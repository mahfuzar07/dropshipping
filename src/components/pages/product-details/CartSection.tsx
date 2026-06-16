'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plane, ShieldCheck, Clock, Search, TrendingDown, Lock, Ship, ScanEye } from 'lucide-react';
import { toast } from 'sonner';
import { addToCard } from '@/lib/api/cart';

// export default function CartSection({ product }: { product: any }) {
// 	console.log('Rendering CartSection with product:', product);
// 	const [selectedShipping, setSelectedShipping] = useState<'air' | 'sea'>('air');
// 	const [isSubmitting, setIsSubmitting] = useState(false);

// 	const airPrice = '৳780 / ৳1170 Per Kg';
// 	const seaPrice = '৳170 / ৳400 Per Kg';

// 	// console.log('product in cart section', product);

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setIsSubmitting(true);

// 		const form = { product_id: product?.offer_id, variant: product?.selectedVariant, quantity: product?.qty || 1 };
// 		console.log('cart click', form);
// 		console.log('product', product);
// 		try {
// 			await addToCard(form);
// 			toast.success('Product added to cart successfully!');
// 		} catch (err) {
// 			toast.error('Failed to add product to cart.');
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};

// 	return (
// 		<div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
// 			{/* Top Bar */}
// 			<div className="flex items-center justify-between px-3 py-5 border-b mb-5 bg-white">
// 				<div className="flex items-center gap-1.5 text-base font-semibold">
// 					Shipping
// 					<span className="text-red-500 text-lg leading-none">*</span>
// 				</div>

// 				<div className="flex items-center gap-1.5 text-gray-600">
// 					<MapPin className="w-5 h-5" />
// 					<span className="font-medium">To Bangladesh</span>
// 				</div>
// 			</div>
// 			<div className="flex gap-2 px-3 font-hanken">
// 				{/* By Air Card */}
// 				<div
// 					onClick={() => setSelectedShipping('air')}
// 					className={`min-h-[100px] flex-1 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
//           ${selectedShipping === 'air' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
// 				>
// 					<div className="flex items-center gap-3">
// 						<div
// 							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
//             ${selectedShipping === 'air' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
// 						>
// 							<Plane className="w-6 h-6" />
// 						</div>
// 						<div>
// 							<p className="font-semibold text-gray-800">By Air</p>
// 							<p className="text-xs text-gray-600 mt-0.5">{airPrice}</p>
// 						</div>
// 					</div>
// 				</div>

// 				{/* By Sea Card */}
// 				<div
// 					onClick={() => setSelectedShipping('sea')}
// 					className={`min-h-[100px] flex-1  flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
//           ${selectedShipping === 'sea' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
// 				>
// 					<div className="flex items-center gap-3">
// 						<div
// 							className={`w-10 h-10 shrink-0 rounded-xl  flex items-center justify-center
//             ${selectedShipping === 'sea' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
// 						>
// 							<Ship className="w-6 h-6" />
// 						</div>
// 						<div>
// 							<p className="font-semibold text-gray-800">By Sea</p>
// 							<p className="text-xs text-gray-600 mt-0.5">{seaPrice}</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Product & Shipping Info */}
// 			<div className="px-3 py-5 space-y-4">
// 				{/* Pieces and Total */}
// 				<div className="space-y-3">
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<span className="text-gray-600">Quantity</span>
// 						<span className="font-medium"> 0</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<span className="text-gray-600">Product price</span>
// 						<span className="font-medium">৳ 0</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<p className="text-gray-600">
// 							Pay now <span>(70%)</span>
// 						</p>
// 						<span className="font-medium">৳ 0</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<p className="text-gray-600">
// 							Pay on delivery <span>(30%)</span>
// 						</p>
// 						<span className="font-medium">৳ 0</span>
// 					</div>
// 					<div className="flex justify-between text-lg font-semibold border-t pt-3 font-hanken">
// 						<span>Total</span>
// 						<span>৳ 0</span>
// 					</div>
// 				</div>
// 				{/* shipping charge info */}
// 				<div className="py-2">
// 					<div className="flex items-center justify-between border  border-dashed border-orange-300 bg-gray-50 rounded-xl p-4 mb-3 ">
// 						<div>
// 							<div className="font-medium">Approximate weight, 2Kg</div>
// 							<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
// 								<Plane className="w-4 h-4" />
// 								By Air - Example Company Global Shipping
// 							</div>
// 						</div>
// 						<div className="flex items-center gap-2">
// 							<span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Slot</span>
// 							<button
// 								className="text-orange-300 hover:text-orange-400  transition-colors
//                    font-semibold  rounded-full flex items-center
//                    text-sm cursor-pointer"
// 							>
// 								<ScanEye />
// 							</button>
// 						</div>
// 					</div>
// 					{/*  Notes */}
// 					<p className="text-xs text-gray-500 leading-relaxed">
// 						*** উল্লেখিত পণ্যের ওজন সম্পূর্ণ সঠিক নয়, আনুমানিক মাত্র। বাংলাদেশে আসার পর পণ্যটির প্রকৃত ওজন মেপে শিপিং চার্জ হিসাব করা হবে।
// 					</p>
// 				</div>

// 				{/* Buttons */}
// 				<div className="pt-2 space-y-3">
// 					<Button size="lg" className="w-full bg-orange-300 hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl transition">
// 						Buy Now
// 					</Button>

// 					<Button
// 						onClick={(e) => {
// 							handleSubmit(e);
// 						}}
// 						variant="outline"
// 						size="lg"
// 						className="w-full border border-orange-300 text-orange-300 hover:bg-orange-500 hover:text-white font-medium py-3.5 rounded-xl transition"
// 					>
// 						Add to Cart
// 					</Button>
// 				</div>
// 			</div>

// 			{/* Dropship Banner */}
// 			<div className="mx-3 mb-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl px-3 py-5 text-white overflow-hidden relative">
// 				<div className="max-w-[65%]">
// 					<h3 className="text-2xl font-bold leading-tight mb-2">
// 						Dropship this product with
// 						<br />
// 						MoveDrop!
// 					</h3>
// 					<p className="text-sm opacity-90 mb-5">
// 						No stock, No risk!
// 						<br />
// 						Just sell and grow your business.
// 					</p>
// 					<button className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-orange-50 transition">
// 						Start Dropshipping
// 					</button>
// 				</div>

// 				{/* Man with box */}
// 				{/* <div className="absolute bottom-0 right-4">
// 					<img src="https://i.ibb.co.com/0jZfZ8k/man-with-box.png" alt="Man with box" className="h-48 object-contain" />
// 				</div> */}

// 				{/* Floating icons */}
// 				<div className="absolute top-6 right-12 text-3xl">👕</div>
// 				<div className="absolute top-20 right-28 text-2xl">🎒</div>
// 			</div>

// 			{/* MoveOn Assurance */}
// 			<div className="px-3 py-6">
// 				<h4 className="font-semibold text-lg mb-4">Brand Assurance</h4>

// 				<div className="space-y-3 text-sm">
// 					<div className="flex items-center gap-3">
// 						<ShieldCheck className="w-5 h-5 text-green-600" />
// 						<span>100% money back guarantee</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Clock className="w-5 h-5 text-green-600" />
// 						<span>On time guarantee</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Search className="w-5 h-5 text-green-600" />
// 						<span>Detailed inspection</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<TrendingDown className="w-5 h-5 text-green-600" />
// 						<span>Lower exchange loss</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Lock className="w-5 h-5 text-green-600" />
// 						<span>Security & Privacy</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// export default function CartSection({ product }: { product: any }) {
// 	const [selectedShipping, setSelectedShipping] = useState<'air' | 'sea'>('air');
// 	const [isSubmitting, setIsSubmitting] = useState(false);

// 	const airPrice = '৳780 / ৳1170 Per Kg';
// 	const seaPrice = '৳170 / ৳400 Per Kg';

// 	const qty: Record<string, number> = product?.qty || {};
// 	const sizes: Array<{ size_name: string; price: string }> = product?.selectedVariant?.sizes || [];

// 	const totalQty = Object.values(qty).reduce((sum, q) => sum + q, 0);

// 	const productTotal = sizes.reduce((sum, size) => {
// 		const q = qty[size.size_name] || 0;
// 		return sum + q * Number(size.price || 0);
// 	}, 0);

// 	const payNow = Math.round(productTotal * 0.7);
// 	const payOnDelivery = productTotal - payNow;

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setIsSubmitting(true);
// 		const form = {
// 			product_id: product?.offer_id,
// 			variant: product?.selectedVariant,
// 			quantity: qty,
// 		};
// 		try {
// 			await addToCard(form);
// 			toast.success('Product added to cart successfully!');
// 		} catch (err) {
// 			toast.error('Failed to add product to cart.');
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};

// 	return (
// 		// ← explicit return was missing / misplaced
// 		<div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
// 			{/* Top Bar */}
// 			<div className="flex items-center justify-between px-3 py-5 border-b mb-5 bg-white">
// 				<div className="flex items-center gap-1.5 text-base font-semibold">
// 					Shipping
// 					<span className="text-red-500 text-lg leading-none">*</span>
// 				</div>
// 				<div className="flex items-center gap-1.5 text-gray-600">
// 					<MapPin className="w-5 h-5" />
// 					<span className="font-medium">To Bangladesh</span>
// 				</div>
// 			</div>

// 			<div className="flex gap-2 px-3 font-hanken">
// 				{/* By Air Card */}
// 				<div
// 					onClick={() => setSelectedShipping('air')}
// 					className={`min-h-[100px] flex-1 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
//             ${selectedShipping === 'air' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
// 				>
// 					<div className="flex items-center gap-3">
// 						<div
// 							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
//               ${selectedShipping === 'air' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
// 						>
// 							<Plane className="w-6 h-6" />
// 						</div>
// 						<div>
// 							<p className="font-semibold text-gray-800">By Air</p>
// 							<p className="text-xs text-gray-600 mt-0.5">{airPrice}</p>
// 						</div>
// 					</div>
// 				</div>

// 				{/* By Sea Card */}
// 				<div
// 					onClick={() => setSelectedShipping('sea')}
// 					className={`min-h-[100px] flex-1 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
//             ${selectedShipping === 'sea' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
// 				>
// 					<div className="flex items-center gap-3">
// 						<div
// 							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
//               ${selectedShipping === 'sea' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
// 						>
// 							<Ship className="w-6 h-6" />
// 						</div>
// 						<div>
// 							<p className="font-semibold text-gray-800">By Sea</p>
// 							<p className="text-xs text-gray-600 mt-0.5">{seaPrice}</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Product & Shipping Info */}
// 			<div className="px-3 py-5 space-y-4">
// 				<div className="space-y-3">
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<span>Quantity</span>
// 						<span className="font-medium">{totalQty}</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<span>Product price</span>
// 						<span className="font-medium">৳ {productTotal.toLocaleString()}</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<p>
// 							Pay now <span>(70%)</span>
// 						</p>
// 						<span className="font-medium">৳ {payNow.toLocaleString()}</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<p>
// 							Pay on delivery <span>(30%)</span>
// 						</p>
// 						<span className="font-medium">৳ {payOnDelivery.toLocaleString()}</span>
// 					</div>
// 					<div className="flex justify-between text-lg font-semibold border-t pt-3 font-hanken">
// 						<span>Total</span>
// 						<span>৳ {productTotal.toLocaleString()}</span>
// 					</div>
// 				</div>

// 				{/* Shipping charge info */}
// 				<div className="py-2">
// 					<div className="flex items-center justify-between border border-dashed border-orange-300 bg-gray-50 rounded-xl p-4 mb-3">
// 						<div>
// 							<div className="font-medium">Approximate weight, 2Kg</div>
// 							<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
// 								<Plane className="w-4 h-4" />
// 								By Air - Example Company Global Shipping
// 							</div>
// 						</div>
// 						<div className="flex items-center gap-2">
// 							<span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Slot</span>
// 							<button className="text-orange-300 hover:text-orange-400 transition-colors font-semibold rounded-full flex items-center text-sm cursor-pointer">
// 								<ScanEye />
// 							</button>
// 						</div>
// 					</div>
// 					<p className="text-xs text-gray-500 leading-relaxed">*** উল্লেখিত পণ্যের ওজন সম্পূর্ণ সঠিক নয়, আনুমানিক মাত্র।</p>
// 				</div>

// 				{/* Buttons */}
// 				<div className="pt-2 space-y-3">
// 					<Button size="lg" className="w-full bg-orange-300 hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl transition">
// 						Buy Now
// 					</Button>
// 					<Button
// 						onClick={handleSubmit}
// 						disabled={isSubmitting}
// 						variant="outline"
// 						size="lg"
// 						className="w-full border border-orange-300 text-orange-300 hover:bg-orange-500 hover:text-white font-medium py-3.5 rounded-xl transition"
// 					>
// 						{isSubmitting ? 'Adding...' : 'Add to Cart'}
// 					</Button>
// 				</div>
// 			</div>

// 			{/* Dropship Banner */}
// 			<div className="mx-3 mb-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl px-3 py-5 text-white overflow-hidden relative">
// 				<div className="max-w-[65%]">
// 					<h3 className="text-2xl font-bold leading-tight mb-2">
// 						Dropship this product with
// 						<br />
// 						MoveDrop!
// 					</h3>
// 					<p className="text-sm opacity-90 mb-5">
// 						No stock, No risk!
// 						<br />
// 						Just sell and grow your business.
// 					</p>
// 					<button className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-orange-50 transition">
// 						Start Dropshipping
// 					</button>
// 				</div>
// 				<div className="absolute top-6 right-12 text-3xl">👕</div>
// 				<div className="absolute top-20 right-28 text-2xl">🎒</div>
// 			</div>

// 			{/* Brand Assurance */}
// 			<div className="px-3 py-6">
// 				<h4 className="font-semibold text-lg mb-4">Brand Assurance</h4>
// 				<div className="space-y-3 text-sm">
// 					<div className="flex items-center gap-3">
// 						<ShieldCheck className="w-5 h-5 text-green-600" />
// 						<span>100% money back guarantee</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Clock className="w-5 h-5 text-green-600" />
// 						<span>On time guarantee</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Search className="w-5 h-5 text-green-600" />
// 						<span>Detailed inspection</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<TrendingDown className="w-5 h-5 text-green-600" />
// 						<span>Lower exchange loss</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Lock className="w-5 h-5 text-green-600" />
// 						<span>Security & Privacy</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// // ── Shipping rate config ──────────────────────────────────────
// const SHIPPING_RATES = {
// 	air: { label: 'By Air', perKg: 780, priceDisplay: '৳780 / ৳1170 Per Kg' },
// 	sea: { label: 'By Sea', perKg: 170, priceDisplay: '৳170 / ৳400 Per Kg' },
// } as const;

// const APPROXIMATE_WEIGHT_KG = 2;
// // ─────────────────────────────────────────────────────────────

// export default function CartSection({ product }: { product: any }) {
// 	const [selectedShipping, setSelectedShipping] = useState<'air' | 'sea'>('air');
// 	const [isSubmitting, setIsSubmitting] = useState(false);

// 	// ── Product totals ────────────────────────────────────────
// 	const qty: Record<string, number> = product?.qty || {};
// 	const sizes: Array<{ size_name: string; price: string }> = product?.selectedVariant?.sizes || [];

// 	const totalQty = Object.values(qty).reduce((sum, q) => sum + q, 0);

// 	const productTotal = sizes.reduce((sum, size) => {
// 		const q = qty[size.size_name] || 0;
// 		return sum + q * Number(size.price || 0);
// 	}, 0);

// 	// ── Shipping charge (dynamic based on selected method) ────
// 	const shippingRate = SHIPPING_RATES[selectedShipping];
// 	const shippingCharge = shippingRate.perKg * APPROXIMATE_WEIGHT_KG;

// 	// ── Grand total = product + shipping ─────────────────────
// 	const grandTotal = productTotal + shippingCharge;
// 	const payNow = Math.round(grandTotal * 0.7);
// 	const payOnDelivery = grandTotal - payNow;
// 	// ─────────────────────────────────────────────────────────

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setIsSubmitting(true);
// 		const form = {
// 			product_id: product?.offer_id,
// 			variant: product?.selectedVariant,
// 			quantity: qty,
// 			shipping_method: selectedShipping,
// 		};
// 		try {
// 			await addToCard(form);
// 			toast.success('Product added to cart successfully!');
// 		} catch (err) {
// 			toast.error('Failed to add product to cart.');
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};

// 	return (
// 		<div className="w-full mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
// 			{/* Top Bar */}
// 			<div className="flex items-center justify-between px-3 py-5 border-b mb-5 bg-white">
// 				<div className="flex items-center gap-1.5 text-base font-semibold">
// 					Shipping
// 					<span className="text-red-500 text-lg leading-none">*</span>
// 				</div>
// 				<div className="flex items-center gap-1.5 text-gray-600">
// 					<MapPin className="w-5 h-5" />
// 					<span className="font-medium">To Bangladesh</span>
// 				</div>
// 			</div>

// 			{/* Shipping Method Selector */}
// 			<div className="flex gap-2 px-3 font-hanken">
// 				{/* By Air Card */}
// 				<div
// 					onClick={() => setSelectedShipping('air')}
// 					className={`min-h-[100px] flex-1 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
// 						${selectedShipping === 'air' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
// 				>
// 					<div className="flex items-center gap-3">
// 						<div
// 							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
// 							${selectedShipping === 'air' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
// 						>
// 							<Plane className="w-6 h-6" />
// 						</div>
// 						<div>
// 							<p className="font-semibold text-gray-800">By Air</p>
// 							<p className="text-xs text-gray-600 mt-0.5">{SHIPPING_RATES.air.priceDisplay}</p>
// 						</div>
// 					</div>
// 				</div>

// 				{/* By Sea Card */}
// 				<div
// 					onClick={() => setSelectedShipping('sea')}
// 					className={`min-h-[100px] flex-1 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
// 						${selectedShipping === 'sea' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
// 				>
// 					<div className="flex items-center gap-3">
// 						<div
// 							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
// 							${selectedShipping === 'sea' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
// 						>
// 							<Ship className="w-6 h-6" />
// 						</div>
// 						<div>
// 							<p className="font-semibold text-gray-800">By Sea</p>
// 							<p className="text-xs text-gray-600 mt-0.5">{SHIPPING_RATES.sea.priceDisplay}</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Totals */}
// 			<div className="px-3 py-5 space-y-4">
// 				<div className="space-y-3">
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<span>Quantity</span>
// 						<span className="font-medium">{totalQty}</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<span>Product price</span>
// 						<span className="font-medium">৳ {productTotal.toLocaleString()}</span>
// 					</div>
// 					{/* ── Shipping charge row (updates on Air/Sea toggle) ── */}
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<span>Shipping charge ({shippingRate.label})</span>
// 						<span className="font-medium">৳ {shippingCharge.toLocaleString()}</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<p>
// 							Pay now <span>(70%)</span>
// 						</p>
// 						<span className="font-medium">৳ {payNow.toLocaleString()}</span>
// 					</div>
// 					<div className="flex justify-between text-sm font-hanken text-gray-600">
// 						<p>
// 							Pay on delivery <span>(30%)</span>
// 						</p>
// 						<span className="font-medium">৳ {payOnDelivery.toLocaleString()}</span>
// 					</div>
// 					<div className="flex justify-between text-lg font-semibold border-t pt-3 font-hanken">
// 						<span>Total</span>
// 						<span>৳ {grandTotal.toLocaleString()}</span>
// 					</div>
// 				</div>

// 				{/* Shipping info box — now shows the selected method dynamically */}
// 				<div className="py-2">
// 					<div className="flex items-center justify-between border border-dashed border-orange-300 bg-gray-50 rounded-xl p-4 mb-3">
// 						<div>
// 							<div className="font-medium">Approximate weight, {APPROXIMATE_WEIGHT_KG}Kg</div>
// 							<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
// 								{selectedShipping === 'air' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
// 								{/* ── Label updates with selection ── */}
// 								{shippingRate.label} - Example Company Global Shipping
// 							</div>
// 						</div>
// 						<div className="flex items-center gap-2">
// 							<span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Slot</span>
// 							<button className="text-orange-300 hover:text-orange-400 transition-colors font-semibold rounded-full flex items-center text-sm cursor-pointer">
// 								<ScanEye />
// 							</button>
// 						</div>
// 					</div>
// 					<p className="text-xs text-gray-500 leading-relaxed">
// 						*** উল্লেখিত পণ্যের ওজন সম্পূর্ণ সঠিক নয়, আনুমানিক মাত্র। বাংলাদেশে আসার পর পণ্যটির প্রকৃত ওজন মেপে শিপিং চার্জ হিসাব করা হবে।
// 					</p>
// 				</div>

// 				{/* Buttons */}
// 				<div className="pt-2 space-y-3">
// 					<Button size="lg" className="w-full bg-orange-300 hover:bg-orange-500 text-white font-semibold py-3.5 rounded-xl transition">
// 						Buy Now
// 					</Button>
// 					<Button
// 						onClick={handleSubmit}
// 						disabled={isSubmitting}
// 						variant="outline"
// 						size="lg"
// 						className="w-full border border-orange-300 text-orange-300 hover:bg-orange-500 hover:text-white font-medium py-3.5 rounded-xl transition"
// 					>
// 						{isSubmitting ? 'Adding...' : 'Add to Cart'}
// 					</Button>
// 				</div>
// 			</div>

// 			{/* Dropship Banner */}
// 			<div className="mx-3 mb-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl px-3 py-5 text-white overflow-hidden relative">
// 				<div className="max-w-[65%]">
// 					<h3 className="text-2xl font-bold leading-tight mb-2">
// 						Dropship this product with
// 						<br />
// 						MoveDrop!
// 					</h3>
// 					<p className="text-sm opacity-90 mb-5">
// 						No stock, No risk!
// 						<br />
// 						Just sell and grow your business.
// 					</p>
// 					<button className="bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-orange-50 transition">
// 						Start Dropshipping
// 					</button>
// 				</div>
// 				<div className="absolute top-6 right-12 text-3xl">👕</div>
// 				<div className="absolute top-20 right-28 text-2xl">🎒</div>
// 			</div>

// 			{/* Brand Assurance */}
// 			<div className="px-3 py-6">
// 				<h4 className="font-semibold text-lg mb-4">Brand Assurance</h4>
// 				<div className="space-y-3 text-sm">
// 					<div className="flex items-center gap-3">
// 						<ShieldCheck className="w-5 h-5 text-green-600" />
// 						<span>100% money back guarantee</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Clock className="w-5 h-5 text-green-600" />
// 						<span>On time guarantee</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Search className="w-5 h-5 text-green-600" />
// 						<span>Detailed inspection</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<TrendingDown className="w-5 h-5 text-green-600" />
// 						<span>Lower exchange loss</span>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<Lock className="w-5 h-5 text-green-600" />
// 						<span>Security & Privacy</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

export interface VariantSize {
	size_name: string;
	price: string;
	stock: string;
}

export interface Variant {
	color_name: string;
	image: string;
	active: boolean;
	sizes: VariantSize[];
}

const SHIPPING_RATES = {
	air: { label: 'By Air', perKg: 780, priceDisplay: '৳780 / ৳1170 Per Kg' },
	sea: { label: 'By Sea', perKg: 170, priceDisplay: '৳170 / ৳400 Per Kg' },
} as const;

export default function CartSection({ product }: { product: any }) {
	const [selectedShipping, setSelectedShipping] = useState<'air' | 'sea'>('air');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const selectedColorQty: Record<number, Record<string, number>> = product?.selectedColorQty || {};
	const variants: Variant[] = product?.variants || [];

	const totalQty = Object.values(selectedColorQty).reduce((sum, sizeMap) => {
		return sum + Object.values(sizeMap).reduce((s, q) => s + q, 0);
	}, 0);

	const productTotal = Object.entries(selectedColorQty).reduce((total, [colorIndex, sizeMap]) => {
		const variant = variants[Number(colorIndex)];
		return (
			total +
			Object.entries(sizeMap).reduce((sum, [sizeName, qty]) => {
				const size = variant?.sizes?.find((s) => s.size_name === sizeName);
				return sum + qty * Number(size?.price || 0);
			}, 0)
		);
	}, 0);

	// weight = heaviest selected variant (or average — your call)
	const weightKg = Object.keys(selectedColorQty).reduce((max, colorIndex) => {
		const w = variants[Number(colorIndex)]?.weightKg ?? 0;
		return Math.max(max, w);
	}, 0);

	const qty: Record<string, number> = product?.qty || {};
	const sizes: Array<{ size_name: string; price: string }> = product?.selectedVariant?.sizes || [];

	// ── Weight from selected variant's pieceWeightScaleInfo ──
	// const weightKg: number = product?.selectedVariant?.weightKg ?? 0;
	// console.log('===product?.selectedVariant?.weightKg', product?.selectedVariant);
	// ─────────────────────────────────────────────────────────

	// const totalQty = Object.values(qty).reduce((sum, q) => sum + q, 0);

	// const productTotal = sizes.reduce((sum, size) => {
	// 	const q = qty[size.size_name] || 0;
	// 	return sum + q * Number(size.price || 0);
	// }, 0);

	// ── Shipping charge uses real weight now ──────────────────
	const shippingRate = SHIPPING_RATES[selectedShipping];
	const shippingCharge = totalQty > 0 ? Math.round(shippingRate.perKg * weightKg * totalQty) : 0; // no charge if nothing selected
	// ─────────────────────────────────────────────────────────

	const grandTotal = productTotal + shippingCharge;
	const payNow = Math.round(grandTotal * 0.7);
	const payOnDelivery = grandTotal - payNow;

	// const handleSubmit = async (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	setIsSubmitting(true);
	// 	const form = {
	// 		product_id: product?.offer_id,
	// 		variant: product?.selectedVariant,
	// 		quantity: qty,
	// 		shipping_method: selectedShipping,
	// 	};
	// 	try {
	// 		await addToCard(form);
	// 		toast.success('Product added to cart successfully!');
	// 	} catch (err) {
	// 		toast.error('Failed to add product to cart.');
	// 	} finally {
	// 		setIsSubmitting(false);
	// 	}
	// };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const selectedVariants = Object.entries(selectedColorQty)
			.filter(([, sizeMap]) => Object.values(sizeMap).some((q) => q > 0))
			.map(([colorIndex, sizeMap]) => ({
				variant: variants[Number(colorIndex)],
				quantity: sizeMap,
			}));

		const form = {
			product_id: product?.offer_id,
			product_name: product?.name,
			product_image: product?.image,
			variants: selectedVariants.map((v) => ({
				variant: {
					color_name: v.variant?.color_name,
					image: v.variant?.image, // ← image lives here
					weightKg: v.variant?.weightKg,
					weightInfo: v.variant?.weightInfo,
					sizes: v.variant?.sizes,
				},
				quantity: v.quantity,
			})),
			shipping_method: selectedShipping,
		};

		console.log('cart submit payload:', form);

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

			{/* Shipping Method Selector */}
			<div className="flex gap-2 px-3 font-hanken">
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
							<p className="text-xs text-gray-600 mt-0.5">{SHIPPING_RATES.air.priceDisplay}</p>
						</div>
					</div>
				</div>

				<div
					onClick={() => setSelectedShipping('sea')}
					className={`min-h-[100px] flex-1 flex items-center justify-center rounded-2xl p-2 cursor-pointer transition-all border-2
						${selectedShipping === 'sea' ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200 hover:border-gray-300'}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
							${selectedShipping === 'sea' ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-500'}`}
						>
							<Ship className="w-6 h-6" />
						</div>
						<div>
							<p className="font-semibold text-gray-800">By Sea</p>
							<p className="text-xs text-gray-600 mt-0.5">{SHIPPING_RATES.sea.priceDisplay}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Totals */}
			<div className="px-3 py-5 space-y-4">
				<div className="space-y-3">
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<span>Quantity</span>
						<span className="font-medium">{totalQty}</span>
					</div>
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<span>Product price</span>
						<span className="font-medium">৳ {productTotal.toLocaleString()}</span>
					</div>
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<span>
							Shipping ({shippingRate.label}, {weightKg}kg × {totalQty} pcs)
						</span>
						<span className="font-medium">৳ {shippingCharge.toLocaleString()}</span>
					</div>
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<p>
							Pay now <span>(70%)</span>
						</p>
						<span className="font-medium">৳ {payNow.toLocaleString()}</span>
					</div>
					<div className="flex justify-between text-sm font-hanken text-gray-600">
						<p>
							Pay on delivery <span>(30%)</span>
						</p>
						<span className="font-medium">৳ {payOnDelivery.toLocaleString()}</span>
					</div>
					<div className="flex justify-between text-lg font-semibold border-t pt-3 font-hanken">
						<span>Total</span>
						<span>৳ {grandTotal.toLocaleString()}</span>
					</div>
				</div>

				{/* Shipping info box */}
				<div className="py-2">
					<div className="flex items-center justify-between border border-dashed border-orange-300 bg-gray-50 rounded-xl p-4 mb-3">
						<div>
							<div className="font-medium">Weight: {weightKg > 0 ? `${weightKg}kg per unit` : 'Calculating...'}</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
								{selectedShipping === 'air' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
								{shippingRate.label} - Example Company Global Shipping
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Slot</span>
							<button className="text-orange-300 hover:text-orange-400 transition-colors font-semibold rounded-full flex items-center text-sm cursor-pointer">
								<ScanEye />
							</button>
						</div>
					</div>
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
						onClick={handleSubmit}
						disabled={isSubmitting}
						variant="outline"
						size="lg"
						className="w-full border border-orange-300 text-orange-300 hover:bg-orange-500 hover:text-white font-medium py-3.5 rounded-xl transition"
					>
						{isSubmitting ? 'Adding...' : 'Add to Cart'}
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
				<div className="absolute top-6 right-12 text-3xl">👕</div>
				<div className="absolute top-20 right-28 text-2xl">🎒</div>
			</div>

			{/* Brand Assurance */}
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
