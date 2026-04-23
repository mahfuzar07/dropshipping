'use client';

import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, Zap, Rocket, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

/* ================= TYPES ================= */

type ShippingMethod = 'std' | 'exp' | 'ovn';

interface OrderItem {
	id: number;
	name: string;
	variant: string;
	qty: number;
	price: number;
}

/* ================= CONST ================= */

const SHIPPING_METHODS: {
	id: ShippingMethod;
	label: string;
	duration: string;
	price: number;
	icon: React.ReactNode;
}[] = [
	{
		id: 'std',
		label: 'Standard Delivery',
		duration: '5–7 business days',
		price: 60,
		icon: <Package size={18} />,
	},
	{
		id: 'exp',
		label: 'Express Delivery',
		duration: '2–3 business days',
		price: 150,
		icon: <Zap size={18} />,
	},
	{
		id: 'ovn',
		label: 'Overnight Delivery',
		duration: 'Next business day',
		price: 350,
		icon: <Rocket size={18} />,
	},
];

/* ================= COMPONENT ================= */

export default function OrderSummary() {
	const { orderSummary, shipping } = useCheckoutStore();

	const [collapsed, setCollapsed] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

	/* ===== responsive control ===== */
	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			setCollapsed(mobile); // mobile → collapsed, desktop → open
		};

		handleResize();
		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleToggle = () => {
		if (isMobile) {
			setCollapsed((prev) => !prev);
		}
	};

	/* ===== calculations ===== */

	const shipPrice = SHIPPING_METHODS.find((m) => m.id === shipping.method)?.price || 0;

	const subtotal = orderSummary.items.reduce((a: number, i: OrderItem) => a + i.price * i.qty, 0);

	const total = subtotal - orderSummary.discount + shipPrice;

	/* ===== UI ===== */

	return (
		<Card className="p-0 border-orange-100 bg-white overflow-hidden font-hanken">
			<button
				onClick={handleToggle}
				className="w-full flex justify-between items-center px-3 md:px-5 py-5 font-semibold hover:bg-orange-50 transition-colors"
			>
				<h1 className="flex items-center gap-2 !text-md">
					<ShoppingCart size={16} className=" shrink-0" />
					Order Summary
					<Badge className="bg-orange-300 text-white text-[10px] px-2 py-0 h-5 rounded-full">{orderSummary.items.length}</Badge>
				</h1>

				<div className="flex items-center gap-2.5">
					<span className="font-bold text-orange-600 text-lg">৳{total.toLocaleString()}</span>

					{/* only mobile arrow */}
					{isMobile && <ChevronDown size={16} className={`transition-transform duration-200 ${collapsed ? 'rotate-0' : 'rotate-180'}`} />}
				</div>
			</button>

			{/* content */}
			{(!collapsed || !isMobile) && (
				<CardContent className="pt-0 px-5 pb-4">
					{/* Items */}
					<div className="space-y-3 mb-4">
						{orderSummary.items.map((item: OrderItem) => (
							<div key={item.id} className="flex items-start justify-between gap-3">
								<div className="flex gap-2.5 flex-1">
									<div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
										<Package size={18} />
									</div>

									<div>
										<p className="text-[13px] font-medium leading-tight">{item.name}</p>
										<p className="text-[11px] text-muted-foreground mt-0.5">
											{item.variant} × {item.qty}
										</p>
									</div>
								</div>

								<span className="text-[13px] font-semibold whitespace-nowrap">৳{(item.price * item.qty).toLocaleString()}</span>
							</div>
						))}
					</div>

					<Separator className="mb-3 bg-orange-100" />

					{/* Totals */}
					<div className="space-y-1.5">
						<div className="flex justify-between text-[13px]">
							<span className="text-muted-foreground">Subtotal</span>
							<span>৳{subtotal.toLocaleString()}</span>
						</div>

						<div className="flex justify-between text-[13px]">
							<span className="text-muted-foreground">Discount</span>
							<span className="text-green-600 font-medium">-৳{orderSummary.discount.toLocaleString()}</span>
						</div>

						<div className="flex justify-between text-[13px]">
							<span className="text-muted-foreground">Shipping</span>
							<span className={!shipPrice ? 'text-muted-foreground' : ''}>{shipPrice ? `৳${shipPrice}` : 'Select method'}</span>
						</div>

						<Separator className="my-2 bg-orange-100" />

						<div className="flex justify-between font-bold text-[15px]">
							<span>Total</span>
							<span className="text-orange-600">৳{total.toLocaleString()}</span>
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	);
}
