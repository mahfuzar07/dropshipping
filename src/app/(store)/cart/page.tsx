import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import CartPageContent from '@/components/pages/cart/CartPageContent';
import { Suspense } from 'react';
import { Metadata } from 'next';
// Meta Data
export const metadata: Metadata = {
	title: 'Cart',
};

export default function CartPage() {
	return (
		<div className="container max-w-7xl mx-auto py-3 px-3">
			<Suspense fallback={<LoadingSkeleton />}>
				<CartPageContent />
			</Suspense>
		</div>
	);
}
