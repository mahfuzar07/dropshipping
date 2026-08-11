import ContactPageContent from '@/components/pages/contact/ContactPageContent';
import { Metadata } from 'next';
import React, { Suspense } from 'react';
import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';

export const metadata: Metadata = {
	title: 'Contact Us',
	description: 'Xianmart-এর সাথে যোগাযোগ করুন — অর্ডার, শিপিং, রিফান্ড কিংবা যেকোনো প্রশ্নের জন্য আমরা আছি আপনার পাশে।',
};

export default function ContactPage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<ContactPageContent />
			</Suspense>
		</div>
	);
}
