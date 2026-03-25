import CustomerDetails from '@/components/pages/admin/customers/customer-details/CustomerDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Customers Details - Admin Dashboard',
};

export default function CustomerPage() {
	return <div className="">
		<CustomerDetails/>
	</div>;
}
