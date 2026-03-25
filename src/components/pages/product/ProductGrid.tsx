'use client';

import EmptyState from '@/components/common/elements/empty-state/EmptyState';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { motion } from 'framer-motion';


export function ProductGrid({ products }: { products: any[] }) {
	if (!products || products.length === 0) {
		return <EmptyState title="Nothing here yet" subtitle="We’re preparing something lovely for this category." />;
	}

	return (
		<motion.div
			variants={{
				hidden: {},
				show: {
					transition: {
						staggerChildren: 0.12,
					},
				},
			}}
			initial="hidden"
			animate="show"
			className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-5 md:gap-5"
		>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</motion.div>
	);
}
