'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

type Product = {
	id: number;
	title: string;
	price: string;
	image: string;
};

export default function ProductCard({ product }: { product: Product }) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				show: { opacity: 1, y: 0 },
			}}
			className="group cursor-pointer"
		>
			<div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
				<Image src={product.image} alt={product.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
			</div>

			<div className="mt-4 space-y-1">
				<h3 className="text-sm font-semibold">{product.title}</h3>
				<p className="text-sm text-primary font-medium">{product.price}</p>
			</div>
		</motion.div>
	);
}
