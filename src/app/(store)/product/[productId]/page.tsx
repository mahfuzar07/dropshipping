import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import ProductDetailsPageContent from '@/components/pages/product-details/ProductDetailsPageContent';
import { getProductDetails } from '@/lib/api/product';

import { Metadata } from 'next';
import { Suspense } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ productId: number }> }): Promise<Metadata> {
	const { productId } = await params;
	const product = await getProductDetails(productId);

	if (!product) {
		return {
			title: 'Product Not Found',
			robots: { index: false, follow: false },
		};
	}

	const item = product.item;
	const description = item.desc ? item.desc.replace(/<[^>]*>/g, '').slice(0, 160) : `Buy ${item.title} at the best price.`;
	const image = item.pic_url || item.item_imgs?.[0]?.url;

	return {
		title: item.title,
		description,
		keywords: item.props
			?.map((p) => p.value)
			.filter(Boolean)
			.join(', '),
		alternates: {
			canonical: `/products/${productId}`,
		},
		openGraph: {
			title: item.title,
			description,
			type: 'website',
			images: image ? [{ url: image, width: 800, height: 800, alt: item.title }] : undefined,
		},

		robots: {
			index: true,
			follow: true,
		},
	};
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ productId: number }> }) {
	const { productId } = await params;
	const product = await getProductDetails(productId);

	return (
		<div className="bg-slate-50">
			<div className="container mx-auto md:py-8 py-0 px-3">
				<Suspense fallback={<LoadingSkeleton />}>
					<ProductDetailsPageContent productId={productId} initialProduct={product} />
				</Suspense>
			</div>
		</div>
	);
}
