'use client';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
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
		limit: 5,
		search: '',
		category: '',
		brand: '',
		minPrice: undefined as number | undefined,
		maxPrice: undefined as number | undefined,
		sortBy: '',
		// sortOrder: 'desc' as 'asc' | 'desc',
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
			// ...(filter.sortOrder && { sortOrder: filter.sortOrder }),
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

	const products = data?.items.item || [];

	return (
		<div className="bg-gray-100 py-8">
			<div className="container mx-auto px-4">
				{/* Title */}
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">NEW LAUNCHES</h2>

				{/* Product Grid */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-3">
					{products.map((product) => (
						<ProductCard product={product} key={product?.num_iid} />
					))}
				</div>
			</div>
		</div>
	);
}
