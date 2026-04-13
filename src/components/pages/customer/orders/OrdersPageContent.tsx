'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';

/* ---------------- types ---------------- */

interface OrderItem {
	id: number;
	reference_no: string;
	created_at: string;
	total_price: number;
	payment_status: number;
	total_qty: number;
	sale_status: number;
}

/* ---------------- helpers ---------------- */

const getStatusColor = (sale_status: number) => {
	switch (sale_status) {
		case 1:
			return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
		case 5:
			return { text: 'Delivered', className: 'bg-green-100 text-green-800' };
		default:
			return { text: 'Processing', className: 'bg-blue-100 text-blue-800' };
	}
};

const formatOrderDate = (dateString: string) => {
	return new Date(dateString).toLocaleString('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric',
	});
};

/* ---------------- dummy data ---------------- */

// const orders: OrderItem[] = [
// 	{
// 		id: 1,
// 		reference_no: 'ORD-12345',
// 		created_at: new Date().toISOString(),
// 		total_price: 2500,
// 		payment_status: 1,
// 		total_qty: 2,
// 		sale_status: 1,
// 	},
// 	{
// 		id: 2,
// 		reference_no: 'ORD-67890',
// 		created_at: new Date().toISOString(),
// 		total_price: 4200,
// 		payment_status: 1,
// 		total_qty: 3,
// 		sale_status: 5,
// 	},
// ];

const productList = [
	{
		product_name: 'Premium Panjabi',
		qty: 1,
		total: 1200,
		product_image: '/assets/hero/slide-1.jpg',
		product_url: '/',
	},
	{
		product_name: 'Stylish Shirt',
		qty: 1,
		total: 1300,
		product_image: '/assets/hero/slide-1.jpg',
		product_url: '/',
	},
];

/* ---------------- Order Row ---------------- */

function OrderRow({ order }: { order: OrderItem }) {
	const { text: statusText, className: statusClass } = getStatusColor(order.sale_status);

	return (
		<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-lg border overflow-hidden">
			{/* header */}
			<div className="bg-gray-50 px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
				<div>
					<p className="text-sm text-gray-600">Order ID</p>
					<p className="font-medium">{order.order_number}</p>
				</div>

				<div>
					<p className="text-sm text-gray-600">Order Date</p>
					<p>{formatOrderDate(order.created_at)}</p>
				</div>

				<div>
					<p className="text-sm text-gray-600">Total</p>
					<p>৳{order.total}</p>
				</div>

				<div className="text-right">
					<span className={`px-3 py-1 rounded-full text-sm ${statusClass}`}>{order?.status}</span>
				</div>
			</div>

			{/* body */}
			<div className="p-5 space-y-4">
				{order?.items?.map((item, idx) => (
					<div key={idx} className="flex items-center gap-4">
						<div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
							<Image src={item?.product?.image} alt="" fill className="object-cover" />
						</div>

						<div className="flex-1">
							<Link href={item?.product?.url} className="font-medium hover:text-orange-400">
								{item?.product?.title}
							</Link>
							<p className="text-sm text-gray-500">Qty: {item.quantity}</p>
							<p className="text-sm text-gray-500">৳{item.total}</p>
						</div>
					</div>
				))}

				<div className="text-right">
					<Link href={`/customer/orders/${order.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm">
						View Details
						<ChevronRight size={16} />
					</Link>
				</div>
			</div>
		</motion.div>
	);
}

/* ---------------- Page ---------------- */

export default function OrdersPageContent() {
	const { data: orderResponse, isLoading: isLoadingAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.USER_ORDERS],
		api: apiEndpoint.orders.ORDERS(),
		auth: true,
		responseType: 'single',

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const orders = orderResponse?.results || [];

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-16 h-16 flex items-center justify-center rounded-full">
						<ShoppingBag className="text-orange-400 w-8 h-8" />
					</div>

					<div>
						<h1 className="text-3xl font-medium">My Orders</h1>
						<p className="text-gray-500">Track and manage your orders</p>
					</div>
				</div>
			</motion.div>

			{/* Orders */}
			{orders.length === 0 ? (
				<div className="text-center py-16">
					<div className="w-32 h-32 bg-gray-200 rounded-xl mx-auto mb-6" />
					<h3 className="text-xl text-gray-600">No orders yet</h3>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<OrderRow key={order.id} order={order} />
					))}
				</div>
			)}
		</div>
	);
}
