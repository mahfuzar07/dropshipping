'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/utils';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';

// unified type (recursive)
export interface MenuCategory {
	id: string;
	name: string;
	slug: string;
	icon?: string;
	subcategories?: MenuCategory[];
}
interface CategoryMenuProps {
	categories: MenuCategory[];
	columnClassName?: string;
}

export default function CategoryMenu({ categories, columnClassName }: CategoryMenuProps) {
	const [activePath, setActivePath] = useState<MenuCategory[]>([]);
	const setCategory = useProductFilterStore((state) => state.setCategory);

	const handleHover = (level: number, item: MenuCategory) => {
		const newPath = activePath.slice(0, level);
		newPath[level] = item;
		setActivePath(newPath);
	};

	// clicking a category should immediately update the filter store
	// (so the destination page renders with it already applied, no
	// waiting on the URL-sync effect there) — the <Link> below still
	// handles the actual redirect.
	const handleClick = (item: MenuCategory) => {
		setCategory(item.name);
	};

	// build columns dynamically
	const columns: MenuCategory[][] = [];
	columns.push(categories);

	activePath.forEach((item) => {
		if (item.subcategories && item.subcategories.length > 0) {
			columns.push(item.subcategories);
		}
	});

	return (
		<div className="flex bg-white shadow-xl rounded-b border overflow-hidden text-sm h-[50vh]">
			{columns.map((col, level) => (
				<AnimatePresence key={level}>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2 }}
						className={cn('h-full overflow-y-auto border-r last:border-r-0', columnClassName)}
					>
						{col.map((item) => {
							const isActive = activePath[level]?.id === item.id;

							return (
								<Link
									href={`/product-list?search=${encodeURIComponent(item.name)}`}
									key={item.id}
									onMouseEnter={() => handleHover(level, item)}
									onClick={() => handleClick(item)}
									className={`flex w-full group justify-between items-center border-b border-slate-100 px-4 py-2.5 cursor-pointer transition
									${isActive ? 'bg-primary text-white font-medium' : 'hover:bg-gray-100'}
								`}
								>
									<span>{item.name}</span>

									{item.subcategories && (
										<ChevronRight size={16} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
									)}
								</Link>
							);
						})}
					</motion.div>
				</AnimatePresence>
			))}
		</div>
	);
}
