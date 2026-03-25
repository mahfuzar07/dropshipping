import CouponsList from '@/components/pages/admin/coupons/CouponsList';
import { Metadata } from 'next';


// Meta Data
export const metadata: Metadata = {
	title: 'Coupons - Admin Dashboard',
	description: 'Manage all coupons',
};

export default function CouponsPage() {
	return (
		<div className="">
			<CouponsList />
		</div>
	);
}
