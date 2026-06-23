'use client';
import { ChevronDown, Menu, Phone } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import CategoryMenu, { type MenuCategory } from './CategoryMenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HoverPopover from '@/components/ui/custom/HoverPopover';
import ServiceContent from './dropdown-content/ServiceContent';
import { Category } from '@/types/customer';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';

export interface CategoryItem {
	[key: number]: any;
}

interface MenuCategoryWithParent extends MenuCategory {
	parentId?: number | null;
}

function normalizeCategories(rawCategories: Category[]): MenuCategory[] {
	const categoryMap = new Map<number, MenuCategoryWithParent>();

	// First pass: create all categories
	rawCategories.forEach((cat) => {
		categoryMap.set(cat.id, {
			id: cat.id,
			icon: cat.icon || '',
			name: cat.name,
			slug: cat.slug,
			parentId: cat.parentId || null,
			subcategories: [],
		});
	});

	const rootCategories: MenuCategory[] = [];

	// Second pass: build tree
	categoryMap.forEach((cat) => {
		if (cat.parentId) {
			const parent = categoryMap.get(cat.parentId);

			if (parent) {
				parent.subcategories?.push(cat);
			}
		} else {
			rootCategories.push(cat);
		}
	});

	// Remove empty subcategories
	const cleanCategories = (categories: MenuCategory[]): MenuCategory[] => {
		return categories.map((cat) => ({
			id: cat.id,
			icon: cat.icon,
			name: cat.name,
			slug: cat.slug,
			...(cat.subcategories && cat.subcategories.length > 0
				? {
						subcategories: cleanCategories(cat.subcategories),
					}
				: {}),
		}));
	};

	return cleanCategories(rootCategories);
}

const navItems = [
	{
		label: 'Home',
		href: '/',
	},
	{
		label: 'Products',
		href: '/products',
	},
	{
		label: 'Flash Sale',
		href: '/flash-sale',
	},
	{
		label: 'New Arrivals',
		href: '/new-sale',
	},
	{
		label: 'All Brands',
		href: '/brands',
	},
	{
		label: 'Track Order',
		href: '/track-order',
	},
];

export default function HeaderBottom() {
	const pathname = usePathname();
	const { openDrawer, openModal } = useLayoutStore();

	const { data, isLoading } = useAppData<any, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.categories.category,
		auth: true,
		responseType: 'single',
		enabled: true,
		refetchOnMount: true,
		staleTime: 2 * 60 * 1000,
	});

	const categories = Array.isArray(data) ? data : (data?.payload ?? []);
	const normalizedCategories = normalizeCategories(categories ?? []);

	return (
		<div className="h-full w-full backdrop-blur-xl text-md items-center justify-center border-b mb-2">
			<div className="container mx-auto px-3 h-full font-fredoka font-medium tracking-wide">
				<div className="flex items-center justify-between  gap-2 h-full">
					<HoverPopover
						className="w-[260px]"
						trigger={
							<div className="relative py-2.5 w-[260px] hidden rounded-t-md hover:bg-twinkle-teal text-white bg-primary md:flex items-center justify-center h-full text-lg gap-5 cursor-pointer">
								<Menu strokeWidth={3} size={18} />
								All Categories
								<ChevronDown strokeWidth={3} size={18} />
							</div>
						}
					>
						<CategoryMenu categories={normalizedCategories} />
					</HoverPopover>

					<div className="flex gap-4 items-center font-fredoka text-md font-medium">
						{navItems.map((item) => {
							const isActive = pathname === item.href;

							return (
								<Link
									key={item.href}
									href={item.href}
									className={`relative px-3 py-3.5 font-medium transition-all duration-300
                ${
									isActive
										? 'text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:rounded-md after:bg-primary'
										: 'text-gray-700 hover:text-primary/80'
								}`}
								>
									{item.label}
								</Link>
							);
						})}

						<HoverPopover
							className="mt-1.5"
							align="right"
							trigger={
								<Link href="/" className="px-3 py-1.5 rounded-full hover:bg-twinkle-teal transition-all duration-300 flex items-center gap-2">
									Services
									<ChevronDown strokeWidth={3} size={18} />
								</Link>
							}
						>
							<ServiceContent />
						</HoverPopover>
					</div>

					<div className="relative group hidden min-w-[240px]  hover:bg-twinkle-teal md:flex items-center justify-center h-full gap-1 cursor-pointer">
						<div className="flex items-center gap-1 text-sm font-quicksand font-medium">
							<Phone size={16} strokeWidth={2} className="fill-twinkle-teal" /> Help Line
							<span className="group-hover:underline group-hover:text-twinkle-gold">+880-1866175745</span>
						</div>
						{/* <div className="flex items-center border-l pl-2">
							<Price amount={120} className="font-fredoka font-semibold text-white/90" />
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
}
