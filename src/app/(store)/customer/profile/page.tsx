import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ProfilePageContent from '@/components/pages/customer/profile/ProfilePageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'My Profile',
};

export default function ProfilePage() {
	return (
		<div className="">
			<Suspense fallback={<LoadingSkeleton />}>
				<ProfilePageContent />
			</Suspense>
		</div>
	);
}
