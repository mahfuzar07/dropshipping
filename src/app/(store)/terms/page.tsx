import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import TermsPageContent from '@/components/pages/terms/TermsPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Terms & Conditions ',
	description: 'Xianmart প্ল্যাটফর্ম ব্যবহারের শর্তাবলী ও নীতিমালা।',
};

export default function TermsPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<TermsPageContent />
			</Suspense>
		</div>
	);
}
