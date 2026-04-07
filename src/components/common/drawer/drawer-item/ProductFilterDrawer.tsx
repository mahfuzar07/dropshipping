'use client';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X, Filter, ChevronDown, Star } from 'lucide-react';
import { useProductFilterStore } from '@/z-store/product/useProductFilterStore';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { motion } from 'framer-motion';

const categories = [
	{ id: 'watches', name: 'Watches', count: 12 },
	{ id: 'cameras', name: 'Cameras', count: 8 },
	{ id: 'headphones', name: 'Headphones', count: 15 },
	{ id: 'lighting', name: 'Lighting', count: 6 },
];

export default function ProductFilterDrawer() {
	const { selectedCategories, priceRange, selectedRatings, toggleCategory, setPriceRange, toggleRating, clearAllFilters } = useProductFilterStore();
	const { isDrawerOpen, closeDrawer } = useLayoutStore();

	const handleClose = () => {
		closeDrawer();
	};

	const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
		categories: false,
		brands: true,
		priceRange: true,
		rating: true,
	});

	const toggleSection = (section: string) => {
		setCollapsedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const handleCategoryChange = (categoryId: string | number, checked: boolean) => {
		toggleCategory(categoryId);
		closeDrawer();
	};

	// const handleBrandChange = (brandId: string, checked: boolean) => {
	// 	toggleBrand(brandId);
	// 	closeDrawer();
	// };

	const handlePriceRangeChange = (value: number[]) => {
		setPriceRange([value[0], value[1]]);
		// dispatch(closeDrawer());
	};

	const handleRatingChange = (rating: number, checked: boolean) => {
		toggleRating(rating);
		closeDrawer();
	};

	return (
		<Drawer open={isDrawerOpen} onOpenChange={handleClose} direction="left">
			<DrawerContent className="h-full md:w-[400px] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between border-b px-4 py-4">
					<DrawerTitle className="text-lg font-medium flex items-center gap-2">
						<Filter className="h-4 w-4" />
						Product Filter
					</DrawerTitle>
					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* filter section  */}
				<div className="bg-white p-5">
					{/* Categories */}
					<div className="mb-3 border-b border-border/50 pb-3">
						<h4
							className="text-md text-foreground flex items-center justify-between cursor-pointer hover:text-slate-600 transition-colors"
							onClick={() => toggleSection('categories')}
						>
							Categories
							<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.categories ? 'rotate-180' : ''}`} />
						</h4>
						<div
							className={`overflow-hidden transition-all duration-300 ease-in-out ${
								collapsedSections.categories ? 'max-h-0 opacity-0' : 'h-max opacity-100 py-4 '
							}`}
						>
							<div className="space-y-2">
								{categories.map((category) => (
									<div key={category.id} className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Checkbox
												id={category.id}
												checked={selectedCategories.map(String).includes(String(category.id))}
												onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
											/>
											<label htmlFor={category.id} className="text-sm cursor-pointer">
												{category.name}
											</label>
										</div>
										<span className="text-xs text-gray-500">({category.count})</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Price Range */}
					<div className="mb-3  border-b border-border/50  pb-3">
						<h4
							className="text-md text-foreground flex items-center justify-between cursor-pointer hover:text-slate-600 transition-colors"
							onClick={() => toggleSection('priceRange')}
						>
							Price Range
							<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.priceRange ? 'rotate-180' : ''}`} />
						</h4>
						<div
							className={`overflow-hidden transition-all duration-300 ease-in-out ${
								collapsedSections.priceRange ? 'max-h-0 opacity-0' : 'h-max pt-5 pb-3 opacity-100'
							}`}
						>
							<div className="px-2">
								<Slider value={priceRange} onValueChange={handlePriceRangeChange} max={2000} min={0} step={50} className="mb-4" />
								<div className="flex items-center justify-between text-sm text-gray-600">
									<span>${priceRange[0]}</span>
									<span>${priceRange[1]}</span>
								</div>
							</div>
						</div>
					</div>

					{/* Brands */}
					{/* <div className="mb-3 border-b border-border/50  pb-3">
						<h4
							className="text-md text-foreground flex items-center justify-between cursor-pointer hover:text-slate-600 transition-colors"
							onClick={() => toggleSection('brands')}
						>
							Brands
							<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.brands ? 'rotate-180' : ''}`} />
						</h4>
						<div
							className={`overflow-hidden transition-all duration-300 ease-in-out ${
								collapsedSections.brands ? 'max-h-0 opacity-0' : 'h-max py-3 opacity-100'
							}`}
						>
							<div className="space-y-2">
								{brands.map((brand) => (
									<div key={brand.id} className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Checkbox
												id={brand.id}
												checked={selectedBrands.includes(brand.id)}
												onCheckedChange={(checked) => handleBrandChange(brand.id, checked as boolean)}
											/>
											<label htmlFor={brand.id} className="text-sm cursor-pointer">
												{brand.name}
											</label>
										</div>
										<span className="text-xs text-gray-500">({brand.count})</span>
									</div>
								))}
							</div>
						</div>
					</div> */}

					{/* Rating */}
					<div className="mb-5">
						<h4
							className="text-md text-foreground flex items-center justify-between cursor-pointer hover:text-slate-600 transition-colors"
							onClick={() => toggleSection('rating')}
						>
							Rating
							<ChevronDown className={`w-4 h-4 transition-transform duration-200 ${collapsedSections.rating ? 'rotate-180' : ''}`} />
						</h4>
						<div
							className={`overflow-hidden transition-all duration-300 ease-in-out ${
								collapsedSections.rating ? 'max-h-0 opacity-0' : 'max-h-64 opacity-100'
							}`}
						>
							<div className="space-y-2">
								{[5, 4, 3, 2, 1].map((rating) => (
									<div key={rating} className="flex items-center space-x-2">
										<Checkbox
											id={`rating-${rating}`}
											checked={selectedRatings.includes(rating)}
											onCheckedChange={(checked) => handleRatingChange(rating, checked as boolean)}
										/>
										<label htmlFor={`rating-${rating}`} className="flex items-center space-x-1 text-sm cursor-pointer">
											<div className="flex">
												{[...Array(5)].map((_, i) => (
													<Star key={i} className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
												))}
											</div>
											<span>& Up</span>
										</label>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Clear Filters */}
					<Button variant="outline" className="w-full bg-transparent" onClick={() => clearAllFilters()}>
						Clear All Filters
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
