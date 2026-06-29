'use client';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ProductResponse } from './NewLaunch';

export default function LatestDeal() {
	const [filter, setFilter] = useState({
		page: 1,
		limit: 5,
		search: '',
		category: '',
		brand: '',
		minPrice: undefined as number | undefined,
		maxPrice: undefined as number | undefined,
		sortBy: '',
		sortOrder: 'desc' as 'asc' | 'desc',
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
			...(filter.sortOrder && { sortOrder: filter.sortOrder }),
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
				<h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">LATEST DEALS</h2>

				{/* MAIN GRID */}
				<div className="grid grid-cols-2 md:grid-cols-6 gap-3">
					{/* ===== FIRST ROW ===== */}

					{/* Product 1 */}
					<div className="md:col-span-1 order-2 md:order-none">
						<ProductCard product={products[0]} />
					</div>

					{/* Product 2 */}
					<div className="md:col-span-1 order-3 md:order-none">
						<ProductCard product={products[1]} />
					</div>
					<div className="md:col-span-1 order-4 md:order-none">
						<ProductCard product={products[2]} />
					</div>

					{/* BANNER */}
					<div className="md:col-span-3 col-span-2 order-1 md:order-none">
						<div className="relative h-full min-h-[280px] md:min-h-[340px] lg:min-h-[350px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#cfe3f4] to-[#f5e4d4] p-6 flex flex-col justify-center">
							{/* Text Content */}
							<div className="max-w-md z-10">
								<h3 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">Daily Deals Best Offers From BD </h3>
								<p className="text-gray-600 font-semibold mb-3 text-lg leading-relaxed">Get Upto 15% Off on Your Favorite Products.</p>
								<p className="text-gray-600 font-semibold mb-6 text-lg leading-relaxed">USE CODE: NEWYEAR.</p>
								<button className="bg-blue-900 hover:bg-blue-800 text-white px-12 py-3 rounded text-sm font-medium transition-all">Shop Now</button>
							</div>

							{/* Decorative Image */}
							<div className="absolute right-4 h-full w-2/5 pointer-events-none">
								<Image src="/assets/deals/deals-bg.webp" alt="International gifting" fill className="object-contain object-bottom" priority />
							</div>
						</div>
					</div>
				</div>
				{/* ===== SECOND ROW (ALL PRODUCTS) ===== */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5">
					{products.slice(3).map((product: any) => (
						<div key={product._id} className="">
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
