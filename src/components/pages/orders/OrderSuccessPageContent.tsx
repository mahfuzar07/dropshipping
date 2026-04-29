'use client';

import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react';

export default function OrderSuccessPageContent() {
	const { address, orderSummary, shipping } = useCheckoutStore();

	/* ================= SAFE VALUES ================= */

	const shipPrice = shipping?.price ?? 0;
	const discount = orderSummary?.discount ?? 0;

	const subtotal = 0;

	const total = subtotal - discount + shipPrice;

	const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();

	/* ================= SAFE FALLBACKS ================= */

	const customerName = address ? 'Customer' : 'Guest';
	const email = 'your@email.com';

	const shippingLabel = shipping?.label ?? 'Not selected';

	const details = [
		['Order ID', orderId],
		['Shipping', shippingLabel],
		['Total Paid', `৳${total.toLocaleString()}`],
	];

	return (
		<div className="text-center py-2 max-w-xl mx-auto font-hanken">
			<div className="w-[72px] h-[72px] rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 text-white text-3xl shadow-md">✓</div>

			<h2 className="text-xl font-semibold mb-2">Order Confirmed!</h2>

			<p className="text-[13px] text-muted-foreground mb-5">Thank you, {customerName}! Your order has been placed successfully.</p>

			<Card className="border-violet-100 bg-violet-50/40 mb-4 text-left">
				<CardContent className="pt-4 pb-2 px-4">
					{details.map(([label, value], i) => (
						<div key={label}>
							<div className="flex justify-between py-2">
								<span className="text-sm text-muted-foreground">{label}</span>
								<span className={`text-sm font-semibold ${label === 'Total Paid' ? 'text-green-600 text-lg' : ''}`}>{value}</span>
							</div>
							{i < details.length - 1 && <Separator className="bg-violet-100" />}
						</div>
					))}
				</CardContent>
			</Card>

			<div className="flex items-center gap-2.5 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl p-3.5 text-left mb-5">
				<Mail size={16} />
				<p>
					A confirmation email has been sent to <strong>{email}</strong>
				</p>
			</div>
		</div>
	);
}
