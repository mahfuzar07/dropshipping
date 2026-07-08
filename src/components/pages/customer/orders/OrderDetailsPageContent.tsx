// 'use client';

// import React from 'react';
// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import Link from 'next/link';
// import { ShoppingBag, MapPin, CreditCard, Calendar, Truck } from 'lucide-react';
// import { QueriesKey } from '@/lib/constants/queriesKey';
// import { apiEndpoint } from '@/lib/constants/apiEndpoint';
// import { useAppData } from '@/hooks/use-appdata';
// import { toast } from 'sonner';
// import { Order } from '@/types/types';

// const getStatusInfo = (status: string) => {
// 	const statusMap: Record<string, { text: string; className: string; iconColor: string }> = {
// 		pending: {
// 			text: 'Pending',
// 			className: 'bg-yellow-100 text-yellow-800 border-yellow-400',
// 			iconColor: 'text-yellow-500',
// 		},
// 		delivered: {
// 			text: 'Delivered',
// 			className: 'bg-green-100 text-green-800 border-green-400',
// 			iconColor: 'text-green-500',
// 		},
// 		canceled: {
// 			text: 'Canceled',
// 			className: 'bg-red-100 text-red-800 border-red-400',
// 			iconColor: 'text-red-500',
// 		},
// 	};

// 	return (
// 		statusMap[status?.toLowerCase()] || {
// 			text: status || 'Unknown',
// 			className: 'bg-gray-100 text-gray-700 border-gray-300',
// 			iconColor: 'text-gray-500',
// 		}
// 	);
// };

// export default function OrderDetailsPageContent({ orderId }: { orderId: string }) {
// 	const { data: orderResponse, isLoading } = useAppData<any, 'single'>({
// 		key: [QueriesKey.USER_ORDERS, orderId],
// 		api: apiEndpoint.orders.ORDERS_DETAILS(orderId),
// 		auth: true,
// 		responseType: 'single',
// 		enabled: !!orderId,
// 		onError: (error: any) => {
// 			toast.error(error?.response?.data?.message || 'Failed to fetch order details');
// 		},
// 	});

// 	// Safe extraction
// 	console.log('Order Response:', orderResponse);
// 	const order: Order | null = orderResponse?.data || orderResponse;

// 	if (isLoading || !order) {
// 		return (
// 			<div className="min-h-[60vh] flex items-center justify-center">
// 				<div className="text-center">
// 					<div className="animate-spin w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
// 					<p className="text-muted-foreground">Loading order details...</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	const { text: statusText, className: statusClass, iconColor } = getStatusInfo(order.status);

// 	const subtotal = Number(order.subtotal || 0);
// 	const shipping = Number(order.shipping_charge || 0);
// 	const discount = Number(order.discount_amount || 0);
// 	const grandTotal = Number(order.total || 0);

// 	const totalQuantity = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

// 	return (
// 		<div className=" px-4 md:px-6 py-8 md:py-12 font-hanken">
// 			{/* Header */}
// 			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
// 				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
// 					<div className="flex items-center gap-4">
// 						<div className="bg-gradient-to-br from-orange-200 to-amber-500 w-20 h-20 flex items-center justify-center rounded-2xl">
// 							<ShoppingBag className="text-white w-10 h-10" />
// 						</div>
// 						<div>
// 							<h1 className="text-3xl font-bold tracking-tight">Order #{order.order_number}</h1>
// 							<div className="flex items-center gap-2 text-muted-foreground mt-1">
// 								<Calendar className="w-4 h-4" />
// 								<span>
// 									Placed on{' '}
// 									{new Date(order.created_at).toLocaleDateString('en-US', {
// 										year: 'numeric',
// 										month: 'long',
// 										day: 'numeric',
// 									})}
// 								</span>
// 							</div>
// 						</div>
// 					</div>

// 					<div className={`px-6 py-2.5 rounded-full text-sm font-medium border flex items-center gap-2 ${statusClass}`}>
// 						<div className={`w-3 h-3 rounded-full ${iconColor.replace('text-', 'bg-')}`} />
// 						{statusText}
// 					</div>
// 				</div>
// 			</motion.div>

// 			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
// 				{/* ==================== LEFT: All Items (Multiple Products Support) ==================== */}
// 				<div className="lg:col-span-7 space-y-3">
// 					<div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
// 						<div className="px-6 py-5 border-b flex items-center justify-between bg-muted/30">
// 							<h2 className="text-xl font-semibold flex items-center gap-2">Ordered Items ({totalQuantity})</h2>
// 							<p className="text-sm text-muted-foreground">{order.items?.length || 0} type of product</p>
// 						</div>

// 						<div className="divide-y divide-border">
// 							{order.items?.map((item, index) => {
// 								const product = item.product || {};
// 								const variant = product.variant || {};
// 								const imageUrl = product.image || '';

// 								return (
// 									<motion.div
// 										key={item.id || `item-${index}`}
// 										initial={{ opacity: 0, y: 15 }}
// 										animate={{ opacity: 1, y: 0 }}
// 										transition={{ delay: index * 0.06 }}
// 										className="p-6 flex gap-5 hover:bg-muted/50 transition-colors"
// 									>
// 										{/* Product Image */}
// 										<div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-xl overflow-hidden border">
// 											{imageUrl && <Image src={imageUrl} alt={product.title || 'Product'} fill className="object-cover" />}
// 										</div>

// 										{/* Product Details */}
// 										<div className="flex-1 min-w-0">
// 											<Link
// 												href={product.url || '#'}
// 												target="_blank"
// 												className="font-semibold text-base leading-tight hover:text-orange-600 transition-colors line-clamp-2"
// 											>
// 												{product.title}
// 											</Link>

// 											{variant.size && (
// 												<p className="text-sm text-muted-foreground mt-1.5">
// 													Variant: <span className="font-medium">{variant.size}</span>
// 												</p>
// 											)}

// 											<div className="mt-4 flex justify-between items-end">
// 												<div>
// 													<span className="text-muted-foreground text-sm">Quantity:</span>{' '}
// 													<span className="font-semibold text-base">{item.quantity}</span>
// 												</div>
// 												<div className="text-right">
// 													<div className="font-semibold text-lg">৳{Number(item.total).toLocaleString()}</div>
// 													<div className="text-xs text-muted-foreground">
// 														each ৳{Number(item.unit_price).toLocaleString()} × {item.quantity}
// 													</div>
// 												</div>
// 											</div>
// 										</div>
// 									</motion.div>
// 								);
// 							})}
// 						</div>
// 					</div>
// 				</div>

// 				{/* ==================== RIGHT: Summary, Address, Payment ==================== */}
// 				<div className="lg:col-span-5 space-y-3">
// 					{/* Price Summary */}
// 					<div className="bg-card rounded-2xl border shadow p-6">
// 						<h3 className="font-semibold text-lg mb-5">Price Summary</h3>
// 						<div className="space-y-4 text-sm">
// 							<div className="flex justify-between">
// 								<span className="text-muted-foreground">Subtotal</span>
// 								<span>৳{subtotal.toLocaleString()}</span>
// 							</div>
// 							{shipping > 0 && (
// 								<div className="flex justify-between">
// 									<span className="text-muted-foreground">Shipping Charge</span>
// 									<span>৳{shipping.toLocaleString()}</span>
// 								</div>
// 							)}
// 							{discount > 0 && (
// 								<div className="flex justify-between text-green-600">
// 									<span>Discount</span>
// 									<span>- ৳{discount.toLocaleString()}</span>
// 								</div>
// 							)}
// 							<div className="border-t pt-4 flex justify-between font-semibold text-base">
// 								<span>Grand Total</span>
// 								<span className="text-primary">৳{grandTotal.toLocaleString()}</span>
// 							</div>
// 						</div>

// 						{/* 1688 Original Price */}
// 						{order.items?.[0]?.product?.price && (
// 							<div className="mt-6 pt-6 border-t text-xs text-muted-foreground">
// 								<p>Original Price (1688):</p>
// 								<p className="font-medium">
// 									{order.items[0].product.price.currency}
// 									{order.items[0].product.price.amount} ≈ {order.items[0].product.price.overseas}
// 								</p>
// 							</div>
// 						)}
// 					</div>

// 					{/* Delivery Information */}
// 					<div className="bg-card rounded-2xl border shadow p-6">
// 						<h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
// 							<MapPin className="w-5 h-5 text-orange-500" />
// 							Delivery Information
// 						</h3>
// 						<div className="space-y-3 text-sm">
// 							<p className="font-medium">{order.address?.full_name}</p>
// 							<div>
// 								<p className="text-muted-foreground">Address</p>
// 								<p>{order.address?.address}</p>
// 								{order.address?.address_line2 && <p>{order.address.address_line2}</p>}
// 								<p>
// 									{order.address?.district}, {order.address?.city} - {order.address?.postal_code}
// 								</p>
// 							</div>
// 							<div>
// 								<p className="text-muted-foreground">Phone</p>
// 								<p className="font-medium">{order.address?.phone}</p>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Payment Information */}
// 					<div className="bg-card rounded-2xl border shadow p-6">
// 						<h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
// 							<CreditCard className="w-5 h-5 text-orange-500" />
// 							Payment Information
// 						</h3>
// 						<div className="uppercase font-medium text-lg tracking-wider">{order.payment_type || 'Cash on Delivery (COD)'}</div>

// 						<div className="mt-8 pt-6 border-t text-right">
// 							<p className="text-xs text-muted-foreground">Total Payable Amount</p>
// 							<p className="text-2xl font-bold text-primary">৳{grandTotal.toLocaleString()}</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			<div className="text-center text-xs text-muted-foreground mt-16">Any questions regarding this order? Please contact our support team.</div>
// 		</div>
// 	);
// }

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, MapPin, CreditCard, Calendar, Truck, Printer } from 'lucide-react';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { authApi } from '@/lib/axiosInstance';

interface VariantItem {
	variant: {
		image?: string;
		color_name?: string;
		sizes?: Array<{ size_name: string; price: string }>;
	};
	quantity: Record<string, number>;
}

interface Order {
	id: number;
	order_number: string;
	track_id: string;
	product_id?: string;
	product_name: string;
	product_image?: string;
	variants: VariantItem[];
	items?: Array<{
		product_id: string;
		product_name: string;
		product_image: string;
		variants: VariantItem[];
		shipping_method?: string;
		item_total: number;
	}>;
	address?: {
		full_name: string;
		phone: string;
		address: string;
		address_line2?: string;
		city: string;
		district: string;
		postal_code: string;
	};
	shipping_method?: string;
	shipping_charge?: string;
	payment_method?: string;
	status: string;
	status_display?: string;
	total_price: string;
	created_at: string;
}

const getStatusInfo = (status: string, statusDisplay?: string) => {
	const statusMap: Record<string, { text: string; className: string; iconColor: string }> = {
		pending: {
			text: 'Pending',
			className: 'bg-yellow-100 text-yellow-800 border-yellow-400',
			iconColor: 'text-yellow-500',
		},
		delivered: {
			text: 'Delivered',
			className: 'bg-green-100 text-green-800 border-green-400',
			iconColor: 'text-green-500',
		},
		canceled: {
			text: 'Canceled',
			className: 'bg-red-100 text-red-800 border-red-400',
			iconColor: 'text-red-500',
		},
	};

	const key = status?.toLowerCase() || '';
	return (
		statusMap[key] || {
			text: statusDisplay || status || 'Unknown',
			className: 'bg-gray-100 text-gray-700 border-gray-300',
			iconColor: 'text-gray-500',
		}
	);
};

export default function OrderDetailsPageContent({ orderId }: { orderId: string }) {
	const { data: orderResponse, isLoading } = useAppData<any, 'single'>({
		key: [QueriesKey.USER_ORDERS, orderId],
		api: apiEndpoint.orders.ORDERS_DETAILS(orderId),
		auth: true,
		responseType: 'single',
		enabled: !!orderId,
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to fetch order details');
		},
	});

	const order: Order | null = orderResponse?.data || orderResponse;

	// Flatten all variants across all products in the order
	const allVariants = useMemo(() => {
		if (!order) return [];
		if (Array.isArray(order.items) && order.items.length > 0) {
			return order.items.flatMap((item: any) =>
				(item.variants || []).map((v: any) => ({
					...v,
					product_id: item.product_id,
					product_name: item.product_name,
					product_image: item.product_image || '',
				})),
			);
		}
		// Fallback for backward compatibility
		return (order.variants || []).map((v) => ({
			...v,
			product_id: order.product_id,
			product_name: order.product_name,
			product_image: order.product_image || '',
		}));
	}, [order]);

	// Calculate totals from variants
	const totalQuantity = useMemo(() => {
		return allVariants.reduce((sum, v) => {
			return sum + Object.values(v.quantity).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
		}, 0);
	}, [allVariants]);

	const subtotal = useMemo(() => {
		return allVariants.reduce((sum, v) => {
			const qty = Number(Object.values(v.quantity)[0]) || 0;
			const price = Number(v.variant.sizes?.[0]?.price || 0);
			return sum + qty * price;
		}, 0);
	}, [allVariants]);

	const handlePrintLabel = async (orderId: string | number) => {
		const toastId = toast.loading('Generating shipping label PDF from backend...');
		try {
			const response = await authApi.get(`/api/order/orders/${orderId}/print-label/`, {
				responseType: 'blob',
			});
			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			window.open(url, '_blank');
			toast.success('Label generated successfully!', { id: toastId });
		} catch (err) {
			toast.error('Failed to generate shipping label PDF', { id: toastId });
		}
	};

	const handlePrintInvoice = async (orderId: string | number) => {
		const toastId = toast.loading('Generating invoice PDF from backend...');
		try {
			const response = await authApi.get(`/api/order/orders/${orderId}/print-invoice/`, {
				responseType: 'blob',
			});
			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			window.open(url, '_blank');
			toast.success('Invoice generated successfully!', { id: toastId });
		} catch (err) {
			toast.error('Failed to generate invoice PDF', { id: toastId });
		}
	};

	if (isLoading || !order) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">Loading order details...</p>
				</div>
			</div>
		);
	}

	const { text: statusText, className: statusClass, iconColor } = getStatusInfo(order.status, order.status_display);
	const grandTotal = Number(order.total_price || 0);
	const shipping = Number(order.shipping_charge || 0);

	return (
		<div className="px-4 md:px-6 py-8 md:py-12 font-hanken">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<div className="bg-gradient-to-br from-orange-200 to-amber-500 w-20 h-20 flex items-center justify-center rounded-2xl">
							<ShoppingBag className="text-white w-10 h-10" />
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Order #{order.order_number}</h1>

							<div className="flex items-center gap-2 text-muted-foreground mt-1">
								<Calendar className="w-4 h-4" />
								<span>
									Placed on{' '}
									{new Date(order.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button onClick={() => handlePrintLabel(order.id)} className="bg-slate-900 text-white hover:bg-slate-800 font-semibold gap-1.5">
							<Printer className="w-4 h-4" /> Print Label
						</Button>

						<Button onClick={() => handlePrintInvoice(order.id)} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
							<Printer className="w-4 h-4" /> Print Invoice
						</Button>

						<div className={`px-6 py-2.5 rounded-full text-sm font-medium border flex items-center gap-2 ${statusClass}`}>
							<div className={`w-3 h-3 rounded-full ${iconColor.replace('text-', 'bg-')}`} />
							{statusText}
						</div>
					</div>
				</div>
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* ==================== LEFT: Ordered Items ==================== */}
				<div className="lg:col-span-7 space-y-3">
					<div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
						<div className="px-6 py-5 border-b flex items-center justify-between bg-muted/30">
							<h2 className="text-xl font-semibold flex items-center gap-2">Ordered Items ({totalQuantity})</h2>
							<p className="text-sm text-muted-foreground">
								{allVariants.length} variant{allVariants.length > 1 ? 's' : ''}
							</p>
						</div>

						<div className="divide-y divide-border">
							{allVariants.map((variantItem, index) => {
								const v = variantItem.variant || {};
								const imageUrl = v.image || variantItem.product_image || '';
								const color = v.color_name || 'Standard';
								const size = v.sizes?.[0]?.size_name || 'Standard';
								const qty = Number(Object.values(variantItem.quantity)[0]) || 0;
								const unitPrice = Number(v.sizes?.[0]?.price || 0);

								return (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.06 }}
										className="p-6 flex gap-5 hover:bg-muted/50 transition-colors"
									>
										{/* Product Image */}
										<div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-xl overflow-hidden border">
											{imageUrl && <Image src={imageUrl} alt={variantItem.product_name} fill className="object-cover" />}
										</div>

										{/* Product Details */}
										<div className="flex-1 min-w-0">
											<Link
												href={`/product/${variantItem.product_id}`}
												target="_blank"
												rel="noopener noreferrer"
												className="font-semibold text-base leading-tight hover:text-orange-600 transition-colors line-clamp-2"
											>
												{variantItem.product_name}
											</Link>

											<div className="mt-1.5 text-sm text-muted-foreground">
												Color: <span className="font-medium">{color}</span>
												{size && <span className="ml-4">Size: {size}</span>}
											</div>

											<div className="mt-4 flex justify-between items-end">
												<div>
													<span className="text-muted-foreground text-sm">Quantity:</span> <span className="font-semibold text-base">{qty}</span>
												</div>
												<div className="text-right">
													<div className="font-semibold text-lg">৳{(unitPrice * qty).toLocaleString()}</div>
													<div className="text-xs text-muted-foreground">
														@ ৳{unitPrice.toLocaleString()} × {qty}
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</div>

				{/* ==================== RIGHT: Summary & Info ==================== */}
				<div className="lg:col-span-5 space-y-3">
					{/* Price Summary */}
					<div className="bg-card rounded-2xl border shadow p-6">
						<h3 className="font-semibold text-lg mb-5">Price Summary</h3>
						<div className="space-y-4 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>৳{subtotal.toLocaleString()}</span>
							</div>

							<div className="flex justify-between">
								<span className="text-muted-foreground">Shipping Method</span>
								<span className="capitalize">{order.shipping_method || 'Air'}</span>
							</div>

							{shipping > 0 && (
								<div className="flex justify-between">
									<span className="text-muted-foreground">Shipping Charge</span>
									<span>৳{shipping.toLocaleString()}</span>
								</div>
							)}

							<div className="border-t pt-4 flex justify-between font-semibold text-base">
								<span>Grand Total</span>
								<span className="text-primary">৳{grandTotal.toLocaleString()}</span>
							</div>
						</div>
					</div>

					{/* Delivery Information */}
					{order.address && (
						<div className="bg-card rounded-2xl border shadow p-6">
							<h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
								<MapPin className="w-5 h-5 text-orange-500" />
								Delivery Information
							</h3>
							<div className="space-y-3 text-sm">
								<p className="font-medium">{order.address.full_name}</p>
								<div>
									<p className="text-muted-foreground">Address</p>
									<p>{order.address.address}</p>
									{order.address.address_line2 && <p>{order.address.address_line2}</p>}
									<p>
										{order.address.district}, {order.address.city} - {order.address.postal_code}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Phone</p>
									<p className="font-medium">{order.address.phone}</p>
								</div>
							</div>
						</div>
					)}

					{/* Payment Information */}
					<div className="bg-card rounded-2xl border shadow p-6">
						<h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
							<CreditCard className="w-5 h-5 text-orange-500" />
							Payment Information
						</h3>
						<div className="uppercase font-medium text-lg tracking-wider">
							{order.payment_method === 'card' ? 'Online Card Payment' : 'Cash on Delivery (COD)'}
						</div>

						<div className="mt-8 pt-6 border-t text-right">
							<p className="text-xs text-muted-foreground">Total Payable Amount</p>
							<p className="text-2xl font-bold text-primary">৳{grandTotal.toLocaleString()}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="text-center text-xs text-muted-foreground mt-16">Any questions regarding this order? Please contact our support team.</div>
		</div>
	);
}
