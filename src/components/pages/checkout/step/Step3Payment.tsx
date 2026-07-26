'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import FormField from '../../../common/elements/form-element/FormField';
import { CreditCard, MoveLeft, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';

/* ================= TYPES ================= */

type PayType = 'card' | 'cod';

type PaymentKeys = 'cardName' | 'cardNumber' | 'expiry' | 'cvv';

type ErrorState = Partial<Record<PaymentKeys, string>>;

/* ================= CONST ================= */

const PAY_METHODS: { id: PayType; label: string; icon: string }[] = [
	{ id: 'card', label: 'Card', icon: '💳' },

	{ id: 'cod', label: 'COD', icon: '💵' },
];

/* ================= HELPERS ================= */

const formatCard = (value: string) =>
	value
		.replace(/\D/g, '')
		.replace(/(.{4})/g, '$1 ')
		.trim();

const formatExpiry = (value: string) => {
	const v = value.replace(/\D/g, '');
	if (v.length <= 2) return v;
	return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
};

type CartResponse = {
	id: number;
	items: any[];
	total_price: number;
	created_at: string;
	updated_at: string;
};

type OrderPayload = {
	shipping_charge: number;
	address_id: number;
	payment_method?: string;
	coupon_code?: string;
};

/* ================= COMPONENT ================= */

export default function Step3Payment() {
	const { payment, setPayment, nextStep, prevStep, address, shipping, appliedCoupon, setAppliedCoupon, setDiscount, setPlacedOrder } =
		useCheckoutStore();
	const router = useRouter();
	const [errors, setErrors] = useState<ErrorState>({});
	const [payType, setPayType] = useState<PayType>('card');

	const { data, isLoading } = useAppData<CartResponse, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.GET_CART(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to load cart'),
	});

	const { create: addNewOrder, isMutating: isAddressLoading } = useAppData<OrderPayload, 'single'>({
		key: [QueriesKey.NEW_ORDERS],
		api: apiEndpoint.orders.ORDERS_CREATE(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address added successfully!');
		},

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	console.log('Cart data in Step 3:', data);
	console.log('Cart data address:', address);
	console.log('Cart data shipping:', shipping);

	const validate = (): ErrorState => {
		if (payType !== 'card') return {};

		const e: ErrorState = {};

		if (!payment.cardName.trim()) e.cardName = 'Required';
		if (payment.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter 16-digit card number';
		if (!payment.expiry || payment.expiry.length < 5) e.expiry = 'MM/YY required';
		if (!payment.cvv || payment.cvv.length < 3) e.cvv = '3-digit CVV';

		return e;
	};

	const handleNext = async () => {
		const e = validate();

		if (Object.keys(e).length) {
			setErrors(e);
			return; // ❗ শুধু UI error
		}

		try {
			const dynamicShippingCost = ((data as any)?.data || []).reduce((sum: number, item: any) => {
				const SHIPPING_RATES = { air: 780, sea: 170 };
				const method = (item.shipping_method as 'air' | 'sea') || 'air';
				const rate = SHIPPING_RATES[method];
				return (
					sum +
					(item.variants || []).reduce((s: number, v: any) => {
						const qty =
							typeof v?.quantity === 'number'
								? v.quantity
								: v?.quantity && typeof v.quantity === 'object'
									? Object.values(v.quantity).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0)
									: 0;
						const weight = Number(v.weight || 0.5);
						return s + qty * weight * rate;
					}, 0)
				);
			}, 0);

			const payload: OrderPayload = {
				shipping_charge: shipping?.price ?? dynamicShippingCost,
				address_id: (typeof address === 'number' ? address : (address as any)?.id) ?? 0,
				payment_method: payType,
				coupon_code: appliedCoupon?.code || '',
			};

			console.log('Order payload:', payload);

			const response: any = await addNewOrder({ payload });

			if (!response || !response.success || !Array.isArray(response.data) || response.data.length === 0) {
				router.push('/order/failed');
				return;
			}

			const createdOrder = response.data[0];
			setPlacedOrder(createdOrder);

			// Clear coupon state on success
			setAppliedCoupon(null);
			setDiscount(0);

			nextStep();
			router.push('/order/success');
		} catch (err) {
			// router.push('/order/failed');
		}
	};
	const cardField = (key: PaymentKeys, formatter?: (v: string) => string) => ({
		id: key,
		value: payment[key] ?? '',
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			let v = e.target.value;
			if (formatter) v = formatter(v);

			setPayment({ [key]: v });
			setErrors((p) => ({ ...p, [key]: '' }));
		},
		className: errors[key] ? 'border-red-400 focus-visible:ring-red-300' : '',
	});

	return (
		<div>
			<h1 className="text-md font-semibold text-foreground mb-5 flex items-center gap-1.5">
				<CreditCard size={16} className=" shrink-0" />
				Secure Payment
			</h1>

			{/* Payment method tabs */}
			<div className="grid grid-cols-4 gap-2 mb-5">
				{PAY_METHODS.map((m) => (
					<button
						key={m.id}
						onClick={() => setPayType(m.id)}
						className={`
              flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-center
              border transition-all duration-200 text-[11px] font-semibold cursor-pointer
              ${
								payType === m.id
									? 'border-primary/50 border-2 bg-orange-50  text-primary'
									: 'border-border border-2 bg-background text-muted-foreground hover:bg-muted/40'
							}
            `}
					>
						<span className="text-lg">{m.icon}</span>
						{m.label}
					</button>
				))}
			</div>

			{/* Card form */}
			{payType === 'card' && (
				<div className="space-y-4">
					<FormField label="Cardholder Name" htmlFor="cardName" error={errors.cardName}>
						<Input {...cardField('cardName')} placeholder="Rahim Uddin" />
					</FormField>

					<FormField label="Card Number" htmlFor="cardNumber" error={errors.cardNumber}>
						<div className="relative">
							<Input {...cardField('cardNumber', formatCard)} placeholder="0000 0000 0000 0000" maxLength={19} />
							<span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none">
								{payment.cardNumber?.startsWith('4') ? '💙' : payment.cardNumber?.startsWith('5') ? '🔴' : '💳'}
							</span>
						</div>
					</FormField>

					<div className="grid grid-cols-2 gap-3">
						<FormField label="Expiry" htmlFor="expiry" error={errors.expiry}>
							<Input {...cardField('expiry', formatExpiry)} placeholder="MM/YY" maxLength={5} />
						</FormField>

						<FormField label="CVV" htmlFor="cvv" error={errors.cvv}>
							<Input {...cardField('cvv')} placeholder="•••" maxLength={4} type="password" />
						</FormField>
					</div>
				</div>
			)}

			{/* COD */}
			{payType === 'cod' && (
				<Card className="border-green-200 bg-green-50">
					<CardContent className="pt-5 text-center">
						<div className="text-4xl mb-3">💵</div>
						<p className="font-semibold text-green-800 mb-1.5">Cash on Delivery</p>
						<p className="text-[13px] text-green-700">Pay when your order arrives.</p>
					</CardContent>
				</Card>
			)}

			<div className="flex my-5 items-center gap-1 bg-orange-50 rounded px-4 py-2.5 border border-orange-100">
				<Shield strokeWidth={3} size={14} className="fill-orange-300 text-primary shrink-0" />

				<p className="text-xs text-primary">Your payment info is encrypted and never stored</p>
			</div>

			<div className="flex gap-2.5 mt-6">
				<Button variant="outline" className="flex-1 h-12" onClick={prevStep}>
					<MoveLeft /> Back
				</Button>

				<Button className="flex-[2] h-12 rounded-xl bg-primary hover:bg-primary/80 text-white font-semibold tracking-wide" onClick={handleNext}>
					Place Order
				</Button>
			</div>
		</div>
	);
}
