'use client';
import React, { useState, useRef } from 'react';
import { Search, Heart, User, ShoppingBasket, Menu, Settings } from 'lucide-react';
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

export default function StoreHeader() {
	const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
	const { openDrawer, openModal } = useLayoutStore();
	const { logout, isAuthenticated, user } = useAuthStore();
	const isVisible = useScrollDirection();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const PRODUCT_CATEGORIES = [
		{ id: 1, name: 'Educational Toys', slug: 'educational-toys' },
		{ id: 2, name: 'Puzzles', slug: 'puzzles' },
		{ id: 3, name: 'Kids Accessories', slug: 'kids-accessories' },
	];

	const SERVICE_CATEGORIES = [
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
				className={`fixed top-0 min-h-[70px] md:min-h-[80px] 2xl:min-h-[100px] left-0 right-0 z-50 transition-transform duration-300 ${
					isVisible ? 'translate-y-0' : '-translate-y-full'
				}`}
			>
				<img src="/assets/header/wave-4.png" alt="" className="absolute top-0 left-0 right-0 w-full h-full object-fill" />

				<div className="container max-w-7xl relative mx-auto px-4 py-3">
					<div className="grid grid-cols-3 items-center">
						{/* Left - Logo + mobile menu btn */}
						<div>
							<button onClick={() => openDrawer({ drawerType: 'mobile-side-menu' })} className="md:hidden block text-muted-foreground">
								<Menu className="h-5 w-5" />
							</button>

							<div className="relative hidden md:block h-18 w-30 overflow-hidden rounded-xl">
								<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
							</div>
						</div>

						{/* Center - Mobile brand */}
						<div className="relative md:hidden h-13 w-30 overflow-hidden rounded-xl mx-auto">
							<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
						</div>

						{/* Desktop Nav - হোভার */}
						<nav className="hidden font-play font-medium md:flex items-center justify-center gap-8 col-span-1">
							{NAV_ITEMS.map((item) => (
								<div key={item.label} className="relative" onMouseEnter={() => handleMouseEnter(item)} onMouseLeave={handleMouseLeaveNav}>
									<a
										href={item.href}
										className="text-md text-slate-700 hover:text-twinkle-accent transition-colors"
										onClick={(e) => item.megaKey && e.preventDefault()}
									>
										{item.label}
									</a>
								</div>
							))}
						</nav>

						{/* Right Icons - একদম আগের মতো */}
						<div className="flex col-span-1 items-center justify-end gap-3 2xl:gap-4">
							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'search' })}>
								<Search size={26} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground" />
							</div>

							<div className="md:flex gap-5 hidden">
								{isAuthenticated ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<div className="flex text-slate-700 cursor-pointer">
												<User size={26} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
											</div>
										</DropdownMenuTrigger>
										<DropdownMenuContent className="w-64 rounded-xl shadow-lg border bg-white" align="end">
											<div>
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
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600">
													<User className="mr-2 h-4 w-4" />
													<span>Log Out</span>
												</DropdownMenuItem>
											</div>
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<div onClick={() => openModal({ modalType: 'login-modal' })} className="flex text-slate-700 cursor-pointer">
										<User size={26} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground transition" />
									</div>
								)}
							</div>

							<div className="relative hidden md:block cursor-pointer">
								<Heart size={26} strokeWidth={1.5} className="text-muted-foreground hover:text-foreground" />
								<div className="absolute -right-2 -top-2 h-4.5 w-4.5 rounded-full text-[10px] text-white bg-twinkle-accent flex items-center justify-center">
									3
								</div>
							</div>

							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<ShoppingBasket size={26} strokeWidth={1.2} className="text-muted-foreground hover:text-foreground" />
								<div className="absolute -right-1 -top-2 h-4.5 w-4.5 rounded-full text-[10px] text-white bg-twinkle-accent flex items-center justify-center">
									3
								</div>
							</div>
						</div>
					</div>

					{/* Mega Menu */}
					{activeMegaMenu && (
						<div onMouseEnter={handleMegaEnter} onMouseLeave={handleMegaLeave}>
							{activeMegaMenu === 'products' && (
								<div className="grid grid-cols-2 gap-6 px-5 pt-10 pb-20">
									<div>
										<h4 className="text-sm font-semibold text-slate-500 mb-2">Products</h4>
										<ul className="flex flex-col gap-2">
											{PRODUCT_CATEGORIES.map((cat) => (
												<li key={cat.id}>
													<a href={`/shop/${cat.slug}`} className="text-sm text-slate-700 hover:text-twinkle-accent transition-colors">
														{cat.name}
													</a>
												</li>
											))}
										</ul>
									</div>
								</div>
							)}

							{activeMegaMenu === 'services' && (
								<div className="px-5 pt-10 pb-20">
									<h4 className="text-sm font-semibold text-slate-500 mb-2">Services</h4>
									<ul className="flex flex-col gap-2">
										{SERVICE_CATEGORIES.map((cat) => (
											<li key={cat.id}>
												<a href={`/services/${cat.slug}`} className="text-sm text-slate-700 hover:text-twinkle-accent transition-colors">
													{cat.name}
												</a>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					)}
				</div>
			</header>

			<div className="min-h-[80px] md:h-[100px]" />
		</>
	);
}
