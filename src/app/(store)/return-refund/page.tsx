import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ReturnRefundPolicyPageContent from '@/components/pages/return/ReturnRefundPolicyPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Return & Refund Policy ',
	description: 'Xianmart-এর পণ্য ফেরত ও রিফান্ড নীতিমালা — কোন পরিস্থিতিতে রিটার্ন প্রযোজ্য এবং কীভাবে আবেদন করবেন।',
};

export default function ReturnRefundPolicyPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
			<ReturnRefundPolicyPageContent/>
			</Suspense>
		</div>
	);
}
