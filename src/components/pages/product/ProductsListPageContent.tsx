'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List } from 'lucide-react';
import { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

import ProductFilterSidebar from './ProductFilterSidebar';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';
import { useProductStore } from '@/z-store/product/useProductStore';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

/* ================= TYPES ================= */

type Product = {
	_id: string;
	offer_id: string;
	title: string;
	url: string;
	image: string;
	product_name: string;
	promotion: string;
	rating: string;
	sold: string;
	price: {
		amount: string;
		currency: string;
		overseas: string;
		unit: string;
	};
	seller_icon: string;
	is_ad: boolean;
	moq: null | number;
};

export default function ProductsListPageContent() {
	const {
		selectedCategories,
		discountOnly,
		priceRange,
		selectedRatings,
		sortBy,
		viewMode,
		pagination,
		setSortBy,
		setViewMode,
		loadMoreProducts,
		resetPagination,
		setPaginationData,
		clearAllFilters,
	} = useProductFilterStore();

	const { products, isLoading, setLoading, setProducts, appendProducts, clearProducts } = useProductStore();

	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	/* ================= FILTER ================= */

	const getFilteredData = useCallback(() => {
		let data = [...products]; // ✅ FIX: dummy array remove (real store use)

		if (selectedCategories.length) {
			data = data.filter((p: any) => selectedCategories.includes(Number(p.category)));
		}

		if (discountOnly) {
			data = data.filter((p: any) => p.discount);
		}

		data = data.filter((p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]);

		if (selectedRatings.length) {
			data = data.filter((p: any) => selectedRatings.includes(p.rating));
		}

		if (sortBy === 'price-low') {
			data.sort((a: any, b: any) => a.price - b.price);
		} else if (sortBy === 'price-high') {
			data.sort((a: any, b: any) => b.price - a.price);
		}

		return data;
	}, [products, selectedCategories, discountOnly, priceRange, selectedRatings, sortBy]);

	/* ================= FETCH ================= */

	const fetchProducts = useCallback(
		(isLoadMore = false) => {
			if (isLoading) return;

			setLoading(true);

			const filtered = getFilteredData();

			const page = pagination.page_number ?? 1;
			const size = pagination.page_size ?? 10;

			const start = (page - 1) * size;
			const end = start + size;

			const paginated = filtered.slice(start, end);

			setTimeout(() => {
				if (isLoadMore) {
					appendProducts(paginated);
				} else {
					setProducts(paginated);
				}

				setPaginationData({
					count: filtered.length,
					page_number: page,
					page_size: size,
					total_pages: Math.ceil(filtered.length / size),
					hasMore: end < filtered.length,
				});

				setLoading(false);
			}, 100);
		},
		[getFilteredData, isLoading, pagination],
	);

	/* ================= EFFECTS ================= */

	useEffect(() => {
		resetPagination();
		clearProducts();
	}, [selectedCategories, discountOnly, priceRange, selectedRatings, sortBy]);

	useEffect(() => {
		fetchProducts(pagination.page_number !== 1);
	}, [pagination.page_number]);

	/* ================= INFINITE SCROLL ================= */

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && pagination.hasMore && !isLoading) {
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
	}, [pagination.hasMore, isLoading, loadMoreProducts]);

	/* ================= UI ================= */

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
							<strong>Results for</strong> "product"
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

					{/* Products */}
					{isLoading && products.length === 0 ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					) : products.length > 0 ? (
						<>
							<div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
								{products.map((product, i) => (
									<motion.div key={product._id || i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
										<ProductCard product={product} />
									</motion.div>
								))}
							</div>

							{/* loader */}
							{isLoading && (
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
									{Array.from({ length: 4 }).map((_, i) => (
										<ProductCardSkeleton key={i} />
									))}
								</div>
							)}

							{/* observer */}
							<div ref={loadMoreRef} className="py-10 text-center text-sm text-muted-foreground">
								{pagination.hasMore ? 'Loading more...' : 'No more products'}
							</div>
						</>
					) : (
						<div className="text-center py-20">
							<p className="mb-3">No products found</p>
							<Button onClick={clearAllFilters}>Clear Filters</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
