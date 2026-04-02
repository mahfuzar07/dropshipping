import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import AddressPageContent from '@/components/pages/customer/address/AddressPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'My Address Book',
};

export default function AddressBookPage() {
	return (
		<div className="">
			<Suspense fallback={<LoadingSkeleton />}>
				<AddressPageContent />
			</Suspense>
		</div>
	);
}
