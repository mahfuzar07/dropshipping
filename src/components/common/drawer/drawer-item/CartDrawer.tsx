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
   Types — aligned to the SKU-based payload sent by CartSection
   { skuId, label, price, selections, quantity }
========================= */

type VariantEntry = {
	skuId: number;
	label: string;
	price: number;
	selections: Record<string, string>; // groupId -> optionId, for reference/debugging
	quantity: number; // flat qty for this SKU
	image?: string; // optional, if backend/product provides a per-variant image
	stock?: number; // optional, used to cap the "+" button if backend returns it
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
const getTotalQty = (variants: VariantEntry[]) => variants.reduce((sum, v) => sum + (v.quantity || 0), 0);

// Total price for a single variant entry
const getVariantTotal = (entry: VariantEntry): number => (entry.price || 0) * (entry.quantity || 0);

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
	onQtyChange: (cartItem: CartItem, variantEntry: VariantEntry, type: 'inc' | 'dec') => void;
	onRemove: (cartItem: CartItem, variantEntry: VariantEntry) => void;
};

function VariantRow({ cartItem, variantEntry, loadingKey, onQtyChange, onRemove }: VariantRowProps) {
	const { skuId, label, price, quantity, image, stock } = variantEntry;

	if (!quantity || quantity <= 0) return null;

	const rowKey = `${cartItem.id}-${skuId}`;
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
								<Image src={image || cartItem.product_image} alt={label} fill className="object-contain p-1" />
							</div>

							{/* Info */}
							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-start mb-1">
									<div className="mt-1 pr-2">
										<h3 className="font-semibold text-sm leading-snug line-clamp-2">{cartItem.product_name}</h3>
										{/* Variant label badge */}
										<div className="flex items-center gap-1.5 mt-1 flex-wrap">
											{label && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{label}</span>}
											<span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">
												{cartItem.shipping_method === 'air' ? '✈ Air' : '🚢 Sea'}
											</span>
										</div>
									</div>
									<Button
										onClick={() => onRemove(cartItem, variantEntry)}
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
											disabled={quantity <= 1 || isUpdating}
											onClick={() => onQtyChange(cartItem, variantEntry, 'dec')}
											className="h-7 w-7 p-0 rounded-none"
										>
											<Minus className="w-3 h-3" />
										</Button>

										<Input value={quantity} readOnly className="w-10 h-7 text-center border-0 border-x text-sm p-0 rounded-none" />

										<Button
											variant="ghost"
											size="sm"
											disabled={(stock !== undefined && quantity >= stock) || isUpdating}
											onClick={() => onQtyChange(cartItem, variantEntry, 'inc')}
											className="h-7 w-7 p-0 rounded-none"
										>
											<Plus className="w-3 h-3" />
										</Button>
									</div>

									<div className="text-right">
										<div className="font-semibold text-sm">৳{(price * quantity).toFixed(2)}</div>
										{quantity > 1 && <div className="text-xs text-muted-foreground">৳{price.toFixed(2)} each</div>}
									</div>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</motion.div>
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

	const cartItems: CartItem[] = useMemo(() => {
		return Array.isArray(data?.data) ? data.data : [];
	}, [data]);

	const activeRowCount = useMemo(() => {
		if (!cartItems.length) return 0;

		return cartItems.reduce((total, item) => {
			if (!Array.isArray(item?.variants)) return total;
			return total + item.variants.filter((v) => v?.quantity > 0).length;
		}, 0);
	}, [cartItems]);

	const subtotal = useMemo(() => getGrandTotal(cartItems), [cartItems]);

	const shippingTotal = useMemo(() => {
		const SHIPPING_RATES = { air: 780, sea: 170 };
		return cartItems.reduce((sum, item) => {
			const rate = SHIPPING_RATES[item.shipping_method || 'air'];
			return sum + (item.variants || []).reduce((s, v: any) => {
				const qty = Number(v.quantity || 0);
				const weight = Number(v.weight || 0.5);
				return s + qty * weight * rate;
			}, 0);
		}, 0);
	}, [cartItems]);

	const grandTotal = subtotal + shippingTotal;

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

	const buildUpdatedPayload = (cartItem: CartItem, skuId: number, newQty: number) => ({
		product_id: cartItem.product_id,
		product_name: cartItem.product_name,
		product_image: cartItem.product_image,
		shipping_method: cartItem.shipping_method,
		variants: cartItem.variants.map((v) => (v.skuId === skuId ? { ...v, quantity: newQty } : v)),
	});

	const handleQtyChange = async (cartItem: CartItem, variantEntry: VariantEntry, type: 'inc' | 'dec') => {
		const currentQty = variantEntry.quantity ?? 0;
		const stock = variantEntry.stock;
		const newQty = type === 'inc' ? (stock !== undefined ? Math.min(currentQty + 1, stock) : currentQty + 1) : Math.max(currentQty - 1, 1);

		if (newQty === currentQty) return;

		const rowKey = `${cartItem.id}-${variantEntry.skuId}`;
		setLoadingKey(rowKey);

		const payload = buildUpdatedPayload(cartItem, variantEntry.skuId, newQty);

		try {
			await updateCart({ payload });
		} finally {
			setLoadingKey(null);
		}
	};

	const handleRemove = async (cartItem: CartItem, variantEntry: VariantEntry) => {
		const rowKey = `${cartItem.id}-${variantEntry.skuId}`;
		setLoadingKey(rowKey);

		const payload = buildUpdatedPayload(cartItem, variantEntry.skuId, 0);

		try {
			await updateCart({ payload });
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
									(cartItem.variants || []).map((variantEntry) => (
										<VariantRow
											key={`${cartItem.id}-${variantEntry.skuId}`}
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
					<div className="border-t px-6 py-3 space-y-3 bg-white font-hanken text-xs">
						<div className="flex justify-between text-muted-foreground">
							<span>Subtotal ({activeRowCount} item{activeRowCount > 1 ? 's' : ''})</span>
							<span>৳{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
						</div>
						<div className="flex justify-between text-muted-foreground">
							<span>Shipping Charge</span>
							<span>৳{shippingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
						</div>
						<div className="flex justify-between font-bold text-sm border-t pt-2">
							<span>Grand Total</span>
							<span className="text-primary">৳{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
