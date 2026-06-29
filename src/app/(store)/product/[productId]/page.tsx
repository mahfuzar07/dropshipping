import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ProductDetailsPageContent from '@/components/pages/product-details/ProductDetailsPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';


// export async function generateMetadata({ params }: { params: Promise<{ productId: string }> }): Promise<Metadata> {
// 	const { productId } = await params;

// 	return {
// 		title: slugToTitle(productId),
// 	};
// }

export default async function ProductDetailsPage({ params }: { params: Promise<{ productId: number }> }) {
	const { productId } = await params;

	return (
		<div className="bg-slate-50">
			<div className="container mx-auto md:py-8 py-0 px-3">
				<Suspense fallback={<LoadingSkeleton />}>
					<ProductDetailsPageContent productId={productId} />
				</Suspense>
			</div>
		</div>
	);
}
