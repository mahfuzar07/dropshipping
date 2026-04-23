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
import { APIResponse } from '@/types/types';

/* =========================
   Types
========================= */

type Variant = {
	price: string;
	stock: string;
	quantity: number;
	size_name: string;
};

type CartItemAPI = {
	id: number;
	product: {
		_id: string;
		moq: string | null;
		url: string;
		sold: string;
		image: string;
		is_ad: boolean;
		price: { unit: string; amount: string; currency: string; overseas: string };
		title: string;
		rating: string;
		offer_id: string;
		promotion: string | null;
		seller_icon: string | null;
		product_name: string;
	};
	quantity: Record<string, number>;
	variant: Variant[];
	total_price: number;
	added_at: string;
};

type CartResponse = {
	id: number;
	items: CartItemAPI[];
	total_price: number;
	created_at: string;
	updated_at: string;
};

type CartPayload = {
	product_id: string;

	variant: {
		image: string;
		active: boolean;
		sizes: {
			price: string;
			stock: string;
			quantity: number;
			size_name: string;
		}[];
	};

	quantity: Record<string, number>;
};

/* =========================
   Helpers
========================= */

const getVariantBySize = (variants: Variant[], size: string) => variants.find((v) => v.size_name === size);

const parsePrice = (priceStr: string): number => {
	const parsed = parseFloat(priceStr.replace(/[^\d.]/g, ''));
	return isNaN(parsed) ? 0 : parsed;
};

/* =========================
   Component
========================= */

export default function CartDrawer() {
	// loadingKey format: `${cartItemId}-${size}`
	const [loadingKey, setLoadingKey] = useState<string | null>(null);

	const { isDrawerOpen, closeDrawer } = useLayoutStore();

	const { data, isLoading } = useAppData<CartResponse, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.GET_CART(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
	});

	// Auto-close when last item is removed
	const activeRowCount = useMemo(() => {
		if (!data?.items) return 0;
		return data.items.reduce((total, item) => total + Object.values(item.quantity).filter((q) => q > 0).length, 0);
	}, [data]);

	const prevRowCount = useRef(activeRowCount);
	useEffect(() => {
		if (prevRowCount.current === 1 && activeRowCount === 0 && isDrawerOpen) closeDrawer();
		prevRowCount.current = activeRowCount;
	}, [activeRowCount, isDrawerOpen, closeDrawer]);

	/* =========================
     Quantity Update
  ========================= */

	const { create: addToCard, isMutating: isAddressLoading } = useAppData<CartPayload, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.ADD_TO_CART(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address added successfully!');
		},

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const quantityUpdate = async (cartItem: CartItemAPI, size: string, type: 'increment' | 'decrement') => {
		const foundItem = data?.items.find((i) => i.id === cartItem.id);
		if (!foundItem) return;

		const variant = getVariantBySize(foundItem.variant, size);
		if (!variant) return;

		const currentQty = foundItem.quantity[size] ?? 0;
		const newQty = type === 'increment' ? currentQty + 1 : Math.max(1, currentQty - 1);

		// Sync quantity into variant array
		const updatedVariant = foundItem.variant.map((v) => ({
			...v,
			quantity: v.size_name === size ? newQty : (foundItem.quantity[v.size_name] ?? v.quantity),
		}));

		const payload: CartPayload = {
			product_id: foundItem.product.offer_id,
			variant: {
				image: foundItem.product.image,
				active: true,
				sizes: updatedVariant,
			},
			quantity: {
				...foundItem.quantity,
				[size]: newQty,
			},
		};
		setLoadingKey(`${cartItem.id}-${size}`);
		try {
			await addToCard(payload);
		} finally {
			setLoadingKey(null);
		}
	};

	const removeVariant = async (cartItem: CartItemAPI, size: string) => {
		const foundItem = data?.items.find((i) => i.id === cartItem.id);
		if (!foundItem) return;

		// Remove this specific size from quantity (set to 0)
		const updatedQuantity = { ...foundItem.quantity, [size]: 0 };

		// Update variant array to reflect quantity 0 for this size
		const updatedVariant = foundItem.variant.map((v) => ({
			...v,
			quantity: v.size_name === size ? 0 : (foundItem.quantity[v.size_name] ?? v.quantity),
		}));

		const payload: CartPayload = {
			product_id: foundItem.product.offer_id,
			variant: {
				image: foundItem.product.image,
				active: true,
				sizes: updatedVariant,
			},
			quantity: updatedQuantity,
		};

		setLoadingKey(`${cartItem.id}-${size}`);
		try {
			await addToCard(payload);
			toast.success('Item removed from cart');
		} catch (err) {
			toast.error('Failed to remove item from cart');
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
						<ShoppingCart className="w-6 h-6" />
						Shopping Cart
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
					) : !data?.items?.length || activeRowCount === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center p-6">
							<div className="relative h-[100px] aspect-square grayscale-[10%]">
								<Image src="/assets/product/cart/empty-cart.png" alt="Empty Cart" fill className="invert-[65%]" />
							</div>
							<p className="mt-4 text-gray-400 font-medium">No products in the cart.</p>
							<Button className="mt-8 bg-twinkle-accent hover:bg-twinkle-accent/80 text-white">RETURN TO SHOP</Button>
						</div>
					) : (
						<div className="space-y-0.5">
							<AnimatePresence>
								{data.items.map((cartItem) =>
									Object.entries(cartItem.quantity)
										.filter(([, qty]) => qty > 0)
										.map(([size, qty], index) => {
											const variant = getVariantBySize(cartItem.variant, size);
											const price = variant ? parsePrice(variant.price) : 0;
											const rowKey = `${cartItem.id}-${size}`;
											const isUpdating = loadingKey === rowKey;

											return (
												<motion.div
													key={rowKey}
													layout
													initial={{ opacity: 0, x: 100 }}
													animate={{ opacity: 1, x: 0 }}
													exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
													transition={{ delay: index * 0.1, type: 'spring', stiffness: 600, damping: 50 }}
												>
													<Card className="overflow-hidden hover:bg-slate-50 transition-all duration-300 py-3 rounded border-none shadow-xs">
														<CardContent className="py-0 px-2">
															<div className="flex gap-3">
																{/* Image */}
																<div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
																	<Image
																		src={cartItem.product.image}
																		alt={cartItem.product.product_name || cartItem.product.title}
																		fill
																		className="object-contain p-1"
																	/>
																</div>

																{/* Info */}
																<div className="flex-1 min-w-0">
																	<div className="flex justify-between items-start mb-2">
																		<div className="mt-1">
																			<h3 className="font-semibold text-md">{cartItem.product.product_name || cartItem.product.title}</h3>
																			<p className="text-xs text-muted-foreground mt-1">{size}</p>
																		</div>
																		<Button
																			onClick={() => {
																				removeVariant(cartItem, size);
																			}}
																			variant="ghost"
																			size="sm"
																		>
																			<Trash2 className="w-4 h-4" />
																		</Button>
																	</div>

																	{/* Quantity + Price */}
																	<div className="flex justify-between mt-4">
																		<div className="flex border rounded-lg">
																			<Button
																				variant="ghost"
																				size="sm"
																				disabled={qty <= 1 || isUpdating}
																				onClick={() => quantityUpdate(cartItem, size, 'decrement')}
																			>
																				{isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Minus className="w-3 h-3" />}
																			</Button>

																			<Input value={qty} readOnly className="w-12 text-center border-0" />

																			<Button
																				variant="ghost"
																				size="sm"
																				disabled={isUpdating}
																				onClick={() => quantityUpdate(cartItem, size, 'increment')}
																			>
																				{isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
																			</Button>
																		</div>

																		<div className="text-right">
																			<div className="font-medium text-sm">${(price * qty).toFixed(2)}</div>
																			{qty > 1 && <div className="text-xs text-muted-foreground">${price.toFixed(2)} each</div>}
																		</div>
																	</div>
																</div>
															</div>
														</CardContent>
													</Card>
												</motion.div>
											);
										}),
								)}
							</AnimatePresence>
						</div>
					)}
				</div>

				{/* Footer */}
				{activeRowCount > 0 && (
					<div className="border-t px-6 py-3 space-y-4">
						<div className="flex justify-between">
							<span className="text-lg font-medium">Subtotal:</span>
							<span className="text-lg font-medium">৳{(data?.total_price ?? 0).toLocaleString()}</span>
						</div>
						<Button variant="outline" asChild>
							<Link href="/cart">VIEW CART</Link>
						</Button>
						<Button asChild>
							<Link href="/checkout">
								Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
							</Link>
						</Button>
					</div>
				)}
			</DrawerContent>
		</Drawer>
	);
}
