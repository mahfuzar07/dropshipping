'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

// unified type (recursive)
export interface MenuCategory {
	id: string;
	name: string;
	slug: string;
	subcategories?: MenuCategory[];
}

export default function CategoryMenu({ categories }: { categories: MenuCategory[] }) {
	const [activePath, setActivePath] = useState<MenuCategory[]>([]);

	const handleHover = (level: number, item: MenuCategory) => {
		const newPath = activePath.slice(0, level);
		newPath[level] = item;
		setActivePath(newPath);
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
		<div className="flex bg-white shadow-xl rounded-b border overflow-y-hidden text-sm h-[50vh]">
			{columns.map((col, level) => (
				<AnimatePresence key={level}>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2 }}
						className="w-[240px] h-full overflow-y-auto border-r last:border-r-0"
					>
						{col.map((item) => {
							const isActive = activePath[level]?.id === item.id;

							return (
								<Link
									href={`/category/${item.slug}`}
									key={item.id}
									onMouseEnter={() => handleHover(level, item)}
									className={`flex group justify-between items-center border-b border-slate-100 px-4 py-2.5 cursor-pointer transition
									${isActive ? 'bg-orange-300 text-white font-medium' : 'hover:bg-gray-100'}
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
