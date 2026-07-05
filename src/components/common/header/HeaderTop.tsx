'use client';
import { Search, User, ShoppingBasket, Menu, Bell, Heart, Truck, ShieldCheck, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useMemo } from 'react';

import HoverPopover from '@/components/ui/custom/HoverPopover';
import ProfileContent from './dropdown-content/ProfileContent';
import SearchBar from '../elements/SearchBar';

interface HeaderTopProps {
	isScrolled: boolean;
}

export default function HeaderTop({ isScrolled }: HeaderTopProps) {
	const { openDrawer, openModal } = useLayoutStore();

	const { logout, isAuthenticated, user } = useAuthStore();

	const { data } = useAppData<any, 'single'>({
		key: [QueriesKey.CART_DATA],
		api: apiEndpoint.cart.GET_CART(),
		auth: true,
		responseType: 'single',
		enabled: isAuthenticated,
	});

	const cartCount = useMemo(() => {
		if (!isAuthenticated || !Array.isArray(data?.data)) return 0;
		return data.data.reduce((total: number, item: any) => {
			if (!Array.isArray(item?.variants)) return total;
			return (
				total +
				item.variants.reduce((sum: number, v: any) => {
					if (!v?.quantity || typeof v.quantity !== 'object') return sum;
					return sum + Object.values(v.quantity).filter((q: any) => q > 0).length;
				}, 0)
			);
		}, 0);
	}, [data, isAuthenticated]);

	return (
		<div className="">
			<div className="container mx-auto hidden md:block">
				<div className="bg-white border-b border-gray-100 text-xs text-gray-600 flex justify-between items-center px-3 py-2">
					<div className="flex items-center gap-4">
						<span className="flex items-center gap-1.5">
							<Truck size={24} className="fill-primary text-slate-100" />
							Free Delivery on orders over Tk. 2000
						</span>
						<span className="text-gray-300">|</span>
						<span className="flex items-center gap-1.5">
							<ShieldCheck size={24} className="fill-primary text-slate-100" />
							100% Original Products
						</span>
					</div>
					<div className="flex items-center gap-4">
						<span>Need Help? +88-01849220756</span>
						<span className="text-gray-300">|</span>
						<span>info@xianmart.com</span>
					</div>
				</div>
			</div>

			<div className="container relative mx-auto pl-3 pr-1 py-2 transition-all duration-300 ease-in-out">
				<div className="grid grid-cols-12 items-center gap-5">
					{/* Left - Logo + mobile menu btn */}
					<div className="md:col-span-3 col-span-2">
						<button className="md:hidden block">
							<div
								onClick={() => openDrawer({ drawerType: 'mobile-side-menu' })}
								className="w-8.5 h-8.5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center md:hidden"
							>
								<Menu size={20} strokeWidth={1.5} className="" />
							</div>
						</button>

						<div
							className={`
								relative hidden md:block overflow-hidden rounded-xl
								transition-all duration-300 ease-in-out h-18 w-60

							`}
						>
							<Image
								src="/assets/brand.png"
								alt="brand"
								fill
								className="object-contain transition-transform duration-300 group-hover:scale-105 py-2"
							/>
						</div>
					</div>

					{/* Center - Mobile brand */}
					<div className="relative col-span-6 md:col-span-6 md:hidden md:h-15 h-13 w-full overflow-hidden rounded-xl mx-auto">
						<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
					</div>

					{/* Desktop Nav - হোভার */}
					<div className="hidden font-medium md:flex items-center justify-center gap-8 col-span-6">
						<SearchBar />
					</div>

					{/* Right Icons */}
					<div className="flex md:col-span-3 col-span-4 items-center md:justify-end justify-center gap-1 md:gap-5 2xl:gap-7">
						<div
							className="w-8.5 h-8.5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center relative cursor-pointer md:hidden"
							onClick={() => openDrawer({ drawerType: 'search' })}
						>
							<Search size={20} strokeWidth={1.5} className="" />
						</div>

						<HoverPopover
							align="right"
							className="mt-5 min-w-[250px] md:flex hidden"
							trigger={
								<div
									onClick={!isAuthenticated ? () => openModal({ modalType: 'auth-modal', modalData: 'login' }) : undefined}
									className="items-center text-slate-700 cursor-pointer md:flex hidden"
								>
									<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<User size={24} strokeWidth={1.5} className="" />
									</div>
									<div className="flex flex-col leading-tight font-fredoka">
										<p className="text-xs">{isAuthenticated ? 'Welcome' : 'Sign In'}</p>
										<p className="leading-tight text-sm">{!isAuthenticated ? 'My Account' : (user?.phone ?? 'Account')}</p>
									</div>
								</div>
							}
						>
							<ProfileContent isAuthenticated={isAuthenticated} user={user} logout={logout} />
						</HoverPopover>

						<div className="md:flex hidden items-center">
							<div className="w-8.5 h-8.5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
								<Heart size={24} strokeWidth={1.5} className="" />
							</div>

							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<p className="text-sm">Wishlist</p>
								<div className="absolute -right-4 -top-3 h-3.5 w-3.5 md:h-4.5 md:w-4.5 rounded-full text-[10px] text-white bg-primary ring-2 ring-white flex items-center justify-center">
									0
								</div>
							</div>
						</div>

						<div className="flex items-center">
							<div className="w-8.5 h-8.5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
								<ShoppingCart size={24} strokeWidth={1.5} className="" />
							</div>

							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<p className="text-sm md:block hidden">Cart</p>
								<div className="absolute -right-0 md:-right-4 -top-4 h-4 w-4 md:h-5 md:w-5 rounded-full text-[10px] text-white bg-primary ring-2 ring-white flex items-center justify-center">
									{cartCount}
								</div>
							</div>
						</div>

						{/* <HoverPopover
							align="right"
							className="mt-5"
							trigger={
								<div className="relative md:block cursor-pointer">
									<div className="w-8.5 h-8.5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
										<Bell size={24} strokeWidth={1.5} className="" />
									</div>

									<div className="absolute right-1 -top-1 h-3.5 w-3.5 md:h-4.5 md:w-4.5 rounded-full text-[10px] bg-twinkle-gold ring-2 ring-white flex items-center justify-center">
										0
									</div>
								</div>
							}
						>
							<NotificationContent />
						</HoverPopover> */}
					</div>
				</div>
			</div>
		</div>
	);
}
