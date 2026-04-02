import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ProfilePageContent from '@/components/pages/customer/profile/ProfilePageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'Dashboard',
};

export default function CustomerPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<ProfilePageContent />
			</Suspense>
		</div>
	);
}
