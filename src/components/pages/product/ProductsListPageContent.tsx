'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List } from 'lucide-react';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import ProductFilterSidebar from './ProductFilterSidebar';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { Product, ProductResponse } from '../home-page/NewLaunch';

export default function ProductsListPageContent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {
		discountOnly,
		priceRange,
		searchText,
		selectedRatings,
		sortBy,
		viewMode,
		pagination,
		setSortBy,
		setViewMode,
		setSearchText,
		setPriceRange,
		toggleDiscount,
		loadMoreProducts,
		resetPagination,
		clearAllFilters,
		setPaginationData,
	} = useProductFilterStore();

	/* ================================================================
	   1. INIT PRICE/DISCOUNT/SORT FROM URL — once on mount only
	   ================================================================ */
	const didInitFromURL = useRef(false);

	useEffect(() => {
		if (didInitFromURL.current) return;
		didInitFromURL.current = true;

		const minP = searchParams.get('min_price');
		const maxP = searchParams.get('max_price');
		const disc = searchParams.get('discount');
		const sort = searchParams.get('sort');

		if (minP || maxP) setPriceRange([Number(minP ?? 0), Number(maxP ?? 1_000_000_000)]);
		if (disc === 'true') toggleDiscount();
		if (sort) setSortBy(sort);
	}, []);

	/* ================================================================
	   1a. SYNC "search" FROM URL — reactive (not mount-only)
	   CategoryMenu navigates client-side to /product-list?search=X
	   while this page instance may already be mounted (same route,
	   just a query change), so a mount-only effect misses it and the
	   stale searchText from the store stays put.
	   ================================================================ */
	useEffect(() => {
		const qFromURL = searchParams.get('search') || '';
		if (qFromURL !== searchText) {
			setSearchText(qFromURL);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	/* ================================================================
	   2. DEBOUNCE searchText (400 ms)
	   ================================================================ */
	const [debouncedSearch, setDebouncedSearch] = useState(searchText);

	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(searchText), 400);
		return () => clearTimeout(t);
	}, [searchText]);

	/* ================================================================
	   3. SYNC FILTERS → URL
	   ================================================================ */
	const updateURL = useCallback(
		(params: URLSearchParams) => {
			const newURL = params.toString() ? `${pathname}?${params.toString()}` : pathname;
			router.replace(newURL, { scroll: false });
		},
		[pathname, router],
	);

	useEffect(() => {
		const params = new URLSearchParams();

		if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
		if (discountOnly) params.set('discount', 'true');
		if (priceRange[0] > 0) params.set('min_price', String(priceRange[0]));
		if (priceRange[1] < 1_000_000_000) params.set('max_price', String(priceRange[1]));
		if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);

		updateURL(params);
	}, [debouncedSearch, discountOnly, priceRange, sortBy, updateURL]);

	/* ================================================================
	   4. ACCUMULATED PRODUCTS
	   ================================================================ */
	const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
	const lastRenderedPageRef = useRef<number>(0);

	/* ================================================================
	   5. FILTER CHANGE → RESET
	   ================================================================ */
	const prevFiltersRef = useRef({
		debouncedSearch,
		discountOnly,
		priceRange,
		selectedRatings,
		sortBy,
	});

	useEffect(() => {
		const prev = prevFiltersRef.current;

		const changed =
			prev.debouncedSearch !== debouncedSearch ||
			prev.discountOnly !== discountOnly ||
			prev.sortBy !== sortBy ||
			JSON.stringify(prev.priceRange) !== JSON.stringify(priceRange) ||
			JSON.stringify(prev.selectedRatings) !== JSON.stringify(selectedRatings);

		if (changed) {
			setAccumulatedProducts([]);
			lastRenderedPageRef.current = 0;
			resetPagination();
			prevFiltersRef.current = {
				debouncedSearch,
				discountOnly,
				priceRange,
				selectedRatings,
				sortBy,
			};
		}
	}, [debouncedSearch, discountOnly, priceRange, selectedRatings, sortBy]);

	/* ================================================================
	   6. API PARAMS
	   ================================================================ */
	const filterParams = useMemo(
		() => ({
			page: pagination.page_number ?? 1,
			limit: pagination.page_size ?? 20,
			...(debouncedSearch.trim() && { search: debouncedSearch.trim() }),
			...(discountOnly && { discount: true }),
			...(priceRange[0] > 0 && { minPrice: priceRange[0] }),
			...(priceRange[1] < 1_000_000_000 && { maxPrice: priceRange[1] }),
			...(sortBy && sortBy !== 'newest' && { sortBy }),
		}),
		[pagination.page_number, pagination.page_size, debouncedSearch, discountOnly, priceRange, sortBy],
	);

	/* ================================================================
	   7. FETCH
	   ================================================================ */
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
			toast.error(error?.response?.data?.message || 'Failed to fetch products');
		},
	});

	/* ================================================================
	   8. ACCUMULATE pages
	   ================================================================ */
	useEffect(() => {
		const items: Product[] = data?.items?.item ?? [];
		const currentPage = filterParams.page;
		const totalPages = data?.items?.page_count ?? 1;
		const total = data?.items?.total_results ?? items.length;

		if (!items.length) return;
		if (currentPage === lastRenderedPageRef.current) return;
		lastRenderedPageRef.current = currentPage;

		setAccumulatedProducts((prev) => {
			if (currentPage === 1) return items;
			const seen = new Set(prev.map((p) => p.num_iid));
			return [...prev, ...items.filter((p) => !seen.has(p.num_iid))];
		});

		setPaginationData({
			count: total,
			page_number: currentPage,
			page_size: data?.items?.page_size ?? filterParams.limit,
			total_pages: totalPages,
			hasMore: currentPage < totalPages,
		});
	}, [data]);

	/* ================================================================
	   9. LOADING STATES
	   ================================================================ */
	const isInitialLoading = isLoading && accumulatedProducts.length === 0;
	const isLoadingMore = isLoading && accumulatedProducts.length > 0;

	/* ================================================================
	   10. CLIENT-SIDE RATING FILTER + SORT
	   ================================================================ */
	const filteredProducts = useMemo(() => {
		let list = [...accumulatedProducts];

		if (selectedRatings.length) {
			list = list.filter((p) => selectedRatings.includes(Number((p as any).rating || 0)));
		}

		if (sortBy === 'price-low') list.sort((a, b) => a.promotion_price - b.promotion_price);
		if (sortBy === 'price-high') list.sort((a, b) => b.promotion_price - a.promotion_price);

		return list;
	}, [accumulatedProducts, selectedRatings, sortBy]);

	/* ================================================================
	   11. INFINITE SCROLL
	   ================================================================ */
	const isFetchingRef = useRef(isLoading);
	const hasMoreRef = useRef(pagination.hasMore);

	useEffect(() => {
		isFetchingRef.current = isLoading;
	}, [isLoading]);
	useEffect(() => {
		hasMoreRef.current = pagination.hasMore;
	}, [pagination.hasMore]);

	const loadMoreRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node) return;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
						loadMoreProducts();
					}
				},
				{ threshold: 0.1 },
			);
			observer.observe(node);
			return () => observer.disconnect();
		},
		[loadMoreProducts],
	);

	/* ================================================================
	   12. CLEAR ALL
	   ================================================================ */
	const handleClearAll = () => {
		clearAllFilters();
		setAccumulatedProducts([]);
		lastRenderedPageRef.current = 0;
		router.replace(pathname, { scroll: false });
	};

	/* ================================================================
	   RENDER
	   ================================================================ */
	return (
		<div className="container mx-auto py-3">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* Sidebar */}
				<div className="col-span-3 sticky top-5 hidden md:block">
					<ProductFilterSidebar />
				</div>

				{/* Products */}
				<div className="col-span-9">
					{/* Toolbar */}
					<div className="flex items-center justify-between mb-6">
						<span className="text-md text-gray-600">
							<strong>{filteredProducts.length}</strong> Products Found
							{pagination.hasMore && !isLoading && <span className="text-sm font-normal text-muted-foreground"> +more</span>}
						</span>

						<div className="flex gap-3">
							<ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}>
								<ToggleGroupItem value="grid">
									<LayoutGrid />
								</ToggleGroupItem>
								<ToggleGroupItem value="list">
									<List />
								</ToggleGroupItem>
							</ToggleGroup>

							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-40">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="newest">Newest</SelectItem>
									<SelectItem value="price-low">Low → High</SelectItem>
									<SelectItem value="price-high">High → Low</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Initial skeleton */}
					{isInitialLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					) : filteredProducts.length > 0 ? (
						<>
							<div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
								{filteredProducts.map((product, i) => (
									<motion.div
										key={product.num_iid || i}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.25, delay: (i % 20) * 0.03 }}
									>
										<ProductCard product={product} />
									</motion.div>
								))}
							</div>

							{/* Infinite scroll sentinel */}
							<div ref={loadMoreRef} className="mt-6 min-h-[80px]">
								{isLoadingMore ? (
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
										{Array.from({ length: 4 }).map((_, i) => (
											<ProductCardSkeleton key={`more-${i}`} />
										))}
									</div>
								) : pagination.hasMore ? (
									<p className="py-8 text-center text-sm text-muted-foreground">scroll for more products</p>
								) : (
									<p className="py-8 text-center text-sm text-muted-foreground">
										all <strong>{filteredProducts.length}</strong> products shown
									</p>
								)}
							</div>
						</>
					) : (
						<div className="text-center py-20">
							<p className="mb-3 text-muted-foreground">Product not found</p>
							<Button onClick={handleClearAll}>Clear Filters</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
