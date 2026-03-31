import Image from 'next/image';
import React from 'react';

const kitchenAppliances = [
	{ id: 1, title: 'Kitchen Waffle Irons', image: '/assets/product/product-3.webp' },
	{ id: 2, title: 'Kitchen Rice Cookers', image: '/assets/product/product-4.webp' },
	{ id: 3, title: 'Ice Cream Machines', image: '/assets/product/product-3.webp' },
	{ id: 4, title: 'Cookware Sets', image: '/assets/product/product-4.webp' },
	{ id: 5, title: 'Specialty Tools & Gadgets', image: '/assets/product/product-3.webp' },
	{ id: 6, title: 'Blender Replacement Parts', image: '/assets/product/product-4.webp' },
];

const householdSupplies = [
	{ id: 7, title: 'Household Cleaning', image: '/assets/product/product-1.webp' },
	{ id: 8, title: 'Laundry Supplies', image: '/assets/product/product-2.webp' },
	{ id: 9, title: 'Air Freshener Supplies', image: '/assets/product/product-1.webp' },
	{ id: 10, title: 'Dishwashing Supplies', image: '/assets/product/product-2.webp' },
	{ id: 11, title: 'Carpet Cleaners', image: '/assets/product/product-1.webp' },
	{ id: 12, title: 'Stain Remover', image: '/assets/product/product-2.webp' },
];

export default function SmallKitchenAndHouseholdSection() {
	return (
		<div className="bg-white py-12">
			<div className="container mx-auto px-4">
				{/* Header */}

				{/* Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* LEFT */}
					<div>
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center justify-between gap-6 w-full">
								<h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight uppercase">Small Kitchen Appliances</h3>

								<button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-md text-sm transition">
									View All
								</button>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
							{kitchenAppliances.map((item) => (
								<div
									key={item.id}
									className="group border border-gray-100 rounded overflow-hidden bg-white hover:shadow-sm transition cursor-pointer flex items-center"
								>
									<div className="relative aspect-square h-full w-1/2 bg-gray-50 shrink-0">
										<Image src={item.image} alt={item.title} fill className="object-contain" />
									</div>

									<div className="p-3 text-center">
										<h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</h4>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* RIGHT */}
					<div>
						<div className="flex items-center justify-between mb-6">
							<div className="flex items-center justify-between gap-6 w-full">
								<h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">TOP-RATED HOUSEHOLD SUPPLIES</h3>

								<button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-md text-sm transition">
									View All
								</button>
							</div>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
							{householdSupplies.map((item) => (
								<div
									key={item.id}
									className="group border border-gray-100 rounded overflow-hidden bg-white hover:shadow-sm transition cursor-pointer flex items-center"
								>
									<div className="relative aspect-square h-full w-1/2 bg-gray-50 shrink-0">
										<Image src={item.image} alt={item.title} fill className="object-contain" />
									</div>

									<div className="p-3 text-center">
										<h4 className="text-sm font-medium text-gray-800 line-clamp-2">{item.title}</h4>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Mobile Button */}
				<div className="flex justify-center mt-6 lg:hidden">
					<button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-full text-sm transition">
						View All Categories
					</button>
				</div>
			</div>
		</div>
	);
}
