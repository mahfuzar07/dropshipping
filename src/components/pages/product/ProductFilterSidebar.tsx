'use client';
import { useState } from 'react';
import type React from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search } from 'lucide-react';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';

const categories = [
	{ id: 1, name: 'Electronics', product_count: 120 },
	{ id: 2, name: 'Fashion', product_count: 80 },
	{ id: 3, name: 'Shoes', product_count: 45 },
	{ id: 4, name: 'Watches', product_count: 60 },
];

export default function ProductFilterSidebar() {
	const { selectedCategories, discountOnly, priceRange, searchText, toggleCategory, toggleDiscount, setPriceRange, setSearchText, clearAllFilters } =
		useProductFilterStore();

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
							<Button onClick={handleApplyPriceFilter} className="w-full bg-orange-300 text-white hover:bg-orange-500">
								Apply
							</Button>

							<p className="text-sm text-gray-500">
								{priceRange[0]} - {priceRange[1]}
							</p>
						</div>
					)}
				</div>

				{/* Categories */}
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
							{categories.map((cat) => (
								<div key={cat.id} className="flex justify-between">
									<div className="flex items-center gap-2">
										<Checkbox checked={selectedCategories.includes(cat.id)} onCheckedChange={() => toggleCategory(cat.id)} />
										<span>{cat.name}</span>
									</div>
									<span className="text-xs text-gray-400">({cat.product_count})</span>
								</div>
							))}
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
