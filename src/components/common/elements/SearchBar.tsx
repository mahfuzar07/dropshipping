'use client';

import { Search, Clock, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ─── Constants ───────────────────────────────────────────────────────────────

const WORDS = ['Fashion & Apparel', 'Home & Garden', 'Toys & Hobbies', 'Health & Medical', 'Gifts'];
const HISTORY_KEY = 'search_history';
const MAX_HISTORY = 5;

const ITEMS = [
	{ icon: '🧸', name: 'Premium Teddy Bear', sub: 'Toys · 1,200+ sold', cat: 'toys' },
	{ icon: '🎮', name: 'Gaming Controller Pro', sub: 'Electronics · Top rated', cat: 'electronics' },
	{ icon: '💄', name: 'Luxury Skincare Set', sub: 'Beauty · 500+ reviews', cat: 'beauty' },
	{ icon: '👟', name: 'Sport Running Shoes', sub: 'Footwear · Free shipping', cat: 'fashion' },
	{ icon: '🪑', name: 'Ergonomic Office Chair', sub: 'Furniture · Best seller', cat: 'furniture' },
	{ icon: '📦', name: 'Custom Packaging Service', sub: 'Services · B2B', cat: 'services' },
	{ icon: '🎁', name: 'Gift Hamper Deluxe', sub: 'Gifts · Same-day delivery', cat: 'gifts' },
	{ icon: '🏠', name: 'Smart Home Kit', sub: 'Gadgets · New arrival', cat: 'gadgets' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
	const next = [term.trim(), ...prev].slice(0, MAX_HISTORY);
	localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

function removeFromHistory(term: string) {
	const next = getHistory().filter((h) => h !== term);
	localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

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

// ─── Component ───────────────────────────────────────────────────────────────

export default function SearchBar() {
	const router = useRouter();
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [wordIdx, setWordIdx] = useState(0);
	const [history, setHistory] = useState<string[]>([]);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	// Cycle animated placeholder words
	useEffect(() => {
		const id = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2200);
		return () => clearInterval(id);
	}, []);

	// Load history from localStorage on open
	useEffect(() => {
		if (open) setHistory(getHistory());
	}, [open]);

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (e: PointerEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('pointerdown', handleClickOutside);
		return () => document.removeEventListener('pointerdown', handleClickOutside);
	}, []);

	// ── Navigate to product list ──────────────────────────────────────────────
	const handleSearch = useCallback(
		(term: string) => {
			const q = term.trim();
			if (!q) return;
			saveToHistory(q);
			setHistory(getHistory());
			setOpen(false);
			setQuery(q);
			router.push(`/product-list?search=${encodeURIComponent(q)}`);
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

	// ── Filtered results ──────────────────────────────────────────────────────
	const results = query.trim()
		? ITEMS.filter((it) => it.name.toLowerCase().includes(query.toLowerCase()) || it.cat.toLowerCase().includes(query.toLowerCase()))
		: null;

	// What to show in dropdown when query is empty
	const showHistory = !query.trim() && history.length > 0;
	const showPopular = !query.trim() && history.length === 0;

	return (
		<div ref={wrapperRef} className="relative w-full z-10">
			{/* ── Input bar ── */}
			<div className="bg-white/10 rounded-full flex items-center pl-5 pr-1 py-1 gap-3 border border-orange-300">
				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setOpen(true)}
					onKeyDown={handleKeyDown}
					autoComplete="off"
					placeholder="Search for"
					className="flex-1 outline-none text-sm md:text-base text-white bg-transparent placeholder:text-white"
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
							className="absolute inset-0 flex items-center pointer-events-none z-0 left-25"
						>
							<span className="text-orange-200 text-sm md:text-base font-medium">{WORDS[wordIdx]}</span>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Search button */}
				<motion.button
					onClick={() => handleSearch(query)}
					whileTap={{ scale: 1 }}
					whileHover={{ scale: 0.95 }}
					transition={{ type: 'spring', stiffness: 200, damping: 5 }}
					className="flex shadow items-center justify-center bg-orange-300 text-white w-10 h-10 md:w-25 md:h-11 rounded-full hover:bg-orange-400 cursor-pointer"
				>
					<Search className="w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6" />
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
							{/* ── Search results (when typing) ── */}
							{results !== null && (
								<>
									<p className="px-4 py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">
										{results.length} result{results.length !== 1 ? 's' : ''}
									</p>

									{results.length > 0 ? (
										results.map((item, i) => (
											<motion.button
												key={item.name}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: i * 0.04, duration: 0.22 }}
												onMouseDown={() => handleSearch(item.name)}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
											>
												<span className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted text-base flex-shrink-0">{item.icon}</span>
												<span className="flex-1 min-w-0">
													<span className="block text-sm font-medium text-foreground">
														<Highlight text={item.name} query={query} />
													</span>
													<span className="block text-xs text-muted-foreground mt-0.5">{item.sub}</span>
												</span>
											</motion.button>
										))
									) : (
										<motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 text-center text-sm text-muted-foreground">
											No results for &ldquo;<strong className="text-foreground">{query}</strong>&rdquo;
										</motion.p>
									)}
								</>
							)}

							{/* ── Recent searches (query empty, history exists) ── */}
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
											<span className="flex-1 text-sm font-medium text-foreground">{term}</span>
											{/* Delete single history item */}
											<button
												onMouseDown={(e) => handleDeleteHistory(e, term)}
												className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-orange-100"
											>
												<X className="w-3.5 h-3.5 text-muted-foreground" />
											</button>
										</motion.div>
									))}

									{/* Clear all history */}
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

							{/* ── Popular searches (query empty, no history) ── */}
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
											className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors text-left cursor-pointer"
										>
											<span className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted flex-shrink-0">
												<Search className="w-3.5 h-3.5 text-orange-400" />
											</span>
											<span className="text-sm font-medium text-muted-foreground">{word}</span>
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
