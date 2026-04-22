// 'use client';

// import { useEffect, useRef } from 'react';
// import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
// import { Button } from '@/components/ui/button';
// import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useLayoutStore } from '@/z-store/global/useLayoutStore';
// import { useCartStore } from '@/z-store/customers/useCartStore';
// import { QueriesKey } from '@/lib/constants/queriesKey';
// import { apiEndpoint } from '@/lib/constants/apiEndpoint';
// import { useAppData } from '@/hooks/use-appdata';
// import { APIResponse } from '@/types/types';
// import { toast } from 'sonner';

// export default function CartDrawer() {
// 	const { isDrawerOpen, closeDrawer } = useLayoutStore();
// 	const { items, removeFromCart, incrementQuantity, decrementQuantity, updateCartQuantity } = useCartStore();

// 	const handleClose = () => {
// 		closeDrawer();
// 	};
// 	const prevItemsLength = useRef(items.length);

// 	useEffect(() => {
// 		if (prevItemsLength.current === 1 && items.length === 0 && isDrawerOpen) {
// 			closeDrawer();
// 		}
// 		prevItemsLength.current = items.length;
// 	}, [items, isDrawerOpen, closeDrawer]);

// 	const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

// 	const { data: cartResponseData, isLoading: isLoadingAddress } = useAppData<APIResponse, 'single'>({
// 		key: [QueriesKey.CART_DATA],
// 		api: apiEndpoint.cart.GET_CART(),
// 		auth: true,
// 		responseType: 'single',

// 		onError: (error: any) => {
// 			toast.error(error?.response?.data?.message || 'Failed to add address');
// 		},
// 	});

// 	// const cardData = cartResponseData;
// 	const cardData = {
// 		id: 4,
// 		items: [
// 			{
// 				id: 16,
// 				product: {
// 					_id: '69e5c4fe5f19a0e87387a6b1',
// 					moq: null,
// 					url: 'https://detail.1688.com/offer/1024928854702.html',
// 					sold: '200+ sold',
// 					image: 'http://192.168.68.118:8001/assets/images/product_images/O1CN016Ug7VZ1kqgUp8nYHo_!!4216024735-0-cib.jpg_460x460q100.jpg_.webp',
// 					is_ad: false,
// 					price: {
// 						unit: '.00',
// 						amount: '75',
// 						currency: '¥',
// 						overseas: '$11.26',
// 					},
// 					title: 'THE MIND复古字母手绘印花T恤2026春季宽松休闲短袖上衣女T6087C',
// 					rating: '5',
// 					offer_id: '1024928854702',
// 					promotion: '元宝可抵1%',
// 					seller_icon: null,
// 					product_name: "Women's T-shirt",
// 				},
// 				quantity: {
// 					均码: 1,
// 				},
// 				variant: [
// 					{
// 						price: '¥71.25',
// 						stock: '',
// 						quantity: 1,
// 						size_name: '均码',
// 					},
// 				],
// 				total_price: 71.25,
// 				added_at: '2026-04-22T05:51:26.987877Z',
// 			},
// 			{
// 				id: 15,
// 				product: {
// 					_id: '69e5c4fc5f19a0e87387a6aa',
// 					moq: 'MOQ 1',
// 					url: 'https://detail.1688.com/offer/681169854358.html',
// 					sold: '400+ sold',
// 					image: 'http://192.168.68.118:8001/assets/images/product_images/O1CN01Ft0yig2CJzNcgQTzr_!!1109108454-0-cib.jpg_460x460q100.jpg_.webp',
// 					is_ad: false,
// 					price: {
// 						unit: '.00',
// 						amount: '47',
// 						currency: '¥',
// 						overseas: '$7.06',
// 					},
// 					title:
// 						'Silk-Gloss Cotton Hooded Sweatshirt T-Shirt for Women 2026 Spring New Style Pure Cotton Versatile Light Luxury Thin Fashion Base Shirt',
// 					rating: '5',
// 					offer_id: '681169854358',
// 					promotion: null,
// 					seller_icon: null,
// 					product_name: "Women's T-shirt",
// 				},
// 				quantity: {
// 					L: 0,
// 					M: 1,
// 					S: 1,
// 				},
// 				variant: [
// 					{
// 						price: '¥47',
// 						stock: '',
// 						quantity: 1,
// 						size_name: 'S',
// 					},
// 					{
// 						price: '¥47',
// 						stock: '',
// 						quantity: 1,
// 						size_name: 'M',
// 					},
// 				],
// 				total_price: 94,
// 				added_at: '2026-04-21T10:43:22.161026Z',
// 			},
// 		],
// 		total_price: 165.25,
// 		created_at: '2026-04-21T08:38:02.797683Z',
// 		updated_at: '2026-04-21T08:38:02.804991Z',
// 	};
// 	console.log('Cart Data:', cardData);

// 	return (
// 		<Drawer open={isDrawerOpen} onOpenChange={handleClose} direction="right">
// 			<DrawerContent className="h-full w-[400px] flex flex-col">
// 				{/* Header */}
// 				<div className="flex items-center justify-between border-b px-4 py-4">
// 					<DrawerTitle className="font-semibold flex items-center gap-2 font-serif text-lg text-foreground">
// 						<ShoppingCart className="w-6 h-6" />
// 						Shopping Cart
// 					</DrawerTitle>
// 					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
// 						<X className="h-4 w-4" />
// 					</Button>
// 				</div>

// 				{/* Cart Items */}
// 				<div className="flex-1 overflow-y-auto pb-4 px-1">
// 					{items.length === 0 ? (
// 						<div className="flex flex-col items-center justify-center h-full text-center p-6">
// 							<div className="grayscale-[10%] relative h-[100px] aspect-square">
// 								<Image src="/assets/product/cart/empty-cart.png" alt="Empty Cart" fill className="invert-[65%]" />
// 							</div>

// 							<p className="mt-4 text-gray-400 font-medium">No products in the cart.</p>
// 							<Button className="mt-8 bg-twinkle-accent hover:bg-twinkle-accent/80 text-white">RETURN TO SHOP</Button>
// 						</div>
// 					) : (
// 						<div className="space-y-0.5 overflow-hidden">
// 							<AnimatePresence>
// 								{items.map((item, index) => (
// 									<motion.div
// 										key={item.id}
// 										layout
// 										initial={{ opacity: 0, x: 100 }}
// 										animate={{ opacity: 1, x: 0 }}
// 										exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
// 										transition={{ delay: index * 0.1, type: 'spring', stiffness: 600, damping: 50 }}
// 									>
// 										<Card className="overflow-hidden hover:bg-slate-50 transition-all duration-300 py-3 rounded border-none shadow-xs">
// 											<CardContent className="py-0 px-2">
// 												<div className="flex gap-3">
// 													{/* Product Image */}
// 													<div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
// 														<Image
// 															src={item.image || `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(item.name)}`}
// 															alt={item.name}
// 															fill
// 															className="object-contain p-1 transition-transform duration-300 hover:scale-105"
// 														/>
// 													</div>

// 													{/* Product Details */}
// 													<div className="flex-1 min-w-0">
// 														<div className="flex justify-between items-start mb-2">
// 															<div className="mt-1">
// 																<h3 className="font-semibold text-md text-foreground leading-tight">{item.name}</h3>
// 																<p className="text-muted-foreground text-xs mt-1 line-clamp-2">{item.description}</p>
// 															</div>
// 															<Button
// 																variant="ghost"
// 																size="sm"
// 																className="text-muted-foreground hover:text-destructive transition-colors"
// 																onClick={() => removeFromCart(item.id)}
// 															>
// 																<Trash2 className="w-4 h-4" />
// 															</Button>
// 														</div>

// 														{/* Price and Quantity Controls */}
// 														<div className="flex items-center justify-between mt-4">
// 															<div className="flex items-center gap-3">
// 																{/* Quantity Controls */}
// 																<div className="flex items-center border border-border rounded-lg">
// 																	<Button
// 																		variant="ghost"
// 																		size="sm"
// 																		className="h-6 w-6 p-0 hover:bg-secondary"
// 																		onClick={() => decrementQuantity(item.id)}
// 																		disabled={item.quantity <= 1}
// 																	>
// 																		<Minus className="w-3 h-3" />
// 																	</Button>
// 																	<Input
// 																		type="number"
// 																		value={item.quantity}
// 																		onChange={(e) => {
// 																			const value = parseInt(e.target.value, 10);
// 																			if (!isNaN(value) && value > 0) {
// 																				updateCartQuantity(item.id, value);
// 																			}
// 																		}}
// 																		className="w-16 h-6 text-center border-0 bg-transparent focus:ring-0 text-sm font-medium no-spinner"
// 																		min="1"
// 																	/>
// 																	<Button
// 																		variant="ghost"
// 																		size="sm"
// 																		className="h-6 w-6 p-0 hover:bg-secondary"
// 																		onClick={() => incrementQuantity(item.id)}
// 																	>
// 																		<Plus className="w-3 h-3" />
// 																	</Button>
// 																</div>
// 															</div>

// 															{/* Price */}
// 															<div className="text-right">
// 																<div className="font-medium text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</div>
// 																{item.quantity > 1 && <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</div>}
// 															</div>
// 														</div>
// 													</div>
// 												</div>
// 											</CardContent>
// 										</Card>
// 									</motion.div>
// 								))}
// 							</AnimatePresence>
// 						</div>
// 					)}
// 				</div>

// 				{/* Footer */}
// 				{items.length > 0 && (
// 					<div className="border-t px-6 py-3 space-y-4">
// 						<div className="flex justify-between items-center">
// 							<span className="text-foreground text-lg font-medium">Subtotal:</span>
// 							<span className="text-lg font-medium">৳{subtotal.toLocaleString()}.00</span>
// 						</div>

// 						<div className="space-y-3">
// 							<Button variant="outline" className="w-full bg-transparent" onClick={handleClose} asChild>
// 								<Link href="/cart">VIEW CART</Link>
// 							</Button>

// 							<Button
// 								asChild
// 								onClick={handleClose}
// 								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-sm group"
// 							>
// 								<Link href="/checkout">
// 									Proceed to Checkout
// 									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
// 								</Link>
// 							</Button>
// 						</div>
// 					</div>
// 				)}
// 			</DrawerContent>
// 		</Drawer>
// 	);
// }

// 'use client';

// import { useEffect, useRef, useMemo, useState } from 'react';
// import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
// import { Button } from '@/components/ui/button';
// import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
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
// import { addToCard } from '@/lib/api/cart';

// /* =========================
//    Types
// ========================= */

// type Variant = {
// 	price: string;
// 	stock: string;
// 	quantity: number;
// 	size_name: string;
// };

// type ProductPrice = {
// 	unit: string;
// 	amount: string;
// 	currency: string;
// 	overseas: string;
// };

// type Product = {
// 	_id: string;
// 	moq: string | null;
// 	url: string;
// 	sold: string;
// 	image: string;
// 	is_ad: boolean;
// 	price: ProductPrice;
// 	title: string;
// 	rating: string;
// 	offer_id: string;
// 	promotion: string | null;
// 	seller_icon: string | null;
// 	product_name: string;
// };

// type CartItemAPI = {
// 	id: number;
// 	product: Product;
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

// /* =========================
//    Helper: get variant by size
// ========================= */

// const getVariantBySize = (variants: Variant[], size: string): Variant | undefined => variants.find((v) => v.size_name === size);

// /* =========================
//    Helper: parse price string "¥71.25" → 71.25
// ========================= */

// const parsePrice = (priceStr: string): number => {
// 	const parsed = parseFloat(priceStr.replace(/[^\d.]/g, ''));
// 	return isNaN(parsed) ? 0 : parsed;
// };

// /* =========================
//    Component
// ========================= */

// export default function CartDrawer() {
// 	const [isSubmitting, setIsSubmitting] = useState(false);
// 	const { isDrawerOpen, closeDrawer } = useLayoutStore();
// 	const handleClose = () => closeDrawer();

// 	/* =========================
//      API Call
//   ========================= */

// 	const { data, isLoading } = useAppData<CartResponse, 'single'>({
// 		key: [QueriesKey.CART_DATA],
// 		api: apiEndpoint.cart.GET_CART(),
// 		auth: true,
// 		responseType: 'single',
// 		onError: (error: any) => {
// 			toast.error(error?.response?.data?.message || 'Failed to load cart');
// 		},
// 	});

// 	/* =========================
//      Flat row count for auto-close
//      (count only size entries with qty > 0)
//   ========================= */

// 	const activeRowCount = useMemo(() => {
// 		if (!data?.items) return 0;
// 		return data.items.reduce((total, item) => {
// 			return total + Object.values(item.quantity).filter((q) => q > 0).length;
// 		}, 0);
// 	}, [data]);

// 	const prevRowCount = useRef(activeRowCount);

// 	useEffect(() => {
// 		if (prevRowCount.current === 1 && activeRowCount === 0 && isDrawerOpen) {
// 			closeDrawer();
// 		}
// 		prevRowCount.current = activeRowCount;
// 	}, [activeRowCount, isDrawerOpen, closeDrawer]);

// 	/* =========================
//      Subtotal from total_price
//   ========================= */

// 	const subtotal = data?.total_price ?? 0;

// 	/* =========================
//      Increment
//   ========================= */

// 	const quantityUpdate = async (cartItem: CartItemAPI, size: string, type: string) => {
// 		// 1. Find the cart item
// 		const foundItem = data?.items.find((i) => i.id === cartItem.id);
// 		console.log('foundItem', foundItem);
// 		if (!foundItem) {
// 			console.error('[UPDATE] Cart item not found:', cartItem.id);
// 			return;
// 		}

// 		// 2. Find the variant for this size
// 		const variant = getVariantBySize(foundItem.variant, size);
// 		if (!variant) {
// 			console.error('[UPDATE] Variant not found for size:', size);
// 			return;
// 		}

// 		// 3. Get current quantity and compute new
// 		const currentQty = foundItem.quantity[size] ?? 0;
// 		const newQty = type === 'increment' ? currentQty + 1 : Math.max(0, currentQty - 1);

// 		foundItem.quantity = {
// 			...foundItem.quantity,
// 			[size]: newQty,
// 		};

// 		const updatedVariant = foundItem.variant.map((v) => ({
// 			...v,
// 			quantity: foundItem.quantity[v.size_name] ?? v.quantity,
// 		}));

// 		foundItem.variant = updatedVariant;

// 		console.log('foundItem', foundItem);

// 		const form = { product_id: foundItem?.product?.offer_id, variant: foundItem.variant, quantity: foundItem.quantity || {} };
// 		console.log('cart click', form);
// 		setIsSubmitting(true);

// 		// 4. Build payload
// 		const payload = {
// 			product_id: foundItem.product.offer_id,
// 			variant: {
// 				image: foundItem.product.image,
// 				active: true,
// 				sizes: foundItem.variant,
// 			},
// 			quantity: foundItem.quantity,
// 		};

// 		try {
// 			await addToCard(payload);
// 			toast.success('Product added to cart successfully!');
// 		} catch (err) {
// 			toast.error('Failed to add product to cart.');
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};

// 	/* =========================
//      Decrement
//   ========================= */

// 	/* =========================
//      Render
//   ========================= */

// 	return (
// 		<Drawer open={isDrawerOpen} onOpenChange={handleClose} direction="right">
// 			<DrawerContent className="h-full w-[400px] flex flex-col">
// 				{/* Header */}
// 				<div className="flex items-center justify-between border-b px-4 py-4">
// 					<DrawerTitle className="font-semibold flex items-center gap-2 font-serif text-lg text-foreground">
// 						<ShoppingCart className="w-6 h-6" />
// 						Shopping Cart
// 					</DrawerTitle>
// 					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
// 						<X className="h-4 w-4" />
// 					</Button>
// 				</div>

// 				{/* Cart Items */}
// 				<div className="flex-1 overflow-y-auto pb-4 px-1">
// 					{!data?.items?.length || activeRowCount === 0 ? (
// 						<div className="flex flex-col items-center justify-center h-full text-center p-6">
// 							<div className="grayscale-[10%] relative h-[100px] aspect-square">
// 								<Image src="/assets/product/cart/empty-cart.png" alt="Empty Cart" fill className="invert-[65%]" />
// 							</div>
// 							<p className="mt-4 text-gray-400 font-medium">No products in the cart.</p>
// 							<Button className="mt-8 bg-twinkle-accent hover:bg-twinkle-accent/80 text-white">RETURN TO SHOP</Button>
// 						</div>
// 					) : (
// 						<div className="space-y-0.5 overflow-hidden">
// 							<AnimatePresence>
// 								{data.items.map((cartItem) =>
// 									// Iterate over quantity entries that are > 0
// 									Object.entries(cartItem.quantity)
// 										.filter(([, qty]) => qty > 0)
// 										.map(([size, qty], index) => {
// 											const variant = getVariantBySize(cartItem.variant, size);
// 											const price = variant ? parsePrice(variant.price) : 0;
// 											const rowKey = `${cartItem.id}-${size}`;

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
// 															<div className="flex gap-3">
// 																{/* Image */}
// 																<div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
// 																	<Image
// 																		src={cartItem.product.image}
// 																		alt={cartItem.product.product_name || cartItem.product.title}
// 																		fill
// 																		className="object-contain p-1"
// 																	/>
// 																</div>

// 																{/* Info */}
// 																<div className="flex-1 min-w-0">
// 																	<div className="flex justify-between items-start mb-2">
// 																		<div className="mt-1">
// 																			<h3 className="font-semibold text-md">{cartItem.product.product_name || cartItem.product.title}</h3>
// 																			<p className="text-xs text-muted-foreground mt-1">{size}</p>
// 																		</div>
// 																		<Button variant="ghost" size="sm">
// 																			<Trash2 className="w-4 h-4" />
// 																		</Button>
// 																	</div>

// 																	{/* Quantity + Price */}
// 																	<div className="flex justify-between mt-4">
// 																		<div className="flex border rounded-lg">
// 																			<Button
// 																				onClick={() => quantityUpdate(cartItem, size, 'decrement')}
// 																				disabled={qty <= 1}
// 																				variant="ghost"
// 																				size="sm"
// 																			>
// 																				<Minus className="w-3 h-3" />
// 																			</Button>

// 																			<Input value={qty} readOnly className="w-12 text-center border-0" />

// 																			<Button onClick={() => quantityUpdate(cartItem, size, 'increment')} variant="ghost" size="sm">
// 																				<Plus className="w-3 h-3" />
// 																			</Button>
// 																		</div>

// 																		{/* Price */}
// 																		<div className="text-right">
// 																			<div className="font-medium text-sm">${(price * qty).toFixed(2)}</div>
// 																			{qty > 1 && <div className="text-xs text-muted-foreground">${price.toFixed(2)} each</div>}
// 																		</div>
// 																	</div>
// 																</div>
// 															</div>
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
// 						<div className="flex justify-between">
// 							<span className="text-lg font-medium">Subtotal:</span>
// 							<span className="text-lg font-medium">৳{subtotal.toLocaleString()}</span>
// 						</div>

// 						<Button variant="outline" asChild>
// 							<Link href="/cart">VIEW CART</Link>
// 						</Button>

// 						<Button asChild>
// 							<Link href="/checkout">
// 								Proceed to Checkout
// 								<ArrowRight className="ml-2 w-4 h-4" />
// 							</Link>
// 						</Button>
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

	const { create: addToCard, isMutating: isAddressLoading } = useAppData<APIResponse, 'single'>({
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

		const payload = {
			product_id: foundItem.product.offer_id,
			variant: {
				image: foundItem.product.image,
				active: true,
				sizes: updatedVariant,
			},
			quantity: { ...foundItem.quantity, [size]: newQty },
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

		const payload = {
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
