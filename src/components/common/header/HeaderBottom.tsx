'use client';
import { ChevronDown, Menu, Phone } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import CategoryMenu from './CategoryMenu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HoverPopover from '@/components/ui/custom/HoverPopover';
import ServiceContent from './dropdown-content/ServiceContent';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';
import { toast } from 'sonner';

export interface CategoryItem {
	[key: string]: any;
}

// main category
export interface Category {
	id: number;
	name: string;
	slug: string;
	icon: string;
	subcategories: Category[];
}

// full API response
export interface CategoriesResponse {
	categories: Category[];
}

export interface MenuCategory {
	id: string;
	name: string;
	slug: string;

	subcategories?: MenuCategory[];
}

export function normalizeCategories(rawCategories: any[]): MenuCategory[] {
	return rawCategories.map((cat) => ({
		id: cat.id,
		name: cat.name,
		slug: cat.id,

		subcategories: cat.subcategories?.map((sub: any, i: number) => ({
			id: `${cat.id}-${i}`,
			name: sub.name,
			slug: sub.name.toLowerCase().replace(/\s+/g, '-'),

			subcategories: sub.items?.map((item: any, j: number) => ({
				id: `${cat.id}-${i}-${j}`,
				name: item.name,
				slug: item.name.toLowerCase().replace(/\s+/g, '-'),
			})),
		})),
	}));
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
		label: 'Track Order',
		href: '/track-order',
	},
];

export default function HeaderBottom() {
	const pathname = usePathname();
	const { openDrawer, openModal } = useLayoutStore();

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

	const normalizedCategories = normalizeCategories(categories ?? []);

	return (
		<div className="h-full w-full backdrop-blur-xl text-md items-center justify-center border-b mb-2 md:block hidden">
			<div className="container mx-auto px-3 h-full font-fredoka font-medium tracking-wide">
				<div className="flex items-center justify-between  gap-2 h-full w-full">
					<HoverPopover
						width="min-w-[260px]"
						align="left"
						trigger={
							<div className="relative py-2.5 min-w-[260px] hidden rounded-t-md hover:bg-twinkle-teal text-white bg-primary md:flex items-center justify-center h-full text-lg gap-5 cursor-pointer">
								<Menu strokeWidth={3} size={18} />
								All Categories
								<ChevronDown strokeWidth={3} size={18} />
							</div>
						}
					>
						<CategoryMenu categories={normalizedCategories} columnClassName="min-w-[260px]" />
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
