// 'use client';

// import { useEffect, useRef, useMemo, useState } from 'react';
// import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
// import { Button } from '@/components/ui/button';
// import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2, Loader2 } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useLayoutStore } from '@/z-store/global/useLayoutStore';
// import { useAppData } from '@/hooks/use-appdata';
// import { QueriesKey } from '@/lib/constants/queriesKey';
// import { apiEndpoint } from '@/lib/constants/apiEndpoint';
// import { toast } from 'sonner';
// import { CartItemSkeleton } from '../../loader/CartItemSkeleton';

// /* =========================
//    Types
// ========================= */

// type Variant = {
// 	price: string;
// 	stock: string;
// 	quantity: number;
// 	size_name: string;
// };

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
// 	variant: Variant[];
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

// type CartPayload = {
// 	product_id: string;

// 	variant: {
// 		image: string;
// 		active: boolean;
// 		sizes: {
// 			price: string;
// 			stock: string;
// 			quantity: number;
// 			size_name: string;
// 		}[];
// 	};

// 	quantity: Record<string, number>;
// };

// /* =========================
//    Helpers
// ========================= */

// const getVariantBySize = (variants: Variant[], size: string) => variants.find((v) => v.size_name === size);

// // const parsePrice = (priceStr: string): number => {
// // 	const parsed = parseFloat(priceStr.replace(/[^\d.]/g, ''));
// // 	return isNaN(parsed) ? 0 : parsed;
// // };

// function parsePrice(variant: { price?: string } | undefined): { currency: string; amount: number } {
// 	if (!variant?.price) {
// 		return { currency: '', amount: 0 };
// 	}

// 	// Extract currency (non-numeric characters at the start)
// 	const currencyMatch = variant.price.match(/^[^\d.]+/);
// 	const currency = currencyMatch ? currencyMatch[0] : '';

// 	// Extract numeric amount
// 	const amount = parseFloat(variant.price.replace(/[^\d.]/g, ''));

// 	return {
// 		currency,
// 		amount: isNaN(amount) ? 0 : amount,
// 	};
// }

// /* =========================
//    Component
// ========================= */

// export default function CartDrawer() {
// 	// loadingKey format: `${cartItemId}-${size}`
// 	const [loadingKey, setLoadingKey] = useState<string | null>(null);
// 	const { isDrawerOpen, closeDrawer } = useLayoutStore();

// 	const { data, isLoading } = useAppData<CartResponse, 'single'>({
// 		key: [QueriesKey.CART_DATA],
// 		api: apiEndpoint.cart.GET_CART(),
// 		auth: true,
// 		responseType: 'single',
// 		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
// 	});

// 	console.log('Cart Data:', data?.data);

// 	// Auto-close when last item is removed
// 	const activeRowCount = useMemo(() => {
// 		if (!data?.items) return 0;
// 		return data.items.reduce((total, item) => total + Object.values(item.quantity).filter((q) => q > 0).length, 0);
// 	}, [data]);

// 	const prevRowCount = useRef(activeRowCount);

// 	useEffect(() => {
// 		if (prevRowCount.current === 1 && activeRowCount === 0 && isDrawerOpen) closeDrawer();
// 		prevRowCount.current = activeRowCount;
// 	}, [activeRowCount, isDrawerOpen, closeDrawer]);

// 	/* =========================
//      Quantity Update
//   ========================= */

// 	const { create: addToCard, isMutating: isAddressLoading } = useAppData<CartPayload, 'single'>({
// 		key: [QueriesKey.CART_DATA],
// 		api: apiEndpoint.cart.ADD_TO_CART(),
// 		auth: true,
// 		responseType: 'single',
// 		enabled: false,
// 		onSuccess: () => {
// 			toast.success('Address added successfully!');
// 		},

// 		onError: (error: any) => {
// 			toast.error(error?.response?.data?.message || 'Failed to add address');
// 		},
// 	});

// 	const quantityUpdate = async (cartItem: CartItemAPI, size: string, type: 'increment' | 'decrement') => {
// 		const foundItem = data?.items.find((i) => i.id === cartItem.id);
// 		if (!foundItem) return;

// 		const variant = getVariantBySize(foundItem.variant, size);
// 		if (!variant) return;

// 		const currentQty = foundItem.quantity[size] ?? 0;
// 		const newQty = type === 'increment' ? currentQty + 1 : Math.max(1, currentQty - 1);

// 		// Sync quantity into variant array
// 		const updatedVariant = foundItem.variant.map((v) => ({
// 			...v,
// 			quantity: v.size_name === size ? newQty : (foundItem.quantity[v.size_name] ?? v.quantity),
// 		}));

// 		const payload: CartPayload = {
// 			product_id: foundItem.product.offer_id,
// 			variant: {
// 				image: foundItem.product.image,
// 				active: true,
// 				sizes: updatedVariant,
// 			},
// 			quantity: {
// 				...foundItem.quantity,
// 				[size]: newQty,
// 			},
// 		};
// 		setLoadingKey(`${cartItem.id}-${size}`);
// 		try {
// 			await addToCard(payload);
// 		} finally {
// 			setLoadingKey(null);
// 		}
// 	};

// 	const removeVariant = async (cartItem: CartItemAPI, size: string) => {
// 		const foundItem = data?.items.find((i) => i.id === cartItem.id);
// 		if (!foundItem) return;

// 		// Remove this specific size from quantity (set to 0)
// 		const updatedQuantity = { ...foundItem.quantity, [size]: 0 };

// 		// Update variant array to reflect quantity 0 for this size
// 		const updatedVariant = foundItem.variant.map((v) => ({
// 			...v,
// 			quantity: v.size_name === size ? 0 : (foundItem.quantity[v.size_name] ?? v.quantity),
// 		}));

// 		const payload: CartPayload = {
// 			product_id: foundItem.product.offer_id,
// 			variant: {
// 				image: foundItem.product.image,
// 				active: true,
// 				sizes: updatedVariant,
// 			},
// 			quantity: updatedQuantity,
// 		};

// 		setLoadingKey(`${cartItem.id}-${size}`);
// 		try {
// 			await addToCard(payload);
// 			toast.success('Item removed from cart');
// 		} catch (err) {
// 			toast.error('Failed to remove item from cart');
// 		} finally {
// 			setLoadingKey(null);
// 		}
// 	};

// 	return (
// 		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="right">
// 			<DrawerContent className="h-full w-[400px] flex flex-col">
// 				{/* Header */}
// 				<div className="flex items-center justify-between border-b px-4 py-4">
// 					<DrawerTitle className="font-semibold flex items-center gap-2 font-serif text-lg text-foreground">
// 						<ShoppingCart className="w-6 h-6" />
// 						Shopping Cart
// 					</DrawerTitle>
// 					<Button variant="ghost" size="sm" onClick={closeDrawer} className="h-8 w-8 p-0 hover:bg-gray-100">
// 						<X className="h-4 w-4" />
// 					</Button>
// 				</div>

// 				{/* Body */}
// 				<div className="flex-1 overflow-y-auto pb-4 px-1">
// 					{isLoading ? (
// 						<div className="flex items-center justify-center h-full">
// 							<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
// 						</div>
// 					) : !data?.items?.length || activeRowCount === 0 ? (
// 						<div className="flex flex-col items-center justify-center h-full text-center p-6">
// 							<div className="relative h-[100px] aspect-square grayscale-[10%]">
// 								<Image src="/assets/product/cart/empty-cart.png" alt="Empty Cart" fill className="invert-[65%]" />
// 							</div>
// 							<p className="mt-4 text-gray-400 font-medium">No products in the cart.</p>
// 							<Button className="mt-8 bg-twinkle-accent hover:bg-twinkle-accent/80 text-white">RETURN TO SHOP</Button>
// 						</div>
// 					) : (
// 						<div className="space-y-0.5">
// 							<AnimatePresence>
// 								{data.items.map((cartItem) =>
// 									Object.entries(cartItem.quantity)
// 										.filter(([, qty]) => qty > 0)
// 										.map(([size, qty], index) => {
// 											const variant = getVariantBySize(cartItem.variant, size);
// 											const { currency, amount } = parsePrice(variant);
// 											console.log('variant===', variant);
// 											console.log('price===', { currency, amount });
// 											const rowKey = `${cartItem.id}-${size}`;
// 											const isUpdating = loadingKey === rowKey;

// 											return (
// 												<motion.div
// 													key={rowKey}
// 													layout
// 													initial={{ opacity: 0, x: 100 }}
// 													animate={{ opacity: 1, x: 0 }}
// 													exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
// 													transition={{ delay: index * 0.1, type: 'spring', stiffness: 600, damping: 50 }}
// 												>
// 													<Card className="overflow-hidden hover:bg-slate-50 transition-all duration-300 py-3 rounded border-none shadow-xs">
// 														<CardContent className="py-0 px-2">
// 															{isUpdating ? (
// 																<CartItemSkeleton />
// 															) : (
// 																<div className="flex gap-3">
// 																	{/* Image */}
// 																	<div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
// 																		<Image
// 																			src={cartItem.product.image}
// 																			alt={cartItem.product.product_name || cartItem.product.title}
// 																			fill
// 																			className="object-contain p-1"
// 																		/>
// 																	</div>

// 																	{/* Info */}
// 																	<div className="flex-1 min-w-0">
// 																		<div className="flex justify-between items-start mb-2">
// 																			<div className="mt-1">
// 																				<h3 className="font-semibold text-md">{cartItem.product.product_name || cartItem.product.title}</h3>
// 																				<p className="text-xs text-muted-foreground mt-1">{size}</p>
// 																			</div>
// 																			<Button
// 																				onClick={() => {
// 																					removeVariant(cartItem, size);
// 																				}}
// 																				variant="ghost"
// 																				size="sm"
// 																			>
// 																				<Trash2 className="w-4 h-4" />
// 																			</Button>
// 																		</div>

// 																		{/* Quantity + Price */}
// 																		<div className="flex justify-between mt-4">
// 																			<div className="flex border rounded-lg">
// 																				<Button
// 																					variant="ghost"
// 																					size="sm"
// 																					disabled={qty <= 1 || isUpdating}
// 																					onClick={() => quantityUpdate(cartItem, size, 'decrement')}
// 																					className="h-full"
// 																				>
// 																					{isUpdating ? <Loader2 className=" animate-spin" /> : <Minus className="w-3 h-full" />}
// 																				</Button>

// 																				<Input value={qty} readOnly className="w-12 text-center border-0" />

// 																				<Button
// 																					variant="ghost"
// 																					size="sm"
// 																					disabled={isUpdating}
// 																					onClick={() => quantityUpdate(cartItem, size, 'increment')}
// 																					className="h-full"
// 																				>
// 																					{isUpdating ? <Loader2 className=" animate-spin" /> : <Plus className="w-3 h-full" />}
// 																				</Button>
// 																			</div>

// 																			<div className="text-right">
// 																				<div className="font-medium text-sm">
// 																					{currency}
// 																					{(amount * qty).toFixed(2)}
// 																				</div>
// 																				{qty > 1 && (
// 																					<div className="text-xs text-muted-foreground">
// 																						{currency}
// 																						{amount.toFixed(2)} each
// 																					</div>
// 																				)}
// 																			</div>
// 																		</div>
// 																	</div>
// 																</div>
// 															)}
// 														</CardContent>
// 													</Card>
// 												</motion.div>
// 											);
// 										}),
// 								)}
// 							</AnimatePresence>
// 						</div>
// 					)}
// 				</div>

// 				{/* Footer */}
// 				{activeRowCount > 0 && (
// 					<div className="border-t px-6 py-3 space-y-4">
// 						<div className="flex justify-between font-hanken">
// 							<span className="text-lg font-medium">Subtotal:</span>
// 							<span className="text-lg font-medium">৳{(data?.total_price ?? 0).toLocaleString()}</span>
// 						</div>

// 						<div className="flex items-center justify-end gap-2">
// 							<Button variant="outline" asChild>
// 								<Link href="/cart">VIEW CART</Link>
// 							</Button>
// 							<Button asChild>
// 								<Link href="/checkout">
// 									Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
// 								</Link>
// 							</Button>
// 						</div>
// 					</div>
// 				)}
// 			</DrawerContent>
// 		</Drawer>
// 	);
// }

'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { CartItemSkeleton } from '../../loader/CartItemSkeleton';

/* =========================
   Types — mapped to new API
========================= */

type WeightInfo = {
	sku1: string;
	skuId: number;
	width: number;
	height: number;
	length: number;
	volume: number;
	weight: number;
};

type VariantSize = {
	price: string;
	stock: string;
	size_name: string;
};

type VariantDetail = {
	image: string;
	color_name: string;
	weightKg: number;
	weightInfo: WeightInfo;
	sizes: VariantSize[];
};

type VariantEntry = {
	variant: VariantDetail;
	quantity: Record<string, number>; // { Standard: 2 }
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

/* =========================
   Helpers
========================= */

// Total qty across all variants of a cart item
const getTotalQty = (variants: VariantEntry[]) =>
	variants.reduce((sum, v) => {
		return sum + Object.values(v.quantity).reduce((s, q) => s + q, 0);
	}, 0);

// Total price for a single variant entry
const getVariantTotal = (entry: VariantEntry): number => {
	return Object.entries(entry.quantity).reduce((sum, [sizeName, qty]) => {
		const size = entry.variant.sizes.find((s) => s.size_name === sizeName);
		return sum + qty * Number(size?.price || 0);
	}, 0);
};

// Grand subtotal across all cart items
const getGrandTotal = (items: CartItem[]): number =>
	items.reduce((sum, item) => {
		return sum + item.variants.reduce((s, v) => s + getVariantTotal(v), 0);
	}, 0);

/* =========================
   Sub-components
========================= */

type VariantRowProps = {
	cartItem: CartItem;
	variantEntry: VariantEntry;
	loadingKey: string | null;
	onQtyChange: (cartItem: CartItem, variantEntry: VariantEntry, sizeName: string, type: 'inc' | 'dec') => void;
	onRemove: (cartItem: CartItem, variantEntry: VariantEntry, sizeName: string) => void;
};

function VariantRow({ cartItem, variantEntry, loadingKey, onQtyChange, onRemove }: VariantRowProps) {
	const { variant, quantity } = variantEntry;

	return (
		<>
			{Object.entries(quantity)
				.filter(([, qty]) => qty > 0)
				.map(([sizeName, qty]) => {
					const size = variant.sizes.find((s) => s.size_name === sizeName);
					const price = Number(size?.price || 0);
					const rowKey = `${cartItem.id}-${variant.color_name}-${sizeName}`;
					const isUpdating = loadingKey === rowKey;

					return (
						<motion.div
							key={rowKey}
							layout
							initial={{ opacity: 0, x: 100 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
							transition={{ type: 'spring', stiffness: 600, damping: 50 }}
						>
							<Card className="overflow-hidden hover:bg-slate-50 transition-all duration-300 py-3 rounded border-none shadow-xs">
								<CardContent className="py-0 px-2">
									{isUpdating ? (
										<CartItemSkeleton />
									) : (
										<div className="flex gap-3">
											{/* Variant image */}
											<div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
												<Image src={variant.image || cartItem.product_image} alt={variant.color_name} fill className="object-contain p-1" />
											</div>

											{/* Info */}
											<div className="flex-1 min-w-0">
												<div className="flex justify-between items-start mb-1">
													<div className="mt-1 pr-2">
														<h3 className="font-semibold text-sm leading-snug line-clamp-2">{cartItem.product_name}</h3>
														{/* Color + size badge */}
														<div className="flex items-center gap-1.5 mt-1 flex-wrap">
															<span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{variant.color_name}</span>
															{sizeName !== 'Standard' && (
																<span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{sizeName}</span>
															)}
															<span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">
																{cartItem.shipping_method === 'air' ? '✈ Air' : '🚢 Sea'}
															</span>
														</div>
													</div>
													<Button
														onClick={() => onRemove(cartItem, variantEntry, sizeName)}
														variant="ghost"
														size="sm"
														className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
													>
														<Trash2 className="w-3.5 h-3.5" />
													</Button>
												</div>

												{/* Qty + Price */}
												<div className="flex justify-between items-center mt-3">
													<div className="flex border rounded-lg overflow-hidden">
														<Button
															variant="ghost"
															size="sm"
															disabled={qty <= 1 || isUpdating}
															onClick={() => onQtyChange(cartItem, variantEntry, sizeName, 'dec')}
															className="h-7 w-7 p-0 rounded-none"
														>
															<Minus className="w-3 h-3" />
														</Button>

														<Input value={qty} readOnly className="w-10 h-7 text-center border-0 border-x text-sm p-0 rounded-none" />

														<Button
															variant="ghost"
															size="sm"
															disabled={qty >= Number(size?.stock || 0) || isUpdating}
															onClick={() => onQtyChange(cartItem, variantEntry, sizeName, 'inc')}
															className="h-7 w-7 p-0 rounded-none"
														>
															<Plus className="w-3 h-3" />
														</Button>
													</div>

													<div className="text-right">
														<div className="font-semibold text-sm">৳{(price * qty).toFixed(2)}</div>
														{qty > 1 && <div className="text-xs text-muted-foreground">৳{price.toFixed(2)} each</div>}
													</div>
												</div>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
		</>
	);
}

/* =========================
   Main Component
========================= */

export default function CartDrawer() {
	const [loadingKey, setLoadingKey] = useState<string | null>(null);
	const { isDrawerOpen, closeDrawer } = useLayoutStore();

	const { data, isLoading } = useAppData<CartResponse, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.GET_CART(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
	});

	// const cartItems: CartItem[] = data?.data ?? [];

	const cartItems: CartItem[] = useMemo(() => {
		return Array.isArray(data?.data) ? data.data : [];
	}, [data]);

	const activeRowCount = useMemo(() => {
		if (!cartItems.length) return 0;

		return cartItems.reduce((total, item) => {
			if (!Array.isArray(item?.variants)) return total;

			return (
				total +
				item.variants.reduce((sum, v) => {
					if (!v?.quantity || typeof v.quantity !== 'object') return sum;
					return sum + Object.values(v.quantity).filter((q) => q > 0).length;
				}, 0)
			);
		}, 0);
	}, [cartItems]);

	const grandTotal = useMemo(() => getGrandTotal(cartItems), [cartItems]);

	// Auto-close when last item is removed
	const prevRowCount = useRef(activeRowCount);
	useEffect(() => {
		if (prevRowCount.current === 1 && activeRowCount === 0 && isDrawerOpen) {
			closeDrawer();
		}
		prevRowCount.current = activeRowCount;
	}, [activeRowCount, isDrawerOpen, closeDrawer]);

	/* =========================
     Mutations
  ========================= */

	const { create: updateCart } = useAppData<any, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.ADD_TO_CART(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to update cart'),
	});

	const handleQtyChange = async (cartItem: CartItem, variantEntry: VariantEntry, sizeName: string, type: 'inc' | 'dec') => {
		const currentQty = variantEntry.quantity[sizeName] ?? 0;
		const size = variantEntry.variant.sizes.find((s) => s.size_name === sizeName);
		const stock = Number(size?.stock || 0);
		const newQty = type === 'inc' ? Math.min(currentQty + 1, stock) : Math.max(currentQty - 1, 1);

		if (newQty === currentQty) return;

		const rowKey = `${cartItem.id}-${variantEntry.variant.color_name}-${sizeName}`;
		setLoadingKey(rowKey);

		const payload = {
			product_id: cartItem.product_id,
			product_name: cartItem.product_name,
			product_image: cartItem.product_image,
			shipping_method: cartItem.shipping_method,
			variants: cartItem.variants.map((v) => ({
				variant: v.variant,
				// update only the matching size in the matching variant
				quantity: v.variant.color_name === variantEntry.variant.color_name ? { ...v.quantity, [sizeName]: newQty } : v.quantity,
			})),
		};

		try {
			await updateCart(payload);
		} finally {
			setLoadingKey(null);
		}
	};

	const handleRemove = async (cartItem: CartItem, variantEntry: VariantEntry, sizeName: string) => {
		const rowKey = `${cartItem.id}-${variantEntry.variant.color_name}-${sizeName}`;
		setLoadingKey(rowKey);

		// set qty to 0 for this size; filter it out visually via activeRowCount
		const payload = {
			product_id: cartItem.product_id,
			product_name: cartItem.product_name,
			product_image: cartItem.product_image,
			shipping_method: cartItem.shipping_method,
			variants: cartItem.variants.map((v) => ({
				variant: v.variant,
				quantity: v.variant.color_name === variantEntry.variant.color_name ? { ...v.quantity, [sizeName]: 0 } : v.quantity,
			})),
		};

		try {
			await updateCart(payload);
			toast.success('Item removed from cart');
		} catch {
			toast.error('Failed to remove item');
		} finally {
			setLoadingKey(null);
		}
	};

	/* =========================
     Render
  ========================= */

	return (
		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="right">
			<DrawerContent className="h-full w-[400px] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between border-b px-4 py-4">
					<DrawerTitle className="font-semibold flex items-center gap-2 font-serif text-lg text-foreground">
						<ShoppingCart className="w-5 h-5" />
						Shopping Cart
						{activeRowCount > 0 && (
							<span className="ml-1 bg-orange-400 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
								{activeRowCount}
							</span>
						)}
					</DrawerTitle>
					<Button variant="ghost" size="sm" onClick={closeDrawer} className="h-8 w-8 p-0 hover:bg-gray-100">
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto pb-4 px-1">
					{isLoading ? (
						<div className="flex items-center justify-center h-full">
							<Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
						</div>
					) : activeRowCount === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center p-6">
							<div className="relative h-[100px] aspect-square">
								<Image src="/assets/product/cart/empty-cart.png" alt="Empty Cart" fill className="invert-[65%]" />
							</div>
							<p className="mt-4 text-gray-400 font-medium">No products in the cart.</p>
							<Button onClick={closeDrawer} className="mt-8 bg-orange-400 hover:bg-orange-500 text-white">
								RETURN TO SHOP
							</Button>
						</div>
					) : (
						<div className="space-y-0.5 pt-1">
							<AnimatePresence>
								{cartItems.map((cartItem) =>
									cartItem.variants.map((variantEntry, vIdx) => (
										<VariantRow
											key={`${cartItem.id}-${variantEntry.variant.color_name}-${vIdx}`}
											cartItem={cartItem}
											variantEntry={variantEntry}
											loadingKey={loadingKey}
											onQtyChange={handleQtyChange}
											onRemove={handleRemove}
										/>
									)),
								)}
							</AnimatePresence>
						</div>
					)}
				</div>

				{/* Footer */}
				{activeRowCount > 0 && (
					<div className="border-t px-6 py-3 space-y-4 bg-white">
						<div className="flex justify-between font-hanken">
							<span className="text-sm text-muted-foreground">
								{activeRowCount} item{activeRowCount > 1 ? 's' : ''}
							</span>
							<span className="text-lg font-semibold">৳{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
						</div>

						<div className="flex items-center justify-end gap-2">
							<Button variant="outline" asChild>
								<Link href="/cart">VIEW CART</Link>
							</Button>
							<Button asChild className="bg-orange-400 hover:bg-orange-500 text-white">
								<Link href="/checkout">
									Checkout <ArrowRight className="ml-2 w-4 h-4" />
								</Link>
							</Button>
						</div>
					</div>
				)}
			</DrawerContent>
		</Drawer>
	);
}
