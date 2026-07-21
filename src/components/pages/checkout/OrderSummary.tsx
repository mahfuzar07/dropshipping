// 'use client';

// import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
// import { Card, CardContent } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { ShoppingCart, Package, ChevronDown } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useAppData } from '@/hooks/use-appdata';
// import { QueriesKey } from '@/lib/constants/queriesKey';
// import { apiEndpoint } from '@/lib/constants/apiEndpoint';
// import { toast } from 'sonner';

// /* ================= TYPES ================= */

// type CartItemAPI = {
// 	id: number;
// 	product: {
// 		_id: string;
// 		moq: string | null;
// 		url: string;
// 		sold: string;
// 		image: string;
// 		is_ad: boolean;
// 		price: { unit: string; amount: string; currency: string; overseas: string };
// 		title: string;
// 		rating: string;
// 		offer_id: string;
// 		promotion: string | null;
// 		seller_icon: string | null;
// 		product_name: string;
// 	};
// 	quantity: Record<string, number>;
// 	variant: {
// 		price: string;
// 		stock: string;
// 		quantity: number;
// 		size_name: string;
// 	}[];
// 	total_price: number;
// 	added_at: string;
// };

// type CartResponse = {
// 	id: number;
// 	items: CartItemAPI[];
// 	total_price: number;
// 	created_at: string;
// 	updated_at: string;
// };

// /* ================= COMPONENT ================= */

// export default function OrderSummary() {
// 	const { orderSummary, shipping } = useCheckoutStore();

// 	const [collapsed, setCollapsed] = useState(true);
// 	const [isMobile, setIsMobile] = useState(false);

// 	const { data, isLoading } = useAppData<CartResponse, 'single'>({
// 		key: [QueriesKey.CART_DATA],
// 		api: apiEndpoint.cart.GET_CART(),
// 		auth: true,
// 		responseType: 'single',
// 		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
// 	});

// 	useEffect(() => {
// 		const handleResize = () => {
// 			const mobile = window.innerWidth < 768;
// 			setIsMobile(mobile);
// 			setCollapsed(mobile);
// 		};
// 		handleResize();
// 		window.addEventListener('resize', handleResize);
// 		return () => window.removeEventListener('resize', handleResize);
// 	}, []);

// 	const handleToggle = () => {
// 		if (isMobile) setCollapsed((prev) => !prev);
// 	};
// 	const shipPrice = shipping?.price ?? 0;
// 	const subtotal = data?.total_price ?? 0;
// 	const discount = orderSummary?.discount ?? 0;
// 	const total = subtotal - discount + shipPrice;

// 	return (
// 		<Card className="p-0 border-orange-100 bg-white overflow-hidden font-hanken">
// 			<button
// 				onClick={handleToggle}
// 				className="w-full flex justify-between items-center px-3 md:px-5 py-5 font-semibold hover:bg-orange-50 transition-colors"
// 			>
// 				<h1 className="flex items-center gap-2 !text-md">
// 					<ShoppingCart size={16} className="shrink-0" />
// 					Order Summary
// 					<Badge className="bg-orange-300 text-white text-[10px] px-2 py-0 h-5 rounded-full">{data?.items.length ?? 0}</Badge>
// 				</h1>

// 				<div className="flex items-center gap-2.5">
// 					<span className="font-bold text-orange-600 text-lg">৳{data?.total_price ? data.total_price.toLocaleString() : '0'}</span>
// 					{isMobile && <ChevronDown size={16} className={`transition-transform duration-200 ${collapsed ? 'rotate-0' : 'rotate-180'}`} />}
// 				</div>
// 			</button>

// 			{(!collapsed || !isMobile) && (
// 				<CardContent className="pt-0 px-5 pb-4">
// 					<div className="space-y-3 mb-4">
// 						{isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}

// 						{data?.items.map((item) => {
// 							// ✅ variant
// 							const variantLabel = item.variant.map((v) => v.size_name).join(', ');
// 							// ✅ quantity
// 							const totalQty = Object.values(item.quantity).reduce((sum, q) => sum + q, 0);

// 							return (
// 								<div key={item.id} className="flex items-start justify-between gap-3">
// 									<div className="flex gap-2.5 flex-1">
// 										{/* ✅ product image */}
// 										<div className="w-10 h-10 rounded-lg bg-orange-100 overflow-hidden flex-shrink-0">
// 											{item.product.image ? (
// 												<img src={item.product.image} alt={item.product.product_name} className="w-full h-full object-cover" />
// 											) : (
// 												<div className="w-full h-full flex items-center justify-center">
// 													<Package size={18} />
// 												</div>
// 											)}
// 										</div>

// 										<div>
// 											<p className="text-[13px] font-medium leading-tight">{item.product.product_name}</p>
// 											<p className="text-[11px] text-muted-foreground mt-0.5">
// 												{variantLabel} × {totalQty}
// 											</p>
// 										</div>
// 									</div>

// 									<span className="text-[13px] font-semibold whitespace-nowrap">৳{item.total_price.toLocaleString()}</span>
// 								</div>
// 							);
// 						})}
// 					</div>

// 					<Separator className="mb-3 bg-orange-100" />

// 					<div className="space-y-1.5">
// 						<div className="flex justify-between text-[13px]">
// 							<span className="text-muted-foreground">Subtotal</span>
// 							<span>৳{subtotal.toLocaleString()}</span>
// 						</div>
// 						{/*
// 						<div className="flex justify-between text-[13px]">
// 							<span className="text-muted-foreground">Discount</span>
// 							<span className="text-green-600 font-medium">-৳{(orderSummary?.discount ?? 0).toLocaleString()}</span>
// 						</div> */}

// 						<div className="flex justify-between text-[13px]">
// 							<span className="text-muted-foreground">Shipping</span>
// 							<span className={!shipPrice ? 'text-muted-foreground' : ''}>{shipPrice ? `৳${shipPrice}` : 'Select method'}</span>
// 						</div>

// 						<Separator className="my-2 bg-orange-100" />

// 						<div className="flex justify-between font-bold text-[15px]">
// 							<span>Total</span>
// 							<span className="text-orange-600">৳{total.toLocaleString()}</span>
// 						</div>
// 					</div>
// 				</CardContent>
// 			)}
// 		</Card>
// 	);
// }

'use client';

import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, ChevronDown, Ticket, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { authApi } from '@/lib/axiosInstance';
import { toast } from 'sonner';

/* ================= TYPES ================= */

type VariantSize = {
	price: string;
	stock: string;
	size_name: string;
};

type VariantDetail = {
	image: string;
	color_name: string;
	weightKg: number;
	sizes: VariantSize[];
};

type VariantEntry = {
	variant: VariantDetail;
	quantity: Record<string, number>;
};

type CartItem = {
	id: number;
	user: string;
	product_id: string;
	product_name: string;
	product_image: string;
	variants: VariantEntry[];
	shipping_method: 'air' | 'sea';
	created_at: string;
	updated_at: string;
};

type CartResponse = {
	success: boolean;
	count: number;
	data: CartItem[];
};

/* ================= HELPERS ================= */

// total qty across all variants of one cart item
const getItemTotalQty = (variants: VariantEntry[]): number =>
	variants.reduce((sum, v) => {
		return sum + Object.values(v.quantity).reduce((s, q) => s + q, 0);
	}, 0);

// total price for one cart item
const getItemTotal = (variants: VariantEntry[]): number =>
	variants.reduce((total, v) => {
		return (
			total +
			Object.entries(v.quantity).reduce((sum, [sizeName, qty]) => {
				const size = v.variant.sizes.find((s) => s.size_name === sizeName);
				return sum + qty * Number(size?.price || 0);
			}, 0)
		);
	}, 0);

// grand subtotal across all cart items
const getSubtotal = (items: CartItem[]): number => items.reduce((sum, item) => sum + getItemTotal(item.variants), 0);

// variant label: "典雅灰 × 2, 奶茶色 × 1"
const getVariantLabel = (variants: VariantEntry[]): string =>
	variants
		.filter((v) => Object.values(v.quantity).some((q) => q > 0))
		.map((v) => {
			const qty = Object.values(v.quantity).reduce((s, q) => s + q, 0);
			return `${v.variant.color_name} × ${qty}`;
		})
		.join(', ');

/* ================= COMPONENT ================= */

export default function OrderSummary() {
	const { orderSummary, shipping, appliedCoupon, setAppliedCoupon, setDiscount } = useCheckoutStore();

	const [collapsed, setCollapsed] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [couponInput, setCouponInput] = useState('');
	const [isValidating, setIsValidating] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			setCollapsed(mobile);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const { data, isLoading } = useAppData<CartResponse, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.GET_CART(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
	});

	const cartItems = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);

	const subtotal = useMemo(() => getSubtotal(cartItems), [cartItems]);
	const shipPrice = shipping?.price ?? 0;
	const discount = orderSummary?.discount ?? 0;
	const total = subtotal - discount + shipPrice;
	const itemCount = cartItems.length;

	const handleApplyCoupon = async () => {
		const code = couponInput.trim().toUpperCase();
		if (!code) return;
		setIsValidating(true);
		try {
			const response = await authApi.get(`/api/order/coupons/?search=${code}`);
			const coupons = response.data?.data || response.data?.results || [];
			const coupon = coupons.find((c: any) => c.code.toUpperCase() === code);

			if (!coupon) {
				toast.error('Invalid coupon code');
				return;
			}

			if (!coupon.is_active) {
				toast.error('This coupon is inactive');
				return;
			}

			const expiryDate = new Date(coupon.valid_until);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			if (expiryDate < today) {
				toast.error('This coupon has expired');
				return;
			}

			const minAmount = Number(coupon.min_order_amount || 0);
			if (subtotal < minAmount) {
				toast.error(`Minimum order amount of ৳${minAmount.toLocaleString()} required`);
				return;
			}

			let calculatedDiscount = 0;
			if (coupon.discount_type === 'flat') {
				calculatedDiscount = Number(coupon.discount_value);
			} else if (coupon.discount_type === 'percent') {
				calculatedDiscount = (Number(coupon.discount_value) / 100) * subtotal;
			}

			calculatedDiscount = Math.min(calculatedDiscount, subtotal);

			setAppliedCoupon(coupon);
			setDiscount(calculatedDiscount);
			toast.success(`Coupon "${coupon.code}" applied! Save ৳${calculatedDiscount.toLocaleString()}`);
			setCouponInput('');
		} catch (error) {
			toast.error('Failed to validate coupon');
		} finally {
			setIsValidating(false);
		}
	};

	const handleRemoveCoupon = () => {
		setAppliedCoupon(null);
		setDiscount(0);
		toast.success('Coupon removed');
	};

	return (
		<Card className="p-0 border-orange-100 bg-white overflow-hidden font-hanken">
			{/* Header — toggles on mobile */}
			<button
				onClick={() => isMobile && setCollapsed((prev) => !prev)}
				className="w-full flex justify-between items-center px-3 md:px-5 py-5 font-semibold hover:bg-orange-50 transition-colors"
			>
				<h1 className="flex items-center gap-2 !text-md">
					<ShoppingCart size={16} className="shrink-0" />
					Order Summary
					<Badge className="bg-primary text-white text-[10px] px-2 py-0 h-5 rounded-full">{itemCount}</Badge>
				</h1>

				<div className="flex items-center gap-2.5">
					<span className="font-bold text-primary text-lg">৳{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
					{isMobile && <ChevronDown size={16} className={`transition-transform duration-200 ${collapsed ? 'rotate-0' : 'rotate-180'}`} />}
				</div>
			</button>

			{(!collapsed || !isMobile) && (
				<CardContent className="pt-0 px-5 pb-4">
					{/* Cart items list */}
					<div className="space-y-3 mb-4">
						{isLoading && <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>}

						{cartItems.map((item) => {
							const itemTotal = getItemTotal(item.variants);
							const totalQty = getItemTotalQty(item.variants);
							const variantLabel = getVariantLabel(item.variants);

							return (
								<div key={item.id} className="flex items-start justify-between gap-3">
									<div className="flex gap-2.5 flex-1 min-w-0">
										{/* Product image — uses product_image as main, variant image as overlay */}
										<div className="relative w-10 h-10 rounded-lg bg-orange-50 overflow-hidden flex-shrink-0 border border-orange-100">
											{item.product_image ? (
												<img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<Package size={18} className="text-primary" />
												</div>
											)}
											{/* qty badge */}
											{totalQty > 1 && (
												<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
													{totalQty}
												</span>
											)}
										</div>

										<div className="min-w-0">
											<p className="text-[13px] font-medium leading-tight line-clamp-2">{item.product_name}</p>
											{/* variant color + size summary */}
											<p className="text-[11px] text-muted-foreground mt-0.5 truncate">{variantLabel}</p>
											{/* shipping method badge */}
											<span className="inline-block text-[10px] bg-orange-50 text-primary px-1.5 py-0.5 rounded mt-0.5">
												{item.shipping_method === 'air' ? '✈ Air' : '🚢 Sea'}
											</span>
										</div>
									</div>

									<span className="text-[13px] font-semibold whitespace-nowrap">
										৳{itemTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
									</span>
								</div>
							);
						})}

						{!isLoading && cartItems.length === 0 && <p className="text-sm text-muted-foreground text-center py-2">No items in cart.</p>}
					</div>

					{/* Coupon code application section */}
					<div className="my-4">
						{appliedCoupon ? (
							<div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
								<div className="flex items-center gap-2 text-emerald-700">
									<Ticket size={16} className="shrink-0 animate-bounce text-emerald-600" />
									<div className="text-xs">
										<p className="font-bold tracking-wider">{appliedCoupon.code}</p>
										<p className="text-[10px] opacity-90">
											{appliedCoupon.discount_type === 'percent' 
												? `${Number(appliedCoupon.discount_value)}% Off` 
												: `৳${Number(appliedCoupon.discount_value).toLocaleString()} Off`} applied
										</p>
									</div>
								</div>
								<button 
									onClick={handleRemoveCoupon} 
									className="text-[11px] font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
								>
									Remove
								</button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<Input
									placeholder="Promo / Coupon Code"
									value={couponInput}
									onChange={(e) => setCouponInput(e.target.value)}
									disabled={isValidating}
									className="text-xs uppercase placeholder:normal-case h-9 tracking-wider border-orange-200 focus-visible:ring-primary bg-white"
								/>
								<Button
									type="button"
									onClick={handleApplyCoupon}
									disabled={isValidating || !couponInput.trim()}
									className="h-9 px-4 bg-primary text-white hover:bg-orange-600 font-semibold text-xs shrink-0 flex items-center gap-1.5"
								>
									{isValidating && <Loader2 size={12} className="animate-spin" />}
									Apply
								</Button>
							</div>
						)}
					</div>

					<Separator className="mb-3 bg-orange-100" />

					{/* Price breakdown */}
					<div className="space-y-1.5">
						<div className="flex justify-between text-[13px]">
							<span className="text-muted-foreground">
								Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})
							</span>
							<span>৳{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
						</div>

						{discount > 0 && (
							<div className="flex justify-between text-[13px]">
								<span className="text-muted-foreground">Discount</span>
								<span className="text-green-600 font-medium">-৳{discount.toLocaleString()}</span>
							</div>
						)}

						<div className="flex justify-between text-[13px]">
							<span className="text-muted-foreground">Shipping</span>
							<span className={!shipPrice ? 'text-muted-foreground' : ''}>{shipPrice ? `৳${shipPrice.toLocaleString()}` : 'Select method'}</span>
						</div>

						<Separator className="my-2 bg-orange-100" />

						<div className="flex justify-between font-bold text-[15px]">
							<span>Total</span>
							<span className="text-primary">৳{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	);
}
