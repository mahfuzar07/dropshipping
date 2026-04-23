'use client';
import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail } from 'lucide-react';

const SHIPPING_METHODS = [
	{
		id: 'std',
		label: 'Standard Delivery',
		duration: '5–7 business days',
		price: 60,
		icon: '📦',
	},
	{
		id: 'exp',
		label: 'Express Delivery',
		duration: '2–3 business days',
		price: 150,
		icon: '⚡',
	},
	{
		id: 'ovn',
		label: 'Overnight Delivery',
		duration: 'Next business day',
		price: 350,
		icon: '🚀',
	},
];
export default function OrderSuccessPageContent() {
	const { address, orderSummary, shipping } = useCheckoutStore();
	const shipPrice = SHIPPING_METHODS.find((m) => m.id === shipping.method)?.price || 0;
	const subtotal = orderSummary.items.reduce((a, i) => a + i.price * i.qty, 0);
	const total = subtotal - orderSummary.discount + shipPrice;
	const orderId = 'ORD-' + Math.random().toString(36).slice(2, 8).toUpperCase();

	const details = [
		['Order ID', orderId],
		['Delivery to', `${address.city}, ${address.country}`],
		['Shipping', SHIPPING_METHODS.find((m) => m.id === shipping.method)?.label || ''],
		['Total Paid', `৳${total.toLocaleString()}`],
	];

	return (
		<div className="text-center py-2 max-w-xl mx-auto font-hanken">
			<div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-4 text-white text-3xl shadow-md">
				✓
			</div>
			<h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
				Order Confirmed!
			</h2>
			<p className="text-[13px] text-muted-foreground mb-5">Thank you, {address.firstName}! Your order has been placed successfully.</p>

			<Card className="border-violet-100 bg-violet-50/40 mb-4 text-left">
				<CardContent className="pt-4 pb-2 px-4">
					{details.map(([label, value], i) => (
						<div key={label}>
							<div className="flex justify-between py-2">
								<span className="text-sm text-muted-foreground">{label}</span>
								<span className={`text-sm font-semibold ${label === 'Total Paid' ? 'text-green-600 font-bold !text-lg' : 'text-foreground'}`}>
									{value}
								</span>
							</div>
							{i < details.length - 1 && <Separator className="bg-violet-100" />}
						</div>
					))}
				</CardContent>
			</Card>

			<div className="flex items-center gap-2.5 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl p-3.5 text-left mb-5">
				<span className="text-base">
					<Mail size={16} />
				</span>
				<p className="text-green-700">
					A confirmation email has been sent to <strong>{address.email}</strong>
				</p>
			</div>
		</div>
	);
}
