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

type Product = {
	_id: string;
	title: string;
	image: string;
	rating: string;
	price: { amount: string; currency: string };
};

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
	   4. RESET PAGE when filters change (not on page increment)
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
	   5. BUILD API QUERY PARAMS
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
	   6. FETCH
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

	const allProducts = topProducts?.results || [];

	/* ================================================================
	   7. CLIENT-SIDE RATING FILTER + SORT (fallback)
	   ================================================================ */
	const filteredProducts = useMemo(() => {
		let data = [...allProducts];

		if (selectedRatings.length) {
			data = data.filter((p) => selectedRatings.includes(Number(p.rating || 0)));
		}

		if (sortBy === 'price-low') {
			data.sort((a, b) => Number(a.price.amount) - Number(b.price.amount));
		} else if (sortBy === 'price-high') {
			data.sort((a, b) => Number(b.price.amount) - Number(a.price.amount));
		}

		return data;
	}, [allProducts, selectedRatings, sortBy]);

	/* ================================================================
	   8. CLIENT-SIDE PAGINATION WINDOW
	   ================================================================ */
	const visibleProducts = useMemo(() => {
		const size = pagination.page_size || 20;
		const page = pagination.page_number || 1;
		return filteredProducts.slice(0, page * size);
	}, [filteredProducts, pagination]);

	/* ================================================================
	   9. INFINITE SCROLL
	   ================================================================ */
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && visibleProducts.length < filteredProducts.length && !isLoading) {
					loadMoreProducts();
				}
			},
			{ threshold: 0.1 },
		);

		const el = loadMoreRef.current;
		if (el) observer.observe(el);

		return () => {
			if (el) observer.unobserve(el);
			observer.disconnect();
		};
	}, [visibleProducts, filteredProducts, isLoading]);

	/* ================================================================
	   10. CLEAR ALL — also wipe URL
	   ================================================================ */
	const handleClearAll = () => {
		clearAllFilters();
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
						</span>

						<div className="flex gap-3">
							<ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
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

					{/* Product Grid */}
					{isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					) : visibleProducts.length > 0 ? (
						<>
							<div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
								{visibleProducts.map((product, i) => (
									<motion.div key={product._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
										<ProductCard product={product} />
									</motion.div>
								))}
							</div>

							<div ref={loadMoreRef} className="py-10 text-center text-sm text-muted-foreground">
								{visibleProducts.length < filteredProducts.length ? 'Loading more...' : 'No more products'}
							</div>
						</>
					) : (
						<div className="text-center py-20">
							<p className="mb-3">No products found</p>
							<Button onClick={handleClearAll}>Clear Filters</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
