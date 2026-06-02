import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import TrackOrderPageContent from '@/components/pages/customer/orders/TrackOrderPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

// Meta Data
export const metadata: Metadata = {
	title: 'Order Tracking ',
};
export default function TrackOrderPage() {
	return (
		<>
			<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3 mb-20">
				<Suspense fallback={<LoadingSkeleton />}>
					<TrackOrderPageContent />
				</Suspense>
			</div>
		</>
	);
}
