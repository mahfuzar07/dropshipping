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

/* ================= COMPONENT ================= */

export default function Step3Payment() {
	const { payment, setPayment, nextStep, prevStep } = useCheckoutStore();
	const router = useRouter();
	const [errors, setErrors] = useState<ErrorState>({});
	const [payType, setPayType] = useState<PayType>('card');

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
			// fake API simulation
			const isSuccess = true; // replace with real API

			if (!isSuccess) {
				router.push('/order/failed');
				return;
			}

			nextStep();
			router.push('/order/success');
		} catch (err) {
			router.push('/order/failed');
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
									? 'border-orange-300 border-2 bg-orange-50  text-orange-600'
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
				<Shield strokeWidth={3} size={14} className="fill-orange-300 text-orange-300 shrink-0" />

				<p className="text-xs text-orange-400">Your payment info is encrypted and never stored</p>
			</div>

			<div className="flex gap-2.5 mt-6">
				<Button variant="outline" className="flex-1 h-12" onClick={prevStep}>
					<MoveLeft /> Back
				</Button>

				<Button className="flex-[2] h-12 rounded-xl bg-orange-300 hover:bg-orange-500 text-white font-semibold tracking-wide" onClick={handleNext}>
					Place Order
				</Button>
			</div>
		</div>
	);
}
