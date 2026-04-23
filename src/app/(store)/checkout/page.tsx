import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import CheckoutPageContent from '@/components/pages/checkout/CheckoutPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'Checkout',
};

export default function CheckoutPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<CheckoutPageContent />
			</Suspense>
		</div>
	);
}
