'use client';

import { useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useProductFilterStore, type MenuCategoryLite } from '@/z-store/product/useProductFilterStore';
import { cn } from '@/lib/utils/utils';
import { getCategoryChildren, getCategoryKey } from '@/lib/utils/category-helpers';

interface CategorySwiperProps {
	categories: any[]; // top-level category tree, each with .subcategories
}

export default function CategorySwiper({ categories }: CategorySwiperProps) {
	const { categoryPath, selectCategoryAtLevel, navigateToBreadcrumbLevel } = useProductFilterStore();
	const scrollRef = useRef<HTMLDivElement>(null);

	// drag-to-scroll state
	const isDragging = useRef(false);
	const dragMoved = useRef(false); // to distinguish click vs drag
	const startX = useRef(0);
	const startScrollLeft = useRef(0);

	const scrollBy = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });

	// --- Mouse drag handlers (desktop) ---
	const onMouseDown = useCallback((e: React.MouseEvent) => {
		const el = scrollRef.current;
		if (!el) return;
		isDragging.current = true;
		dragMoved.current = false;
		startX.current = e.pageX - el.offsetLeft;
		startScrollLeft.current = el.scrollLeft;
	}, []);

	const onMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDragging.current) return;
		const el = scrollRef.current;
		if (!el) return;
		e.preventDefault();
		const x = e.pageX - el.offsetLeft;
		const walk = x - startX.current;
		if (Math.abs(walk) > 5) dragMoved.current = true; // treat as drag only past a small threshold
		el.scrollLeft = startScrollLeft.current - walk;
	}, []);

	const endDrag = useCallback(() => {
		isDragging.current = false;
	}, []);

	// prevent the click-through on a category button right after a drag
	const onClickCapture = useCallback((e: React.MouseEvent) => {
		if (dragMoved.current) {
			e.preventDefault();
			e.stopPropagation();
			dragMoved.current = false;
		}
	}, []);

	if (!categories?.length) return null;

	const level = categoryPath.length;
	const deepest = categoryPath[level - 1];
	// items to show: children of the deepest selected category, or top-level list if nothing selected
	const itemsAtLevel: any[] = level === 0 ? categories : getCategoryChildren(deepest);

	return (
		<div className="mb-4">
			{/* Breadcrumb */}
			{categoryPath.length > 0 && (
				<div className="flex items-center gap-1 text-xs text-gray-500 mb-2 flex-wrap">
					{/* Root crumb: clears the whole path, goes back to top-level categories */}
					<button className="hover:text-primary hover:underline cursor-pointer" onClick={() => navigateToBreadcrumbLevel(-1)}>
						<LayoutDashboard size={14} strokeWidth={1.8} />
					</button>
					{categoryPath.map((c, i) => {
						const catKey = getCategoryKey(c);
						return (
							<span key={catKey} className="flex items-center gap-1">
								<span>/</span>
								<button
									className={cn('hover:text-primary hover:underline  cursor-pointer', i === categoryPath.length - 1 && 'text-primary font-medium')}
									onClick={() => navigateToBreadcrumbLevel(i)}
								>
									{c.name}
								</button>
							</span>
						);
					})}
				</div>
			)}

			{/* Horizontal swiper for the current level's categories */}
			{itemsAtLevel.length > 0 && (
				<div className="relative flex items-center">
					<button
						onClick={() => scrollBy(-1)}
						className="hidden sm:flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-white shadow mr-1 z-10"
						aria-label="Scroll left"
					>
						<ChevronLeft className="w-4 h-4" />
					</button>

					<div
						ref={scrollRef}
						className="flex gap-2 overflow-x-auto scroll-smooth py-1 select-none cursor-grab active:cursor-grabbing"
						style={{ scrollbarWidth: 'none' }}
						onMouseDown={onMouseDown}
						onMouseMove={onMouseMove}
						onMouseUp={endDrag}
						onMouseLeave={endDrag}
						onClickCapture={onClickCapture}
					>
						{itemsAtLevel.map((cat) => {
							const catKey = getCategoryKey(cat);
							const isSelected = getCategoryKey(categoryPath[level]) === catKey;
							return (
								<button
									key={catKey}
									onClick={() => selectCategoryAtLevel(cat, level)}
									className={cn(
										'shrink-0 whitespace-nowrap  cursor-pointer rounded-full border px-4 py-1.5 text-sm transition-colors',
										isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary',
									)}
								>
									{cat.name}
								</button>
							);
						})}
					</div>

					<button
						onClick={() => scrollBy(1)}
						className="hidden sm:flex shrink-0 items-center justify-center w-7 h-7 rounded-full bg-white shadow ml-1 z-10"
						aria-label="Scroll right"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	);
}
