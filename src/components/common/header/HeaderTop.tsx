'use client';
import { Search, User, ShoppingBasket, Menu, Bell, Heart } from 'lucide-react';
import Image from 'next/image';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import SearchBar from './SearchBar';
import NotificationContent from './dropdown-content/NotificationContent';
import HoverPopover from '@/components/ui/custom/HoverPopover';
import ProfileContent from './dropdown-content/ProfileContent';

interface HeaderTopProps {
	isScrolled: boolean;
}

export default function HeaderTop({ isScrolled }: HeaderTopProps) {
	const { openDrawer, openModal } = useLayoutStore();

	const { logout, isAuthenticated, user } = useAuthStore();

	return (
		<div className="z-10">
			<div className="container relative mx-auto py-1">
				<div className="text-sm py-2">
					<div className="container mx-auto flex justify-between items-center px-4">
						<div className="flex gap-6 text-gray-600">
							<p>🚚 Free Delivery on orders over Tk. 2000</p>
							<p>🛡️ 100% Original Products</p>
						</div>

						<div className="flex gap-6 text-gray-600">
							<p>Need Help? +88-01849220756</p>
							<p>info@xianmart.com</p>
						</div>
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
					<div className="relative col-span-5 md:col-span-6 md:hidden h-15 w-full overflow-hidden rounded-xl mx-auto">
						<Image src="/assets/brand.png" alt="brand" fill className="object-contain transition-transform duration-300 group-hover:scale-105" />
					</div>

					{/* Desktop Nav - হোভার */}
					<div className="hidden font-medium md:flex items-center justify-center gap-8 col-span-6">
						<SearchBar />
					</div>

					{/* Right Icons */}
					<div className="flex md:col-span-3 col-span-5 items-center justify-end gap-3 2xl:gap-7">
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
									className="items-center gap-2 text-slate-700 cursor-pointer md:flex hidden"
								>
									<div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
										<User size={24} strokeWidth={1.5} className="" />
									</div>
									<div className="flex flex-col leading-tight font-fredoka">
										<p className="text-sm">{isAuthenticated ? 'Welcome' : 'Sign In'}</p>
										<p className="leading-tight text-base">{!isAuthenticated ? 'My Account' : (user?.phone ?? 'Account')}</p>
									</div>
								</div>
							}
						>
							<ProfileContent isAuthenticated={isAuthenticated} user={user} logout={logout} />
						</HoverPopover>

						<div className="flex items-center">
							<div className="w-8.5 h-8.5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
								<ShoppingBasket size={24} strokeWidth={1.5} className="" />
							</div>

							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<span>Wishlist</span>
								<div className="absolute -right-4 -top-3 h-3.5 w-3.5 md:h-4.5 md:w-4.5 rounded-full text-[10px] text-white bg-primary ring-2 ring-white flex items-center justify-center">
									0
								</div>
							</div>
						</div>

						<div className="flex items-center">
							<div className="w-8.5 h-8.5 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
								<Heart size={24} strokeWidth={1.5} className="" />
							</div>

							<div className="relative cursor-pointer" onClick={() => openDrawer({ drawerType: 'cart' })}>
								<span>Cart</span>
								<div className="absolute -right-4 -top-3 h-3.5 w-3.5 md:h-4.5 md:w-4.5 rounded-full text-[10px] text-white bg-primary ring-2 ring-white flex items-center justify-center">
									0
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
