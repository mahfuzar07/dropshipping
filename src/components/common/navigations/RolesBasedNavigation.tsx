'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
	Users,
	Settings,
	BarChart3,
	LayoutDashboard,
	ChevronDown,
	ChevronUp,
	ClipboardList,
	ShoppingCart,
	Shirt,
	TicketPercent,
	LayersPlus,
	Contact,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

/* ---------------- Roles ---------------- */

export type RoleType = 'SUPER_ADMIN' | 'HR_ADMIN' | 'DEPARTMENT_LEAD' | 'ACCOUNTS' | 'CALL_CENTER' | 'PACKER' | 'DELIVERY' | 'STAFF';

/* ---------------- Menu Interface ---------------- */

interface MenuItem {
	icon?: React.ComponentType<{ className?: string }>;
	label: string;
	href?: string;
	roles?: RoleType[];
	subItems?: MenuItem[];
}

/* ---------------- Sidebar Config ---------------- */

const sidebarItems: MenuItem[] = [
	{
		icon: LayoutDashboard,
		label: 'Dashboard',
		href: '/portal/admin/dashboard',
		roles: ['SUPER_ADMIN', 'HR_ADMIN', 'DEPARTMENT_LEAD'],
	},

	{
		icon: Contact,
		label: 'Work Space',
		roles: ['SUPER_ADMIN', 'HR_ADMIN'],
		subItems: [
			{
				label: 'Departments',
				href: '/portal/admin/department',
				roles: ['SUPER_ADMIN'],
			},
			{
				label: 'Employee List',
				href: '/portal/admin/employee',
				roles: ['SUPER_ADMIN', 'HR_ADMIN'],
			},
		],
	},

	{
		icon: Users,
		label: 'Customers',
		href: '/portal/admin/customers',
		roles: ['SUPER_ADMIN', 'CALL_CENTER'],
	},

	{
		icon: ClipboardList,
		label: 'Categories',
		href: '/portal/admin/categories',
		roles: ['SUPER_ADMIN'],
	},

	{
		icon: Shirt,
		label: 'Products',
		roles: ['SUPER_ADMIN', 'PACKER'],
		subItems: [
			{
				label: 'All Products',
				href: '/portal/admin/products',
				roles: ['SUPER_ADMIN', 'PACKER'],
			},
			{
				label: 'Add Product',
				href: '/portal/admin/add-product',
				roles: ['SUPER_ADMIN'],
			},
		],
	},

	{
		icon: ShoppingCart,
		label: 'Orders',
		href: '/portal/admin/orders',
		roles: ['SUPER_ADMIN', 'CALL_CENTER', 'PACKER'],
	},

	{
		icon: TicketPercent,
		label: 'Coupons',
		href: '/portal/admin/coupons',
		roles: ['SUPER_ADMIN'],
	},

	{
		icon: LayersPlus,
		label: 'Attributes',
		roles: ['SUPER_ADMIN'],
		subItems: [
			{ label: 'All Attributes', href: '/portal/admin/attributes', roles: ['SUPER_ADMIN'] },
			{ label: 'Create Attributes', href: '/portal/admin/add-attribute', roles: ['SUPER_ADMIN'] },
		],
	},

	{
		icon: BarChart3,
		label: 'Analytics',
		href: '/portal/admin/analytics',
		roles: ['SUPER_ADMIN', 'ACCOUNTS'],
	},

	{
		icon: Settings,
		label: 'Settings',
		href: '/portal/admin/settings',
		roles: ['SUPER_ADMIN'],
	},
];

/* ---------------- Role Filter ---------------- */

const filterMenuByRole = (items: MenuItem[], role: RoleType): MenuItem[] => {
	return items
		.filter((item) => !item.roles || item.roles.includes(role))
		.map((item) => ({
			...item,
			subItems: item.subItems ? item.subItems.filter((sub) => !sub.roles || sub.roles.includes(role)) : undefined,
		}))
		.filter((item) => !item.subItems || item.subItems.length > 0);
};

/* ---------------- Component ---------------- */

export default function RolesBasedNavigation({ currentPath, closeDrawer }: { currentPath: string; closeDrawer?: () => void }) {
	const router = useRouter();

	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	/* ----- Example user role (replace with auth/store) ----- */
	const userRole: RoleType = 'SUPER_ADMIN';

	const filteredSidebar = useMemo(() => filterMenuByRole(sidebarItems, userRole), [userRole]);

	/* ----- auto expand parent ----- */

	useEffect(() => {
		const parent = filteredSidebar.find((item) => item.subItems?.some((sub) => sub.href === currentPath))?.label;

		setExpandedItems(parent ? [parent] : []);
	}, [currentPath, filteredSidebar]);

	const handleItemClick = useCallback(
		(item: MenuItem) => {
			if (item.subItems?.length) {
				setExpandedItems((prev) => (prev.includes(item.label) ? prev.filter((l) => l !== item.label) : [item.label]));
			} else if (item.href) {
				router.push(item.href);
				closeDrawer?.();
			}
		},
		[router, closeDrawer],
	);

	/* ---------------- Menu Item Component ---------------- */

	const MenuItemComponent = ({ item, isChild = false }: { item: MenuItem; isChild?: boolean }) => {
		const hasSubItems = !!item.subItems?.length;
		const isExpanded = expandedItems.includes(item.label);

		const isActive = (item.href && currentPath.startsWith(item.href)) || item.subItems?.some((sub) => sub.href && currentPath.startsWith(sub.href));

		return (
			<div className="font-play">
				<div
					onClick={() => handleItemClick(item)}
					className={`relative flex items-center w-full cursor-pointer px-6.5 py-2 ${isChild ? 'pl-10' : ''} ${
						isActive ? 'text-white' : 'text-slate-300/65 hover:text-white duration-300'
					}`}
				>
					{!isChild && item.icon && <item.icon className={`mr-3.5 h-5 w-5 ${isActive ? 'text-[#F16A38]' : ''}`} />}

					{isActive && !isChild && <div className="absolute left-0 top-0 h-full w-0.5 bg-[#F16A38]" />}

					<span className={`flex-1 ${isChild ? 'ml-5 text-sm font-medium hover:translate-x-1 duration-300' : 'text-[15px]'}`}>{item.label}</span>

					{hasSubItems &&
						(isExpanded ? (
							<ChevronUp className="h-4 w-4 transition-transform duration-300" />
						) : (
							<ChevronDown className="h-4 w-4 transition-transform duration-300" />
						))}
				</div>

				<div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'h-max mt-1.5 space-y-1' : 'max-h-0'}`}>
					{hasSubItems && item.subItems!.map((sub) => <MenuItemComponent key={sub.href} item={sub} isChild />)}
				</div>
			</div>
		);
	};

	return (
		<div className="flex flex-col h-full w-full bg-dashboard-sidebar-background text-white">
			<div className="py-5 text-center mb-3">
				<h1 className="text-3xl font-bold text-[#F16A38]">Twinkle Bud</h1>
			</div>

			<nav className="w-full space-y-4 py-5 pb-10 h-full overflow-y-auto scrollbar-hide">
				{filteredSidebar.map((item) => (
					<MenuItemComponent key={item.label} item={item} />
				))}
			</nav>
		</div>
	);
}
