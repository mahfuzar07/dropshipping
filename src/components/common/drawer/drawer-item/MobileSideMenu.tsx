'use client';
import { useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
	ChevronLeft,
	ChevronRight,
	Menu,
	ChevronDown,
	LayoutGrid,
	ShoppingCart,
	Truck,
	FileText,
	Camera,
	Calculator,
	House,
	Package,
	Zap,
	Sparkles,
	MapPinned,
	BriefcaseBusiness,
} from 'lucide-react';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';

export interface DrawerProps<T = unknown> {
	open: boolean;
	drawerData?: T;
}

const serviceItems = [
	{
		title: 'Buy & Ship For Me',
		description: 'Customized buying and shipping.',
		href: '/services/buy-ship',
		icon: ShoppingCart,
	},
	{
		title: 'Ship For Me',
		description: 'Hassle-free shipping solutions.',
		href: '/services/ship',
		icon: Truck,
	},
	{
		title: 'Request For Quotation',
		description: 'Precise quotation management.',
		href: '/services/rfq',
		icon: FileText,
	},
	{
		title: 'Image Lens',
		description: 'Intelligent image-based search.',
		href: '/services/image-lens',
		icon: Camera,
	},
	{
		title: 'Cost Calculator',
		description: 'Accurate financial planning tools.',
		href: '/services/cost-calculator',
		icon: Calculator,
	},
];
const navItems = [
	{
		label: 'Home',
		href: '/',
		icon: House,
	},
	{
		label: 'Products',
		href: '/product-list',
		icon: Package,
	},
	{
		label: 'Flash Sale',
		href: '/flash-sale',
		icon: Zap,
	},
	{
		label: 'New Arrivals',
		href: '/new-sale',
		icon: Sparkles,
	},
	{
		label: 'Track Order',
		href: '/track-order',
		icon: MapPinned,
	},
];
export default function MobileSideMenu({ open }: DrawerProps) {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const pathname = usePathname();

	const toggleOpen = (key: string) => {
		setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
	};

	return (
		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="left">
			<DrawerContent className="h-full md:w-[450px] !w-[320px] flex flex-col border-none rounded-tr-2xl">
				{/* Close button */}
				<button
					onClick={closeDrawer}
					className="absolute right-3 top-4 z-50 w-8 h-8 rounded-full bg-primary/50 border border-border/50 flex items-center justify-center transition-colors shadow-md"
				>
					<ChevronLeft size={17} className="text-slate-100" />
				</button>

				<div className="w-full overflow-x-hidden flex flex-col h-full rounded-tr-2xl">
					{/* ── Header ── */}
					<div className="relative px-3 py-5 shrink-0 border-b border-border/50 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
						{/* Decorative circles */}
						<div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 pointer-events-none" />
						<div className="absolute -bottom-4 right-10 w-14 h-14 rounded-full bg-primary/5 pointer-events-none" />

						<div className="flex items-center gap-3 relative z-10">
							<div>
								<h2 className="text-lg font-semibold tracking-tight leading-tight text-foreground font-fredoka">Menus</h2>
							</div>
						</div>
					</div>

					{/* ── Category list ── */}
					<div className="flex-1 overflow-y-auto px-2 py-3 font-fredoka">
						{/* Normal Menus */}
						<div className="space-y-1">
							{navItems.map((item) => {
								const Icon = item.icon;

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={closeDrawer}
										className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
											pathname === item.href ? 'bg-primary text-white' : 'hover:bg-gray-100'
										}`}
									>
										<Icon size={18} />
										<span>{item.label}</span>
									</Link>
								);
							})}
						</div>

						{/* Services Dropdown */}
						<div className="mt-3 border-t pt-3">
							<button
								onClick={() => toggleOpen('services')}
								className="flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-gray-100 transition"
							>
								<div className="flex items-center gap-3">
									<BriefcaseBusiness size={18} />
									<span className="font-medium">Services</span>
								</div>

								<ChevronDown size={18} className={`transition-transform ${openKeys.includes('services') ? 'rotate-180' : ''}`} />
							</button>

							{openKeys.includes('services') && (
								<div className="mt-2 ml-3 space-y-2 border-l border-gray-200 pl-3">
									{serviceItems.map((service) => {
										const Icon = service.icon;

										return (
											<Link
												key={service.title}
												href={service.href}
												onClick={closeDrawer}
												className="flex gap-3 rounded-xl p-3 hover:bg-gray-50 transition"
											>
												<div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-orange-500 shrink-0">
													<Icon size={18} />
												</div>

												<div>
													<h4 className="text-sm font-semibold text-gray-900">{service.title}</h4>

													<p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
												</div>
											</Link>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
