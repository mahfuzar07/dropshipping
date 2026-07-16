'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Settings, BarChart3, LayoutDashboard, ChevronDown, ChevronUp, ClipboardList, ShoppingCart, TicketPercent } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MenuItem {
	icon?: React.ComponentType<{ className?: string }>;
	label: string;
	href?: string;
	subItems?: MenuItem[];
}

const sidebarItems: MenuItem[] = [
	{ icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
	{ icon: Users, label: 'Customers', href: '/admin/customers' },
	{ icon: ClipboardList, label: 'Categories', href: '/admin/categories' },
	{
		icon: ShoppingCart,
		label: 'Orders',
		subItems: [
			{ label: 'All Orders', href: '/admin/orders' },
			{ label: 'Fulfillment & Shipping', href: '/admin/fulfillment' },
		],
	},
	{ icon: TicketPercent, label: 'Coupons', href: '/admin/coupons' },
	{ icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
	{
		icon: Settings,
		label: 'Settings',
		href: '/admin/settings',
	},
];

export default function AdminNavigation({ currentPath, closeDrawer }: { currentPath: string; closeDrawer?: () => void }) {
	const [expandedItems, setExpandedItems] = useState<string[]>([]);
	const router = useRouter();

	// Auto-expand parent if a child route is active
	useEffect(() => {
		const parentToExpand = sidebarItems.find((item) => item.subItems?.some((sub) => sub.href === currentPath))?.label;

		setExpandedItems(parentToExpand ? [parentToExpand] : []);
	}, [currentPath]);

	const handleItemClick = useCallback(
		(item: MenuItem) => {
			if (item.subItems?.length) {
				setExpandedItems((prev) => (prev.includes(item.label) ? prev.filter((l) => l !== item.label) : [item.label]));
			} else if (item.href) {
				router.push(item.href);
				if (closeDrawer) {
					closeDrawer();
				}
			}
		},
		[router, closeDrawer],
	);

	const MenuItemComponent = ({ item, isChild = false }: { item: MenuItem; isChild?: boolean }) => {
		const hasSubItems = !!item.subItems?.length;
		const isExpanded = expandedItems.includes(item.label);
		const isActive = (item.href && currentPath.startsWith(item.href)) || item.subItems?.some((sub) => sub.href && currentPath.startsWith(sub.href));

		return (
			<div className="font-play">
				<div
					onClick={() => handleItemClick(item)}
					className={`relative flex items-center w-full cursor-pointer px-6.5 py-2.5 ${isChild ? 'pl-10' : ''} ${
						isActive ? 'text-[#F16A38] bg-orange-50/50 font-semibold' : 'text-slate-600 hover:text-slate-900 duration-300'
					}`}
				>
					{!isChild && item.icon && <item.icon className={`mr-3.5 h-5 w-5 ${isActive ? 'text-[#F16A38]' : 'text-slate-400'}`} />}

					{isActive && !isChild && <div className="absolute left-0 top-0 h-full w-1 bg-[#F16A38]" />}

					<span className={`flex-1 ${isChild ? 'ml-5 text-sm font-medium hover:translate-x-1 duration-300' : 'text-[15px]'}`}>{item.label}</span>

					{hasSubItems &&
						(isExpanded ? (
							<ChevronUp className="h-4 w-4 transition-transform duration-300 text-slate-400" />
						) : (
							<ChevronDown className="h-4 w-4 transition-transform duration-300 text-slate-400" />
						))}
				</div>

				{/* Sub-items with Tailwind height transition */}
				<div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'h-max mt-1.5 space-y-1' : 'max-h-0'}`}>
					{hasSubItems && item.subItems!.map((sub) => <MenuItemComponent key={sub.href} item={sub} isChild />)}
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="flex flex-col h-full w-full bg-white border-r border-slate-200/60 text-slate-800">
				<Link href="/admin/dashboard" className="w-full h-18 md:h-20 flex items-center justify-center bg-[#FF5A1F] border-b border-orange-600/25 p-2.5 cursor-pointer shrink-0">
					<img src="/assets/brand.png" alt="Logo" className="w-full h-full object-contain filter brightness-0 invert" />
				</Link>

				<nav className="w-full space-y-2 py-5 pb-10 h-full overflow-y-auto scrollbar-hide">
					{sidebarItems.map((item) => (
						<MenuItemComponent key={item.label} item={item} />
					))}
				</nav>
			</div>
		</>
	);
}
