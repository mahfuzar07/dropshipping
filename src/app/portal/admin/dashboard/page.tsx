import DashboardPageContent from '@/components/pages/admin/dashboard/DashboardPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard - Admin Dashboard',
};

export default function AdminDashboardPage() {
	return (
		<div className="">
			<DashboardPageContent />
		</div>
	);
}
