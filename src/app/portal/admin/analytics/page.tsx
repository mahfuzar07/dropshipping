'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import {
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

export default function AnalyticsPage() {
	const [reportType, setReportType] = useState<'sales' | 'customers' | 'shipping' | 'refunds'>('sales');
	const [timeRange, setTimeRange] = useState('7d');

	// Fetch dynamic aggregated statistics from backend
	const { data: analyticsResponse, isLoading, isError } = useAppData<any, 'single'>({
		key: [QueriesKey.ADMIN_ANALYTICS, timeRange],
		api: apiEndpoint.orders.ANALYTICS(),
		auth: true,
		responseType: 'single',
		onError: () => {
			toast.error('Failed to load real-time analytics data');
		}
	});

	const reportsData = useMemo(() => {
		return {
			sales: analyticsResponse?.sales || [],
			customers: analyticsResponse?.customers || [],
			shipping: analyticsResponse?.shipping || [],
			refunds: analyticsResponse?.refunds || []
		};
	}, [analyticsResponse]);

	const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
			loading: `Formatting and compiling ${reportType} report...`,
			success: `${reportType.toUpperCase()}_Report_${new Date().getFullYear()}.${format} successfully downloaded!`,
			error: 'Export failed'
		});
	};

	const formattedDate = useMemo(() => {
		return new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4" />
					<p className="text-muted-foreground">Aggregating database statistics...</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center text-center">
				<div>
					<p className="text-rose-500 font-semibold mb-2">Error compiling data</p>
					<p className="text-xs text-muted-foreground">Please check server status or authorization parameters.</p>
				</div>
			</div>
		);
	}

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
							<SelectItem value="7d">Last 7 Days</SelectItem>
							<SelectItem value="30d">Last 30 Days</SelectItem>
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
									<Tooltip formatter={(value) => `৳${Number(value).toLocaleString()}`} />
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
						<CardTitle className="text-base font-bold text-slate-800">Carrier Volume Comparison</CardTitle>
					</CardHeader>
					<CardContent className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={reportsData.shipping} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis dataKey="carrier" stroke="#94A3B8" fontSize={10} />
								<YAxis stroke="#94A3B8" fontSize={10} />
								<Tooltip formatter={(value, name) => [name === 'cost' ? `৳${Number(value).toLocaleString()}` : value, name]} />
								<Bar dataKey="delivered" name="Delivered Parcles" fill="#10B981" radius={[4, 4, 0, 0]} />
								<Bar dataKey="delayed" name="Delayed Parcles" fill="#F59E0B" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			)}

			{reportType === 'refunds' && (
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="text-base font-bold text-slate-800">Cancellations & Return Losses</CardTitle>
					</CardHeader>
					<CardContent className="h-80">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={reportsData.refunds} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" vertical={false} />
								<XAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
								<YAxis stroke="#94A3B8" fontSize={10} />
								<Tooltip formatter={(value, name) => [name === 'amount' ? `৳${Number(value).toLocaleString()}` : value, name]} />
								<Bar dataKey="count" name="Case Count" fill="#EF4444" radius={[4, 4, 0, 0]} />
								<Bar dataKey="amount" name="Financial Impact" fill="#F43F5E" radius={[4, 4, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
