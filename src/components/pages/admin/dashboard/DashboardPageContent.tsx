'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	FileText,
	Users,
	DollarSign,
	TrendingUp,
	Activity,
	Shield,
	Settings,
	Bell,
	LogOut,
	MoreHorizontal,
	Eye,
	UserCheck,
	UserX,
} from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const staticAdminData = {
	systemStats: {
		totalUsers: 1247,
		activeUsers: 892,
		totalInvoices: 5634,
		totalRevenue: 284750.0,
		monthlyRevenue: 45230.0,
		pendingPayments: 12450.0,
	},
	recentUsers: [
		{
			id: '1',
			name: 'John Doe',
			email: 'john@example.com',
			plan: 'Pro',
			status: 'active',
			joinDate: '2024-01-15',
			lastActive: '2024-01-20',
			invoiceCount: 12,
			revenue: 2450.0,
		},
		{
			id: '2',
			name: 'Sarah Johnson',
			email: 'sarah@design.com',
			plan: 'Free',
			status: 'active',
			joinDate: '2024-01-10',
			lastActive: '2024-01-19',
			invoiceCount: 3,
			revenue: 850.0,
		},
		{
			id: '3',
			name: 'Mike Chen',
			email: 'mike@startup.com',
			plan: 'Pro',
			status: 'inactive',
			joinDate: '2023-12-20',
			lastActive: '2024-01-05',
			invoiceCount: 8,
			revenue: 1200.0,
		},
	],
	systemActivity: [
		{ type: 'user_signup', message: 'New user registered: jane@example.com', time: '2 hours ago' },
		{ type: 'payment', message: 'Payment received: $2,500 from Acme Corp', time: '4 hours ago' },
		{ type: 'invoice_sent', message: 'Invoice INV-1234 sent by John Doe', time: '6 hours ago' },
		{ type: 'user_upgrade', message: 'User upgraded to Pro: sarah@design.com', time: '1 day ago' },
	],
	revenueData: [
		{ month: 'Jan', revenue: 45230, users: 1247 },
		{ month: 'Dec', revenue: 42100, users: 1198 },
		{ month: 'Nov', revenue: 38950, users: 1156 },
		{ month: 'Oct', revenue: 35200, users: 1089 },
	],
};

export default function DashboardPageContent() {
	const [user, setUser] = useState<unknown>(null);
	const [isLoading, setIsLoading] = useState(true);

	// useEffect(() => {
	// 	const userData = localStorage.getItem('InvoBird_user');
	// 	if (!userData) {
	// 		window.location.href = '/login';
	// 		return;
	// 	}

	// 	const parsedUser = JSON.parse(userData);
	// 	if (parsedUser.role !== 'admin') {
	// 		window.location.href = '/dashboard';
	// 		return;
	// 	}

	// 	setUser(parsedUser);
	// 	setIsLoading(false);
	// }, []);

	// const handleLogout = () => {
	// 	localStorage.removeItem('InvoBird_user');
	// 	window.location.href = '/';
	// };

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800 border-green-200';
			case 'inactive':
				return 'bg-gray-100 text-gray-800 border-gray-200';
			case 'suspended':
				return 'bg-red-100 text-red-800 border-red-200';
			default:
				return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	};

	const getPlanColor = (plan: string) => {
		switch (plan) {
			case 'Pro':
				return 'bg-primary/10 text-primary border-primary/20';
			case 'Free':
				return 'bg-muted text-muted-foreground border-border';
			default:
				return 'bg-muted text-muted-foreground border-border';
		}
	};

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'user_signup':
				return <UserCheck className="h-4 w-4 text-green-600" />;
			case 'payment':
				return <DollarSign className="h-4 w-4 text-primary" />;
			case 'invoice_sent':
				return <FileText className="h-4 w-4 text-blue-600" />;
			case 'user_upgrade':
				return <TrendingUp className="h-4 w-4 text-accent" />;
			default:
				return <Activity className="h-4 w-4 text-muted-foreground" />;
		}
	};

	// if (isLoading) {
	// 	return (
	// 		<div className="min-h-screen bg-background flex items-center justify-center">
	// 			<div className="text-center">
	// 				<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
	// 					<Shield className="h-5 w-5 text-primary-foreground" />
	// 				</div>
	// 				<p className="text-muted-foreground">Loading admin dashboard...</p>
	// 			</div>
	// 		</div>
	// 	);
	// }

	return (
		<div className="min-h-screen">
			{/* System Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				<Card className="border-border bg-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{staticAdminData.systemStats.totalUsers.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">{staticAdminData.systemStats.activeUsers} active users</p>
					</CardContent>
				</Card>

				<Card className="border-border bg-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${staticAdminData.systemStats.totalRevenue.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">${staticAdminData.systemStats.monthlyRevenue.toLocaleString()} this month</p>
					</CardContent>
				</Card>

				<Card className="border-border bg-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{staticAdminData.systemStats.totalInvoices.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Across all users</p>
					</CardContent>
				</Card>

				<Card className="border-border bg-card">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">${staticAdminData.systemStats.pendingPayments.toLocaleString()}</div>
						<p className="text-xs text-muted-foreground">Awaiting payment</p>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Recent Users */}
				<div className="lg:col-span-2">
					<Card className="border-border bg-card">
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="font-heading">Recent Users</CardTitle>
									<CardDescription>Latest user registrations and activity</CardDescription>
								</div>
								<Button variant="outline" asChild>
									<Link href="/admin/users">View All Users</Link>
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{staticAdminData.recentUsers.map((user) => (
									<div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
										<div className="flex items-center space-x-4">
											<div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
												<span className="text-primary font-semibold text-sm">
													{user.name
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</span>
											</div>
											<div>
												<p className="font-medium text-foreground">{user.name}</p>
												<p className="text-sm text-muted-foreground">{user.email}</p>
												<p className="text-xs text-muted-foreground">Joined {user.joinDate}</p>
											</div>
										</div>

										<div className="flex items-center space-x-4">
											<div className="text-right">
												<div className="flex items-center space-x-2 mb-1">
													<Badge className={getPlanColor(user.plan)}>{user.plan}</Badge>
													<Badge className={getStatusColor(user.status)}>{user.status}</Badge>
												</div>
												<p className="text-sm text-muted-foreground">
													{user.invoiceCount} invoices • ${user.revenue.toLocaleString()}
												</p>
											</div>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end">
													<DropdownMenuItem>
														<Eye className="h-4 w-4 mr-2" />
														View Details
													</DropdownMenuItem>
													<DropdownMenuItem>
														<UserCheck className="h-4 w-4 mr-2" />
														Activate
													</DropdownMenuItem>
													<DropdownMenuItem>
														<UserX className="h-4 w-4 mr-2" />
														Suspend
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* System Activity & Revenue Chart */}
				<div className="space-y-6">
					{/* System Activity */}
					<Card className="border-border bg-card">
						<CardHeader>
							<CardTitle className="font-heading">System Activity</CardTitle>
							<CardDescription>Recent system events</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{staticAdminData.systemActivity.map((activity, index) => (
									<div key={index} className="flex items-start space-x-3">
										<div className="mt-1">{getActivityIcon(activity.type)}</div>
										<div className="flex-1">
											<p className="text-sm text-foreground">{activity.message}</p>
											<p className="text-xs text-muted-foreground">{activity.time}</p>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Revenue Overview */}
					<Card className="border-border bg-card">
						<CardHeader>
							<CardTitle className="font-heading">Revenue Overview</CardTitle>
							<CardDescription>Monthly revenue trends</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{staticAdminData.revenueData.map((data, index) => (
									<div key={index} className="flex items-center justify-between">
										<div>
											<p className="font-medium text-foreground">{data.month} 2024</p>
											<p className="text-sm text-muted-foreground">{data.users} users</p>
										</div>
										<div className="text-right">
											<p className="font-semibold text-foreground">${data.revenue.toLocaleString()}</p>
											<div className="w-20 h-2 bg-muted rounded-full mt-1">
												<div className="h-2 bg-primary rounded-full" style={{ width: `${(data.revenue / 50000) * 100}%` }}></div>
											</div>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Quick Actions */}
					<Card className="border-border bg-card">
						<CardHeader>
							<CardTitle className="font-heading">Quick Actions</CardTitle>
							<CardDescription>Common admin tasks</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							<Button className="w-full justify-start" asChild>
								<Link href="/admin/users">
									<Users className="h-4 w-4 mr-2" />
									Manage Users
								</Link>
							</Button>
							<Button variant="outline" className="w-full justify-start bg-transparent" asChild>
								<Link href="/admin/analytics">
									<TrendingUp className="h-4 w-4 mr-2" />
									View Analytics
								</Link>
							</Button>
							<Button variant="outline" className="w-full justify-start bg-transparent" asChild>
								<Link href="/admin/settings">
									<Settings className="h-4 w-4 mr-2" />
									System Settings
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
