'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
	BarChart3,
	TrendingUp,
	Users,
	Truck,
	RotateCcw,
	DollarSign,
	Download,
	Calendar
} from 'lucide-react';
import {
	ResponsiveContainer,
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	BarChart,
	Bar,
	CartesianGrid
} from 'recharts';

const reportsData = {
	sales: [
		{ date: '2026-06-18', revenue: 45000, margin: 15400, orders: 32 },
		{ date: '2026-06-19', revenue: 52000, margin: 18200, orders: 38 },
		{ date: '2026-06-20', revenue: 61000, margin: 21300, orders: 45 },
		{ date: '2026-06-21', revenue: 48000, margin: 16800, orders: 35 },
		{ date: '2026-06-22', revenue: 75000, margin: 26200, orders: 52 },
		{ date: '2026-06-23', revenue: 89000, margin: 31100, orders: 61 },
		{ date: '2026-06-24', revenue: 95000, margin: 33200, orders: 68 }
	],
	customers: [
		{ date: '2026-06-18', newUsers: 14, activeUsers: 450 },
		{ date: '2026-06-19', newUsers: 22, activeUsers: 512 },
		{ date: '2026-06-20', newUsers: 19, activeUsers: 490 },
		{ date: '2026-06-21', newUsers: 31, activeUsers: 642 },
		{ date: '2026-06-22', newUsers: 42, activeUsers: 780 },
		{ date: '2026-06-23', newUsers: 50, activeUsers: 890 },
		{ date: '2026-06-24', newUsers: 58, activeUsers: 950 }
	],
	shipping: [
		{ carrier: 'SkyShip BD', delivered: 142, delayed: 3, cost: 8520 },
		{ carrier: 'Pathao Courier', delivered: 280, delayed: 14, cost: 16800 },
		{ carrier: 'RedX Delivery', delivered: 195, delayed: 11, cost: 11700 }
	],
	refunds: [
		{ category: 'Defective Product', count: 12, amount: 14400 },
		{ category: 'Sizing Mistake', count: 8, amount: 6400 },
		{ category: 'Delayed Sourcing', count: 5, amount: 4500 }
	]
};

export default function AnalyticsPage() {
	const [reportType, setReportType] = useState<'sales' | 'customers' | 'shipping' | 'refunds'>('sales');
	const [timeRange, setTimeRange] = useState('7d');

	const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
			loading: `Formatting and compiling ${reportType} report...`,
			success: `${reportType.toUpperCase()}_Report_June2026.${format} successfully downloaded!`,
			error: 'Export failed'
		});
	};

	return (
		<div className="space-y-6 font-play max-w-5xl mx-auto">
			{/* Top Bar actions */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Analytics & Reports</h2>
					<p className="text-xs text-slate-400">Generate, view, and export profitability, shipping and customer segmentation metrics.</p>
				</div>
				<div className="flex items-center gap-2">
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-32 bg-white">
							<SelectValue placeholder="Select Range" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="24h">Today</SelectItem>
							<SelectItem value="7d">Last 7 Days</SelectItem>
							<SelectItem value="30d">Last 30 Days</SelectItem>
							<SelectItem value="ytd">Year to date</SelectItem>
						</SelectContent>
					</Select>

					<Button onClick={() => handleExport('csv')} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
						<Download size={14} /> Export CSV
					</Button>
				</div>
			</div>

			{/* Sub tabs selector */}
			<div className="flex gap-2 border-b pb-3">
				{[
					{ id: 'sales', label: 'Sales & Profitability', icon: DollarSign },
					{ id: 'customers', label: 'Customer Segmentation', icon: Users },
					{ id: 'shipping', label: 'Logistics Performance', icon: Truck },
					{ id: 'refunds', label: 'Refunds & Returns', icon: RotateCcw }
				].map((tab) => (
					<button
						key={tab.id}
						onClick={() => setReportType(tab.id as any)}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition duration-200 ${
							reportType === tab.id
								? 'bg-orange-50 border-orange-200 text-[#F16A38]'
								: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
						}`}
					>
						<tab.icon size={14} />
						<span>{tab.label}</span>
					</button>
				))}
			</div>

			{/* Active charts grid */}
			{reportType === 'sales' && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<Card className="lg:col-span-2 shadow-sm">
						<CardHeader>
							<CardTitle className="text-base font-bold text-slate-800">Sales & Margins Profitability</CardTitle>
						</CardHeader>
						<CardContent className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={reportsData.sales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
									<YAxis stroke="#94A3B8" fontSize={10} />
									<Tooltip formatter={(value) => `৳${value}`} />
									<Area type="monotone" dataKey="revenue" stroke="#F16A38" fill="rgba(241, 106, 56, 0.1)" strokeWidth={2.5} />
									<Area type="monotone" dataKey="margin" stroke="#3B82F6" fill="rgba(59, 130, 246, 0.05)" strokeWidth={2} />
								</AreaChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="text-base font-bold text-slate-800">Order Volumes</CardTitle>
						</CardHeader>
						<CardContent className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={reportsData.sales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
									<YAxis stroke="#94A3B8" fontSize={10} />
									<Tooltip />
									<Bar dataKey="orders" fill="#818CF8" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>
			)}

			{reportType === 'customers' && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					<Card className="lg:col-span-2 shadow-sm">
						<CardHeader>
							<CardTitle className="text-base font-bold text-slate-800">Shopper Registrations Trend</CardTitle>
						</CardHeader>
						<CardContent className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart data={reportsData.customers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
									<YAxis stroke="#94A3B8" fontSize={10} />
									<Tooltip />
									<Area type="monotone" dataKey="newUsers" stroke="#34D399" fill="rgba(52, 211, 153, 0.1)" strokeWidth={2} />
								</AreaChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>

					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="text-base font-bold text-slate-800">Active Customer Base</CardTitle>
						</CardHeader>
						<CardContent className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={reportsData.customers} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} />
									<XAxis dataKey="date" stroke="#94A3B8" fontSize={10} />
									<YAxis stroke="#94A3B8" fontSize={10} />
									<Tooltip />
									<Bar dataKey="activeUsers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</div>
			)}

			{reportType === 'shipping' && (
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="text-base font-bold text-slate-800">3PL Courier Service Performance</CardTitle>
						<CardDescription>On-time performance and total freight invoice rates</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b bg-slate-50 text-slate-400 font-bold text-xs uppercase">
									<th className="py-3 px-4">Courier Name</th>
									<th className="py-3 px-4">Delivered Parcles</th>
									<th className="py-3 px-4">Delayed Deliveries</th>
									<th className="py-3 px-4">Total Freight Invoice</th>
								</tr>
							</thead>
							<tbody className="divide-y text-slate-700">
								{reportsData.shipping.map((shp) => (
									<tr key={shp.carrier} className="hover:bg-slate-50/50">
										<td className="py-4 px-4 font-bold text-slate-850">{shp.carrier}</td>
										<td className="py-4 px-4 font-semibold">{shp.delivered} parcels</td>
										<td className="py-4 px-4 font-semibold text-rose-500">{shp.delayed} delays</td>
										<td className="py-4 px-4 font-extrabold text-indigo-600">৳{shp.cost.toLocaleString()}</td>
									</tr>
								))}
							</tbody>
						</table>
					</CardContent>
				</Card>
			)}

			{reportType === 'refunds' && (
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="text-base font-bold text-slate-800">Returns & RMA Disputes Causes</CardTitle>
						<CardDescription>Major categorizations for refund claims</CardDescription>
					</CardHeader>
					<CardContent className="p-0">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="border-b bg-slate-50 text-slate-400 font-bold text-xs uppercase">
									<th className="py-3 px-4">Claim Category</th>
									<th className="py-3 px-4">Claims Count</th>
									<th className="py-3 px-4">Refund Amount Paid</th>
								</tr>
							</thead>
							<tbody className="divide-y text-slate-700">
								{reportsData.refunds.map((ref) => (
									<tr key={ref.category} className="hover:bg-slate-50/50">
										<td className="py-4 px-4 font-bold text-slate-800">{ref.category}</td>
										<td className="py-4 px-4 font-semibold">{ref.count} claims</td>
										<td className="py-4 px-4 font-extrabold text-rose-600">৳{ref.amount.toLocaleString()}</td>
									</tr>
								))}
							</tbody>
						</table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
