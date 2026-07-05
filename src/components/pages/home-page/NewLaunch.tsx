'use client';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export type ProductResponse = {
	items: {
		page: number;
		page_count: number;
		page_size: number;
		real_total_results: number;
		total_results: number;
		item: Product[];
	};
};

export type Product = {
	num_iid: string;
	detail_url: string;
	title: string;
	url: string;
	pic_url: string;
	tag_percent: string;
	price: number;
	promotion_price: number;
	sales: number;
};

export default function NewLaunch() {
	const [filter, setFilter] = useState({
		page: 1,
		limit: 20,
		search: '',
		category: '',
		brand: '',
		minPrice: undefined as number | undefined,
		maxPrice: undefined as number | undefined,
		sortBy: '',
	});

	const filterParams = useMemo(
		() => ({
			page: filter.page,
			limit: filter.limit,
			...(filter.search.trim() && { search: filter.search.trim() }),
			...(filter.category && { category: filter.category }),
			...(filter.brand && { brand: filter.brand }),
			...(filter.minPrice !== undefined && { minPrice: filter.minPrice }),
			...(filter.maxPrice !== undefined && { maxPrice: filter.maxPrice }),
			...(filter.sortBy && { sortBy: filter.sortBy }),
		}),
		[filter],
	);

	const { data, isLoading } = useAppData<ProductResponse, 'single'>({
		key: [QueriesKey.NEW_LAUNCH_PRODUCTS, filterParams],
		api: apiEndpoint.products.publicProducts,
		queryParams: filterParams,
		auth: false,
		responseType: 'single',
		refetchOnMount: true,
		staleTime: 0,
		enabled: true,
		clientOnly: true,
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	/* ================================================================
	   ACCUMULATED PRODUCTS + PAGINATION STATE
	   ================================================================ */
	const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const lastRenderedPageRef = useRef<number>(0);

	useEffect(() => {
		const items: Product[] = data?.items?.item ?? [];
		const currentPage = filterParams.page;
		const totalPages = data?.items?.page_count ?? 1;

		if (!items.length) return;
		if (currentPage === lastRenderedPageRef.current) return;
		lastRenderedPageRef.current = currentPage;

		setAccumulatedProducts((prev) => {
			if (currentPage === 1) return items;
			const seen = new Set(prev.map((p) => p.num_iid));
			return [...prev, ...items.filter((p) => !seen.has(p.num_iid))];
		});

		setHasMore(currentPage < totalPages);
	}, [data]);

	/* ================================================================
	   INFINITE SCROLL
	   ================================================================ */
	const isFetchingRef = useRef(isLoading);
	const hasMoreRef = useRef(hasMore);

	useEffect(() => {
		isFetchingRef.current = isLoading;
	}, [isLoading]);
	useEffect(() => {
		hasMoreRef.current = hasMore;
	}, [hasMore]);

	const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
		if (!node) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
					setFilter((prev) => ({ ...prev, page: prev.page + 1 }));
				}
			},
			{ threshold: 0.1 },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	const isInitialLoading = isLoading && accumulatedProducts.length === 0;
	const isLoadingMore = isLoading && accumulatedProducts.length > 0;

	return (
		<div className="bg-gray-100 py-8">
			<div className="container mx-auto px-4">
				{/* Title */}
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">NEW LAUNCHES</h2>

				{/* Initial skeleton */}
				{isInitialLoading ? (
					<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
						{Array.from({ length: 10 }).map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</div>
				) : (
					<>
						{/* Product Grid */}
						<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
							{accumulatedProducts.map((product) => (
								<ProductCard product={product} key={product.num_iid} />
							))}
						</div>

						{/* Infinite scroll sentinel */}
						<div ref={loadMoreRef} className="mt-6 min-h-[80px]">
							{isLoadingMore && (
								<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
									{Array.from({ length: 5 }).map((_, i) => (
										<ProductCardSkeleton key={`more-${i}`} />
									))}
								</div>
							)}
						</div>
					</>
				)}
			</div>
		</div>
	);
}
