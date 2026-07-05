'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { CartItemComponent } from './CartItemComponent';
import OrderSummary from '../checkout/OrderSummary';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { authApi } from '@/lib/axiosInstance';

type Variant = {
	price: string;
	stock: string;
	quantity: number;
	size_name: string;
};

type Product = {
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

type CartItemAPI = {
	id: number;
	product: Product;
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

export default function CartPageContent() {
	const [isUpdating, setIsUpdating] = useState(false);

	// Fetch cart data using the custom hook
	const { data, isLoading, update: updateCart, remove: removeCart } = useAppData<CartResponse, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.GET_CART(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
	});

	const rawItems = useMemo(() => (Array.isArray((data as any)?.data) ? (data as any).data : []), [data]);

	const items = useMemo(() => {
		const mappedItems: any[] = [];
		rawItems.forEach((rawItem: any) => {
			const variants = Array.isArray(rawItem.variants) ? rawItem.variants : [];
			variants.forEach((vEntry: any) => {
				const colorName = vEntry.variant?.color_name;
				const image = vEntry.variant?.image || rawItem.product_image;
				const sizes = Array.isArray(vEntry.variant?.sizes) ? vEntry.variant.sizes : [];
				const quantities = vEntry.quantity || {};

				Object.entries(quantities).forEach(([sizeName, qty]) => {
					const qtyNum = Number(qty);
					if (qtyNum <= 0) return;

					const sizeDetail = sizes.find((s: any) => s.size_name === sizeName);
					const sizePrice = Number(sizeDetail?.price || 0);

					mappedItems.push({
						uniqueKey: `${rawItem.id}-${colorName}-${sizeName}`,
						id: rawItem.id,
						product_id: rawItem.product_id,
						color_name: colorName,
						size_name: sizeName,
						product: {
							_id: rawItem.product_id,
							product_name: rawItem.product_name,
							image: image,
							title: `${rawItem.product_name} (${colorName} - ${sizeName})`,
							price: {
								unit: 'pcs',
								amount: String(sizePrice),
								currency: '৳',
								overseas: '',
							},
							rating: '',
							sold: '',
							offer_id: rawItem.product_id,
							moq: null,
							url: '',
							is_ad: false,
							promotion: null,
							seller_icon: null,
						},
						quantity: {
							[sizeName]: qtyNum,
						},
						variant: [
							{
								price: String(sizePrice),
								stock: String(sizeDetail?.stock || 0),
								quantity: qtyNum,
								size_name: sizeName,
							}
						],
						total_price: sizePrice * qtyNum,
						added_at: rawItem.created_at,
						rawItem,
					});
				});
			});
		});
		return mappedItems;
	}, [rawItems]);

	const handleRemoveItem = async (uniqueKey: string) => {
		const itemToRemove = items.find((item) => item.uniqueKey === uniqueKey);
		if (!itemToRemove) return;

		setIsUpdating(true);
		try {
			const { rawItem, color_name, size_name } = itemToRemove;
			
			const updatedVariants = rawItem.variants.map((vEntry: any) => {
				if (vEntry.variant?.color_name === color_name) {
					const updatedQuantity = { ...vEntry.quantity };
					delete updatedQuantity[size_name];
					return {
						...vEntry,
						quantity: updatedQuantity,
					};
				}
				return vEntry;
			}).filter((vEntry: any) => {
				return Object.values(vEntry.quantity).some((qty: any) => Number(qty) > 0);
			});

			if (updatedVariants.length === 0) {
				await removeCart({ id: rawItem.id });
			} else {
				await updateCart({
					id: rawItem.id,
					payload: { variants: updatedVariants } as any
				});
			}

			toast.success('Item removed from cart');
		} catch (error) {
			console.error('Remove item error:', error);
			toast.error('Failed to remove item');
		} finally {
			setIsUpdating(false);
		}
	};

	const handleUpdateQuantity = async (uniqueKey: string, newQuantity: number) => {
		const itemToUpdate = items.find((item) => item.uniqueKey === uniqueKey);
		if (!itemToUpdate) return;

		setIsUpdating(true);
		try {
			const { rawItem, color_name, size_name } = itemToUpdate;
			
			const updatedVariants = rawItem.variants.map((vEntry: any) => {
				if (vEntry.variant?.color_name === color_name) {
					return {
						...vEntry,
						quantity: {
							...vEntry.quantity,
							[size_name]: newQuantity,
						},
					};
				}
				return vEntry;
			});

			await updateCart({
				id: rawItem.id,
				payload: { variants: updatedVariants } as any
			});

			toast.success('Quantity updated');
		} catch (error) {
			console.error('Update quantity error:', error);
			toast.error('Failed to update quantity');
		} finally {
			setIsUpdating(false);
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
				<div className="text-center">
					<Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
					<p className="text-muted-foreground">Loading your cart...</p>
				</div>
			</div>
		);
	}

	// Empty cart state
	if (items.length === 0) {
		return (
			<div className="md:min-h-[70vh] min-h-[80vh] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4 }}
					className="w-full max-w-md px-4"
				>
					<div className="text-center">
						<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center">
							<ShoppingBag className="w-12 h-12 text-primary" />
						</div>

						<h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 text-foreground">Your cart is empty</h1>

						<p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
							Discover amazing products and start building your perfect collection today.
						</p>

						<div className="space-y-3">
							<Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 shadow-md">
								<Link href="/shop" className="inline-flex items-center justify-center gap-2">
									<ShoppingBag className="w-4 h-4" />
									Start Shopping
								</Link>
							</Button>
							<Button asChild variant="outline" className="w-full">
								<Link href="/">Continue Browsing</Link>
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		);
	}

	// Cart with items
	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-6 md:mb-10">
					<h1 className="text-2xl md:text-4xl font-bold tracking-tight">Shopping Cart</h1>
					<p className="text-[10px] md:text-xs text-muted-foreground mt-3 tracking-wider uppercase">
						{items.length} item{items.length !== 1 ? 's' : ''} in your cart
					</p>
				</div>

				{/* Main Content */}
				<div className="grid lg:grid-cols-3 gap-6 md:gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.1 }}
							className="space-y-3 md:space-y-4"
						>
							<AnimatePresence mode="popLayout">
								{items.map((item, index) => (
									<motion.div
										key={item.uniqueKey}
										initial={{ opacity: 0, y: 20, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: -20, scale: 0.95 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										className="w-full"
									>
										<CartItemComponent item={item} onRemove={handleRemoveItem} onUpdateQuantity={handleUpdateQuantity} />
									</motion.div>
								))}
							</AnimatePresence>
						</motion.div>

						{/* Additional Info */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.3 }}
							className="mt-8 p-4 md:p-6 bg-blue-50 border border-blue-100 rounded-xl"
						>
							<p className="text-sm text-blue-900">
								✨ <span className="font-semibold">Tip:</span> Items will be saved in your cart for 30 days. Don&apos;t miss out on your favorites!
							</p>
						</motion.div>
					</div>

					{/* Order Summary Sidebar */}
					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="h-fit">
						<OrderSummary />
					</motion.div>
				</div>

				{/* Continue Shopping Button */}
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.4 }} className="mt-12 text-center">
					<Button asChild variant="outline" className="gap-2">
						<Link href="/shop">
							<ArrowLeft className="w-4 h-4" />
							Continue Shopping
						</Link>
					</Button>
				</motion.div>
			</div>
		</div>
	);
}
