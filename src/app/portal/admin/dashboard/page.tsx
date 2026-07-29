'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, ShoppingCart, DollarSign, Clock, RotateCcw, Truck, ShieldAlert, CheckCircle, ArrowUpRight, Calendar } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';

interface Order {
	id: number;
	total_price: string;
	status: string;
	created_at: string;
}

interface CustomerUser {
	id: number;
	date_joined: string;
}

export default function AdminDashboardPage() {
	// Fetch all orders
	const { data: ordersResponse, isLoading: isOrdersLoading } = useAppData<any, 'single'>({
		key: [QueriesKey.USER_ORDERS, 'admin-dashboard-orders'],
		api: `${apiEndpoint.orders.ORDERS()}?view=admin&limit=1000`,
		auth: true,
		responseType: 'single',
	});

	// Fetch all customers
	const { data: customersResponse, isLoading: isCustomersLoading } = useAppData<any, 'single'>({
		key: [QueriesKey.ADMIN_CUSTOMERS, 'admin-dashboard-customers'],
		api: `/api/user/customer/`,
		auth: true,
		responseType: 'single',
	});

	const orders: Order[] = ordersResponse?.data || ordersResponse?.results || [];
	const customers: CustomerUser[] = customersResponse?.data || customersResponse?.results || [];

	// CALCULATIONS
	const stats = useMemo(() => {
		const now = new Date();
		const todayStr = now.toISOString().split('T')[0];

		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(now.getDate() - 7);

		const oneMonthAgo = new Date();
		oneMonthAgo.setDate(now.getDate() - 30);

		let todaySales = 0;
		let weeklySales = 0;
		let monthlySales = 0;

		const pipeline: Record<string, number> = {
			pending: 0,
			confirmed: 0,
			processing: 0,
			packed: 0,
			shipped: 0,
			delivered: 0,
			cancelled: 0,
			returned: 0,
		};

		orders.forEach((o) => {
			const oDate = new Date(o.created_at);
			const oDateStr = o.created_at.split('T')[0];
			const price = Number(o.total_price || 0);
			const status = o.status?.toLowerCase() || '';

			if (pipeline[status] !== undefined) {
				pipeline[status] += 1;
			}

			if (status !== 'cancelled') {
				if (oDateStr === todayStr) {
					todaySales += price;
				}
				if (oDate >= oneWeekAgo) {
					weeklySales += price;
				}
				if (oDate >= oneMonthAgo) {
					monthlySales += price;
				}
			}
		});

		return {
			todaySales,
			weeklySales,
			monthlySales,
			pipeline,
		};
	}, [orders]);

	// Charts Data Calculation
	const revenueData = useMemo(() => {
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const monthlyStats: Record<string, { revenue: number; orders: number }> = {};

		// Initialize last 6 months
		const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthLabel = months[d.getMonth()];
			monthlyStats[monthLabel] = { revenue: 0, orders: 0 };
		}

		orders.forEach((o) => {
			const date = new Date(o.created_at);
			const monthLabel = months[date.getMonth()];
			if (monthlyStats[monthLabel]) {
				monthlyStats[monthLabel].revenue += Number(o.total_price || 0);
				monthlyStats[monthLabel].orders += 1;
			}
		});

		return Object.entries(monthlyStats).map(([month, data]) => ({
			month,
			revenue: data.revenue,
			orders: data.orders,
		}));
	}, [orders]);

	const customerGrowthData = useMemo(() => {
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const monthlyStats: Record<string, number> = {};

		const now = new Date();
		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthLabel = months[d.getMonth()];
			monthlyStats[monthLabel] = 0;
		}

		customers.forEach((c) => {
			const date = new Date(c.date_joined);
			const monthLabel = months[date.getMonth()];
			if (monthlyStats[monthLabel] !== undefined) {
				monthlyStats[monthLabel] += 1;
			}
		});

		// Cumulative count
		let sum = Math.max(0, customers.length - Object.values(monthlyStats).reduce((a, b) => a + b, 0));
		return Object.entries(monthlyStats).map(([month, count]) => {
			sum += count;
			return { month, customers: sum };
		});
	}, [customers]);

	const formattedDate = useMemo(() => {
		return new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}, []);

	if (isOrdersLoading || isCustomersLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">Loading dashboard analytics...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 font-play">
			{/* Overview header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-2xl font-bold text-slate-800">Welcome to Update Shipping Admin</h2>
					<p className="text-sm text-slate-500">Monitor order dispatch, performance metrics, and revenues real-time.</p>
				</div>
				<div className="flex items-center gap-2 bg-slate-50 border px-4 py-2 rounded-lg text-sm font-semibold text-slate-600">
					<Calendar size={16} />
					<span>{formattedDate}</span>
				</div>
			</div>

			{/* Core KPI Metrics Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="hover:shadow-md transition duration-300">
					<CardContent className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium text-slate-500">Today&apos;s Sales</p>
								<h3 className="text-2xl font-bold mt-1 text-slate-800">৳{stats.todaySales.toLocaleString()}</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> Live updates
								</span>
							</div>
							<div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
								<DollarSign size={22} />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition duration-300">
					<CardContent className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium text-slate-500">Total Customers</p>
								<h3 className="text-2xl font-bold mt-1 text-slate-800">{customers.length.toLocaleString()}</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> Registered users
								</span>
							</div>
							<div className="p-3 bg-blue-50 rounded-lg text-blue-600">
								<Users size={22} />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition duration-300">
					<CardContent className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium text-slate-500">Weekly Sales</p>
								<h3 className="text-2xl font-bold mt-1 text-slate-800">৳{stats.weeklySales.toLocaleString()}</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> Last 7 days
								</span>
							</div>
							<div className="p-3 bg-purple-50 rounded-lg text-purple-600">
								<TrendingUp size={22} />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="hover:shadow-md transition duration-300">
					<CardContent className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium text-slate-500">Monthly Sales</p>
								<h3 className="text-2xl font-bold mt-1 text-slate-800">৳{stats.monthlySales.toLocaleString()}</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> Last 30 days
								</span>
							</div>
							<div className="p-3 bg-amber-50 rounded-lg text-amber-600">
								<ShoppingCart size={22} />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Order Status Breakdown Metrics */}
			<div>
				<h3 className="text-lg font-bold text-slate-700 mb-3">Order Status Pipeline</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
					{[
						{ label: 'Pending', count: stats.pipeline.pending, color: 'text-amber-600 bg-amber-50', icon: Clock },
						{ label: 'Confirmed', count: stats.pipeline.confirmed, color: 'text-sky-600 bg-sky-50', icon: CheckCircle },
						{ label: 'Processing', count: stats.pipeline.processing, color: 'text-blue-600 bg-blue-50', icon: TrendingUp },
						{ label: 'Packed', count: stats.pipeline.packed, color: 'text-purple-600 bg-purple-50', icon: ShoppingCart },
						{ label: 'Shipped', count: stats.pipeline.shipped, color: 'text-indigo-600 bg-indigo-50', icon: Truck },
						{ label: 'Delivered', count: stats.pipeline.delivered, color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
						{ label: 'Cancelled', count: stats.pipeline.cancelled, color: 'text-rose-600 bg-rose-50', icon: ShieldAlert },
						{ label: 'Returned', count: stats.pipeline.returned, color: 'text-rose-650 bg-rose-50', icon: RotateCcw },
					].map((item) => (
						<div key={item.label} className="bg-white p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 shadow-sm">
							<div className={`p-2 rounded-lg ${item.color}`}>
								<item.icon size={18} />
							</div>
							<div>
								<p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{item.label}</p>
								<p className="text-base font-bold text-slate-800">{item.count}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Revenue & Orders Trend */}
				<Card className="lg:col-span-2 shadow-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg font-bold text-slate-800">Revenue Trends</CardTitle>
						<CardDescription>Dynamic monthly shop billing breakdown</CardDescription>
					</CardHeader>
					<CardContent className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
								<XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
								<YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
								<Tooltip formatter={(value) => [`৳${(value as number).toLocaleString()}`, 'Revenue']} />
								<Line type="monotone" dataKey="revenue" stroke="#F16A38" strokeWidth={3} activeDot={{ r: 8 }} />
							</LineChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* Customer Growth */}
				<Card className="shadow-sm">
					<CardHeader className="pb-4">
						<CardTitle className="text-lg font-bold text-slate-800">Customer Growth</CardTitle>
						<CardDescription>Live onboarding trends of registered shoppers</CardDescription>
					</CardHeader>
					<CardContent className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={customerGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
								<XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
								<YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
								<Tooltip formatter={(value) => [value, 'Customers']} />
								<Area type="monotone" dataKey="customers" stroke="#4F46E5" fill="#EEF2FF" strokeWidth={2} />
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
