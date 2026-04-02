import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import WishlistPageContent from '@/components/pages/customer/wishlist/WishlistPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';
// Meta Data
export const metadata: Metadata = {
	title: 'My Wishlist',
};

export default function WishlistPage() {
	return (
		<div className="">
			<Suspense fallback={<LoadingSkeleton />}>
				<WishlistPageContent />
			</Suspense>
		</div>
	);
}
