'use client';
import { useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ChevronLeft, Plus, Minus, User, UserCircle } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import Link from 'next/link';
import Image from 'next/image';
import { NAV_ITEMS } from '@/lib/constants/data';

interface Category {
	id: number;
	name: string;
	slug: string;
	children?: Category[];
}

interface MenuItemProps {
	label: string;
	href?: string;
	children?: Category[];
	parentKey?: string;
}

const productCategories: Category[] = [
	{ id: 1, name: 'Educational Toys', slug: 'educational-toys' },
	{ id: 2, name: 'Puzzles', slug: 'puzzles' },
	{ id: 3, name: 'Kids Accessories', slug: 'kids-accessories' },
];

const serviceCategories: Category[] = [
	{ id: 1, name: 'School Management System', slug: 'school-management' },
	{ id: 2, name: 'School Website Design', slug: 'school-website' },
	{ id: 3, name: 'Online Quiz System', slug: 'online-quiz' },
	{ id: 4, name: 'Custom Software', slug: 'custom-software' },
];

export default function MobileSideMenu() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	const toggleOpen = (key: string) => {
		setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
	};

	const MenuItem = ({ label, href, children, parentKey = label }: MenuItemProps) => {
		const hasChildren = !!children?.length;
		const isOpen = openKeys.includes(parentKey);

		return (
			<div>
				<div className="flex justify-between items-center px-3 py-2 hover:bg-slate-50 text-slate-700 cursor-pointer text-md">
					{href ? (
						<Link href={href} onClick={closeDrawer} className="flex-1 block">
							{label}
						</Link>
					) : (
						<span className="flex-1">{label}</span>
					)}

					{hasChildren && (
						<span
							onClick={(e) => {
								e.stopPropagation();
								toggleOpen(parentKey);
							}}
						>
							{isOpen ? <Minus size={15} /> : <Plus size={15} />}
						</span>
					)}
				</div>

				{hasChildren && isOpen && (
					<div className="ml-2 mt-1 !text-sm border-none">
						{children.map((cat) => (
							<MenuItem
								key={cat.id}
								label={cat.name}
								href={`${href || ''}/${cat.slug}`}
								children={cat.children}
								parentKey={`${parentKey}-${cat.id}`}
							/>
						))}
					</div>
				)}
			</div>
		);
	};

	const getCategories = (megaKey?: string) => {
		if (megaKey === 'products') return productCategories;
		if (megaKey === 'services') return serviceCategories;
		return undefined;
	};

	return (
		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="left">
			<DrawerContent className="h-full md:w-[400px] flex flex-col">
				{/* Close Button */}
				<button
					className="flex items-center justify-center absolute w-10 h-10 -right-5 top-2 rounded-full bg-slate-200 shadow ring-1 ring-white/50"
					onClick={closeDrawer}
				>
					<ChevronLeft size={26} strokeWidth={2} className="text-slate-700" />
				</button>

				{/* Brand */}
				<div className="p-3 py-5 bg-slate-50">
					<div className="relative p-3 h-16 w-full overflow-hidden rounded-xl">
						<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
					</div>
				</div>

				{/* Navigation */}
				<nav className="h-full overflow-y-auto px-3 py-5 space-y-2.5 font-emily">
					{NAV_ITEMS.map((item) => (
						<MenuItem key={item.label} label={item.label} href={item.href} children={getCategories(item.megaKey)} />
					))}
				</nav>

				{/* User Section */}
				<div className="p-3 z-10 bg-white border-t w-full absolute bottom-0">
					<div className="flex items-center gap-3 text-slate-700 cursor-pointer">
						<UserCircle size={26} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
						<span className="text-sm">Login / Register</span>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
