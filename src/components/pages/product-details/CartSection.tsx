'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Plane, ShieldCheck, Clock, Search, TrendingDown, Lock } from 'lucide-react';

export default function CartSection() {
	return (
		<div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
			{/* Top Bar */}
			<div className="flex items-center justify-between px-3 py-5 border-b bg-white">
				<div className="flex items-center gap-1.5 text-base font-semibold">
					Shipping
					<span className="text-red-500 text-lg leading-none">*</span>
				</div>

				<div className="flex items-center gap-1.5 text-gray-600">
					<MapPin className="w-5 h-5" />
					<span className="font-medium">To Bangladesh</span>
				</div>
			</div>

			{/* Product & Shipping Info */}
			<div className="px-3 py-5 space-y-4">
				{/* Sweater Info */}
				<div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
					<div>
						<div className="font-medium">Sweater, ৳820/Kg</div>
						<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
							<Plane className="w-4 h-4" />
							By Air - MoveOn Global Shipping
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Slot</span>
						<button className="text-gray-400 hover:text-gray-600">✏️</button>
					</div>
				</div>

				{/* Pieces and Total */}
				<div className="space-y-3">
					<div className="flex justify-between text-sm">
						<span className="text-gray-600">0 Pieces</span>
						<span className="font-medium">৳0</span>
					</div>

					<div className="flex justify-between text-lg font-semibold border-t pt-3">
						<span>Total</span>
						<span>৳0</span>
					</div>

					{/* Bengali Note */}
					<p className="text-xs text-gray-500 leading-relaxed">চায়না লোকাল ডেলিভারি চার্জ কার্ট পেজে যোগ হবে</p>
				</div>

				{/* Buttons */}
				<div className="pt-2 space-y-3">
					<Button size="lg" className="w-full bg-orange-300 hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl transition">
						Buy Now
					</Button>

					<Button
						variant="outline"
						size="lg"
						className="w-full border border-orange-300 text-orange-300 hover:bg-orange-500 hover:text-white font-medium py-3.5 rounded-xl transition"
					>
						Add to Cart
					</Button>
				</div>
			</div>

			{/* Dropship Banner */}
			<div className="mx-3 mb-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl px-3 py-5 text-white overflow-hidden relative">
				<div className="max-w-[65%]">
					<h3 className="text-2xl font-bold leading-tight mb-2">
						Dropship this product with
						<br />
						MoveDrop!
					</h3>
					<p className="text-sm opacity-90 mb-5">
						No stock, No risk!
						<br />
						Just sell and grow your business.
					</p>
					<button className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-orange-50 transition">
						Start Dropshipping
					</button>
				</div>

				{/* Man with box */}
				{/* <div className="absolute bottom-0 right-4">
					<img src="https://i.ibb.co.com/0jZfZ8k/man-with-box.png" alt="Man with box" className="h-48 object-contain" />
				</div> */}

				{/* Floating icons */}
				<div className="absolute top-6 right-12 text-3xl">👕</div>
				<div className="absolute top-20 right-28 text-2xl">🎒</div>
			</div>

			{/* MoveOn Assurance */}
			<div className="px-3 py-6">
				<h4 className="font-semibold text-lg mb-4">Brand Assurance</h4>

				<div className="space-y-3 text-sm">
					<div className="flex items-center gap-3">
						<ShieldCheck className="w-5 h-5 text-green-600" />
						<span>100% money back guarantee</span>
					</div>
					<div className="flex items-center gap-3">
						<Clock className="w-5 h-5 text-green-600" />
						<span>On time guarantee</span>
					</div>
					<div className="flex items-center gap-3">
						<Search className="w-5 h-5 text-green-600" />
						<span>Detailed inspection</span>
					</div>
					<div className="flex items-center gap-3">
						<TrendingDown className="w-5 h-5 text-green-600" />
						<span>Lower exchange loss</span>
					</div>
					<div className="flex items-center gap-3">
						<Lock className="w-5 h-5 text-green-600" />
						<span>Security & Privacy</span>
					</div>
				</div>
			</div>
		</div>
	);
}
