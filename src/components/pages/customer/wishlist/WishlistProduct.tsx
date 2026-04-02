'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/common/elements/product-card/ProductCard';

const PAGE_SIZE = 4;

export default function WishlistProduct({ products }: { products: any[] }) {
	const [page, setPage] = useState(1);

	const visibleProducts = useMemo(() => {
		return products.slice(0, page * PAGE_SIZE);
	}, [products, page]);

	const hasMore = visibleProducts.length < products.length;

	if (!products.length) {
		return <p className="text-center text-muted-foreground mt-20">Your wishlist is empty</p>;
	}

	return (
		<div>
			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
				{visibleProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{hasMore && (
				<div className="text-center mt-12">
					<Button variant="outline" size="lg" onClick={() => setPage((p) => p + 1)}>
						View More Products
					</Button>
				</div>
			)}
		</div>
	);
}
