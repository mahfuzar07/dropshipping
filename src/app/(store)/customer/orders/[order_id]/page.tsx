import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import OrderDetailsPageContent from '@/components/pages/customer/orders/OrderDetailsPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';


export async function generateMetadata({ params }: { params: Promise<{ order_id: string }> }): Promise<Metadata> {
	const { order_id } = await params;

	return {
		title: `Order #${order_id}`,
		description: `View details for Order #${order_id}.`,
		robots: {
			index: false,
			follow: false,
		},
	};
}

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
