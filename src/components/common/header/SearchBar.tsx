'use client';

import { Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

// ─── Data ────────────────────────────────────────────────────────────────────

const WORDS = ['Products', 'Toys', 'Services', 'Gadgets', 'Gifts'];

const ITEMS = [
	{ icon: '🧸', name: 'Premium Teddy Bear', sub: 'Toys · 1,200+ sold', cat: 'toys' },
	{ icon: '🎮', name: 'Gaming Controller Pro', sub: 'Electronics · Top rated', cat: 'electronics' },
	{ icon: '💄', name: 'Luxury Skincare Set', sub: 'Beauty · 500+ reviews', cat: 'beauty' },
	{ icon: '👟', name: 'Sport Running Shoes', sub: 'Footwear · Free shipping', cat: 'fashion' },
	{ icon: '🛋️', name: 'Ergonomic Office Chair', sub: 'Furniture · Best seller', cat: 'furniture' },
	{ icon: '📦', name: 'Custom Packaging Service', sub: 'Services · B2B', cat: 'services' },
	{ icon: '🎁', name: 'Gift Hamper Deluxe', sub: 'Gifts · Same-day delivery', cat: 'gifts' },
	{ icon: '🔧', name: 'Smart Home Kit', sub: 'Gadgets · New arrival', cat: 'gadgets' },
];

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

export default function SearchBar() {
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const [wordIdx, setWordIdx] = useState(0);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { closeDrawer } = useLayoutStore();

	useEffect(() => {
		const id = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2200);
		return () => clearInterval(id);
	}, []);

	const handleSearch = () => {
		if (!query.trim()) return;

		router.push(`/product-list?search=${encodeURIComponent(query)}`);

		closeDrawer();
	};

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (!wrapperRef.current) return;

			if (!wrapperRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};

		document.addEventListener('pointerdown', handleClickOutside);

		return () => {
			document.removeEventListener('pointerdown', handleClickOutside);
		};
	}, []);

	const results = query.trim()
		? ITEMS.filter((it) => it.name.toLowerCase().includes(query.toLowerCase()) || it.cat.toLowerCase().includes(query.toLowerCase()))
		: null;
	return (
		<div ref={wrapperRef} className="relative w-full font-quicksand">
			<div className="bg-white/70 w-full backdrop-blur-xl rounded-full flex items-center pl-6 pr-1 py-1 gap-3 border border-twinkle-teal z-50">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setOpen(true)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							handleSearch();
						}
					}}
					autoComplete="off"
					placeholder="Search for"
					className="flex-1 font-fredoka outline-none text-sm md:text-base text-muted-foreground font-medium  bg-transparent placeholder:text-twinkle-teal"
				/>

				{/* animate placcement of placeholder text when query is empty, cycling through WORDS */}

				<AnimatePresence mode="wait" initial={false}>
					{!query && (
						<motion.div
							key={wordIdx}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -10, opacity: 0 }}
							transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
							className="absolute font-fredoka inset-0 flex items-center pointer-events-none z-0 md:left-26 left-24"
						>
							{/* <span className="text-twinkle-teal text-sm md:text-base font-light mr-1">Search for</span> */}
							<span className="text-twinkle-gold text-sm md:text-base font-medium">{WORDS[wordIdx]}</span>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.button
					type="button"
					onClick={handleSearch}
					whileTap={{ scale: 1 }}
					whileHover={{ scale: 0.95 }}
					transition={{
						type: 'spring',
						stiffness: 200,
						damping: 5,
					}}
					className="flex shadow items-center justify-center bg-primary text-white  w-10 h-10 md:w-18 md:h-11 rounded-full hover:bg-twinkle-teal/90 cursor-pointer"
				>
					<Search className="w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6" />
				</motion.button>
			</div>

			{/* ── Dropdown ── */}
			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.9 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.9 }}
						transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
						className="absolute top-[calc(100%+2px)] left-0 right-0 z-50 rounded-2xl border border-white/20 bg-white py-2"
					>
						<div className="overflow-y-auto max-h-[70vh] md:max-h-[50vh]">
							<div className="">
								{/* Section label */}
								<p className="px-4 font-quicksand py-2 text-xs tracking-widest uppercase text-muted-foreground font-semibold">
									{results ? `${results.length} result ${results.length !== 1 ? 's' : ''}` : 'Popular searches'}
								</p>

								{/* Search results */}
								{results ? (
									results.length > 0 ? (
										results.map((item, i) => (
											<motion.button
												key={item.name}
												initial={{ opacity: 0, x: -10 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: i * 0.04, duration: 0.22 }}
												onMouseDown={() => {
													setQuery(item.name);
													setOpen(false);
												}}
												className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-twinkle-teal/10 transition-colors text-left"
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
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="px-4 py-5 font-semibold font-quicksand text-center text-sm text-muted-foreground"
										>
											No results for &ldquo;<strong className="text-foreground"> {query} </strong>&rdquo;
										</motion.p>
									)
								) : (
									/* Popular suggestions */
									WORDS.map((word, i) => (
										<motion.button
											key={word}
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: i * 0.04, duration: 0.22 }}
											onMouseDown={() => {
												setQuery(word);
												setOpen(false);
											}}
											className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-colors text-left cursor-pointer"
										>
											<span className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted flex-shrink-0">
												<Search className="w-3.5 h-3.5" />
											</span>
											<span className="text-sm font-medium text-muted-foreground">{word}</span>
										</motion.button>
									))
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
