'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import WishlistProduct from './WishlistProduct';
import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';

/* -------- dummy data -------- */

const products = [
	{
		id: 1,
		title: 'Product 1',
		image: '/assets/product/product-2.webp',
		store: 'US',
		price: '1233.00',
	},
	{ id: 2, title: 'Product 2', image: '/assets/product/product-5.png', store: 'US', price: '12.99' },
	{
		id: 3,
		title: 'Product 3',
		image: '/assets/product/product-6.png',
		store: 'US',
		price: '199.99',
	},
	{
		id: 4,
		title: 'Product 4',
		image: '/assets/product/product-7.png',
		store: 'US',
		price: '2.99',
	},
	{
		id: 5,
		title: 'Product 5',
		image: '/assets/product/product-2.webp',
		store: 'US',
		price: '2.99',
	},
	{
		id: 6,
		title: 'Product 6',
		image: '/assets/product/product-3.webp',
		store: 'US',
		price: '2.99',
	},
	{
		id: 7,
		title: 'Product 7',
		image: '/assets/product/product-1.webp',
		store: 'US',
		price: '2.99',
	},
];

/* -------- loading state -------- */

const isLoadingState = false;

export default function WishlistPageContent() {
	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-16 h-16 flex items-center justify-center rounded-full">
						<Heart className="text-orange-400 w-8 h-8" />
					</div>

					<div>
						<h1 className="text-3xl font-medium">My Wishlist</h1>
						<p className="text-muted-foreground">Your saved favorite products</p>
					</div>
				</div>
			</motion.div>

			{/* Loading */}
			{isLoadingState && Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} />)}

			{/* Empty */}
			{!isLoadingState && products.length === 0 && <p className="text-muted-foreground text-center mt-16">Your wishlist is empty</p>}

			{/* Products */}
			{!isLoadingState && products.length > 0 && <WishlistProduct products={products} />}
		</div>
	);
}
