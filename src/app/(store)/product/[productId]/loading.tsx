import ProductDetailsSkeleton from '@/components/common/loader/ProductDetailsSkeleton';
import React from 'react';

export default function loading() {
	return (
		<div className="container mx-auto md:py-8 py-0 px-3">
			<ProductDetailsSkeleton />
		</div>
	);
}
