import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ShippingChargePageContent from '@/components/pages/shipping-charge/ShippingChargePageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Customs & Shipping Charge',
	description: 'Xianmart-এ কাস্টমস ও শিপিং চার্জ কীভাবে নির্ধারিত হয় এবং ওজন হিসাব করা হয়, তার বিস্তারিত ব্যাখ্যা।',
};

export default function ShippingChargePage() {
	return (
		<div className="container max-w-7xl mx-auto md:py-8 py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<ShippingChargePageContent />
			</Suspense>
		</div>
	);
}
