'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List } from 'lucide-react';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

import ProductFilterSidebar, { CategoriesResponse } from './ProductFilterSidebar';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { Product, ProductResponse } from '../home-page/NewLaunch';
import ProductPagination from '@/components/common/elements/Productpagination';
import CategorySwiper from './CategorySwiper';

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
		resetPagination,
		clearAllFilters,
		setPaginationData,
	} = useProductFilterStore();

	/* ================================================================
	   1. INIT FROM URL — once on mount only
	   ================================================================ */
	const didInitFromURL = useRef(false);

	const qFromURLInitial = searchParams.get('search') || '';
	const [debouncedSearch, setDebouncedSearch] = useState(qFromURLInitial);

	useEffect(() => {
		if (didInitFromURL.current) return;
		didInitFromURL.current = true;

		const q = searchParams.get('search') || '';
		const minP = searchParams.get('min_price');
		const maxP = searchParams.get('max_price');
		const disc = searchParams.get('discount');
		const sort = searchParams.get('sort');

		if (q) {
			setSearchText(q);
			setDebouncedSearch(q);
		}
		if (minP || maxP) setPriceRange([Number(minP ?? 0), Number(maxP ?? 1_000_000_000)]);
		if (disc === 'true') toggleDiscount();
		if (sort) setSortBy(sort);
	}, []);

	useEffect(() => {
		const qFromURL = searchParams.get('search') || '';
		if (qFromURL !== searchText) {
			setSearchText(qFromURL);
			setDebouncedSearch(qFromURL);
		}
	}, [searchParams, searchText, setSearchText]);

	/* ================================================================
	   2. DEBOUNCE searchText (400 ms)
	   ================================================================ */
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
	   4. FILTER CHANGE → RESET TO PAGE 1
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
	   5. API PARAMS
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
	   6. FETCH
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

	const { data: categoriesData } = useAppData<CategoriesResponse, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.products.CATEGORIES(),
		auth: true,
		responseType: 'single',
	});
	const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories ?? []);

	/* ================================================================
	   7. SYNC PAGINATION META FROM RESPONSE (current page only, no accumulation)
	   ================================================================ */
	useEffect(() => {
		const currentPage = filterParams.page;
		const totalPages = data?.items?.page_count ?? 1;
		const total = data?.items?.total_results ?? 0;

		setPaginationData({
			count: total,
			page_number: currentPage,
			page_size: data?.items?.page_size ?? filterParams.limit,
			total_pages: totalPages,
			hasMore: currentPage < totalPages,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	/* ================================================================
	   8. CLIENT-SIDE RATING FILTER + SORT (applied on the current page only)
	   ================================================================ */
	const products: Product[] = data?.items?.item ?? [];

	const filteredProducts = useMemo(() => {
		let list = [...products];

		if (selectedRatings.length) {
			list = list.filter((p) => selectedRatings.includes(Number((p as any).rating || 0)));
		}

		if (sortBy === 'price-low') list.sort((a, b) => a.promotion_price - b.promotion_price);
		if (sortBy === 'price-high') list.sort((a, b) => b.promotion_price - a.promotion_price);

		return list;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, selectedRatings, sortBy]);

	/* ================================================================
	   9. PAGE CHANGE HANDLER
	   ================================================================ */
	const handlePageChange = (page: number) => {
		const totalPages = pagination.total_pages ?? 1;
		if (page < 1 || page > totalPages || page === pagination.page_number) return;

		setPaginationData({
			count: pagination.count ?? 0,
			page_number: page,
			page_size: pagination.page_size ?? 20,
			total_pages: totalPages,
			hasMore: page < totalPages,
		});

		if (typeof window !== 'undefined') {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	/* ================================================================
	   10. CLEAR ALL
	   ================================================================ */
	const handleClearAll = () => {
		clearAllFilters();
		router.replace(pathname, { scroll: false });
	};

	/* ================================================================
	   RENDER
	   ================================================================ */
	return (
		<div className="container mx-auto p-3">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* Sidebar */}
				<div className="col-span-3 sticky top-5 hidden md:block">
					<ProductFilterSidebar />
				</div>

				{/* Products */}
				<div className="col-span-9">
					{/* Toolbar */}
					<div className="flex md:flex-row flex-col gap-2   md:items-center justify-between mb-3">
						<div>
							<p className="text-xs md:text-base font-semibold">
								SHOWING RESULTS FOR <span className="uppercase text-primary ml-1"> {searchText}</span>
							</p>

							<span className="text-xs text-gray-600">
								<strong>{pagination.count ?? filteredProducts.length}</strong> Results Found
							</span>
						</div>

						<div className="flex justify-between gap-3">
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
					<CategorySwiper categories={categories} />

					{/* Skeleton while loading */}
					{isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					) : filteredProducts.length > 0 ? (
						<>
							<div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3' : 'space-y-3'}>
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

							{/* Pagination */}
							<ProductPagination currentPage={pagination.page_number ?? 1} totalPages={pagination.total_pages ?? 1} onPageChange={handlePageChange} />
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
