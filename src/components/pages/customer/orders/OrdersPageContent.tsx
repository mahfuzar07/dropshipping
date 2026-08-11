'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Calendar, Truck, Package, ImageOff } from 'lucide-react';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';
import { toast } from 'sonner';

interface Variant {
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
	product_id?: string;
	product_name: string;
	product_image?: string;
	variants: Variant[];
	items?: Array<{
		product_id: string;
		product_name: string;
		product_image: string;
		variants: Variant[];
		shipping_method?: string;
		item_total: number;
	}>;
	shipping_method?: string;
	status: string;
	status_display?: string;
	total_price: string;
	created_at: string;
}

/* One row per (product, color, size) with a quantity > 0 — the actual purchasable line item. */
interface LineItem {
	product_id?: string;
	product_name: string;
	image: string;
	color: string;
	size: string;
	qty: number;
	unitPrice: number;
}

/* ====================== Status ====================== */

const getStatusInfo = (status: string, statusDisplay?: string) => {
	const statusMap: Record<string, { text: string; className: string; iconColor: string }> = {
		pending: { text: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-300', iconColor: 'bg-amber-500' },
		processing: { text: 'Processing', className: 'bg-blue-100 text-blue-700 border-blue-300', iconColor: 'bg-blue-500' },
		shipped: { text: 'Shipped', className: 'bg-indigo-100 text-indigo-700 border-indigo-300', iconColor: 'bg-indigo-500' },
		delivered: { text: 'Delivered', className: 'bg-emerald-100 text-emerald-700 border-emerald-300', iconColor: 'bg-emerald-500' },
		canceled: { text: 'Canceled', className: 'bg-red-100 text-red-700 border-red-300', iconColor: 'bg-red-500' },
	};

	const key = status?.toLowerCase() || '';
	return (
		statusMap[key] || {
			text: statusDisplay || status || 'Unknown',
			className: 'bg-gray-100 text-gray-600 border-gray-300',
			iconColor: 'bg-gray-500',
		}
	);
};

/* ====================== Order Row ====================== */

function OrderRow({ order }: { order: Order }) {
	const { text: statusText, className: statusClass, iconColor } = getStatusInfo(order.status, order.status_display);

	// Build one line item per (product, color, size) that actually has quantity > 0.
	// Fixes a bug where only the first size/quantity entry was ever shown, even
	// when a variant included several sizes with their own quantities and prices.
	const lineItems: LineItem[] = useMemo(() => {
		const source =
			Array.isArray(order.items) && order.items.length > 0
				? order.items.flatMap((item) =>
						(item.variants || []).map((v) => ({
							variantItem: v,
							product_id: item.product_id,
							product_name: item.product_name,
							product_image: item.product_image || '',
						})),
					)
				: (order.variants || []).map((v) => ({
						variantItem: v,
						product_id: order.product_id,
						product_name: order.product_name,
						product_image: order.product_image || '',
					}));

		const lines: LineItem[] = [];
		source.forEach(({ variantItem, product_id, product_name, product_image }) => {
			const variant = variantItem.variant || {};
			const image = variant.image || product_image || '';
			const color = variant.color_name || '';

			Object.entries(variantItem.quantity || {}).forEach(([sizeKey, qtyRaw]) => {
				const qty = Number(qtyRaw) || 0;
				if (qty <= 0) return;

				const sizeInfo = variant.sizes?.find((s) => s.size_name === sizeKey);
				lines.push({
					product_id,
					product_name,
					image,
					color,
					size: sizeInfo?.size_name || sizeKey,
					qty,
					unitPrice: Number(sizeInfo?.price) || 0,
				});
			});
		});
		return lines;
	}, [order]);

	const totalQuantity = useMemo(() => lineItems.reduce((sum, l) => sum + l.qty, 0), [lineItems]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="bg-card border border-border rounded-3xl overflow-hidden hover:shadow-md transition-shadow"
		>
			{/* Order Header */}
			<div className="px-6 py-5 bg-muted/60 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
						<Package className="text-orange-500 w-6 h-6" />
					</div>

					<div>
						<p className="text-xs text-muted-foreground">Order ID</p>
						<p className="font-semibold text-lg tracking-tight">#{order.order_number}</p>
					</div>
				</div>

				<div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
					<div>
						<p className="text-xs text-muted-foreground flex items-center gap-1.5">
							<Calendar className="w-4 h-4" />
							Order Date
						</p>
						<p className="font-medium">
							{Number.isNaN(new Date(order.created_at).getTime())
								? '—'
								: new Date(order.created_at).toLocaleDateString('en-US', {
										month: 'long',
										day: 'numeric',
										year: 'numeric',
									})}
						</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">
							{totalQuantity} item{totalQuantity !== 1 ? 's' : ''} · Total
						</p>
						<p className="font-bold text-2xl text-primary">৳{(Number(order.total_price) || 0).toLocaleString()}</p>
					</div>

					<div className="flex items-center gap-2">
						<div className={`w-3 h-3 rounded-full ${iconColor}`} />
						<span className={`px-5 py-1.5 rounded-full text-sm font-medium border ${statusClass}`}>{statusText}</span>
					</div>
				</div>
			</div>

			{/* Products / Variants */}
			<div className="p-6 space-y-6">
				{lineItems.map((line, idx) => (
					<div key={idx} className="flex gap-5 group">
						<div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border bg-muted shadow-sm">
							{line.image ? (
								<Image
									src={line.image}
									alt={line.product_name}
									fill
									sizes="96px"
									className="object-cover group-hover:scale-105 transition-transform duration-300"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-muted-foreground">
									<ImageOff size={22} />
								</div>
							)}
						</div>

						<div className="flex-1 min-w-0 pt-1">
							<Link
								href={`/product/${line.product_id}`}
								target="_blank"
								rel="noopener noreferrer"
								className="font-semibold text-[15px] leading-tight hover:text-orange-600 transition-colors line-clamp-2"
							>
								{line.product_name}
							</Link>

							<div className="mt-1.5 text-sm text-muted-foreground">
								{line.color && <span>Color: {line.color}</span>}
								{line.size && <span className={line.color ? 'ml-3' : ''}>Size: {line.size}</span>}
							</div>

							<div className="mt-3 flex items-center justify-between">
								<div className="text-sm">
									Quantity: <span className="font-semibold">{line.qty}</span>
								</div>
								<div className="text-right">
									<p className="font-semibold text-lg">৳{(line.unitPrice * line.qty).toLocaleString()}</p>
									<p className="text-xs text-muted-foreground">@ ৳{line.unitPrice.toLocaleString()} each</p>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Footer Action */}
			<div className="px-6 py-5 border-t flex justify-end bg-white/50">
				<Link
					href={`/customer/orders/${order.id}`}
					className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-300 to-amber-400 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transition-all active:scale-95"
				>
					View Details
					<ChevronRight size={18} />
				</Link>
			</div>
		</motion.div>
	);
}

/* ====================== Loading Skeleton ====================== */

function OrderRowSkeleton() {
	return (
		<div className="bg-card border border-border rounded-3xl overflow-hidden animate-pulse">
			<div className="px-6 py-5 bg-muted/60 border-b flex items-center gap-4">
				<div className="w-12 h-12 bg-slate-200 rounded-2xl" />
				<div className="space-y-2">
					<div className="h-3 w-16 bg-slate-200 rounded" />
					<div className="h-4 w-28 bg-slate-200 rounded" />
				</div>
			</div>
			<div className="p-6 flex gap-5">
				<div className="w-24 h-24 rounded-2xl bg-slate-200 flex-shrink-0" />
				<div className="flex-1 space-y-3 pt-1">
					<div className="h-4 w-2/3 bg-slate-200 rounded" />
					<div className="h-3 w-1/3 bg-slate-200 rounded" />
					<div className="h-3 w-1/2 bg-slate-200 rounded" />
				</div>
			</div>
		</div>
	);
}

/* ====================== Main Component ====================== */
export default function OrdersPageContent() {
	const { data: orderResponse, isLoading } = useAppData<any, 'single'>({
		key: [QueriesKey.USER_ORDERS],
		api: apiEndpoint.orders.ORDERS(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to load orders');
		},
	});

	const orders: Order[] = orderResponse?.data || orderResponse?.results || [];

	return (
		<div className="px-4 md:px-8 py-10 md:py-14 bg-background min-h-screen font-hanken">
			{/* Page Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-gradient-to-br from-orange-200 to-orange-400 w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
						<ShoppingBag className="text-white w-8 h-8" />
					</div>

					<div>
						<h1 className="text-3xl font-medium">My Orders</h1>
						<p className="text-muted-foreground">Track, manage and review your recent purchases</p>
					</div>
				</div>
			</motion.div>

			{/* Orders List */}
			{isLoading ? (
				<div className="space-y-10">
					{Array.from({ length: 3 }).map((_, i) => (
						<OrderRowSkeleton key={i} />
					))}
				</div>
			) : orders.length === 0 ? (
				<div className="text-center py-24">
					<div className="mx-auto w-28 h-28 bg-muted rounded-full flex items-center justify-center mb-8">
						<Truck className="w-14 h-14 text-muted-foreground" />
					</div>
					<h2 className="text-3xl font-semibold text-foreground">No orders yet</h2>
					<p className="text-muted-foreground mt-3 max-w-md mx-auto">When you make your first purchase, your orders will appear here.</p>
				</div>
			) : (
				<div className="space-y-10">
					{orders.map((order) => (
						<OrderRow key={order.id} order={order} />
					))}
				</div>
			)}
		</div>
	);
}
