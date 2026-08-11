'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, MapPin, CreditCard, Calendar, ImageOff, Printer } from 'lucide-react';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/axiosInstance';

// Adjust this import path to wherever OrderTimeline.tsx actually lives in your project.
import OrderTimeline, { type OrderStatus, type HistoryItem } from './OrderTimeline';

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
		variants: any[];
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
	status_history?: HistoryItem[];
	total_price: string;
	discount?: string | number;
	coupon_code?: string;
	created_at: string;
}

const getStatusInfo = (status: string, statusDisplay?: string) => {
	const statusMap: Record<string, { text: string; className: string; iconColor: string }> = {
		pending: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-400', iconColor: 'text-yellow-500' },
		confirmed: { text: 'Confirmed', className: 'bg-blue-100 text-blue-800 border-blue-400', iconColor: 'text-blue-500' },
		processing: { text: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-400', iconColor: 'text-blue-500' },
		shipped: { text: 'Shipped', className: 'bg-indigo-100 text-indigo-800 border-indigo-400', iconColor: 'text-indigo-500' },
		rescheduled: { text: 'Rescheduled', className: 'bg-purple-100 text-purple-800 border-purple-400', iconColor: 'text-purple-500' },
		delivered: { text: 'Delivered', className: 'bg-green-100 text-green-800 border-green-400', iconColor: 'text-green-500' },
		completed: { text: 'Completed', className: 'bg-green-100 text-green-800 border-green-400', iconColor: 'text-green-500' },
		canceled: { text: 'Canceled', className: 'bg-red-100 text-red-800 border-red-400', iconColor: 'text-red-500' },
		cancelled: { text: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-400', iconColor: 'text-red-500' },
		returned: { text: 'Returned', className: 'bg-rose-100 text-rose-800 border-rose-400', iconColor: 'text-rose-500' },
		refunded: { text: 'Refunded', className: 'bg-sky-100 text-sky-800 border-sky-400', iconColor: 'text-sky-500' },
		failed: { text: 'Failed', className: 'bg-orange-100 text-orange-800 border-orange-400', iconColor: 'text-orange-500' },
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

// Maps whatever casing/spelling the API sends ("canceled", "Delivered", ...)
// onto the OrderTimeline component's strict OrderStatus keys.
const STATUS_ALIASES: Record<string, OrderStatus> = {
	pending: 'PENDING',
	confirmed: 'CONFIRMED',
	processing: 'PROCESSING',
	shipped: 'SHIPPED',
	rescheduled: 'RESCHEDULED',
	delivered: 'DELIVERED',
	completed: 'COMPLETED',
	cancelled: 'CANCELLED',
	canceled: 'CANCELLED',
	returned: 'RETURNED',
	refunded: 'REFUNDED',
	failed: 'FAILED',
};

function toTimelineStatus(status: string): OrderStatus {
	return STATUS_ALIASES[status?.toLowerCase()?.trim()] || 'PENDING';
}

type NormalizedVariantRow = {
	skuId: string | number;
	label: string;
	price: number;
	quantity: number;
	weight: number;
	image?: string;
	color?: string;
	size?: string;
	product_id: string;
	product_name: string;
	product_image: string;
};

function normalizeOrderVariants(items: any[], orderFallback: any): NormalizedVariantRow[] {
	const rows: NormalizedVariantRow[] = [];

	const parseVariants = (variants: any[], prodId: string, prodName: string, prodImg: string) => {
		if (!Array.isArray(variants)) return;
		variants.forEach((v: any) => {
			if (!v) return;

			// Format A (Flat SKU-based)
			if (typeof v.quantity === 'number') {
				let color = 'Standard';
				let size = 'Standard';
				if (v.label) {
					const colorMatch = v.label.match(/Color:\s*([^,]+)/i);
					const sizeMatch = v.label.match(/Size:\s*([^,]+)/i);
					if (colorMatch) color = colorMatch[1].trim();
					if (sizeMatch) size = sizeMatch[1].trim();

					if (!colorMatch && !sizeMatch && v.label.includes('/')) {
						const parts = v.label.split('/');
						if (parts[0]) color = parts[0].trim();
						if (parts[1]) size = parts[1].trim();
					}
				}
				rows.push({
					skuId: v.skuId ?? '',
					label: v.label ?? '',
					price: Number(v.price || 0),
					quantity: v.quantity,
					weight: Number(v.weight || 0.5),
					image: v.image || prodImg,
					color,
					size,
					product_id: prodId,
					product_name: prodName,
					product_image: prodImg,
				});
			}
			// Format B (Old Nested structure)
			else if (v.quantity && typeof v.quantity === 'object') {
				const colorName = v.variant?.color_name || 'Standard';
				const variantImg = v.variant?.image || prodImg;
				const sizes = Array.isArray(v.variant?.sizes) ? v.variant.sizes : [];
				const weight = Number(v.variant?.weight_kg || v.variant?.weight || 0.5);

				Object.entries(v.quantity).forEach(([sizeName, qty]) => {
					const qtyNum = Number(qty);
					if (qtyNum <= 0) return;

					const sizeDetail = sizes.find((s: any) => s.size_name === sizeName);
					const priceNum = Number(sizeDetail?.price || 0);

					rows.push({
						skuId: sizeDetail?.id || `${colorName}-${sizeName}`,
						label: colorName ? `${colorName} - ${sizeName}` : sizeName,
						price: priceNum,
						quantity: qtyNum,
						weight: weight,
						image: variantImg,
						color: colorName,
						size: sizeName,
						product_id: prodId,
						product_name: prodName,
						product_image: prodImg,
					});
				});
			}
		});
	};

	if (Array.isArray(items) && items.length > 0) {
		items.forEach((item: any) => {
			parseVariants(item.variants, item.product_id, item.product_name, item.product_image || '');
		});
	} else if (orderFallback) {
		parseVariants(orderFallback.variants, orderFallback.product_id || '', orderFallback.product_name || '', orderFallback.product_image || '');
	}

	return rows;
}

function OrderDetailsSkeleton() {
	return (
		<div className="px-4 md:px-6 py-8 md:py-12 font-hanken animate-pulse">
			<div className="flex items-center gap-4 mb-10">
				<div className="w-20 h-20 rounded-2xl bg-slate-200" />
				<div className="space-y-2">
					<div className="h-6 w-48 bg-slate-200 rounded" />
					<div className="h-4 w-36 bg-slate-200 rounded" />
				</div>
			</div>
			<div className="h-40 bg-slate-100 rounded-3xl mb-8" />
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<div className="lg:col-span-7 h-80 bg-slate-100 rounded-2xl" />
				<div className="lg:col-span-5 space-y-3">
					<div className="h-56 bg-slate-100 rounded-2xl" />
					<div className="h-32 bg-slate-100 rounded-2xl" />
				</div>
			</div>
		</div>
	);
}

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

	const normalizedVariants = useMemo(() => {
		if (!order) return [];
		return normalizeOrderVariants(order.items || [], order);
	}, [order]);

	const totalQuantity = useMemo(() => normalizedVariants.reduce((sum, v) => sum + v.quantity, 0), [normalizedVariants]);
	const subtotal = useMemo(() => normalizedVariants.reduce((sum, v) => sum + v.quantity * v.price, 0), [normalizedVariants]);

	const handlePrintLabel = async (orderId: string | number) => {
		const toastId = toast.loading('Generating shipping label PDF from backend...');
		try {
			const response = await authApi.get(`/api/order/orders/${orderId}/print-label/`, { responseType: 'blob' });
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
			const response = await authApi.get(`/api/order/orders/${orderId}/print-invoice/`, { responseType: 'blob' });
			const blob = new Blob([response.data], { type: 'application/pdf' });
			const url = window.URL.createObjectURL(blob);
			window.open(url, '_blank');
			toast.success('Invoice generated successfully!', { id: toastId });
		} catch (err) {
			toast.error('Failed to generate invoice PDF', { id: toastId });
		}
	};

	if (isLoading || !order) {
		return <OrderDetailsSkeleton />;
	}

	const { text: statusText, className: statusClass, iconColor } = getStatusInfo(order.status, order.status_display);
	const grandTotal = Number(order.total_price || 0);
	const shipping = Number(order.shipping_charge || 0);
	const discount = Number(order.discount || 0);

	return (
		<div className="px-4 md:px-6 py-8 md:py-12 font-hanken">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
					<div className="flex items-center gap-4">
						<div className="bg-gradient-to-br from-orange-200 to-amber-500 w-20 h-20 flex items-center justify-center rounded-2xl shadow-sm">
							<ShoppingBag className="text-white w-10 h-10" />
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Order #{order.order_number}</h1>

							<div className="flex items-center gap-2 text-muted-foreground mt-1">
								<Calendar className="w-4 h-4" />
								<span>
									Placed on{' '}
									{Number.isNaN(new Date(order.created_at).getTime())
										? '—'
										: new Date(order.created_at).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
								</span>
							</div>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
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

			{/* Order Progress Timeline — row layout collapses to a vertical stepper on
			    mobile automatically (see OrderTimeline's internal md: breakpoints),
			    so no extra responsive wiring is needed here. */}
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
				<OrderTimeline status={toTimelineStatus(order.status)} history={order.status_history} direction="row" />
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
				{/* ==================== LEFT: Ordered Items ==================== */}
				<div className="lg:col-span-7 space-y-3">
					<div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
						<div className="px-6 py-5 border-b flex items-center justify-between bg-muted/30">
							<h2 className="text-xl font-semibold flex items-center gap-2">Ordered Items ({totalQuantity})</h2>
							<p className="text-sm text-muted-foreground">
								{normalizedVariants.length} variant{normalizedVariants.length > 1 ? 's' : ''}
							</p>
						</div>

						<div className="divide-y divide-border">
							{normalizedVariants.map((variantItem, index) => {
								const imageUrl = variantItem.image || variantItem.product_image || '';
								const { color, size } = variantItem;
								const qty = variantItem.quantity;
								const unitPrice = variantItem.price;

								return (
									<motion.div
										key={variantItem.skuId ?? index}
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.06 }}
										className="p-6 flex gap-5 hover:bg-muted/50 transition-colors"
									>
										{/* Product Image */}
										<div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-xl overflow-hidden border">
											{imageUrl ? (
												<Image src={imageUrl} alt={variantItem.product_name} fill sizes="96px" className="object-cover" />
											) : (
												<div className="w-full h-full flex items-center justify-center text-muted-foreground">
													<ImageOff size={20} />
												</div>
											)}
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

							{discount > 0 && (
								<div className="flex justify-between text-green-600">
									<span>Discount ({order.coupon_code || 'Coupon'})</span>
									<span>- ৳{discount.toLocaleString()}</span>
								</div>
							)}

							<div className="border-t pt-4 flex justify-between font-semibold text-base">
								<span>Grand Total</span>
								<span className="text-primary">৳{grandTotal.toLocaleString()}</span>
							</div>

							<div className="mt-3 bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5 text-xs text-slate-600">
								<div className="flex justify-between">
									<span>Immediate Payment (70% Paid)</span>
									<span className="font-semibold text-slate-800">৳{(grandTotal * 0.7).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
								</div>
								<div className="flex justify-between">
									<span>Payment upon Delivery (30% COD)</span>
									<span className="font-semibold text-slate-800">৳{(grandTotal * 0.3).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
								</div>
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
