import ProductCard from '@/components/common/elements/product-card/ProductCard';
import Image from 'next/image';
import React from 'react';

const products = [
	{ id: 1, title: 'Product 1', image: '/assets/hero/slide-1.jpg', store: 'US', price: '1233.00' },
	{ id: 2, title: 'Product 2', image: '/assets/hero/slide-1.jpg', store: 'US', price: '12.99' },
	{ id: 3, title: 'Product 3', image: '/assets/hero/slide-1.jpg', store: 'US', price: '12.99' },
	{ id: 4, title: 'Product 4', image: '/assets/hero/slide-1.jpg', store: 'US', price: '1233.00' },
	{ id: 5, title: 'Product 5', image: '/assets/hero/slide-1.jpg', store: 'US', price: '12.99' },
	{ id: 6, title: 'Product 6', image: '/assets/hero/slide-1.jpg', store: 'US', price: '12.99' },
	{ id: 7, title: 'Product 7', image: '/assets/hero/slide-1.jpg', store: 'US', price: '12.99' },
	{ id: 8, title: 'Product 8', image: '/assets/hero/slide-1.jpg', store: 'US', price: '12.99' },
];

export default function LatestDeal() {
	return (
		<div className="bg-gray-100 py-8">
			<div className="container mx-auto px-4">
				{/* Title */}
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">LATEST DEALS</h2>

				{/* MAIN GRID */}
				<div className="grid grid-cols-1 md:grid-cols-6 gap-3">
					{/* ===== FIRST ROW ===== */}

					{/* Product 1 */}
					<div className="md:col-span-1">
						<ProductCard product={products[0]} />
					</div>

					{/* Product 2 */}
					<div className="md:col-span-1">
						<ProductCard product={products[1]} />
					</div>
					<div className="md:col-span-1">
						<ProductCard product={products[2]} />
					</div>

					{/* BANNER */}
					<div className="md:col-span-3">
						<div className="relative h-full min-h-[280px] md:min-h-[340px] lg:min-h-[350px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#cfe3f4] to-[#f5e4d4] p-6 flex flex-col justify-center">
							{/* Text Content */}
							<div className="max-w-md z-10">
								<h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">International Gifting Store</h3>
								<p className="text-gray-600 font-semibold mb-6 text-lg leading-relaxed">
									Buy Your Favorite Gifts Online & Send Abroad to Your Loved Ones
								</p>
								<button className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-3 rounded text-sm font-medium transition-all">Gift Now</button>
							</div>

							{/* Decorative Image */}
							<div className="absolute right-4 h-full w-2/5 pointer-events-none">
								<Image src="/assets/gift/giftcard-bg.webp" alt="International gifting" fill className="object-contain object-bottom" priority />
							</div>
						</div>
					</div>
				</div>
				{/* ===== SECOND ROW (ALL PRODUCTS) ===== */}
				<div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-5">
					{products.slice(3).map((product) => (
						<div key={product.id} className="">
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
