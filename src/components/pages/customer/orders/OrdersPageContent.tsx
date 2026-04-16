'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ChevronRight, Calendar, Truck, Package } from 'lucide-react';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';
import { toast } from 'sonner';
import { Order } from '@/types/types';

const getStatusInfo = (status: string) => {
	const statusMap: Record<string, { text: string; className: string; iconColor: string }> = {
		pending: {
			text: 'Pending',
			className: 'bg-amber-100 text-amber-700 border-amber-300',
			iconColor: 'bg-amber-500',
		},
		delivered: {
			text: 'Delivered',
			className: 'bg-emerald-100 text-emerald-700 border-emerald-300',
			iconColor: 'bg-emerald-500',
		},
		canceled: {
			text: 'Canceled',
			className: 'bg-red-100 text-red-700 border-red-300',
			iconColor: 'bg-red-500',
		},
	};

	return (
		statusMap[status?.toLowerCase()] || {
			text: status || 'Unknown',
			className: 'bg-gray-100 text-gray-600 border-gray-300',
			iconColor: 'bg-gray-500',
		}
	);
};

function OrderRow({ order }: { order: Order }) {
	const { text: statusText, className: statusClass, iconColor } = getStatusInfo(order.status);
	const totalQuantity = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

	console.log('Order Items:', order.items);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className="bg-card border border-border rounded-3xl overflow-hidden"
		>
			{/* Order Header */}
			<div className="px-6 py-5 bg-muted/60 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
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
							{new Date(order.created_at).toLocaleDateString('en-US', {
								month: 'long',
								day: 'numeric',
								year: 'numeric',
							})}
						</p>
					</div>

					<div>
						<p className="text-xs text-muted-foreground">Total</p>
						<p className="font-bold text-2xl text-primary">৳{Number(order.total).toLocaleString()}</p>
					</div>

					<div className="flex items-center gap-2">
						<div className={`w-3 h-3 rounded-full ${iconColor}`} />
						<span className={`px-5 py-1.5 rounded-full text-sm font-medium border ${statusClass}`}>{statusText}</span>
					</div>
				</div>
			</div>

			{/* Products */}
			<div className="p-6 space-y-6">
				{order.items?.map((item, idx) => {
					const product = item.product || {};
					const variant = product.variant || {};
					const imageUrl = product.image || '';

					return (
						<div key={item.id || idx} className="flex gap-5 group">
							<div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border bg-muted shadow-sm">
								{imageUrl && (
									<Image
										src={imageUrl}
										alt={product.product_name || 'Product'}
										fill
										className="object-cover group-hover:scale-105 transition-transform duration-300"
									/>
								)}
							</div>

							<div className="flex-1 min-w-0 pt-1">
								<Link
									href={product.url || '#'}
									target="_blank"
									className="font-semibold text-[15px] leading-tight hover:text-orange-600 transition-colors line-clamp-2"
								>
									{product.title || product.title}
								</Link>

								{variant.size && (
									<p className="text-sm text-muted-foreground mt-1">
										Variant: <span className="font-medium text-foreground">{variant.size}</span>
									</p>
								)}

								<div className="mt-3 flex items-center justify-between">
									<div className="text-sm">
										Quantity: <span className="font-semibold">{item.quantity}</span>
									</div>
									<div className="text-right">
										<p className="font-semibold text-lg">৳{Number(item.total).toLocaleString()}</p>
										<p className="text-xs text-muted-foreground">@ ৳{Number(item.unit_price).toLocaleString()} each</p>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* Footer Action */}
			<div className="px-6 py-5 border-t flex justify-end bg-white/50">
				<Link
					href={`/customer/orders/${order.id}`}
					className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-300 to-amber-400 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
				>
					View Details
					<ChevronRight size={18} />
				</Link>
			</div>
		</motion.div>
	);
}

/* ====================== Main Page ====================== */
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

	const orders: Order[] = orderResponse?.results || orderResponse?.data || [];

	if (isLoading) {
		return (
			<div className="min-h-[70vh] flex items-center justify-center">
				<div className="text-center">
					<div className="w-10 h-10 border-4 border-orange-400 border-t-transparent animate-spin rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">Loading your orders...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-4 md:px-8 py-10 md:py-14 bg-background min-h-screen font-hanken">
			{/* Page Header */}

			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-16 h-16 flex items-center justify-center rounded-full">
						<ShoppingBag className="text-orange-400 w-8 h-8" />
					</div>

					<div>
						<h1 className="text-3xl font-medium">My Orders</h1>
						<p className="text-muted-foreground">Track, manage and review your recent purchases</p>
					</div>
				</div>
			</motion.div>

			{/* Orders List */}
			{orders.length === 0 ? (
				<div className="text-center py-24">
					<div className="mx-auto w-28 h-28 bg-muted rounded-full flex items-center justify-center mb-8">
						<Truck className="w-14 h-14 text-muted-foreground" />
					</div>
					<h2 className="text-3xl font-semibold text-foreground">No orders yet</h2>
					<p className="text-muted-foreground mt-3 max-w-md mx-auto">When you make your first purchase, your orders will appear here.</p>
				</div>
			) : (
				<div className="space-y-10">
					{orders.map((order, index) => (
						<OrderRow key={order.id} order={order} />
					))}
				</div>
			)}
		</div>
	);
}
