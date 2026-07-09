'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductFilterStore, type MenuCategoryLite } from '@/z-store/product/useProductFilterStore';
import { cn } from '@/lib/utils/utils';

interface CategorySwiperProps {
	categories: any[]; // top-level category tree, each with .subcategories
}

export default function CategorySwiper({ categories }: CategorySwiperProps) {
	const { categoryPath, selectCategoryAtLevel } = useProductFilterStore();
	const scrollRef = useRef<HTMLDivElement>(null);

	const scrollBy = (dir: number) => scrollRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });

	if (!categories?.length) return null;

	const level = categoryPath.length;
	const deepest = categoryPath[level - 1];
	// items to show: children of the deepest selected category, or top-level list if nothing selected
	const itemsAtLevel: any[] = level === 0 ? categories : (deepest?.subcategories ?? []);

	return (
		<div className="mb-4">
			{/* Breadcrumb */}
			{categoryPath.length > 0 && (
				<div className="flex items-center gap-1 text-xs text-gray-500 mb-2 flex-wrap">
					<button className="hover:text-primary hover:underline" onClick={() => selectCategoryAtLevel(null, 0)}>
						All
					</button>
					{categoryPath.map((c, i) => (
						<span key={c.id} className="flex items-center gap-1">
							<span>/</span>
							<button
								className={cn('hover:text-primary hover:underline', i === categoryPath.length - 1 && 'text-primary font-medium')}
								onClick={() => selectCategoryAtLevel(c as MenuCategoryLite, i)}
							>
								{c.name}
							</button>
						</span>
					))}
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

					<div ref={scrollRef} className="flex gap-2 overflow-x-auto scroll-smooth py-1" style={{ scrollbarWidth: 'none' }}>
						{itemsAtLevel.map((cat) => {
							const isSelected = categoryPath[level]?.id === cat.id;
							return (
								<button
									key={cat.id}
									onClick={() => selectCategoryAtLevel(cat, level)}
									className={cn(
										'shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors',
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
