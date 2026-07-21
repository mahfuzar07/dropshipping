import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ShopDetailsPageContent from '@/components/pages/shop-details/ShopDetailsPageContent';

import { Suspense } from 'react';
import { Metadata } from 'next';
// Meta Data
export const metadata: Metadata = {
	title: 'Shop Details',
};

export default function ShopDetailsPage() {
	return (
		<div className="container max-w-7xl mx-auto py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<ShopDetailsPageContent />
			</Suspense>
		</div>
	);
}
