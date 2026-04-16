import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import OrderDetailsPageContent from '@/components/pages/customer/orders/OrderDetailsPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'Order Details',
};

export default async function OrdersPage({ params }: { params: Promise<{ order_id: number | string }> }) {
	const { order_id } = await params;
	return (
		<div className="">
			<Suspense fallback={<LoadingSkeleton />}>
				<OrderDetailsPageContent orderId={String(order_id)} />
			</Suspense>
		</div>
	);
}
