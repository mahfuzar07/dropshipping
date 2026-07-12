'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { ProductResponse } from './NewLaunch';

interface CategorySectionProps {
	title: string;
	searchTag: string;
	icon: string;
	bgClass?: string;
}

export default function CategorySection({ title, searchTag, icon, bgClass = 'bg-white' }: CategorySectionProps) {
	const filterParams = useMemo(
		() => ({
			page: 1,
			limit: 10,
			search: searchTag,
		}),
		[searchTag]
	);

	const { data, isLoading } = useAppData<ProductResponse, 'single'>({
		key: [QueriesKey.SEARCH_PRODUCTS, searchTag, filterParams],
		api: apiEndpoint.products.publicProducts,
		queryParams: filterParams,
		auth: false,
		responseType: 'single',
		refetchOnMount: true,
		staleTime: 0,
		enabled: true,
		clientOnly: true,
	});

	const products = data?.items?.item ?? [];

	if (!isLoading && products.length === 0) return null;

	return (
		<section className={`py-12 ${bgClass} transition-colors duration-300`}>
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-100">
					<div className="flex items-center gap-3">
						<span className="text-2xl md:text-3xl select-none" role="img" aria-label={title}>
							{icon}
						</span>
						<h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight font-hanken uppercase">
							{title}
						</h2>
					</div>
					<Link
						href={`/product-list?search=${encodeURIComponent(searchTag)}`}
						className="group flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
					>
						See More
						<ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>

				{/* Products Grid */}
				{isLoading ? (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						{Array.from({ length: 10 }).map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						{products.slice(0, 10).map((product) => (
							<ProductCard product={product} key={product.num_iid} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}
