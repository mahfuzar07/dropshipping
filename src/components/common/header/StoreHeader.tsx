'use client';
import React, { useState, useRef } from 'react';
import { Heart, User, ShoppingBasket, Menu, ChevronDown, Smartphone, Headset, Globe, Truck, Bell } from 'lucide-react';

import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useScrollDirection } from '@/hooks/useScrollDirection';

import HoverPopover from '@/components/ui/custom/HoverPopover';
import Link from 'next/link';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import NotificationContent from './dropdown-content/NotificationContent';
import ProfileContent from './dropdown-content/ProfileContent';
import ServiceContent from './dropdown-content/ServiceContent';
import CategoryPopover from '@/components/ui/custom/CategoryPopover';
import CategoryMenu from './CategoryMenu';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';

// export const CATEGORIES = [
// 	{
// 		id: 1,
// 		name: 'Electronics',
// 		slug: 'electronics',
// 		children: [
// 			{
// 				id: 2,
// 				name: 'Mobiles',
// 				slug: 'mobiles',
// 				children: [
// 					{ id: 3, name: 'Android Phones', slug: 'android' },
// 					{ id: 4, name: 'iPhone', slug: 'iphone' },
// 				],
// 			},
// 			{
// 				id: 5,
// 				name: 'Laptops',
// 				slug: 'laptops',
// 				children: [
// 					{ id: 6, name: 'Gaming Laptop', slug: 'gaming' },
// 					{ id: 7, name: 'Ultrabook', slug: 'ultrabook' },
// 				],
// 			},
// 		],
// 	},
// 	{
// 		id: 8,
// 		name: 'Fashion',
// 		slug: 'fashion',
// 		children: [
// 			{
// 				id: 9,
// 				name: 'Men',
// 				slug: 'men',
// 				children: [
// 					{ id: 10, name: 'Shirts', slug: 'shirts' },
// 					{ id: 11, name: 'Shoes', slug: 'shoes' },
// 				],
// 			},
// 		],
// 	},
// ];

export default function StoreHeader() {
	const { openDrawer, openModal } = useLayoutStore();
	const { logout, isAuthenticated, user } = useAuthStore();
	const isVisible = useScrollDirection();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [open, setOpen] = useState(true);

	const { data: categoriesData, isLoading: isLoadingAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.products.CATEGORIES(),
		auth: true,
		responseType: 'single',

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const CATEGORIES = categoriesData?.categories || [];
	console.log('CATEGORIE---', CATEGORIES);

	return (
		<>
			<header
				className={`sticky w-full md:min-h-[100px] top-0 left-0 right-0 z-50 transition-transform duration-300  shadow ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
			>
				<div className="bg-slate-100 items-center hidden md:flex ">
					<div className="container relative mx-auto px-4 py-1">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Link href="/" className="flex gap-1.5 items-center text-slate-500 cursor-pointer text-sm border-r pr-3">
									<Smartphone size={16} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
									<span className="">Brand App</span>
								</Link>

								<Link href="/" className="flex gap-1.5 items-center text-slate-500 cursor-pointer text-sm">
									<Headset size={16} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
									<span className="">Support</span>
								</Link>
							</div>
							<div className="flex items-center gap-5">
								<div className="flex gap-3 items-center text-slate-500 cursor-pointer text-sm">
									<div className="relative hidden md:block cursor-pointer">
										<Heart size={22} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground" />
										<div className="absolute -right-2 -top-1 h-4 w-4 rounded-full text-[10px] text-white bg-orange-300 flex items-center justify-center">
											3
										</div>
									</div>
									Wishlist
								</div>
								<div className="">
									<Select>
										<SelectTrigger className="w-25 border-none bg-transparent h-auto px-0 focus:ring-0 focus:ring-offset-0 shadow-none focus:border-none! focus:ring-transparent!">
											<Truck size={14} className="text-gray-500" />
											<SelectValue placeholder="Ship To" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="bd">🇧🇩 Bangladesh</SelectItem>
												<SelectItem value="in">🇮🇳 India</SelectItem>
												<SelectItem value="pk">🇵🇰 Pakistan</SelectItem>
												<SelectItem value="ae">🇦🇪 UAE</SelectItem>
												<SelectItem value="cn">🇨🇳 China</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div className="">
									<Select>
										<SelectTrigger className="w-26 border-none bg-transparent h-auto px-0 focus:ring-0 focus:ring-offset-0 shadow-none focus:border-none! focus:ring-transparent!">
											<Globe size={14} className="text-gray-500" />
											<SelectValue placeholder="Lang" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="apple">English</SelectItem>
												<SelectItem value="banana">Bangla</SelectItem>
												<SelectItem value="blueberry">Chinese</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white flex items-center">
					<div className="container relative mx-auto px-4 py-4">
						<div className="grid md:grid-cols-4 grid-cols-2 items-center ">
							{/* Left - Logo + mobile menu btn */}
							<div>
								<button onClick={() => openDrawer({ drawerType: 'mobile-side-menu' })} className="md:hidden block text-muted-foreground">
									<Menu className="h-5 w-5" />
								</button>

								{/* <div className="relative hidden md:block h-18 w-30 overflow-hidden rounded-xl">
								<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
							</div> */}
								<div className="flex items-center gap-8">
									<div className="relative hidden md:block overflow-hidden rounded-xl">
										<h1>Brand Logo</h1>
									</div>
									<CategoryPopover
										trigger={
											<div className="relative cursor-pointer font-medium flex items-center gap-1.5 bg-slate-100 px-5 py-2 rounded hover:bg-slate-100">
												Catgory
												<ChevronDown size={18} />
											</div>
										}
									>
										<CategoryMenu categories={CATEGORIES} />
									</CategoryPopover>
								</div>
							</div>

							{/* Desktop Nav - */}
							<nav className="hidden font-play font-medium md:flex items-center justify-center gap-5 col-span-2">
								<ul className="flex gap-5">
									<li>Contact</li>
									<li>Terms & Condition</li>
									<li>Privacy Policy</li>
								</ul>
								<HoverPopover
									trigger={
										<div className="relative cursor-pointer font-medium flex items-center gap-1.5">
											Services
											<ChevronDown size={18} />
										</div>
									}
								>
									<ServiceContent />
								</HoverPopover>
							</nav>

							{/* Right Icons - */}
							<div className="flex col-span-1 items-center justify-end gap-3 2xl:gap-5">
								<HoverPopover
									trigger={
										<div className="flex gap-1 items-center text-slate-500 cursor-pointer ">
											<User size={20} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
											<span className="flex items-center gap-1.5">Profile</span>
										</div>
									}
								>
									<ProfileContent isAuthenticated={isAuthenticated} user={user} />
								</HoverPopover>
								<HoverPopover
									trigger={
										<div className="relative cursor-pointer">
											<Bell size={22} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground mt-1" />
											<div className="absolute -right-1 -top-2 h-4.5 w-4.5 rounded-full text-[10px] text-white bg-orange-300 flex items-center justify-center">
												0
											</div>
										</div>
									}
								>
									<NotificationContent />
								</HoverPopover>

								<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
									<ShoppingBasket size={26} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground" />
									<div className="absolute -right-1 -top-2 h-4.5 w-4.5 rounded-full text-[10px] text-white bg-orange-300 flex items-center justify-center">
										3
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* <div className="md:min-h-[100px]" />	 */}
		</>
	);
}
