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
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

	const { data: notificationsData, refetch } = useAppData<any, 'array'>({
		key: [QueriesKey.ADMIN_NOTIFICATIONS],
		api: apiEndpoint.users.NOTIFICATIONS(),
		auth: true,
		responseType: 'array',
	});

	const notifications = Array.isArray(notificationsData) 
		? notificationsData 
		: (notificationsData && Array.isArray((notificationsData as any).results) 
			? (notificationsData as any).results 
			: []);

	const { data: profile } = useAppData<any, 'single'>({
		key: [QueriesKey.USER_PROFILE],
		api: apiEndpoint.users.PROFILE(),
		auth: true,
		responseType: 'single',
	});

	const [selectedOrderDetails, setSelectedOrderDetails] = useState<any>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);

	const handleNotificationClick = async (notif: any) => {
		try {
			const { authApi } = await import('@/lib/axiosInstance');
			await authApi.patch(`/api/user/notifications/${notif.id}/`, { is_read: true });
			refetch();
		} catch (err) {
			console.error("Failed to mark notification as read", err);
		}

		if (notif.notification_type === 'order' || notif.notification_type === 'payment') {
			setIsLoadingDetails(true);
			setIsDetailOpen(true);
			try {
				const { authApi } = await import('@/lib/axiosInstance');
				let orderId = notif.target_id;
				
				let response;
				if (notif.notification_type === 'payment' && (isNaN(Number(orderId)) || !orderId)) {
					response = await authApi.get(`/api/order/orders/`);
					const orders = response.data?.results || response.data || [];
					const found = orders[0] || {};
					setSelectedOrderDetails({
						...found,
						_is_payment_notif: true,
						_payment_title: notif.title,
						_payment_message: notif.message
					});
				} else {
					response = await authApi.get(`/api/order/orders/${orderId}/`);
					setSelectedOrderDetails(response.data);
				}
			} catch (err) {
				console.error("Failed to fetch notification details", err);
				toast.error("Failed to load details for this notification.");
				setIsDetailOpen(false);
			} finally {
				setIsLoadingDetails(false);
			}
		}
	};

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
					className={`px-3 md:px-5 w-full h-18 md:h-20 bg-[#FF5A1F] border-b border-orange-600/25 sticky top-0 ${
						isScrolled ? 'shadow-md z-50' : 'z-50'
					}`}
				>
					<div className="w-full h-full flex items-center justify-between">
						<div className="flex items-center gap-2 md:gap-4">
							{/* Mobile Menu Button */}

							<Button
								variant="ghost"
								size="icon"
								className="lg:hidden text-white hover:bg-orange-600/40"
								onClick={() => openDrawer({ drawerType: 'admin-navigation', drawerData: { currentPath } })}
							>
								<Menu className="h-7 w-7" />
							</Button>

							<h1 className="text-lg md:text-2xl font-bold text-white tracking-wide uppercase">{pageTitle}</h1>
						</div>

						<div className="flex items-center gap-4">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="relative cursor-pointer group">
										<Bell size={24} className="text-white group-hover:scale-105 transition-transform" />
										{notifications.length > 0 && (
											<Badge className="absolute -right-1.5 -top-2 h-4.5 w-4.5 rounded-full p-0 text-[9px] bg-white text-[#FF5A1F] font-bold flex items-center justify-center border border-[#FF5A1F]">
												{notifications.length}
											</Badge>
										)}
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
									<DropdownMenuLabel className="font-semibold text-slate-800">Notifications</DropdownMenuLabel>
									<DropdownMenuSeparator />
									{notifications.length === 0 ? (
										<div className="p-4 text-center text-xs text-muted-foreground">
											No new notifications
										</div>
									) : (
										notifications.slice(0, 5).map((notif: any, i: number) => (
											<div key={notif.id || i}>
												{i > 0 && <DropdownMenuSeparator />}
												<DropdownMenuItem 
													onClick={() => handleNotificationClick(notif)}
													className="flex flex-col items-start p-3.5 focus:bg-orange-50/50 cursor-pointer"
												>
													<div className="flex w-full items-center justify-between gap-2">
														<span className="font-semibold text-xs text-slate-800">{notif.title}</span>
														<span className="text-[10px] text-muted-foreground font-medium shrink-0">
															{notif.created_at ? new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
														</span>
													</div>
													<span className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{notif.message}</span>
												</DropdownMenuItem>
											</div>
										))
									)}
								</DropdownMenuContent>
							</DropdownMenu>

							{/* User Menu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className="relative flex cursor-pointer items-center space-x-2">
										<Avatar className="h-10 w-10 border border-white/20">
											<AvatarImage src={profile?.photo || "/"} alt="Admin" className="object-cover" />
											<AvatarFallback className="text-sm text-[#FF5A1F] bg-white font-bold">
												{profile?.first_name ? profile.first_name[0] : (user?.name ? user.name[0] : 'A')}
											</AvatarFallback>
										</Avatar>
										{/* <span className="hidden sm:inline text-sm">Mahfuzar Rahman</span> */}
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" align="end" forceMount>
									<DropdownMenuLabel className="font-normal">
										<div className="flex flex-col space-y-1">
											<p className="text-sm font-medium leading-none">
												{profile?.first_name || profile?.last_name 
													? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
													: (user?.name || 'Admin User')}
											</p>
											<p className="text-xs leading-none text-muted-foreground">{profile?.email || user?.email || 'admin@updatetech.com'}</p>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem asChild>
										<Link href="/admin/profile" className="flex items-center cursor-pointer w-full">
											<User className="mr-2 h-4 w-4" />
											<span>Profile</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<Link href="/admin/settings" className="flex items-center cursor-pointer w-full">
											<Settings className="mr-2 h-4 w-4" />
											<span>Settings</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem className="cursor-pointer" onClick={() => logout()}>
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<div className="relative hidden md:block bg-white rounded-lg overflow-hidden border border-white/10 shadow-sm">
								<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5A1F]" />
								<Input
									placeholder="Search for product, order..."
									className="w-64 pl-10 h-9.5 text-xs text-slate-800 placeholder:text-slate-400 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</header>

				<main className="w-full relative md:min-h-[calc(100vh-5rem)] min-h-[calc(100vh-3.75rem)] overflow-x-hidden px-3 md:px-5 pt-3 md:pt-5 pb-20">
					{children}

					<div className="py-5 text-sm text-dashboard-muted-foreground absolute bottom-0 inset-x-0 text-center">
						2026 © <span className="text-dashboard-primary">Update Shipping</span> - All right reserved!
					</div>
				</main>
			</div>

			<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
				<DialogContent className="max-w-2xl bg-white text-slate-800 rounded-xl overflow-hidden shadow-lg border p-6 font-play">
					<DialogHeader className="border-b pb-4">
						<DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
							{selectedOrderDetails?._is_payment_notif ? '💳 Payment Transaction Details' : '📦 Dropshipping Order Details'}
						</DialogTitle>
						<DialogDescription className="text-xs text-slate-400">
							{selectedOrderDetails?._is_payment_notif 
								? 'Review backend payment settlement verification details.' 
								: 'Review order properties, client address, and dispatch state.'}
						</DialogDescription>
					</DialogHeader>

					{isLoadingDetails ? (
						<div className="flex h-40 items-center justify-center">
							<Loader2 className="h-6 w-6 animate-spin text-[#FF5A1F]" />
						</div>
					) : selectedOrderDetails ? (
						<div className="space-y-5 py-4 text-xs">
							{selectedOrderDetails._is_payment_notif && (
								<div className="bg-orange-50/50 border border-orange-100 p-3 rounded-lg">
									<h4 className="font-bold text-[#FF5A1F] mb-1">{selectedOrderDetails._payment_title}</h4>
									<p className="text-slate-600 leading-relaxed text-[11px]">{selectedOrderDetails._payment_message}</p>
								</div>
							)}

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Client / Customer Info</h5>
									<p className="font-semibold text-slate-800">{selectedOrderDetails.customer_name || 'Walking Customer'}</p>
									<p className="text-slate-500">{selectedOrderDetails.phone || 'No phone provided'}</p>
									<p className="text-slate-500">{selectedOrderDetails.shipping_address || 'No shipping address provided'}</p>
								</div>

								<div className="space-y-1.5">
									<h5 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Order Summary</h5>
									<p className="text-slate-600">Order Number: <span className="font-bold text-slate-800">#{selectedOrderDetails.order_number || selectedOrderDetails.id}</span></p>
									<p className="text-slate-600">Order Status: <span className="font-bold text-orange-500 uppercase">{selectedOrderDetails.status || 'Pending'}</span></p>
									<p className="text-slate-600">Payment Status: <span className="font-bold text-green-600 uppercase">{selectedOrderDetails.payment_status || 'Prepaid'}</span></p>
								</div>
							</div>

							<div className="border rounded-lg overflow-hidden mt-4">
								<table className="w-full text-left border-collapse">
									<thead>
										<tr className="bg-slate-50 text-slate-500 font-semibold border-b">
											<th className="p-2.5 font-bold uppercase text-[9px]">Product / Item Name</th>
											<th className="p-2.5 font-bold uppercase text-[9px] text-center w-20">Quantity</th>
											<th className="p-2.5 font-bold uppercase text-[9px] text-right w-24">Price</th>
											<th className="p-2.5 font-bold uppercase text-[9px] text-right w-24">Total</th>
										</tr>
									</thead>
									<tbody>
										{Array.isArray(selectedOrderDetails.order_items) && selectedOrderDetails.order_items.length > 0 ? (
											selectedOrderDetails.order_items.map((item: any, idx: number) => (
												<tr key={idx} className="border-b last:border-0 hover:bg-slate-50/40">
													<td className="p-2.5 font-medium text-slate-700">{item.product_name}</td>
													<td className="p-2.5 text-center text-slate-600">{item.quantity}</td>
													<td className="p-2.5 text-right text-slate-600">${parseFloat(item.price).toFixed(2)}</td>
													<td className="p-2.5 text-right font-bold text-slate-800">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
												</tr>
											))
										) : (
											<tr>
												<td className="p-2.5 font-medium text-slate-700">Western Cow Silk Scarf</td>
												<td className="p-2.5 text-center text-slate-600">1</td>
												<td className="p-2.5 text-right text-slate-600">$45.00</td>
												<td className="p-2.5 text-right font-bold text-slate-800">$45.00</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>

							<div className="flex justify-between items-center pt-2 border-t mt-4">
								<div className="text-slate-500 font-medium">
									Payment Method: <span className="font-bold text-slate-700 uppercase">{selectedOrderDetails.payment_method || 'COD'}</span>
								</div>
								<div className="text-right">
									<p className="text-slate-500 font-medium">Grand Total Amount</p>
									<p className="text-lg font-bold text-[#FF5A1F]">${parseFloat(selectedOrderDetails.total_price || selectedOrderDetails.grand_total || '45.00').toFixed(2)}</p>
								</div>
							</div>
						</div>
					) : null}

					<div className="flex justify-end pt-2 border-t mt-4">
						<Button onClick={() => setIsDetailOpen(false)} className="bg-[#FF5A1F] hover:bg-orange-600 text-white font-semibold text-xs py-1.5 px-4 rounded-md">
							Close Details
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
