'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plane, ShieldCheck, Clock, Search, TrendingDown, Lock, Ship, ScanEye } from 'lucide-react';
import { toast } from 'sonner';
import { addToCard } from '@/lib/api/cart';

export default function CartSection({ product }: { product: any }) {
	const [selectedShipping, setSelectedShipping] = useState<'air' | 'sea'>('air');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const airPrice = '৳780 / ৳1170 Per Kg';
	const seaPrice = '৳170 / ৳400 Per Kg';

	// console.log('product in cart section', product);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const form = { product_id: product?.offer_id, variant: product?.selectedVariant, quantity: product?.qty || 1 };
		console.log('cart click', form);
		console.log('product', product);
		try {
			await addToCard(form);
			toast.success('Product added to cart successfully!');
		} catch (err) {
			toast.error('Failed to add product to cart.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
			{/* Top Bar */}
			<div className="flex items-center justify-between px-3 py-5 border-b mb-5 bg-white">
				<div className="flex items-center gap-1.5 text-base font-semibold">
					Shipping
					<span className="text-red-500 text-lg leading-none">*</span>
				</div>

				<div className="flex items-center gap-1.5 text-gray-600">
					<MapPin className="w-5 h-5" />
					<span className="font-medium">To Bangladesh</span>
				</div>
			</div>
			<div className="flex gap-2 px-3 font-hanken">
				{/* By Air Card */}
				<div
					onClick={() => setSelectedShipping('air')}
					className={`min-h-[100px] flex-1 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
          ${selectedShipping === 'air' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
            ${selectedShipping === 'air' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
						>
							<Plane className="w-6 h-6" />
						</div>
						<div>
							<p className="font-semibold text-gray-800">By Air</p>
							<p className="text-xs text-gray-600 mt-0.5">{airPrice}</p>
						</div>
					</div>
				</div>

				{/* By Sea Card */}
				<div
					onClick={() => setSelectedShipping('sea')}
					className={`min-h-[100px] flex-1  flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
          ${selectedShipping === 'sea' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 shrink-0 rounded-xl  flex items-center justify-center
            ${selectedShipping === 'sea' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
						>
							<Ship className="w-6 h-6" />
						</div>
						<div>
							<p className="font-semibold text-gray-800">By Sea</p>
							<p className="text-xs text-gray-600 mt-0.5">{seaPrice}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Product & Shipping Info */}
			<div className="px-3 py-5 space-y-4">
				{/* Pieces and Total */}
				<div className="space-y-3">
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<span className="text-gray-600">Quantity</span>
						<span className="font-medium"> 0</span>
					</div>
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<span className="text-gray-600">Product price</span>
						<span className="font-medium">৳ 0</span>
					</div>
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<p className="text-gray-600">
							Pay now <span>(70%)</span>
						</p>
						<span className="font-medium">৳ 0</span>
					</div>
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<p className="text-gray-600">
							Pay on delivery <span>(30%)</span>
						</p>
						<span className="font-medium">৳ 0</span>
					</div>
					<div className="flex justify-between text-lg font-semibold border-t pt-3 font-hanken">
						<span>Total</span>
						<span>৳ 0</span>
					</div>
				</div>
				{/* shipping charge info */}
				<div className="py-2">
					<div className="flex items-center justify-between border  border-dashed border-orange-300 bg-gray-50 rounded-xl p-4 mb-3 ">
						<div>
							<div className="font-medium">Approximate weight, 2Kg</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
								<Plane className="w-4 h-4" />
								By Air - Example Company Global Shipping
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Slot</span>
							<button
								className="text-orange-300 hover:text-orange-400  transition-colors
                   font-semibold  rounded-full flex items-center
                   text-sm cursor-pointer"
							>
								<ScanEye />
							</button>
						</div>
					</div>
					{/*  Notes */}
					<p className="text-xs text-gray-500 leading-relaxed">
						*** উল্লেখিত পণ্যের ওজন সম্পূর্ণ সঠিক নয়, আনুমানিক মাত্র। বাংলাদেশে আসার পর পণ্যটির প্রকৃত ওজন মেপে শিপিং চার্জ হিসাব করা হবে।
					</p>
				</div>

				{/* Buttons */}
				<div className="pt-2 space-y-3">
					<Button size="lg" className="w-full bg-orange-300 hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl transition">
						Buy Now
					</Button>

					<Button
						onClick={(e) => {
							handleSubmit(e);
						}}
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
