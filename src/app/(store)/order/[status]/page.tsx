import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';

import OrderSuccessPageContent from '@/components/pages/orders/OrderSuccessPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'Order | Success',
};

export default function OrderSuccessPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<OrderSuccessPageContent />
			</Suspense>
		</div>
	);
}
