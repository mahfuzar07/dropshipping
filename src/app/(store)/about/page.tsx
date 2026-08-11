import { Metadata } from 'next';
import React, { Suspense } from 'react';
import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import AboutPageContent from '@/components/pages/about/AboutPageContent';

export const metadata: Metadata = {
	title: 'About Us',
	description: 'Xianmart সম্পর্কে জানুন — চীন থেকে বাংলাদেশে নির্ভরযোগ্য, সহজ ও নিরাপদ পণ্য সোর্সিং প্ল্যাটফর্ম।',
};

export default function AboutPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<AboutPageContent />
			</Suspense>
		</div>
	);
}
