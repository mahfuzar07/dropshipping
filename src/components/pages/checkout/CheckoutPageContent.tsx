'use client';

import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { Card, CardContent } from '@/components/ui/card';

import StepIndicator from './StepIndicator';
import Step1Address from './step/Step1Address';
import Step2Shipping from './step/Step2Shipping';
import Step3Payment from './step/Step3Payment';
import OrderSummary from './OrderSummary';

export default function CheckoutPageContent() {
	const step = useCheckoutStore((s) => s.step);

	return (
		<div className="min-h-screen py-6 md:py-10 px-3 md:px-6 bg-background">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="text-center mb-6 md:mb-10">
					<h1 className="text-2xl md:text-4xl font-semibold tracking-tight">Checkout</h1>
					<p className="text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wider uppercase">Fast · Secure · Reliable</p>
				</div>

				{/* Step indicator */}
				<div className="mb-6">
					<StepIndicator />
				</div>

				{/* Layout */}
				<div className="grid gap-6 md:grid-cols-3 lg:grid-cols-12">
					{/* Order Summary (Mobile first) */}
					<div className="md:col-span-3 lg:col-span-5 order-1 md:order-2">
						<div className="md:sticky md:top-6">
							<OrderSummary />
						</div>
					</div>

					{/* Form Section */}
					<div className="md:col-span-3 lg:col-span-7 order-2 md:order-1 border border-border rounded-xl p-3 md:p-5 shadow">
						{step === 1 && <Step1Address />}
						{step === 2 && <Step2Shipping />}
						{step === 3 && <Step3Payment />}
					</div>
				</div>
			</div>
		</div>
	);
}
