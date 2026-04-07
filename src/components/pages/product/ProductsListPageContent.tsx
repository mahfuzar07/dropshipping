'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, List } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import ProductFilterSidebar from './ProductFilterSidebar';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';
import { useProductStore } from '@/z-store/product/useProductStore';
import ProductCard from '@/components/common/elements/product-card/ProductCard';
import ProductCardSkeleton from '@/components/common/loader/ProductCardSkeleton';

// Dummy products
const ALL_PRODUCTS = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	title: `Product ${i + 1}`,
	price: Math.floor(Math.random() * 1000),
	image: '/assets/product/product-6.png',
	store: `US-Store ${(i % 5) + 1}`,
	category: 'Electronics',
	discount: Math.random() < 0.3,
	rating: Math.ceil(Math.random() * 5),
}));

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

	//  filter + paginate logic
	const getFilteredData = () => {
		let data = [...ALL_PRODUCTS];

		if (selectedCategories.length) {
			data = data.filter((p) => selectedCategories.includes(Number(p.category)));
		}

		if (discountOnly) {
			data = data.filter((p) => p.discount);
		}

		data = data.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

		if (selectedRatings.length) {
			data = data.filter((p) => selectedRatings.includes(p.rating));
		}

		// sort
		if (sortBy === 'price-low') {
			data.sort((a, b) => a.price - b.price);
		} else if (sortBy === 'price-high') {
			data.sort((a, b) => b.price - a.price);
		}

		return data;
	};

	//  fetch simulation with load more support
	const fetchProducts = (isLoadMore = false) => {
		if (isLoading) return;

		setLoading(true);

		const filtered = getFilteredData();

		const start = ((pagination.page_number || 1) - 1) * (pagination.page_size || 10);
		const end = start + (pagination.page_size || 10);

		const paginated = filtered.slice(start, end);

		setTimeout(() => {
			if (isLoadMore) {
				appendProducts(paginated);
			} else {
				setProducts(paginated);
			}

			setPaginationData({
				count: filtered.length,
				page_number: pagination.page_number || 1,
				page_size: pagination.page_size || 10,
				total_pages: Math.ceil(filtered.length / (pagination.page_size || 10)),
			});

			setLoading(false);
		}, 100);
	};

	//  initial + filter change
	useEffect(() => {
		resetPagination();
		clearProducts();
	}, [selectedCategories, discountOnly, priceRange, selectedRatings, sortBy]);

	//  fetch whenever page changes
	useEffect(() => {
		fetchProducts(pagination.page_number !== 1);
	}, [pagination.page_number]);

	//  infinite scroll
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && pagination.hasMore && !isLoading) {
					loadMoreProducts();
				}
			},
			{ threshold: 0.1 },
		);

		if (loadMoreRef.current) {
			observer.observe(loadMoreRef.current);
		}

		return () => observer.disconnect();
	}, [pagination.hasMore, isLoading]);

	return (
		<div className="container mx-auto py-3">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
				{/* Sidebar Filters */}
				<div className="col-span-3 sticky top-5 self-start hidden md:block overflow-y-auto">
					<ProductFilterSidebar />
				</div>

				{/* Products Section */}
				<div className="col-span-9 rounded">
					{/* Toolbar */}
					<div className="flex items-center justify-between mb-6">
						<span className="text-md text-gray-600">
							<strong>Results for</strong> "product"
						</span>

						<div className="flex gap-3">
							<Button variant="outline" onClick={() => setViewMode('grid')}>
								<Grid3X3 />
							</Button>
							<Button variant="outline" onClick={() => setViewMode('list')}>
								<List />
							</Button>

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

					{/* Products Grid / List */}
					{isLoading && products.length === 0 ? (
						<div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
							{Array.from({ length: 8 }).map((_, i) => (
								<ProductCardSkeleton key={i} />
							))}
						</div>
					) : products.length > 0 ? (
						<>
							<div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
								{products.map((product, i) => (
									<motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
										<ProductCard product={product} />
									</motion.div>
								))}
							</div>

							{/* Load More Skeleton */}
							{isLoading && (
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
									{Array.from({ length: 4 }).map((_, i) => (
										<ProductCardSkeleton key={i} />
									))}
								</div>
							)}

							{/* Load More Observer */}
							<div ref={loadMoreRef} className="py-10 text-center">
								{pagination.hasMore}
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
