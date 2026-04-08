'use client';

import { Store, Star, Trophy, Headphones, Truck, ChevronRight } from 'lucide-react';

export default function SellerInfo() {
	return (
		<div className="w-full bg-gray-50 rounded py-5 px-4 flex items-center justify-between mb-2">
			{/* Left Side - Seller Info */}
			<div className="flex items-center gap-5">
				{/* Store Icon */}
				<div className="w-20 h-20 bg-orange-300 rounded-xl flex items-center justify-center flex-shrink-0">
					<Store className="w-8 h-8 text-white" strokeWidth={2.2} />
				</div>

				{/* Seller Store Text & Ratings */}
				<div>
					<h3 className="text-lg font-bold text-gray-800 tracking-wide">SELLER STORE</h3>

					<div className="flex items-center gap-4 mt-3 flex-wrap">
						{/* Product Rating */}
						<div className="flex items-center gap-1.5 bg-white px-5 py-1.5 rounded">
							<Star className="w-5 h-5 text-teal-500 fill-current" />
							<span className="text-sm text-gray-700">
								Product <strong> 4.7</strong>
							</span>
						</div>

						{/* Level */}
						<div className="flex items-center gap-1.5 bg-white px-5 py-1.5 rounded">
							<Trophy className="w-5 h-5 text-teal-500" />
							<span className="text-sm text-gray-700">
								Level <strong> 4.7</strong>
							</span>
						</div>

						{/* Service */}
						<div className="flex items-center gap-1.5 bg-white px-5 py-1.5 rounded">
							<Headphones className="w-5 h-5 text-teal-500" />
							<span className="text-sm text-gray-700">
								Service <strong> 3.5</strong>
							</span>
						</div>

						{/* Delivery */}
						<div className="flex items-center gap-1.5 bg-white px-5 py-1.5 rounded">
							<Truck className="w-5 h-5 text-teal-500 " />
							<span className="text-sm text-gray-700">
								Delivery <strong>2.5</strong>
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side - Visit Store Button */}
			<button
				className="bg-orange-300 hover:bg-orange-400 active:bg-orange-500 transition-colors
                   text-white font-semibold px-8 py-3 rounded-full flex items-center gap-2
                   text-sm tracking-wider cursor-pointer"
			>
				Visit Store
				<ChevronRight className="w-4 h-4" />
			</button>
		</div>
	);
}
