'use client';
import React, { useState, useRef } from 'react';
import { Search, Heart, User, ShoppingBasket, Menu, Settings, Divide, ArrowBigDown, ArrowDown, ChevronDown, Smartphone, Headset, MapPin, Globe } from 'lucide-react';
import Image from 'next/image';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { NAV_ITEMS } from '@/lib/constants/data';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import HoverPopover from '@/components/ui/custom/HoverPopover';
import Link from 'next/link';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = [
	{
		id: 1,
		name: 'Level 1',
		slug: 'l1',
		children: [
			{
				id: 2,
				name: 'Level 2',
				slug: 'l2',
				children: [
					{
						id: 3,
						name: 'Level 3',
						slug: 'l3',
					},
				],
			},
		],
	},
	{
		id: 2,
		name: 'Level 1',
		slug: 'l1',
		children: [
			{
				id: 2,
				name: 'Level 2',
				slug: 'l2',
				children: [
					{
						id: 3,
						name: 'Level 3',
						slug: 'l3',
					},
				],
			},
		],
	},
];

export default function StoreHeader() {
	const { openDrawer, openModal } = useLayoutStore();
	const { logout, isAuthenticated, user } = useAuthStore();
	const isVisible = useScrollDirection();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const [open, setOpen] = useState(true);
	return (
		<>
			<header
				className={`fixed md:min-h-[100px] top-0 left-0 right-0 z-50 transition-transform duration-300  shadow ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
			>
				<div className="bg-slate-50 items-center hidden md:flex ">
					<div className="container relative mx-auto px-4 py-1">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-5">
								<Link href="/" className="flex gap-1.5 items-center text-slate-500 cursor-pointer text-sm">
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

								<Select>
									<SelectTrigger className="w-25 border-none bg-transparent h-auto px-0 focus:ring-0 focus:ring-offset-0 shadow-none focus:border-none! focus:ring-transparent!">
										<MapPin size={14} className="text-gray-500" />
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

				<div className="bg-white flex items-center">
					<div className="container relative mx-auto px-4 py-4">
						<div className="grid md:grid-cols-3 grid-cols-2 items-center ">
							{/* Left - Logo + mobile menu btn */}
							<div>
								<button onClick={() => openDrawer({ drawerType: 'mobile-side-menu' })} className="md:hidden block text-muted-foreground">
									<Menu className="h-5 w-5" />
								</button>

								{/* <div className="relative hidden md:block h-18 w-30 overflow-hidden rounded-xl">
								<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
							</div> */}
								<div className="relative hidden md:block overflow-hidden rounded-xl">
									<h1>Brand Logo</h1>
								</div>
							</div>

							{/* Desktop Nav - */}
							<nav className="hidden font-play font-medium md:flex items-center justify-center gap-8 col-span-1"></nav>

							{/* Right Icons - */}
							<div className="flex col-span-1 items-center justify-end gap-3 2xl:gap-4">
								<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'search' })}>
									<Search size={22} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground" />
								</div>

								<HoverPopover
									trigger={
										<div className="flex gap-2 items-center text-slate-500 cursor-pointer">
											<User size={22} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
											<div className="flex items-center gap-1.5">
												Profile
												<ChevronDown size={18} />
											</div>
										</div>
									}
								>
									<div className="px-3 py-5">
										{isAuthenticated ? (
											<div className="flex items-center gap-3 p-2">
												<div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
													<User className="h-5 w-5 text-primary" />
												</div>
												<div>
													<p className="text-sm font-semibold">Welcome back 👋</p>
													<p className="text-xs text-muted-foreground">{user?.phone}</p>
												</div>
											</div>
										) : (
											<div className="flex flex-col gap-2">
												<Button>Sign In</Button>
												<Button variant="outline">Registration</Button>
											</div>
										)}

										<div className="my-3 border-t" />

										<div className="flex flex-col gap-1 text-sm">
											<div className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2">
												<User className="h-4 w-4" /> My Profile
											</div>
											<div className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2">
												<Settings className="h-4 w-4" /> Settings
											</div>
										</div>
									</div>
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

			<div className="md:min-h-[100px]" />
		</>
	);
}
