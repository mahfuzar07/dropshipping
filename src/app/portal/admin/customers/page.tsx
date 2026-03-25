import CustomersTable from '@/components/pages/admin/customers/CustomersTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Customers - Admin Dashboard',
};

export default function CustomerPage() {
	return (
		<div className="">
			<CustomersTable />
		</div>
	);
}
