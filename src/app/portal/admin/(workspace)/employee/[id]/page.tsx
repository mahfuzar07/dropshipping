import EmployeeDetails from '@/components/pages/admin/workspace/employee/employee-profile/EmployeeDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Employees - Admin Dashboard',
};

export default function EmployeeProfileFormPage() {
    return (
			<div className="">
				<EmployeeDetails />
			</div>
		);
}
