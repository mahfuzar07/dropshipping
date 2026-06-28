'use client';
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
	TrendingUp,
	Users,
	ShoppingCart,
	DollarSign,
	Clock,
	RotateCcw,
	Truck,
	ShieldAlert,
	Award,
	CheckCircle,
	ArrowUpRight,
	Calendar
} from 'lucide-react';
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	LineChart,
	Line,
	BarChart,
	Bar,
	CartesianGrid
} from 'recharts';

// Rich Mock and Combined Data for a stunning dashboard
const revenueData = [
	{ month: 'Jan', revenue: 120000, orders: 480 },
	{ month: 'Feb', revenue: 190000, orders: 590 },
	{ month: 'Mar', revenue: 170000, orders: 510 },
	{ month: 'Apr', revenue: 240000, orders: 780 },
	{ month: 'May', revenue: 310000, orders: 990 },
	{ month: 'Jun', revenue: 450000, orders: 1240 },
];

const customerGrowthData = [
	{ month: 'Jan', customers: 1200 },
	{ month: 'Feb', customers: 1650 },
	{ month: 'Mar', customers: 2100 },
	{ month: 'Apr', customers: 2850 },
	{ month: 'May', customers: 3900 },
	{ month: 'Jun', customers: 5400 },
];

const topProducts = [
	{ id: 1, name: 'Wireless Bluetooth Earbuds Pro', category: 'Electronics', sales: 450, revenue: '৳540,000', stock: 120, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=100&auto=format&fit=crop&q=60' },
	{ id: 2, name: 'Premium Leather Smart Watch', category: 'Wearables', sales: 320, revenue: '৳416,000', stock: 85, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=100&auto=format&fit=crop&q=60' },
	{ id: 3, name: 'Ergonomic Memory Foam Pillow', category: 'Home & Living', sales: 290, revenue: '৳145,000', stock: 240, image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=100&auto=format&fit=crop&q=60' },
	{ id: 4, name: 'Ultra-thin Portable Power Bank 20k', category: 'Accessories', sales: 210, revenue: '৳252,000', stock: 15, image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=100&auto=format&fit=crop&q=60' }
];

const topCategories = [
	{ name: 'Smart Electronics', productsCount: 142, salesVolume: '৳1,250,000', percentage: 45 },
	{ name: 'Home Appliances', productsCount: 89, salesVolume: '৳780,000', percentage: 28 },
	{ name: 'Fashion & Apparel', productsCount: 210, salesVolume: '৳480,000', percentage: 17 },
	{ name: 'Kitchen Tools', productsCount: 65, salesVolume: '৳290,000', percentage: 10 }
];

export default function AdminDashboardPage() {
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
					<span>Jun 24, 2026</span>
				</div>
			</div>

			{/* Core KPI Metrics Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="hover:shadow-md transition duration-300">
					<CardContent className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm font-medium text-slate-500">Today&apos;s Sales</p>
								<h3 className="text-2xl font-bold mt-1 text-slate-800">৳45,230</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> +12.4% from yesterday
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
								<h3 className="text-2xl font-bold mt-1 text-slate-800">5,432</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> +8.1% this week
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
								<h3 className="text-2xl font-bold mt-1 text-slate-800">৳312,400</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> +15.2% vs last week
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
								<h3 className="text-2xl font-bold mt-1 text-slate-800">৳1,480,000</h3>
								<span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-2">
									<ArrowUpRight size={14} /> +22.8% vs last month
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
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
					{[
						{ label: 'Pending', count: 18, color: 'text-amber-600 bg-amber-50', icon: Clock },
						{ label: 'Processing', count: 24, color: 'text-blue-600 bg-blue-50', icon: TrendingUp },
						{ label: 'Shipped', count: 42, color: 'text-indigo-600 bg-indigo-50', icon: Truck },
						{ label: 'Delivered', count: 512, color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle },
						{ label: 'Returned', count: 7, color: 'text-rose-600 bg-rose-50', icon: RotateCcw },
						{ label: 'Refund Requests', count: 3, color: 'text-purple-600 bg-purple-50', icon: ShieldAlert }
					].map((item) => (
						<div key={item.label} className="bg-white p-4 rounded-xl border flex items-center gap-3 shadow-sm">
							<div className={`p-2 rounded-lg ${item.color}`}>
								<item.icon size={20} />
							</div>
							<div>
								<p className="text-xs text-slate-500 font-medium">{item.label}</p>
								<p className="text-lg font-bold text-slate-800">{item.count}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Revenue & Orders Trend */}
				<Card className="lg:col-span-2 shadow-sm">
					<CardHeader className="flex flex-row items-center justify-between pb-4">
						<div>
							<CardTitle className="text-lg font-bold text-slate-800">Revenue & Order Trends</CardTitle>
							<CardDescription>Monthly representation of store turnover</CardDescription>
						</div>
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
						<CardDescription>Active shopper registrations</CardDescription>
					</CardHeader>
					<CardContent className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={customerGrowthData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
								<XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
								<YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
								<Tooltip />
								<Area type="monotone" dataKey="customers" stroke="#3B82F6" fill="rgba(59, 130, 246, 0.1)" strokeWidth={2} />
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</div>

			{/* Supplier & Shipping Performance Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Supplier Performance Metrics */}
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row items-center gap-3">
						<div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
							<Award size={20} />
						</div>
						<div>
							<CardTitle className="text-base font-bold text-slate-800">Supplier Performance Metrics</CardTitle>
							<CardDescription>Tracking 1688 and local suppliers</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{[
							{ metric: 'Average Lead Time', value: '6.4 Days', desc: 'Sourcing to warehouse arrival', percent: 92 },
							{ metric: 'Supplier Fill Rate', value: '98.2%', desc: 'Correct inventory supplied', percent: 98 },
							{ metric: 'Cost Defect Rate', value: '0.4%', desc: 'Price errors on dispatch', percent: 99.6 }
						].map((item) => (
							<div key={item.metric} className="space-y-1">
								<div className="flex justify-between text-sm">
									<span className="font-semibold text-slate-700">{item.metric}</span>
									<span className="font-bold text-[#F16A38]">{item.value}</span>
								</div>
								<p className="text-xs text-slate-400">{item.desc}</p>
								<div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
									<div className="h-full bg-rose-400 rounded-full" style={{ width: `${item.percent}%` }} />
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Shipping & Logistical Performance Metrics */}
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row items-center gap-3">
						<div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
							<Truck size={20} />
						</div>
						<div>
							<CardTitle className="text-base font-bold text-slate-800">Shipping Performance Metrics</CardTitle>
							<CardDescription>Tracking 3PL and courier efficiencies</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						{[
							{ metric: 'On-Time Delivery Rate', value: '94.8%', desc: 'Delivered within promised ETA', percent: 94.8 },
							{ metric: 'Logistics Damage Rate', value: '0.12%', desc: 'Reported product breakages', percent: 99.8 },
							{ metric: 'Average Shipping Days', value: '4.8 Days', desc: 'Dhaka vs rural BD zones', percent: 85 }
						].map((item) => (
							<div key={item.metric} className="space-y-1">
								<div className="flex justify-between text-sm">
									<span className="font-semibold text-slate-700">{item.metric}</span>
									<span className="font-bold text-indigo-600">{item.value}</span>
								</div>
								<p className="text-xs text-slate-400">{item.desc}</p>
								<div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
									<div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.percent}%` }} />
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Products & Categories Breakdown Tables */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Top Selling Products */}
				<Card className="lg:col-span-2 shadow-sm">
					<CardHeader>
						<CardTitle className="text-lg font-bold text-slate-800">Top Selling Products</CardTitle>
						<CardDescription>Highest selling products this month</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm border-collapse">
								<thead>
									<tr className="border-b text-slate-400 font-semibold">
										<th className="pb-3 pl-2">Product</th>
										<th className="pb-3">Sales</th>
										<th className="pb-3">Revenue</th>
										<th className="pb-3 pr-2">Stock</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{topProducts.map((prod) => (
										<tr key={prod.id} className="hover:bg-slate-50/55 duration-200">
											<td className="py-3 pl-2 flex items-center gap-3">
												<img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-md border" />
												<div>
													<p className="font-semibold text-slate-800 line-clamp-1">{prod.name}</p>
													<p className="text-xs text-slate-400">{prod.category}</p>
												</div>
											</td>
											<td className="py-3 text-slate-600 font-medium">{prod.sales} qty</td>
											<td className="py-3 font-bold text-[#F16A38]">{prod.revenue}</td>
											<td className="py-3 pr-2">
												<span className={`px-2 py-0.5 rounded text-xs font-semibold ${prod.stock < 20 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
													{prod.stock} left
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>

				{/* Top Categories */}
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="text-lg font-bold text-slate-800">Top Categories</CardTitle>
						<CardDescription>Sales distribution by department</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{topCategories.map((cat) => (
							<div key={cat.name} className="space-y-1">
								<div className="flex justify-between items-center text-sm">
									<div>
										<span className="font-semibold text-slate-700">{cat.name}</span>
										<span className="text-xs text-slate-400 block">{cat.productsCount} products</span>
									</div>
									<span className="font-bold text-slate-800">{cat.salesVolume}</span>
								</div>
								<div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
									<div className="h-full bg-orange-400 rounded-full" style={{ width: `${cat.percentage}%` }} />
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
