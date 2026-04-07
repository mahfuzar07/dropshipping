'use client';

import { motion } from 'framer-motion';
import { Star, Truck } from 'lucide-react';
import Image from 'next/image';

type Product = {
	id: number;
	title: string;
	price: number;
	image: string;
	store: string;
	category: string;
	discount?: boolean;
	rating?: number;
};

export default function ProductCard({ product }: { product: Product }) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				show: { opacity: 1, y: 0 },
			}}
			className="group cursor-pointer bg-white overflow-hidden rounded-xl h-full flex flex-col transition-all duration-300"
		>
			{/* Image Container - Fixed aspect ratio */}
			<div className="relative  aspect-square bg-white overflow-hidden flex-shrink-0 rounded-2xl">
				<Image
					src={product.image}
					alt={product.title}
					fill
					className="object-cover transition-transform duration-600 ease-in-out group-hover:scale-105"
				/>
			</div>

			{/* Content - This will take the remaining height */}
			<div className="flex-1 flex flex-col p-3 pt-4">
				{/* Title */}
				<h3 className="text-sm font-semibold line-clamp-2 leading-tight mb-3 flex-grow">{product.title}</h3>

				{/* Rating & Sold */}
				<div className="flex items-center justify-between text-gray-500 text-xs mb-2">
					<div className="flex items-center gap-1">
						<Star size={15} className="fill-yellow-500 text-yellow-400" />
						<span>4.7 (45)</span>
					</div>
					<p>4K Sold</p>
				</div>

				{/* Price */}
				<div className="mt-auto">
					<h3 className="text-xl font-bold text-primary flex items-center font-hanken">
						<span className="font-hanken mr-0.5">৳</span>
						{product.price}
					</h3>
				</div>

				{/* Delivery Info */}
				<div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
					<Truck size={16} className="text-primary" />
					<p className="font-medium text-primary">USA to BD: 15 - 20 days</p>
				</div>
			</div>
		</motion.div>
	);
}
