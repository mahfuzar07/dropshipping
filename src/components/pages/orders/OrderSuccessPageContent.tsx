'use client';

import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, ShieldCheck, CreditCard, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function OrderSuccessPageContent() {
	const { address, orderSummary, shipping, placedOrder } = useCheckoutStore();
	const { user } = useAuthStore();

	/* ================= VALUES & FALLBACKS ================= */

	const orderId = placedOrder?.order_number || 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();
	const paymentMethod = placedOrder?.payment_method === 'card' ? 'Online Card Payment' : 'Cash on Delivery (COD)';

	const total = placedOrder?.total_price
		? Number(placedOrder.total_price)
		: (placedOrder?.items || []).reduce((sum: number, item: any) => sum + (Number(item.item_total) || 0), 0) +
			(shipping?.price ?? 0) -
			(orderSummary?.discount ?? 0);

	const shipPrice = placedOrder?.shipping_charge ? Number(placedOrder.shipping_charge) : (shipping?.price ?? 0);
	const discount = placedOrder?.discount ? Number(placedOrder.discount) : (orderSummary?.discount ?? 0);
	const subtotal = total - shipPrice + discount;

	const customerName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : address ? 'Customer' : 'Guest';

	const email = user?.email || 'your@email.com';
	const shippingLabel = placedOrder?.shipping_method
		? placedOrder.shipping_method === 'air'
			? 'By Air Shipping'
			: 'By Sea Shipping'
		: (shipping?.label ?? 'Not selected');

	const payNow = Math.round(total * 0.7);
	const payOnDelivery = total - payNow;

	const details = [
		['Order ID', orderId],
		['Shipping Method', shippingLabel],
		['Payment Type', paymentMethod],
		['Subtotal', `৳${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
		['Shipping Charge', `৳${shipPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
		...(discount > 0 ? [['Discount Code', `-৳${discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`]] : []),
		['Total Order Amount', `৳${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
	];

	return (
		<div className="text-center py-6 max-w-xl mx-auto font-hanken">
			<div className="w-[72px] h-[72px] rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4 text-white text-3xl shadow-md border-4 border-white animate-bounce">
				✓
			</div>

			<h2 className="text-2xl font-bold mb-2 tracking-tight text-slate-800">Order Confirmed!</h2>

			<p className="text-[14px] text-muted-foreground mb-6">
				Thank you, <span className="font-semibold text-slate-800">{customerName}</span>! Your order has been placed successfully.
			</p>

			<Card className="border-orange-100 bg-orange-50/20 mb-6 text-left shadow-xs rounded-xl overflow-hidden">
				<CardContent className="pt-5 pb-3 px-5">
					<h3 className="font-semibold text-sm text-slate-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
						<ShoppingBag size={14} className="text-primary" />
						Receipt Details
					</h3>
					{details.map(([label, value], i) => {
						const isTotal = label === 'Total Order Amount';
						return (
							<div key={label}>
								<div className="flex justify-between py-2.5 items-center">
									<span className={`text-sm ${isTotal ? 'font-bold text-slate-800' : 'text-muted-foreground'}`}>{label}</span>
									<span className={`text-sm font-semibold text-slate-800 ${isTotal ? 'text-primary text-base font-extrabold' : ''}`}>{value}</span>
								</div>
								{i < details.length - 1 && <Separator className="bg-orange-100/50" />}
							</div>
						);
					})}

					{/* Split Payment Calculations summary */}
					<div className="mt-4 bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5 text-xs">
						<div className="flex justify-between text-slate-700">
							<span className="flex items-center gap-1">
								<CreditCard size={12} className="text-slate-500" />
								Immediate Payment (70% Paid)
							</span>
							<span className="font-bold text-slate-800">৳{payNow.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span className="flex items-center gap-1">
								<Truck size={12} className="text-slate-500" />
								Payment upon Delivery (30% COD)
							</span>
							<span className="font-bold text-slate-800">৳{payOnDelivery.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex items-start gap-3 text-emerald-800 text-sm bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-left mb-6">
				<Mail size={16} className="mt-0.5 shrink-0 text-emerald-600 animate-pulse" />
				<div>
					<p className="font-semibold text-emerald-900">Email Confirmation Sent</p>
					<p className="text-xs text-emerald-800/80 mt-0.5">
						We have sent a detailed order receipt and billing information to <strong>{email}</strong>
					</p>
				</div>
			</div>

			<div className="flex gap-3 justify-center">
				<Button asChild className="bg-primary hover:bg-orange-600 text-white font-semibold px-6 rounded-lg">
					<Link href="/customer/orders">View My Orders</Link>
				</Button>
				<Button asChild variant="outline" className="px-6 rounded-lg">
					<Link href="/">Continue Shopping</Link>
				</Button>
			</div>
		</div>
	);
}
