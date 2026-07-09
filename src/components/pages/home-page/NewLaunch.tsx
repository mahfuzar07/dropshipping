'use client';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import ProductPagination from '@/components/common/elements/Productpagination';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { useMemo, useState } from 'react';
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
	   CURRENT PAGE PRODUCTS + PAGINATION META (no accumulation)
	   ================================================================ */
	const products: Product[] = data?.items?.item ?? [];
	const currentPage = filter.page;
	const totalPages = data?.items?.page_count ?? 1;

	const handlePageChange = (page: number) => {
		if (page < 1 || page > totalPages || page === filter.page) return;

		setFilter((prev) => ({ ...prev, page }));

		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	return (
		<div className="py-8">
			<div className="container mx-auto px-2">
				{/* Title */}
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">NEW LAUNCHES</h2>

				{/* Skeleton while loading */}
				{isLoading ? (
					<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
						{Array.from({ length: 10 }).map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</div>
				) : (
					<>
						{/* Product Grid */}
						<div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
							{products.map((product) => (
								<ProductCard product={product} key={product.num_iid} />
							))}
						</div>

						{/* Pagination */}
						<ProductPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
					</>
				)}
			</div>
		</div>
	);
}
