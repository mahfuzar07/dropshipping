'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Category {
	id: number;
	name: string;
	slug: string;
	children?: Category[];
}

export default function CategoryMenu({ categories }: { categories: Category[] }) {
	const [activePath, setActivePath] = useState<Category[]>([]);

	const handleHover = (level: number, item: Category) => {
		const newPath = activePath.slice(0, level);
		newPath[level] = item;
		setActivePath(newPath);
	};

	// build columns dynamically
	const columns: Category[][] = [];
	columns.push(categories);

	activePath.forEach((item) => {
		if (item.children) {
			columns.push(item.children);
		}
	});

	return (
		<div className="flex  bg-white shadow-xl rounded border overflow-hidden text-sm">
			{columns.map((col, level) => (
				<AnimatePresence key={level}>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						transition={{ duration: 0.2 }}
						className="w-[240px] border-r last:border-r-0"
					>
						{col.map((item) => {
							const isActive = activePath[level]?.id === item.id;

							return (
								<Link
									href={`/category/${item.slug}`}
									key={item.id}
									onMouseEnter={() => handleHover(level, item)}
									className={`flex group justify-between items-center px-4 py-2 cursor-pointer transition
										${isActive ? 'bg-orange-300 text-white font-medium' : ''}
									`}
								>
									<span>{item.name}</span>

									{item.children && (
										<ChevronRight
											size={16}
											className={` group-hover:text-white ${isActive ? 'bg-orange-300 text-white font-medium' : 'text-gray-500'}`}
										/>
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
