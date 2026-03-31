import ProductCard from '@/components/common/elements/product-card/ProductCard';
import Image from 'next/image';
import React from 'react';

const products = [
	{
		id: 1,
		title: 'DUDE Wipes DUDE Bombs Toilet Stank Eliminator - 2-in-1 Air Freshener and Toilet...',
		image: '/assets/hero/slide-1.jpg',
		store: 'US',
		price: '1233.00',
	},
	{
		id: 2,
		title: 'Gain In-Wash Laundry Scent Booster Beads, Happy, 24 oz',
		image: '/assets/hero/slide-1.jpg',
		store: 'US',
		price: '12.99',
	},
	{
		id: 3,
		title: 'Gain In-Wash Laundry Scent Booster Beads, Happy, 24 oz',
		image: '/assets/hero/slide-1.jpg',
		store: 'US',
		price: '12.99',
	},
];

export default function GiftIdeas() {
	return (
		<div className="bg-gray-100 py-8 ">
			<div className="container mx-auto px-4">
				{/* Title */}
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">GIFT IDEAS</h2>

				{/* Main Grid */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
					{/* LEFT: Gift Banner - Made to match height */}
					<div className="md:col-span-2">
						<div className="relative h-full min-h-[280px] md:min-h-[340px] lg:min-h-[350px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#cfe3f4] to-[#f5e4d4] p-6 flex flex-col justify-center">
							{/* Text Content */}
							<div className="max-w-md z-10">
								<h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">International Gifting Store</h3>
								<p className="text-gray-600 font-semibold mb-6 text-lg leading-relaxed">Buy Your Favorite Gifts Online & Send Abroad to Your Loved Ones</p>
								<button className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-3 rounded text-sm font-medium transition-all">Gift Now</button>
							</div>

							{/* Decorative Image */}
							<div className="absolute right-4 h-full w-2/5 pointer-events-none">
								<Image src="/assets/gift/giftcard-bg.webp" alt="International gifting" fill className="object-contain object-bottom" priority />
							</div>
						</div>
					</div>

					{/* RIGHT: Product Cards - Now properly stretch to same height */}
					<div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
