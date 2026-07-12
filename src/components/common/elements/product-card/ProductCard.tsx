'use client';

import { Product } from '@/components/pages/home-page/NewLaunch';
import { motion } from 'framer-motion';
import { Star, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const formatPrice = (price: any) => {
	if (price === undefined || price === null) return '';
	const priceStr = String(price).trim();
	if (priceStr.startsWith('৳')) return priceStr;
	const num = parseFloat(priceStr.replace(/[^\d.]/g, ''));
	if (!isNaN(num)) {
		return `৳${num.toFixed(2)}`;
	}
	return `৳${priceStr}`;
};

export default function ProductCard({ product }: { product: Product }) {
	if (!product) return null;

	console.log('Rendering ProductCard for:', product);

	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				show: { opacity: 1, y: 0 },
			}}
			className="group cursor-pointer bg-white overflow-hidden rounded-md h-full flex flex-col transition-all duration-300 shadow"
		>
			{/* Image Container - Fixed aspect ratio */}
			<Link
				href={`/product/${product.num_iid}`}
				rel="noopener noreferrer"
				className="font-semibold text-[15px] leading-tight hover:text-orange-600 transition-colors line-clamp-2"
			>
				<div className="relative  aspect-square bg-white overflow-hidden flex-shrink-0 rounded">
					<Image
						src={product?.pic_url || '/placeholder.png'}
						alt={product?.title || 'Product'}
						fill
						className="object-cover md:p-5 p-3 transition-transform duration-600 ease-in-out group-hover:scale-105"
					/>
				</div>

				{/* Content - This will take the remaining height */}
				<div className="flex-1 flex flex-col p-3 pt-2">
					{/* Price */}
					<div className="mt-auto mb-1">
						<h3 className="text-sm md:text-xl font-bold text-primary flex items-center font-hanken">
							<span className="mr-0.5">{formatPrice(product.price)}</span>
						</h3>
					</div>
					{/* Title */}
					<h3 className="text-xs md:text-sm font-semibold line-clamp-2 leading-tight flex-grow mb-1.5">{product?.title}</h3>

					{/* Rating & Sold */}
					<div className="flex items-center justify-between text-gray-400 text-xs mb-1">
						{product.sales !== undefined && product.sales !== null && (
							<p className='font-medium text-xs'>{product.sales} sold</p>
						)}
					</div>

					{/* Delivery Info */}
					<div className="flex items-center gap-1.5 text-[10px] text-gray-600">
						<Truck size={16} className="text-primary" />
						<p className="font-medium text-primary">CN to BD: 15 - 20 days</p>
					</div>
				</div>
			</Link>
		</motion.div>
	);
}
