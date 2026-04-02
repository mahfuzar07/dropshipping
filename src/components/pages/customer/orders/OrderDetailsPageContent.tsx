'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, MapPin, CreditCard } from 'lucide-react';

const order = {
	reference_no: '123456',
	created_at: new Date().toISOString(),
	total_price: 59136,
	total_qty: 2,
	payment_type: 'cod',
	shipping_type: 'home_delivery',
	sale_status: 1,
	name: 'John Doe',
	phone_number: '01700000000',
	address: 'Dhaka, Bangladesh',
	city: 'Dhaka',
	product_sale: [
		{
			product_name: 'Premium Panjabi',
			product_image: '/assets/hero/slide-1.jpg',
			qty: 1,
			total: 29568,
			product_url: '/',
			order_variation_info: [{ color_name: 'Red' }],
		},
		{
			product_name: 'Stylish Shirt',
			product_image: '/assets/hero/slide-1.jpg',
			qty: 1,
			total: 29568,
			product_url: '/',
			order_variation_info: [{ color_name: 'Black' }],
		},
	],
};

const getStatusInfo = (status: number) => {
	const statusMap: Record<number, { text: string; className: string }> = {
		1: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
		5: { text: 'Delivered', className: 'bg-green-100 text-green-800 border-green-300' },
	};

	return statusMap[status] || { text: 'Unknown', className: 'bg-gray-100 text-gray-700' };
};

export default function OrderDetailsPageContent() {
	const { text: statusText, className: statusClass } = getStatusInfo(order.sale_status);
	const orderItem = order.total_qty;

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-3">
						<div className="bg-slate-100 w-16 h-16 flex items-center justify-center rounded-full">
							<ShoppingBag className="text-orange-400 w-7 h-7" />
						</div>

						<div>
							<h1 className="text-2xl font-semibold">Order ID : #{order.reference_no}</h1>
							<p className="text-muted-foreground mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
						</div>
					</div>

					<span className={`px-4 py-1.5 rounded-full text-sm border ${statusClass}`}>{statusText}</span>
				</div>

				{/* Summary */}
				<div className="mt-6 bg-slate-50 rounded grid grid-cols-3 text-center">
					<div className="border-r p-4">
						<p className="text-sm text-muted-foreground">Total Amount</p>
						<p className="text-xl font-medium text-primary">৳{order.total_price.toLocaleString()}</p>
					</div>

					<div className="border-r p-4">
						<p className="text-sm text-muted-foreground">Total Items</p>
						<p className="text-xl font-medium">{orderItem}</p>
					</div>

					<div className="p-4">
						<p className="text-sm text-muted-foreground">Payment</p>
						<p className="text-xl font-medium uppercase">{order.payment_type}</p>
					</div>
				</div>
			</motion.div>

			{/* Products */}
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4 border-b pb-3">Ordered Items</h2>

				<div className="bg-card p-4 rounded-lg space-y-4">
					{order.product_sale.map((item, index) => {
						const color = item.order_variation_info?.[0]?.color_name;

						return (
							<motion.div key={index} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="border-b pb-4 flex gap-4">
								<div className="relative w-16 h-16 bg-muted rounded">
									<Image src={item.product_image} alt="" fill className="object-cover" />
								</div>

								<div className="flex-1">
									<Link href={item.product_url} className="font-medium hover:text-orange-400">
										{item.product_name}
									</Link>

									{color && <p className="text-sm text-muted-foreground">Color: {color}</p>}

									<div className="flex justify-between text-sm mt-2">
										<span>Qty: {item.qty}</span>
										<span>৳{item.total.toLocaleString()}</span>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>

			{/* Address */}
			<div className="space-y-5">
				<h3 className="text-xl border-b pb-3 font-semibold flex items-center gap-2">
					<MapPin className="w-5 h-5" />
					Delivery Information
				</h3>

				<div className="bg-card p-5 rounded">
					<p>
						<strong>Name:</strong> {order.name}
					</p>
					<p>
						<strong>Address:</strong> {order.address}
					</p>
					<p>
						<strong>Phone:</strong> {order.phone_number}
					</p>
				</div>
			</div>

			{/* Payment */}
			<div className="mt-8">
				<h3 className="text-xl border-b pb-3 font-semibold flex items-center gap-2">
					<CreditCard className="w-5 h-5" />
					Payment Information
				</h3>

				<div className="p-5">
					<p className="uppercase">{order.payment_type}</p>

					<div className="text-right mt-4">
						<p className="text-muted-foreground">Grand Total</p>
						<p className="text-xl font-bold text-primary">৳{order.total_price.toLocaleString()}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
