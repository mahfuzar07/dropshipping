'use client';

import { Search, Clock, X, Loader2, ChevronDown, Menu, ImageIcon, CameraIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/axiosInstance';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import CategoryMenu from '../header/CategoryMenu';
import HoverPopover from '@/components/ui/custom/HoverPopover';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { normalizeCategories } from '../header/HeaderBottom';
import { Product } from '@/components/pages/home-page/NewLaunch';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { cn } from '@/lib/utils/utils';

// ─── Constants ────────────────────────────────────────────────────────────────

const WORDS = ['Products', 'Paste Product Link', 'Home & Garden', 'Health & Medical', 'Gifts'];
const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 5;

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

function getHistory(): string[] {
	if (typeof window === 'undefined') return [];
	try {
		return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
	} catch {
		return [];
	}
}

function saveToHistory(term: string) {
	if (!term.trim()) return;
	const prev = getHistory().filter((h) => h.toLowerCase() !== term.toLowerCase());
	localStorage.setItem(HISTORY_KEY, JSON.stringify([term.trim(), ...prev].slice(0, MAX_HISTORY)));
}

function removeFromHistory(term: string) {
	localStorage.setItem(HISTORY_KEY, JSON.stringify(getHistory().filter((h) => h !== term)));
}

// ─── Highlight match ──────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
	if (!query) return <>{text}</>;
	const idx = text.toLowerCase().indexOf(query.toLowerCase());
	if (idx === -1) return <>{text}</>;
	return (
		<>
			{text.slice(0, idx)}
			<span className="bg-yellow-100 text-yellow-600 px-0.5 rounded font-semibold">{text.slice(idx, idx + query.length)}</span>
			{text.slice(idx + query.length)}
		</>
	);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchBar() {
	const router = useRouter();
	const { drawerType, closeDrawer } = useLayoutStore();
	const isSearchDrawerOpen = drawerType === 'search';
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [wordIdx, setWordIdx] = useState(0);
	const [history, setHistory] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	// debounced search results

	const [debouncedQuery, setDebouncedQuery] = useState('');
	const wrapperRef = useRef<HTMLDivElement>(null);

	// ── Animated placeholder ──────────────────────────────────────────────────
	useEffect(() => {
		const id = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2200);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(query.trim());
		}, 400);

		return () => clearTimeout(timer);
	}, [query]);

	// ── Load history when dropdown opens ─────────────────────────────────────
	useEffect(() => {
		if (open) setHistory(getHistory());
	}, [open]);

	// ── Close on outside click ────────────────────────────────────────────────
	useEffect(() => {
		const handle = (e: PointerEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('pointerdown', handle);
		return () => document.removeEventListener('pointerdown', handle);
	}, []);

	const filterParams = useMemo(
		() => ({
			page: 1,
			limit: 8,
			...(debouncedQuery && {
				search: debouncedQuery,
			}),
		}),
		[debouncedQuery],
	);

	const { data: searchData, isLoading: searching } = useAppData<any, 'single'>({
		key: [QueriesKey.NEW_LAUNCH_PRODUCTS, filterParams],
		api: apiEndpoint.products.publicProducts,
		queryParams: filterParams,
		auth: false,
		responseType: 'single',
		refetchOnMount: true,
		staleTime: 0,
		enabled: !!debouncedQuery,
		clientOnly: true,
	});

	const results: Product[] = searchData?.items.item || [];

	// ── Navigate ──────────────────────────────────────────────────────────────
	const handleSearch = useCallback(
		(term: string) => {
			const q = term.trim();
			if (!q) return;
			saveToHistory(q);
			setHistory(getHistory());
			setOpen(false);
			setQuery(q);
			router.push(`/product-list?search=${encodeURIComponent(q)}`);
			closeDrawer();
		},
		[router],
	);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleSearch(query);
	};

	const handleDeleteHistory = (e: React.MouseEvent, term: string) => {
		e.stopPropagation();
		removeFromHistory(term);
		setHistory(getHistory());
	};

	// ── Dropdown state flags ──────────────────────────────────────────────────
	const hasQuery = query.trim().length > 0;
	const showHistory = !hasQuery && history.length > 0;
	const showPopular = !hasQuery && history.length === 0;

	const { data, isLoading } = useAppData<any, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.products.CATEGORIES(),
		auth: true,
		responseType: 'single',
		enabled: true,
		refetchOnMount: true,
		staleTime: 2 * 60 * 1000,
	});

	const categories = Array.isArray(data) ? data : (data?.categories ?? []);

	const normalizedCategories = normalizeCategories(categories ?? []);

	const { create, isMutating: imageSearching } = useAppData<any, 'single'>({
		key: [QueriesKey.SEARCH_IMAGE_PRODUCTS],

		api: apiEndpoint.products.imageSearch,
		auth: true,
		responseType: 'single',
		enabled: false,
	});

	const handleImageSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		const formData = new FormData();
		formData.append('image', file);

		try {
			const res = await create({
				payload: formData,
			});

			router.push(`/product-list?imageSearch=${res?.searchId}`);
			closeDrawer();
		} catch (err) {
			console.error(err);
		}

		e.target.value = '';
	};

	return (
		<div ref={wrapperRef} className="relative w-full z-10">
			{/* ── Input bar ── */}
			<div className="bg-white/10 rounded-full flex items-center pl-3 pr-1 py-1 gap-1 border border-primary">
				<div className="">
					<HoverPopover
						width="min-w-[160px]"
						align="left"
						trigger={
							<div className="relative py-2.5 min-w-[160px] hidden  md:flex items-center justify-center h-full !font-normal text-md gap-5 cursor-pointer border-r border-primary/20 mr-2">
								All Categories
								<ChevronDown strokeWidth={2} size={18} />
							</div>
						}
					>
						<CategoryMenu categories={normalizedCategories} columnClassName="min-w-[200px]" />
					</HoverPopover>
				</div>

				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setOpen(true)}
					onKeyDown={handleKeyDown}
					autoComplete="off"
					placeholder="Search for"
					className="flex-1 outline-none text-sm md:text-base text-foreground bg-transparent placeholder:text-muted-foreground font-normal"
				/>

				{/* Animated placeholder cycling */}
				<AnimatePresence mode="wait" initial={false}>
					{!query && (
						<motion.div
							key={wordIdx}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -10, opacity: 0 }}
							transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
							className={cn(
								'absolute inset-0 flex items-center pointer-events-none z-0 transition-all duration-300',
								isSearchDrawerOpen ? 'left-23' : 'left-66',
							)}
						>
							<span className="text-primary text-sm md:text-base font-normal">{WORDS[wordIdx]}</span>
						</motion.div>
					)}
				</AnimatePresence>

				<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSearch} />

				<motion.button
					type="submit"
					onClick={() => fileInputRef.current?.click()}
					whileTap={{ scale: 1 }}
					whileHover={{ scale: 0.95 }}
					transition={{ type: 'spring', stiffness: 200, damping: 5 }}
					className="flex items-center justify-center text-primary w-10 h-10 rounded-md hover:bg-primary/10 cursor-pointer"
				>
					{imageSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <CameraIcon className="w-6 h-6 md:w-7 md:h-7" />}
				</motion.button>

				{/* Search button */}
				<motion.button
					onClick={() => handleSearch(query)}
					whileTap={{ scale: 1 }}
					whileHover={{ scale: 0.95 }}
					transition={{ type: 'spring', stiffness: 200, damping: 5 }}
					className="flex shadow items-center justify-center bg-primary text-white w-10 h-10 md:w-18 md:h-11 rounded-full hover:bg-primary/80 cursor-pointer"
				>
					<Search className="w-4 h-4 md:w-5 md:h-5" />
				</motion.button>
			</div>

			{/* ── Dropdown ── */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.97 }}
						transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
						className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-2xl border border-white/20 bg-white shadow-xl py-2 overflow-hidden"
					>
						<div className="overflow-y-auto max-h-[70vh] md:max-h-[50vh]">
							{/* ── Typing: live search results ── */}
							{hasQuery && (
								<>
									<p className="px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold flex items-center gap-2">
										{searching ? (
											<>
												<Loader2 className="w-3 h-3 animate-spin" />
												Searching...
											</>
										) : (
											<>
												{results.length} result{results.length !== 1 ? 's' : ''}
											</>
										)}
									</p>

									{!searching && results.length > 0 ? (
										results.map((product, i) => (
											<motion.button
												key={product.num_iid}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: i * 0.04, duration: 0.22 }}
												onMouseDown={() => handleSearch(product.title)}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
											>
												{/* product image */}
												<span className="w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
													{product.pic_url ? (
														<img src={product.pic_url} alt={product.title} className="w-full h-full object-cover" />
													) : (
														<span className="w-full h-full flex items-center justify-center text-lg">🛍️</span>
													)}
												</span>
												<span className="flex-1 min-w-0">
													<span className="block text-sm font-medium text-foreground truncate">
														<Highlight text={product.title} query={query} />
													</span>
													<span className="block font-play text-xs text-muted-foreground mt-0.5">
														{product.price}
														{/* {product.rating ? ` · ⭐ ${product.rating}` : ''} */}
													</span>
												</span>
											</motion.button>
										))
									) : !searching ? (
										<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 text-center text-sm text-muted-foreground">
											No results for &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;
										</motion.p>
									) : (
										// searching skeleton
										<div className="px-4 py-2 space-y-3">
											{Array.from({ length: 3 }).map((_, i) => (
												<div key={i} className="flex items-center gap-3 animate-pulse">
													<div className="w-9 h-9 rounded-lg bg-muted flex-shrink-0" />
													<div className="flex-1 space-y-1.5">
														<div className="h-3 bg-muted rounded w-3/4" />
														<div className="h-2.5 bg-muted rounded w-1/2" />
													</div>
												</div>
											))}
										</div>
									)}
								</>
							)}

							{/* ── No query: recent searches ── */}
							{showHistory && (
								<>
									<p className="px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">Recent Searches</p>
									{history.map((term, i) => (
										<motion.div
											key={term}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: i * 0.04, duration: 0.22 }}
											className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors cursor-pointer group"
											onMouseDown={() => handleSearch(term)}
										>
											<span className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted flex-shrink-0">
												<Clock className="w-3.5 h-3.5 text-orange-400" />
											</span>
											<span className="flex-1 text-sm font-medium text-foreground truncate">{term}</span>
											<button
												onMouseDown={(e) => handleDeleteHistory(e, term)}
												className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-orange-100"
											>
												<X className="w-3.5 h-3.5 text-muted-foreground" />
											</button>
										</motion.div>
									))}
									<div className="px-4 pt-1 pb-2 flex justify-end">
										<button
											onMouseDown={() => {
												localStorage.removeItem(HISTORY_KEY);
												setHistory([]);
											}}
											className="text-xs text-orange-400 hover:text-orange-600 transition-colors"
										>
											Clear all
										</button>
									</div>
								</>
							)}

							{/* ── No query, no history: popular ── */}
							{showPopular && (
								<>
									<p className="px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">Popular Searches</p>
									{WORDS.map((word, i) => (
										<motion.button
											key={word}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: i * 0.04, duration: 0.22 }}
											onMouseDown={() => handleSearch(word)}
											className="w-full flex items-center gap-3 px-4 py-2 hover:bg-orange-50 transition-colors text-left cursor-pointer"
										>
											<span className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted flex-shrink-0">
												<Search className="w-3.5 h-3.5 text-orange-400" />
											</span>
											<span className="text-sm font-normal text-muted-foreground">{word}</span>
										</motion.button>
									))}
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
