'use client';
import { Search, User, ShoppingBasket, Menu, Bell, Heart, Truck, ShieldCheck, ShoppingCart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useMemo } from 'react';

import HoverPopover from '@/components/ui/custom/HoverPopover';
import ProfileContent from './dropdown-content/ProfileContent';
import SearchBar from '../elements/SearchBar';

export default function HeaderTop() {
	const router = useRouter();
	const { openDrawer } = useLayoutStore();

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
					if (typeof v?.quantity === 'number') {
						return sum + v.quantity;
					} else if (v?.quantity && typeof v.quantity === 'object') {
						return sum + Object.values(v.quantity).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
					}
					return sum;
				}, 0)
			);
		}, 0);
	}, [data, isAuthenticated]);

	const cartTotal = useMemo(() => {
		if (!isAuthenticated || !Array.isArray(data?.data)) return 0;
		return data.data.reduce((total: number, item: any) => {
			if (!Array.isArray(item?.variants)) return total;
			return (
				total +
				item.variants.reduce((sum: number, v: any) => {
					const qty =
						typeof v?.quantity === 'number'
							? v.quantity
							: v?.quantity && typeof v.quantity === 'object'
								? Object.values(v.quantity).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0)
								: 0;
					const price = Number(v?.price || 0);
					return sum + qty * price;
				}, 0)
			);
		}, 0);
	}, [data, isAuthenticated]);

	return (
		<div className="bg-primary">
			<div className="container relative mx-auto pl-3 pr-1 py-2 transition-all duration-300 ease-in-out">
				<div className="grid grid-cols-12 items-center gap-5">
					{/* Left - Logo + mobile menu btn */}
					<div className="md:col-span-3 hidden md:block">
						<div
							className={`
								relative hidden md:block overflow-hidden rounded-xl
								transition-all duration-300 ease-in-out h-20 w-65

							`}
							onClick={() => {
								window.location.href = '/';
							}}
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
					<div
						className="relative col-span-6 md:col-span-6 md:hidden md:h-15 h-11 w-full overflow-hidden rounded-xl mx-auto"
						onClick={() => {
							window.location.href = '/';
						}}
					>
						<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
					</div>

					{/* Desktop Nav - হোভার */}
					<div className="hidden font-medium md:flex items-center justify-center gap-8 col-span-6">
						<SearchBar />
					</div>

					{/* Right Icons */}
					<div className="flex md:col-span-3 col-span-6 items-center md:justify-end justify-end gap-1 md:gap-5 2xl:gap-7">
						<div className="flex items-center">
							<div className="w-8.5 h-8.5 md:w-10 md:h-10 bg-primary text-white rounded-full flex items-center justify-center">
								<Heart size={24} strokeWidth={1.5} className="" />
							</div>

							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<p className="text-xs md:block hidden text-white font-semibold">Wishlist</p>
								<div className="absolute -right-1 md:-right-4 -top-4 h-4 w-4 md:h-5 md:w-5 rounded-full text-[10px] text-white bg-primary ring-2 ring-white flex items-center justify-center">
									0
								</div>
							</div>
						</div>

						<div className="flex items-center gap-1">
							<div
								className="w-8.5 h-8.5 md:w-10 md:h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer"
								onClick={() => openDrawer({ drawerType: 'cart' })}
							>
								<ShoppingBag size={24} strokeWidth={1.5} className="" />
							</div>

							<div className="relative cursor-pointer flex flex-col items-start leading-none" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<p className="text-xs md:block hidden text-white font-semibold">Cart</p>
								<div className="absolute -right-1 md:-right-4 -top-4 h-4 w-4 md:h-5 md:w-5 rounded-full text-[10px] text-white bg-primary ring-2 ring-white flex items-center justify-center">
									{cartCount}
								</div>
							</div>
						</div>

						{isAuthenticated ? (
							<HoverPopover
								align="right"
								className="mt-5 min-w-[250px] flex"
								trigger={
									<div className="items-center text-white cursor-pointer flex justify-center">
										<div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
											<User size={24} strokeWidth={1.5} className="" />
										</div>
										<div className="md:flex hidden font-semibold flex-col leading-tight font-fredoka">
											<p className="text-xs">Welcome</p>
											<p className="leading-tight text-sm"> My Profile</p>
										</div>
									</div>
								}
							>
								<ProfileContent isAuthenticated={isAuthenticated} user={user} logout={logout} />
							</HoverPopover>
						) : (
							<div onClick={() => router.push('/sign-in')} className="items-center text-white cursor-pointer flex justify-center">
								<div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
									<User size={24} strokeWidth={1.5} className="" />
								</div>
								<div className="md:flex hidden font-semibold flex-col leading-tight font-fredoka">
									<p className="text-xs">Sign In</p>
									<p className="leading-tight text-sm">Account</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="md:hidden block container mx-auto px-3 pb-2">
				<SearchBar />
			</div>
		</div>
	);
}
