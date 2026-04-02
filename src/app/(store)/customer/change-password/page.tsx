import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ChangePassword from '@/components/pages/customer/change-password/ChangePassword';

import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'Reset Password - Customer Account',
};

export default function ChangePasswordPage() {
	return (
		<div className="">
			<Suspense fallback={<LoadingSkeleton />}>
				<ChangePassword />
			</Suspense>
		</div>
	);
}
