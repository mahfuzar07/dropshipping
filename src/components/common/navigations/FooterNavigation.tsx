'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Package, User } from 'lucide-react';

import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

export default function FooterNavigation() {
	const pathname = usePathname();

	const { isAuthenticated } = useAuthStore();
	const { openDrawer } = useLayoutStore();

	const isActive = (path: string) => {
		if (path === '/') return pathname === '/';
		return pathname.startsWith(path);
	};

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-[0_-2px_15px_rgba(0,0,0,.08)] lg:hidden">
			<div className="relative h-14">
				{/* Floating Logo */}
				<div className="absolute left-1/2 -top-2 -translate-x-1/2">
					<Link href="/" className="flex h-15 w-15 items-center justify-center rounded-full border-4 border-white bg-primary shadow-lg">
						<Image src="/favicon.png" alt="Logo" width={34} height={34} priority />
					</Link>
				</div>

				<div className="grid h-full grid-cols-5 items-center">
					{/* Home */}
					<Link
						href="/"
						className={`flex flex-col items-center justify-center gap-1 transition-colors ${
							isActive('/') ? 'text-primary' : 'text-muted-foreground/80'
						}`}
					>
						<Home size={22} strokeWidth={1.8} />
						<span className="text-xs font-medium">Home</span>
					</Link>

					{/* Category */}
					<button
						onClick={() =>
							openDrawer({
								drawerType: 'category-drawer',
							})
						}
						className="flex flex-col items-center justify-center gap-1 text-muted-foreground/80"
					>
						<LayoutDashboard size={22} strokeWidth={1.8} />
						<span className="text-xs font-medium">Category</span>
					</button>

					{/* Empty Space */}
					<div />

					{/* Shop */}
					<Link
						href="/shop"
						className={`flex flex-col items-center justify-center gap-1 transition-colors ${
							isActive('/shop') ? 'text-primary' : 'text-muted-foreground/80'
						}`}
					>
						<Package size={22} strokeWidth={1.8} />
						<span className="text-xs font-medium">Shop</span>
					</Link>

					{/* Account */}
					<Link
						href={isAuthenticated ? '/customer/profile' : '/sign-in'}
						className={`flex flex-col items-center justify-center gap-1 transition-colors ${
							pathname.startsWith('/customer/profile') || pathname.startsWith('/sign-in') ? 'text-primary' : 'text-muted-foreground/80'
						}`}
					>
						<User size={22} strokeWidth={1.8} />
						<span className="text-xs font-medium">{isAuthenticated ? 'Account' : 'Login'}</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}
