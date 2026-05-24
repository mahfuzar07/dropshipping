'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List } from 'lucide-react';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import ProductFilterSidebar from './ProductFilterSidebar';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';
import ProductCard, { Product } from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';

type TopSellingResponse = {
	page: number;
	limit: number;
	total: number;
	total_pages: number;
	results: Product[];
};

export default function ProductsListPageContent() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const {
		selectedCategories,
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
		setCategory,
		setPriceRange,
		toggleDiscount,
		loadMoreProducts,
		resetPagination,
		clearAllFilters,
		setPaginationData,
	} = useProductFilterStore();

	/* ================================================================
	   1. INIT STORE FROM URL on first mount
	   ================================================================ */
	const didInitFromURL = useRef(false);

	useEffect(() => {
		if (didInitFromURL.current) return;
		didInitFromURL.current = true;

		const q = searchParams.get('search') || '';
		const cat = searchParams.get('category');
		const minP = searchParams.get('min_price');
		const maxP = searchParams.get('max_price');
		const disc = searchParams.get('discount');
		const sort = searchParams.get('sort');

		if (q) setSearchText(q);
		if (cat) setCategory(Number(cat));
		if (minP || maxP) setPriceRange([Number(minP ?? 0), Number(maxP ?? 1_000_000_000)]);
		if (disc === 'true') toggleDiscount();
		if (sort) setSortBy(sort);
	}, []);

	/* ================================================================
	   2. DEBOUNCE searchText (400ms)
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
		if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
		if (discountOnly) params.set('discount', 'true');
		if (priceRange[0] > 0) params.set('min_price', String(priceRange[0]));
		if (priceRange[1] < 1_000_000_000) params.set('max_price', String(priceRange[1]));
		if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);

		updateURL(params);
	}, [debouncedSearch, selectedCategories, discountOnly, priceRange, sortBy, updateURL]);

	/* ================================================================
	   4. ACCUMULATED PRODUCTS STATE
	   ================================================================ */
	const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);

	const lastRenderedPageRef = useRef<number>(0);

	/* ================================================================
	   5. FILTER CHANGE → RESET ACCUMULATED LIST + PAGINATION
	   ================================================================ */
	const prevFiltersRef = useRef({
		debouncedSearch,
		selectedCategories,
		discountOnly,
		priceRange,
		selectedRatings,
		sortBy,
	});

	useEffect(() => {
		const prev = prevFiltersRef.current;

		const filtersChanged =
			prev.debouncedSearch !== debouncedSearch ||
			prev.discountOnly !== discountOnly ||
			prev.sortBy !== sortBy ||
			JSON.stringify(prev.priceRange) !== JSON.stringify(priceRange) ||
			JSON.stringify(prev.selectedCategories) !== JSON.stringify(selectedCategories) ||
			JSON.stringify(prev.selectedRatings) !== JSON.stringify(selectedRatings);

		if (filtersChanged) {
			setAccumulatedProducts([]);
			lastRenderedPageRef.current = 0;
			resetPagination();
			prevFiltersRef.current = {
				debouncedSearch,
				selectedCategories,
				discountOnly,
				priceRange,
				selectedRatings,
				sortBy,
			};
		}
	}, [debouncedSearch, selectedCategories, discountOnly, priceRange, selectedRatings, sortBy]);

	/* ================================================================
	   6. BUILD API QUERY PARAMS
	   ================================================================ */
	const queryParams = useMemo(() => {
		const params = new URLSearchParams();

		params.set('page', String(pagination.page_number ?? 1));
		params.set('limit', String(pagination.page_size ?? 20));

		if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
		if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
		if (discountOnly) params.set('discount', 'true');
		if (priceRange[0] > 0) params.set('min_price', String(priceRange[0]));
		if (priceRange[1] < 1_000_000_000) params.set('max_price', String(priceRange[1]));
		if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);

		return params.toString();
	}, [pagination.page_number, pagination.page_size, debouncedSearch, selectedCategories, discountOnly, priceRange, sortBy]);

	/* ================================================================
	   7. FETCH
	   ================================================================ */
	const { data: topProducts, isLoading } = useAppData<TopSellingResponse, 'single'>({
		key: [QueriesKey.TOP_PRODUCTS, queryParams],
		api: apiEndpoint.products.TOP_PRODUCTS(queryParams),
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to fetch products');
		},
	});

	/* ================================================================
	   8. ACCUMULATE — API response
	   ================================================================ */
	useEffect(() => {
		if (!topProducts?.results) return;

		const incomingPage = topProducts.page;

		if (incomingPage === lastRenderedPageRef.current) return;
		lastRenderedPageRef.current = incomingPage;

		if (incomingPage === 1) {
			setAccumulatedProducts(topProducts.results);
		} else {
			setAccumulatedProducts((prev) => {
				const existingIds = new Set(prev.map((p) => p._id));
				const newOnes = topProducts.results.filter((p) => !existingIds.has(p._id));
				return [...prev, ...newOnes];
			});
		}

		// Store-এ hasMore
		setPaginationData({
			count: topProducts.total,
			page_number: topProducts.page,
			page_size: topProducts.limit,
			total_pages: topProducts.total_pages,
			hasMore: topProducts.page < topProducts.total_pages,
		});
	}, [topProducts]);

	/* ================================================================
	   9. DERIVED LOADING STATES

	   ================================================================ */
	const isInitialLoading = isLoading && accumulatedProducts.length === 0;
	const isLoadingMore = isLoading && accumulatedProducts.length > 0;

	/* ================================================================
	   10. CLIENT-SIDE RATING FILTER + SORT
	   ================================================================ */
	const filteredProducts = useMemo(() => {
		let data = [...accumulatedProducts];

		if (selectedRatings.length) {
			data = data.filter((p) => selectedRatings.includes(Number(p.rating || 0)));
		}

		if (sortBy === 'price-low') {
			data.sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
		} else if (sortBy === 'price-high') {
			data.sort((a, b) => Number(b.price.amount) - Number(a.price.amount));
		}

		return data;
	}, [accumulatedProducts, selectedRatings, sortBy]);

	/* ================================================================
	   11. INFINITE SCROLL

	   ================================================================ */
	const isFetchingRef = useRef(isLoading);
	const hasMoreRef = useRef(pagination.hasMore);

	// ref
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
				(entries) => {
					if (entries[0].isIntersecting && hasMoreRef.current && !isFetchingRef.current) {
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
							{pagination.hasMore && !isLoading && <span className="text-sm font-normal text-muted-foreground">more</span>}
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

					{/* ── Initial Loading ── */}
					{isInitialLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					) : /* ── Products exist ── */
					filteredProducts.length > 0 ? (
						<>
							<div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
								{filteredProducts.map((product, i) => (
									<motion.div
										key={product._id || i}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.25, delay: (i % 20) * 0.03 }}
									>
										<ProductCard product={product} />
									</motion.div>
								))}
							</div>

							{/* ── Infinite scroll trigger + bottom indicator ── */}
							<div ref={loadMoreRef} className="mt-6 min-h-[80px]">
								{isLoadingMore ? (
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
										{Array.from({ length: 4 }).map((_, i) => (
											<ProductCardSkeleton key={`more-${i}`} />
										))}
									</div>
								) : pagination.hasMore ? (
									<div className="py-8 text-center text-sm text-muted-foreground">scroll for more products</div>
								) : (
									<div className="py-8 text-center text-sm text-muted-foreground">
										all <strong>{filteredProducts.length}</strong> product
									</div>
								)}
							</div>
						</>
					) : (
						/* ── Empty state ── */
						<div className="text-center py-20">
							<p className="mb-3 text-muted-foreground">Product not found</p>
							<Button onClick={handleClearAll}>Filters clear</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
