'use client';
import React, { useState, useRef } from 'react';
import { Search, Heart, User, ShoppingBasket, Menu, Settings, Divide } from 'lucide-react';
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

type Category = {
	id: number;
	name: string;
	slug: string;
	children?: Category[];
};

export function CategoryItem({ item, level = 0 }: { item: Category; level?: number }) {
	const [open, setOpen] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setOpen(true);
	};

	const handleLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setOpen(false);
		}, 150);
	};

	return (
		<div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
			{/* ITEM */}
			<div className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-slate-100">
				<span>{item.name}</span>
				{item.children && <span className={`transition-transform ${open ? 'rotate-90' : ''}`}>›</span>}
			</div>

			{/* CHILDREN */}
			<AnimatePresence>
				{open && item.children && (
					<motion.div
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						transition={{ duration: 0.2 }}
						className="
							absolute top-0 left-full
							w-56
							bg-white border shadow-lg rounded
							min-h-[500px] max-h-[500px]
							overflow-y-auto
							z-50
						"
					>
						{item.children.map((child) => (
							<CategoryItem key={child.id} item={child} level={level + 1} />
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default function StoreHeader() {
	const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
	const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
	const { openDrawer, openModal } = useLayoutStore();
	const { logout, isAuthenticated, user } = useAuthStore();
	const isVisible = useScrollDirection();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const SERVICE = [
		{ id: 1, name: 'School Management System', slug: 'school-management' },
		{ id: 2, name: 'School Website Design', slug: 'school-website' },
		{ id: 3, name: 'Online Quiz System', slug: 'online-quiz' },
		{ id: 4, name: 'Custom Software', slug: 'custom-software' },
	];

	const handleMouseEnter = (item: { megaKey?: string }) => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		if (item.megaKey) setActiveMegaMenu(item.megaKey);
	};

	const handleMouseLeaveNav = () => {
		timeoutRef.current = setTimeout(() => {
			setActiveMegaMenu(null);
		}, 200);
	};

	const handleMegaEnter = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
	};

	const handleMegaLeave = () => {
		timeoutRef.current = setTimeout(() => {
			setActiveMegaMenu(null);
		}, 200);
	};

	return (
		<>
			<header
				className={`fixed top-0 min-h-[80px] left-0 right-0 z-50 transition-transform duration-300 bg-slate-100 flex items-center ${
					isVisible ? 'translate-y-0' : '-translate-y-full'
				}`}
			>
				<div className="container relative mx-auto px-4 py-3">
					<div className="grid grid-cols-3 items-center">
						{/* Left - Logo + mobile menu btn */}
						<div>
							<button onClick={() => openDrawer({ drawerType: 'mobile-side-menu' })} className="md:hidden block text-muted-foreground">
								<Menu className="h-5 w-5" />
							</button>

							{/* <div className="relative hidden md:block h-18 w-30 overflow-hidden rounded-xl">
								<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
							</div> */}
							<div>
								<h1>Brand Logo</h1>
							</div>
						</div>

						{/* Desktop Nav - */}
						<nav className="hidden font-play font-medium md:flex items-center justify-center gap-8 col-span-1">
							<div className="relative " onMouseEnter={() => handleMouseEnter({ megaKey: 'products' })} onMouseLeave={handleMouseLeaveNav}>
								<span className="cursor-pointer text-md text-slate-700">Categories</span>

								<AnimatePresence>
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute border left-0 top-full mt-2 w-50 bg-white z-50 min-h-[600px] rounded"
										onMouseEnter={handleMegaEnter}
										onMouseLeave={handleMegaLeave}
									>
										{CATEGORIES.map((cat) => (
											<CategoryItem key={cat.id} item={cat} />
										))}
									</motion.div>
								</AnimatePresence>
							</div>

							{/* SERVICES */}
							<div className="relative" onMouseEnter={() => handleMouseEnter({ megaKey: 'services' })} onMouseLeave={handleMouseLeaveNav}>
								<span className="cursor-pointer text-md text-slate-700">Services</span>

								<AnimatePresence>
									{activeMegaMenu === 'services' && (
										<motion.div
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.2 }}
											className="absolute left-0 top-full mt-3 w-64 bg-white shadow-lg rounded-xl border p-4 z-50"
											onMouseEnter={handleMegaEnter}
											onMouseLeave={handleMegaLeave}
										>
											<ul className="flex flex-col gap-2">
												{SERVICE.map((item) => (
													<li key={item.id}>
														<a href={`/services/${item.slug}`} className="text-sm text-slate-700 hover:text-twinkle-accent transition">
															{item.name}
														</a>
													</li>
												))}
											</ul>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</nav>

						{/* Right Icons - */}
						<div className="flex col-span-1 items-center justify-end gap-3 2xl:gap-4">
							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'search' })}>
								<Search size={26} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground" />
							</div>

							<div className="md:flex gap-5 hidden">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<div className="flex text-slate-700 cursor-pointer">
											<User size={26} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
										</div>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-64 p-5 rounded-xl shadow-lg border bg-white" align="end">
										<div>
											{isAuthenticated ? (
												<DropdownMenuLabel className="font-normal">
													<div className="flex items-center gap-3 p-2">
														<div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
															<User className="h-5 w-5 text-primary" />
														</div>
														<div className="flex flex-col">
															<p className="text-sm font-semibold leading-none">Welcome back 👋</p>
															<p className="text-xs text-muted-foreground mt-1">{user?.phone}</p>
														</div>
													</div>
												</DropdownMenuLabel>
											) : (
												<div className="flex flex-col gap-2 py-2">
													<Button>Sign In</Button>
													<Button variant="outline">Registration</Button>
												</div>
											)}

											<DropdownMenuSeparator />
											<DropdownMenuItem className="cursor-pointer">
												<User className="mr-2 h-4 w-4" />
												<span>My Profile</span>
											</DropdownMenuItem>
											<DropdownMenuItem className="cursor-pointer">
												<Settings className="mr-2 h-4 w-4" />
												<span>Account Settings</span>
											</DropdownMenuItem>
											<DropdownMenuItem className="cursor-pointer">
												<span className="mr-2 h-4 w-4">📦</span>
												<span>My Orders</span>
											</DropdownMenuItem>

											{isAuthenticated && (
												<>
													<DropdownMenuSeparator />
													<DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
														<User className="mr-2 h-4 w-4" />
														<span>Log Out</span>
													</DropdownMenuItem>
												</>
											)}
										</div>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<div className="relative hidden md:block cursor-pointer">
								<Heart size={26} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground" />
								<div className="absolute -right-2 -top-2 h-4.5 w-4.5 rounded-full text-[10px] text-white bg-green-600 flex items-center justify-center">
									3
								</div>
							</div>

							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<ShoppingBasket size={26} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground" />
								<div className="absolute -right-1 -top-2 h-4.5 w-4.5 rounded-full text-[10px] text-white bg-green-600 flex items-center justify-center">
									3
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="min-h-[80px]" />
		</>
	);
}
