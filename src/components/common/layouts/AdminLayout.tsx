'use client';
import type { ReactNode } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Settings, Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { usePathname, useRouter } from 'next/navigation';
import AdminNavigation from '../navigations/AdminNavigation';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import UnauthenticatedSkeleton from '../loader/UnauthenticatedSkeleton';

interface AdminLayoutProps {
	children: ReactNode;
	currentPath?: string;
}

export default function AdminLayout({ children, currentPath = '/admin/dashboard' }: AdminLayoutProps) {
	const { openDrawer } = useLayoutStore();
	const [isScrolled, setIsScrolled] = useState(false);
	const router = useRouter();
	const { user, isAuthenticated, logout } = useAuthStore();
	const pathname = usePathname();

	const pageTitle = useMemo(() => {
		if (!pathname) return 'DASHBOARD';

		const segments = pathname.split('/').filter(Boolean);

		// if last segment looks like an id (anything not purely alphabetic)
		const isDynamicSegment = (segment: string) => {
			return !/^[a-z-]+$/i.test(segment);
		};

		let last = segments[segments.length - 1];

		if (isDynamicSegment(last) && segments.length > 1) {
			const parent = segments[segments.length - 2];

			const singular = parent.endsWith('s') ? parent.slice(0, -1) : parent;

			return `${singular} details`.replace(/-/g, ' ').toUpperCase();
		}

		return last.replace(/-/g, ' ').toUpperCase();
	}, [pathname]);

	// Redirect non-admin users
	// useEffect(() => {
	// 	if (!isAuthenticated || user?.role !== 'ADMIN') {
	// 		router.replace('/unauthorized');
	// 	}
	// }, [isAuthenticated, user, router]);

	// if (!isAuthenticated || user?.role !== 'ADMIN') return <UnauthenticatedSkeleton />;

	return (
		<div className="flex h-screen bg-dashboard-background text-dashboard-foreground font-play">
			{/* Desktop Sidebar */}
			<div className="hidden lg:block  w-70 2xl:w-82">
				<AdminNavigation currentPath={currentPath} />
			</div>

			<div className="w-full h-full overflow-y-auto scrollbar-hide" onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}>
				{/* Header */}
				<header
					className={`px-3 md:px-5 w-full h-18 md:h-20 bg-background/95 sticky top-0 ${
						isScrolled ? 'backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-[0_5px_5px_-5px_rgba(0,0,0,0.2)] z-50' : 'z-50'
					}`}
				>
					<div className="w-full h-full flex items-center justify-between">
						<div className="flex items-center gap-2 md:gap-4">
							{/* Mobile Menu Button */}

							<Button
								variant="ghost"
								size="icon"
								className="lg:hidden bg-slate-50"
								onClick={() => openDrawer({ drawerType: 'admin-navigation', drawerData: { currentPath } })}
							>
								<Menu className="h-8 w-8" />
							</Button>

							<h1 className="text-lg md:text-2xl font-medium text-dashboard-muted uppercase">{pageTitle}</h1>
						</div>

						<div className="flex items-center gap-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="relative cursor-pointer">
										<Bell size={26} className="text-dashboard-muted-foreground" />
										<Badge className="absolute -right-1 -top-2.5 h-5 w-5 rounded-full p-0 text-[10px] bg-dashboard-primary flex items-center justify-center">
											3
										</Badge>
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-80" align="end">
									<DropdownMenuLabel>Notifications</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="flex flex-col items-start p-4">
										<div className="flex w-full items-center justify-between">
											<span className="font-medium">New Order Received</span>
											<span className="text-xs text-muted-foreground">2m ago</span>
										</div>
										<span className="text-sm text-muted-foreground">Order #1234 from John Doe</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="flex flex-col items-start p-4">
										<div className="flex w-full items-center justify-between">
											<span className="font-medium">Low Stock Alert</span>
											<span className="text-xs text-muted-foreground">1h ago</span>
										</div>
										<span className="text-sm text-muted-foreground">{`Product "Widget A" is running low`}</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="flex flex-col items-start p-4">
										<div className="flex w-full items-center justify-between">
											<span className="font-medium">Payment Processed</span>
											<span className="text-xs text-muted-foreground">3h ago</span>
										</div>
										<span className="text-sm text-muted-foreground">$299.99 payment confirmed</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="text-center">
										<span className="text-sm">View all notifications</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* User Menu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="relative flex cursor-pointer items-center space-x-2">
										<Avatar className="h-11 w-11">
											<AvatarImage src="/" alt="Admin" />
											<AvatarFallback className="text-sm text-dashboard-muted-foreground font-semibold">MR</AvatarFallback>
										</Avatar>
										{/* <span className="hidden sm:inline text-sm">Mahfuzar Rahman</span> */}
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">Admin User</p>
											<p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<User className="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Settings className="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Log out</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<div className="relative hidden md:block bg-dashboard-background rounded overflow-hidden">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input placeholder="Search..." className="w-55 pl-10 border-none shadow-none rounded-none" />
							</div>
						</div>
					</div>
				</header>

				<main className="w-full relative md:min-h-[calc(100vh-5rem)] min-h-[calc(100vh-3.75rem)] overflow-x-hidden px-3 md:px-5 pt-3 md:pt-5 pb-20">
					{children}

					<div className="py-5 text-sm text-dashboard-muted-foreground absolute bottom-0 inset-x-0 text-center">
						2026 © <span className="text-dashboard-primary">Twinkle Bud</span> - All right reserved!
					</div>
				</main>
			</div>
		</div>
	);
}
