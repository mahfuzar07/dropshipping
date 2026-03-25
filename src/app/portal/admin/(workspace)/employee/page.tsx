import EmployeesTable from '@/components/pages/admin/workspace/employee/EmployeesTable';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Employees - Admin Dashboard',
};

export default function CustomerPage() {
	return (
		<div className="">
			<EmployeesTable />
		</div>
	);
}
