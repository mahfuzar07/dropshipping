'use client';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { User, Home, Package, Heart, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function FooterNavigation() {
	const { hasHydrated, logout, isAuthenticated, user } = useAuthStore();
	const { openDrawer, openModal } = useLayoutStore();
	return (
		<nav className="fixed bottom-0 left-0 right-0 bg-store-secondary-muted text-muted-foreground border-t shadow-lg lg:hidden z-50">
			<div className="grid grid-cols-5 items-center font-emily py-0.5">
				<Link href="/" className="flex flex-col items-center gap-1 p-2">
					<Home className="w-5 h-5 ext-muted-foreground" />
					<span className="text-xs">Home</span>
				</Link>
				<Link href="/cart" className="flex flex-col items-center gap-1 p-2 ">
					<LayoutDashboard className="w-5 h-5" />
					<span className="text-xs">Category</span>
				</Link>

				<Link href="/customer/wishlist" className="flex flex-col items-center gap-1 p-2">
					<div className="relative cursor-pointer">
						<Heart size={30} strokeWidth={1.5} className="" />

						<div className="absolute -right-2 -top-2 h-4.5 w-4.5 rounded-full text-[10px] text-white bg-twinkle-accent flex items-center justify-center">
							3
						</div>
					</div>
				</Link>
				<Link href="/shop" className="flex flex-col items-center gap-1 p-2">
					<Package className="w-5 h-5" />
					<span className="text-xs">Shop</span>
				</Link>

				{isAuthenticated ? (
					<Link href="/customer/profile" className="flex flex-col items-center gap-1 p-2">
						<User className="w-5 h-5" />
						<span className="text-xs">Account</span>
					</Link>
				) : (
					<button onClick={() => openModal({ modalType: 'login-modal' })} className="flex flex-col items-center gap-1 p-2">
						<User className="w-5 h-5" />
						<span className="text-xs">Login</span>
					</button>
				)}
			</div>
		</nav>
	);
}
