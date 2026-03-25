'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TypoTitle from '@/components/common/elements/TypoTitle';
import { ProductGrid } from '../product/ProductGrid';

type Product = {
	id: number;
	title: string;
	price: string;
	image: string;
};

type TabConfig = {
	key: string;
	label: string;
	products: Product[];
};

export const tabsConfig: TabConfig[] = [
	{
		key: 'girls',
		label: 'Girls’ Clothing',
		products: [
			{
				id: 1,
				title: 'Little Stars Dress',
				price: '55.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
			{
				id: 2,
				title: 'Baby Bear Hoodie',
				price: '50.00$ – 95.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
			{
				id: 3,
				title: 'Little Stars Dress',
				price: '55.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
			{
				id: 4,
				title: 'Baby Bear Hoodie',
				price: '50.00$ – 95.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
			{
				id: 5,
				title: 'Little Stars Dress',
				price: '55.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
			{
				id: 6,
				title: 'Baby Bear Hoodie',
				price: '50.00$ – 95.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
			{
				id: 7,
				title: 'Little Stars Dress',
				price: '55.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
			{
				id: 8,
				title: 'Baby Bear Hoodie',
				price: '50.00$ – 95.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
		],
	},
	{
		key: 'boys',
		label: 'Boys’ Clothing',
		products: [
			{
				id: 3,
				title: 'Junior Jogger Pants',
				price: '77.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
		],
	},
	{
		key: 'accessories',
		label: 'Accessories',
		products: [
			{
				id: 4,
				title: 'Mini Denim Jacket',
				price: '99.00$',
				image: 'https://jthemes.net/themes/wp/kidify/wp-content/uploads/2023/10/product5-334x394.png',
			},
		],
	},
	{ key: 'newborn', label: 'Newborn', products: [] },
	{ key: 'sale', label: 'Sale', products: [] },
];

const tabTriggerClass =
	'relative rounded-full px-5 py-2 text-sm md:text-md font-medium ' +
	'text-muted-foreground border border-transparent transition-all duration-200 ' +
	'hover:border-dashed hover:border-twinkle-accent hover:text-twinkle-accent ' +
	'data-[state=active]:border-dashed data-[state=active]:border-twinkle-accent ' +
	'data-[state=active]:text-twinkle-accent data-[state=active]:bg-transparent';

export default function NewInStoreSection() {
	// at least one tab has products?
	const hasAnyProduct = tabsConfig.some((tab) => tab.products.length > 0);
	if (!hasAnyProduct) return null;

	return (
		<section className="py-5 md:py-10 mb-10">
			<div className="container max-w-7xl mx-auto px-4">
				{/* Title */}
				<div className="md:mb-8 mb-5 text-center space-y-3">
					<span className="inline-block rounded-full bg-twinkle-accent/10 px-4 py-1 text-xs md:text-sm font-medium text-twinkle-accent mb-5">NEW IN STORE</span>
					<TypoTitle title="Recommend For You" align="center" />
				</div>

				<Tabs defaultValue={tabsConfig[0].key} className="w-full">
					{/* Tabs header */}
					<TabsList className="mx-auto md:mb-8 mb-5 flex w-fit gap-3 md:gap-5 bg-transparent p-0">
						{tabsConfig.map((tab) => (
							<TabsTrigger key={tab.key} value={tab.key} className={tabTriggerClass}>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					{/* Tabs content */}
					{tabsConfig.map((tab) => (
						<TabsContent key={tab.key} value={tab.key}>
							<ProductGrid products={tab.products} />
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	);
}
