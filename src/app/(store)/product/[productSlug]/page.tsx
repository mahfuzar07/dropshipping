import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ProductDetailsPageContent from '@/components/pages/product-details/ProductDetailsPageContent';
import { Metadata } from 'next';
import { Suspense } from 'react';

function slugToTitle(slug: string) {
	return slug
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ productSlug: string }> }): Promise<Metadata> {
	const { productSlug } = await params;

	return {
		title: slugToTitle(productSlug),
	};
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ productSlug: string }> }) {
	const { productSlug } = await params;

	return (
		<div className="bg-slate-50">
			<div className="container mx-auto md:py-8 py-0 px-3">
				<Suspense fallback={<LoadingSkeleton />}>
					<ProductDetailsPageContent productSlug={productSlug} />
				</Suspense>
			</div>
		</div>
	);
}
