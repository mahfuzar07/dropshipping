'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/common/elements/product-card/ProductCard';

const PAGE_SIZE = 4;

interface WishlistProductProps {
	products: any[];

	onChange?: () => void;
}

export default function WishlistProduct({ products }: WishlistProductProps) {
	const [page, setPage] = useState(1);

	useEffect(() => {
		const maxPage = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
		setPage((p) => Math.min(p, maxPage));
	}, [products.length]);

	const visibleProducts = useMemo(() => products.slice(0, page * PAGE_SIZE), [products, page]);

	const remaining = products.length - visibleProducts.length;
	const hasMore = remaining > 0;

	if (!products.length) {
		return <p className="text-center text-muted-foreground mt-20">Your wishlist is empty</p>;
	}

	return (
		<div>
			<p className="text-sm text-muted-foreground mb-4">
				Showing {visibleProducts.length} of {products.length} product{products.length !== 1 ? 's' : ''}
			</p>

			<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
				{visibleProducts.map((product) => (
					<ProductCard key={product.num_iid} product={product} />
				))}
			</div>

			{hasMore && (
				<div className="text-center mt-12">
					<Button variant="outline" size="lg" onClick={() => setPage((p) => p + 1)}>
						View More Products ({remaining} left)
					</Button>
				</div>
			)}
		</div>
	);
}
