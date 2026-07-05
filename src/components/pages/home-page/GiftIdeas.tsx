'use client';

import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ProductResponse } from './NewLaunch';

export default function GiftIdeas() {
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
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Gift Ideas</h2>

				{/* Main Grid */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-5">
					{/* LEFT BANNER */}
					<div className="md:col-span-2 col-span-4">
						<div className="relative min-h-[280px] md:min-h-[340px] lg:min-h-[360px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#cfe3f4] to-[#f5e4d4] p-6 flex items-center">
							<div className="max-w-md z-10">
								<h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">International Gifting Store</h3>

								<p className="text-gray-600 font-semibold mb-6 text-lg leading-relaxed">Buy Your Favorite Gifts Online & Send Abroad</p>

								<button className="bg-blue-900 hover:bg-blue-800 text-white px-10 py-3 rounded text-sm font-medium transition-all">Gift Now</button>
							</div>

							<div className="absolute right-4 top-0 h-full w-2/5 pointer-events-none">
								<Image src="/assets/gift/giftcard-bg.webp" alt="gift banner" fill className="object-contain object-bottom" priority />
							</div>
						</div>
					</div>

					{/* RIGHT PRODUCTS */}
					<div className="grid grid-cols-2 2xl:grid-cols-3 gap-3 md:col-span-2 col-span-4 items-stretch">
						{isLoading
							? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl" />)
							: products.map((product) => <ProductCard product={product} />)}
					</div>
				</div>
			</div>
		</div>
	);
}
