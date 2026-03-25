import OrdersTable from '@/components/pages/admin/orders/OrdersTable';

import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Orders - Admin Dashboard',
};

type Order = {
	id: string;
	date: string;
	customer: string;
	priority: 'Normal' | 'High';
	total: string;
	payment: 'Paid' | 'Unpaid' | 'Refund';
	items: number;
	delivery: string | null;
	status: 'Draft' | 'Packaging' | 'Completed' | 'Canceled';
};

export default function OrdersPage() {
	const ordersData: Order[] = [
		{
			id: '#583488/80',
			date: 'Apr 23, 2024',
			customer: 'Gail C. Anderson',
			priority: 'Normal',
			total: '$1,230.00',
			payment: 'Unpaid',
			items: 4,
			delivery: null,
			status: 'Draft',
		},
		{
			id: '#456754/80',
			date: 'Apr 20, 2024',
			customer: 'Jung S. Ayala',
			priority: 'Normal',
			total: '$987.00',
			payment: 'Paid',
			items: 2,
			delivery: null,
			status: 'Packaging',
		},
		{
			id: '#578246/80',
			date: 'Apr 19, 2024',
			customer: 'David A. Arnold',
			priority: 'High',
			total: '$1,478.00',
			payment: 'Paid',
			items: 5,
			delivery: '#D-57837678',
			status: 'Completed',
		},
		{
			id: '#348930/80',
			date: 'Apr 04, 2024',
			customer: 'Cecile D. Gordon',
			priority: 'Normal',
			total: '$720.00',
			payment: 'Refund',
			items: 4,
			delivery: null,
			status: 'Canceled',
		},
		{
			id: '#391367/80',
			date: 'Apr 02, 2024',
			customer: 'William Moreno',
			priority: 'Normal',
			total: '$1,909.00',
			payment: 'Paid',
			items: 6,
			delivery: '#D-89734235',
			status: 'Completed',
		},
	];
	return (
		<div className="">
			<OrdersTable data={ordersData} />
		</div>
	);
}
