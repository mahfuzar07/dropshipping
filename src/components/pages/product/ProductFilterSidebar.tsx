'use client';
import { useState } from 'react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronLeft, Search } from 'lucide-react';
import { useProductFilterStore, type MenuCategoryLite } from '@/z-store/product/useProductFilterStore';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';

export interface CategoryItem {
	[key: string]: any;
}

export interface Category {
	id: number;
	name: string;
	slug: string;
	icon: string;
	subcategories: Category[];
}

export interface CategoriesResponse {
	categories: Category[];
}

export default function ProductFilterSidebar() {
	const { categoryPath, discountOnly, priceRange, searchText, selectCategoryAtLevel, toggleDiscount, setPriceRange, setSearchText, clearAllFilters } =
		useProductFilterStore();

	const { data, isLoading } = useAppData<CategoriesResponse, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.products.CATEGORIES(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const categories = Array.isArray(data) ? data : (data?.categories ?? []);

	const [minPrice, setMinPrice] = useState(priceRange[0].toString());
	const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());

	const [collapsedSections, setCollapsedSections] = useState({
		categories: false,
		discount: false,
		priceRange: false,
	});

	const toggleSection = (section: keyof typeof collapsedSections) => {
		setCollapsedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const handleApplyPriceFilter = () => {
		const min = Math.max(0, Number(minPrice) || 0);
		const max = Math.min(10000, Number(maxPrice) || 10000);

		if (min <= max) {
			setPriceRange([min, max]);
		}
	};

	// ---- Flat, single-level category navigation (no nested tree) ----
	const level = categoryPath.length;
	const deepest = categoryPath[level - 1] as any;
	// items to show: children of the deepest selected category, or top-level list if nothing selected
	const itemsAtLevel: Category[] = level === 0 ? categories : (deepest?.subcategories ?? []);

	const handleGoBack = () => {
		if (level === 0) return;
		// go back one level: reselect the parent at (level - 1) as "current",
		// i.e. drop only the deepest item, keep everything above it
		if (level === 1) {
			selectCategoryAtLevel(null, 0);
		} else {
			const parent = categoryPath[level - 2] as MenuCategoryLite;
			selectCategoryAtLevel(parent, level - 2);
		}
	};

	return (
		<aside className="w-full space-y-3 overflow-y-auto">
			<div className="bg-white rounded-lg p-6">
				<h3 className="text-xl mb-4">Filters</h3>

				{/* Search */}
				<div className="mb-5">
					<div className="relative">
						<Input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search..." className="pr-8" />
						<Search className="absolute right-2 top-3 w-4 h-4" />
					</div>
				</div>

				{/* Price */}
				<div className="mb-3 border-b border-border/50 pb-3">
					<h4
						onClick={() => toggleSection('priceRange')}
						className="text-md text-foreground flex items-center justify-between cursor-pointer hover:text-slate-600 transition-colors"
					>
						Price Range
						<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.priceRange ? 'rotate-180' : ''}`} />
					</h4>

					{!collapsedSections.priceRange && (
						<div className="mt-3 space-y-2">
							<div className="flex gap-2">
								<Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
								<Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
							</div>
							<Button onClick={handleApplyPriceFilter} className="w-full bg-primary text-white hover:bg-primary/80">
								Apply
							</Button>

							<p className="text-sm text-gray-500">
								{priceRange[0]} - {priceRange[1]}
							</p>
						</div>
					)}
				</div>

				{/* Categories - single-level, replace-on-select */}
				<div className="mb-3 border-b border-border/50 pb-3">
					<h4
						onClick={() => toggleSection('categories')}
						className="text-md text-foreground flex items-center justify-between cursor-pointer hover:text-slate-600 transition-colors"
					>
						Categories
						<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.categories ? 'rotate-180' : ''}`} />
					</h4>

					{!collapsedSections.categories && (
						<div className="mt-3 space-y-2">
							{/* Back button + breadcrumb, only when drilled into a category */}
							{level > 0 && (
								<button type="button" onClick={handleGoBack} className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary mb-2">
									<ChevronLeft className="w-3.5 h-3.5" />
									<span className="truncate">{deepest?.name}</span>
								</button>
							)}

							{itemsAtLevel.map((cat: any) => {
								const isSelected = categoryPath[level]?.id === cat.id;
								return (
									<div key={cat.id} className="flex justify-between items-center">
										<div className="flex items-center gap-2">
											<Checkbox checked={isSelected} onCheckedChange={() => selectCategoryAtLevel(cat, level)} />
											<span className={isSelected ? 'text-primary font-medium' : ''}>{cat.name}</span>
										</div>
										{cat.product_count !== undefined && <span className="text-xs text-gray-400">({cat.product_count})</span>}
									</div>
								);
							})}

							{itemsAtLevel.length === 0 && <p className="text-xs text-gray-400">No subcategories</p>}
						</div>
					)}
				</div>

				{/* Discount */}
				<div className="mb-3 pb-3">
					<h4
						onClick={() => toggleSection('discount')}
						className="text-md text-foreground flex items-center justify-between cursor-pointer hover:text-slate-600 transition-colors"
					>
						Discount
						<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.discount ? 'rotate-180' : ''}`} />
					</h4>

					{!collapsedSections.discount && (
						<div className="mt-2 flex items-center gap-2">
							<Checkbox checked={discountOnly} onCheckedChange={toggleDiscount} />
							<span>Discount Only</span>
						</div>
					)}
				</div>

				<Button variant="outline" className="w-full" onClick={clearAllFilters}>
					Clear All
				</Button>
			</div>
		</aside>
	);
}
