import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import PrivacyPolicyPageContent from '@/components/pages/policy/PrivacyPolicyPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Privacy Policy ',
	description: 'Xianmart কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার ও সংরক্ষণ করে, তার বিস্তারিত বিবরণ।',
};

export default function PrivacyPolicyPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<PrivacyPolicyPageContent/>
			</Suspense>
		</div>
	);
}
