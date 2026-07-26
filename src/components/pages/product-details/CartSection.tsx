'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Plane, ShieldCheck, Clock, Search, TrendingDown, Lock, Ship, ScanEye } from 'lucide-react';
import { toast } from 'sonner';
import { addToCard } from '@/lib/api/cart';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { QueriesKey } from '@/lib/constants/queriesKey';

interface VariantOption {
	skuId: number;
	price: number;
	stock: number;
	selections: Record<string, string>;
	label: string;
}

interface VariantGroup {
	groupId: string;
	label: string;
	options: { id: string; value: string; image?: string }[];
	hasImages: boolean;
}

const SHIPPING_RATES = {
	air: { label: 'By Air', perKg: 780, priceDisplay: '৳780 / ৳1170 Per Kg' },
	sea: { label: 'By Sea', perKg: 170, priceDisplay: '৳170 / ৳400 Per Kg' },
} as const;

// Parses strings like "500g" / "0.5kg" / "500" into kg. Adjust if the API
// gives weight in a different unit/format.
function parseWeightToKg(weight?: string): number {
	if (!weight) return 0;
	const match = weight.match(/([\d.]+)\s*(kg|g)?/i);
	if (!match) return 0;
	const value = parseFloat(match[1]);
	if (isNaN(value)) return 0;
	return match[2]?.toLowerCase() === 'g' ? value / 1000 : value;
}

export default function CartSection({ product }: { product: any }) {
	const [selectedShipping, setSelectedShipping] = useState<'air' | 'sea'>('air');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { isAuthenticated } = useAuthStore();
	const router = useRouter();
	const queryClient = useQueryClient();
	const { openDrawer } = useLayoutStore();

	// skuId -> qty (this is what ProductDetailsPageContent actually passes)
	const selectedQty: Record<number, number> = product?.selectedQty || {};
	const variantOptions: VariantOption[] = product?.variantOptions || [];
	const variantGroups: VariantGroup[] = product?.variantGroups || [];

	const selectedEntries = Object.entries(selectedQty).filter(([, qty]) => qty > 0);

	const totalQty = selectedEntries.reduce((sum, [, qty]) => sum + qty, 0);

	const productTotal = variantOptions.length === 0
		? totalQty * (product?.price || 0)
		: selectedEntries.reduce((total, [skuId, qty]) => {
				const variant = variantOptions.find((v) => v.skuId === Number(skuId));
				return total + qty * (variant?.price || 0);
			}, 0);

	// Per-SKU weight isn't available from the API right now (only a single
	// `weight` string on the product). Falling back to that for every unit.
	const weightPerUnitKg = parseWeightToKg(product?.weight);

	const shippingRate = SHIPPING_RATES[selectedShipping];
	const shippingCharge = totalQty > 0 ? Math.round(shippingRate.perKg * weightPerUnitKg * totalQty) : 0;

	const grandTotal = productTotal + shippingCharge;
	const payNow = Math.round(grandTotal * 0.7);
	const payOnDelivery = grandTotal - payNow;

	const requireAuth = (action: () => void) => {
		if (!isAuthenticated) {
			toast.error('Please sign in to continue.');
			router.push('/sign-in');
			return;
		}
		action();
	};

	// Builds a human-readable label + selections for a SKU using variantGroups
	const buildVariantPayload = (variant: VariantOption, qty: number) => ({
		skuId: variant.skuId,
		label: variant.label,
		price: variant.price,
		selections: variant.selections,
		quantity: qty,
		weight: weightPerUnitKg,
	});

	const getSelectedVariantsPayload = () => {
		if (variantOptions.length === 0) {
			return [{
				skuId: 0,
				label: 'Standard',
				price: product?.price || 0,
				selections: {},
				quantity: totalQty,
				weight: weightPerUnitKg,
			}];
		}
		return selectedEntries
			.map(([skuId, qty]) => {
				const variant = variantOptions.find((v) => v.skuId === Number(skuId));
				if (!variant) return null;
				return buildVariantPayload(variant, qty);
			})
			.filter(Boolean);
	};

	const submitCart = async (redirectToCheckout: boolean) => {
		if (totalQty === 0) {
			toast.error('Please select at least one item first.');
			return;
		}

		setIsSubmitting(true);

		const form = {
			product_id: product?.offer_id,
			product_name: product?.name,
			product_image: product?.image,
			variants: getSelectedVariantsPayload(),
			shipping_method: selectedShipping,
		};

		try {
			await addToCard(form as any);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CART_DATA] });

			if (redirectToCheckout) {
				router.push('/checkout');
			} else {
				toast.success('Product added to cart successfully!');
				openDrawer({ drawerType: 'cart' });
			}
		} catch (err) {
			toast.error(redirectToCheckout ? 'Failed to process buy now.' : 'Failed to add product to cart.');
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
						${selectedShipping === 'air' ? 'bg-primary/10 border-primary' : 'bg-white border-gray-200 hover:border-gray-300'}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
							${selectedShipping === 'air' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
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
						${selectedShipping === 'sea' ? 'bg-primary/10 border-primary' : 'bg-white border-gray-200 hover:border-gray-300'}`}
				>
					<div className="flex items-center gap-3">
						<div
							className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center
							${selectedShipping === 'sea' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}
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
							Shipping ({shippingRate.label}, {weightPerUnitKg}kg × {totalQty} pcs)
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
					<div className="flex items-center justify-between border border-dashed border-primary/50 bg-gray-50 rounded-xl p-4 mb-3">
						<div>
							<div className="font-medium">Weight: {weightPerUnitKg > 0 ? `${weightPerUnitKg}kg per unit` : 'Calculating...'}</div>
							<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
								{selectedShipping === 'air' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
								{shippingRate.label} - Example Company Global Shipping
							</div>
						</div>
						<div className="flex items-center gap-2">
							<span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">Slot</span>
							<button className="text-primary hover:text-primary/50 transition-colors font-semibold rounded-full flex items-center text-sm cursor-pointer">
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
					<Button
						onClick={() => requireAuth(() => submitCart(true))}
						disabled={isSubmitting}
						size="lg"
						className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3.5 rounded-xl transition"
					>
						Buy Now
					</Button>
					<Button
						onClick={() => requireAuth(() => submitCart(false))}
						disabled={isSubmitting}
						variant="outline"
						size="lg"
						className="w-full border border-primary/50 text-primary hover:bg-primary hover:text-white font-medium py-3.5 rounded-xl transition"
					>
						{isSubmitting ? 'Adding...' : 'Add to Cart'}
					</Button>
				</div>
			</div>

			{/* Dropship Banner */}
			<div className="mx-3 mb-5 bg-gradient-to-r from-primary to-primary/60 rounded-2xl px-3 py-5 text-white overflow-hidden relative">
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
					<button className="bg-white text-primary font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-orange-50 transition">
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
						<ShieldCheck className="w-5 h-5 text-primary" />
						<span>100% money back guarantee</span>
					</div>
					<div className="flex items-center gap-3">
						<Clock className="w-5 h-5 text-primary" />
						<span>On time guarantee</span>
					</div>
					<div className="flex items-center gap-3">
						<Search className="w-5 h-5 text-primary" />
						<span>Detailed inspection</span>
					</div>
					<div className="flex items-center gap-3">
						<TrendingDown className="w-5 h-5 text-primary" />
						<span>Lower exchange loss</span>
					</div>
					<div className="flex items-center gap-3">
						<Lock className="w-5 h-5 text-primary" />
						<span>Security & Privacy</span>
					</div>
				</div>
			</div>
		</div>
	);
}
