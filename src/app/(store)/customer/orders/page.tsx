import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import OrdersPageContent from '@/components/pages/customer/orders/OrdersPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'My Orders',
};

export default function OrdersPage() {
	return (
		<div className="">
			<Suspense fallback={<LoadingSkeleton />}>
				<OrdersPageContent />
			</Suspense>
		</div>
	);
}
