'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, CheckCircle, ArrowDown, MoreVertical, PencilLine } from 'lucide-react';
import DataTable from '@/components/common/data-table/DataTable';
import { ColumnDef } from '@tanstack/react-table';

// Sample Data and Columns for Transaction History Table
// =========================
export type Transaction = {
	invoice_id: string;
	total?: string;
	date?: string;
	payment?: 'COD' | 'Visa' | 'Mastarcard';
	status: 'Complete' | 'Cancelled' | 'Pending' | 'In Progress';
};

export const transactionColumns: ColumnDef<Transaction>[] = [
	{
		accessorKey: 'invoice_id',
		header: 'Invoice ID',
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const map: any = {
				Draft: 'secondary',
				Inactive: 'warning',
				Active: 'success',
				'Out Of Stock': 'destructive',
			};
			return <Badge variant={map[row.original.status]}>{row.original.status}</Badge>;
		},
	},
	{ accessorKey: 'total', header: 'Total' },
	{ accessorKey: 'date', header: 'Date' },
	{ accessorKey: 'payment', header: 'Payment Method' },
];

const transactionData: Transaction[] = [
	{
		invoice_id: '#INV-2540',
		total: '$145.00',
		date: '12 Jan, 2024',
		payment: 'COD',
		status: 'Complete',
	},
	{
		invoice_id: '#INV-2540',
		total: '$145.00',
		date: '12 Jan, 2024',
		payment: 'COD',
		status: 'Complete',
	},
	{
		invoice_id: '#INV-2540',
		total: '$145.00',
		date: '12 Jan, 2024',
		payment: 'COD',
		status: 'Complete',
	},
	{
		invoice_id: '#INV-2540',
		total: '$145.00',
		date: '12 Jan, 2024',
		payment: 'COD',
		status: 'Complete',
	},
	{
		invoice_id: '#INV-2540',
		total: '$145.00',
		date: '12 Jan, 2024',
		payment: 'COD',
		status: 'Complete',
	},
];

// Small Reusable Components
// =========================

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
	return (
		<div className="flex items-center justify-between shadow rounded-lg border border-transparent hover:border-orange-200 bg-white">
			<div className="p-5">
				<p className="text-md text-dashboard-muted font-hanken">{title}</p>
				<p className="text-2xl font-medium mt-3">{value}</p>
			</div>
			<div className="mr-5 rounded-xl bg-orange-100 p-3 text-orange-600">{icon}</div>
		</div>
	);
}

function InfoRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid md:grid-cols-3 gap-2 grid-cols-2 text-sm py-2 md:py-4 border-b last:border-none">
			<div className="text-muted-foreground col-span-1">{label}</div>

			<div className="font-medium col-span-2">{value}</div>
		</div>
	);
}

// =========================
// Main Page Component
// =========================

export default function CustomerDetails() {
	return (
		<div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
			{/* Left Column */}
			<div className="xl:col-span-4 space-y-5">
				{/* Profile Card */}
				<Card className="overflow-hidden border-none gap-0 pt-0">
					<div className="h-30 bg-dashboard-primary" />
					<CardContent className="pt-0">
						<div className="-mt-10 flex flex-col gap-2">
							<Avatar className="h-25 w-25 border-4 border-white">
								<AvatarImage src="/avatar.png" />
								<AvatarFallback>MM</AvatarFallback>
							</Avatar>
							<div>
								<div className="flex items-center gap-2">
									<h3 className="font-semibold text-lg">Michael A. Miner</h3>
									<CheckCircle className="h-4 w-4 text-green-500" />
								</div>
								<p className="text-sm text-orange-500">@michael_cus_2024</p>
							</div>
						</div>

						<div className="mt-4 space-y-2 text-sm">
							<p className="flex items-center gap-2">
								<Mail className="h-4 w-4" /> michaelaminer@dayrep.com
							</p>
							<p className="flex items-center gap-2">
								<Phone className="h-4 w-4" /> +88-01773841134
							</p>
						</div>

						<div className="mt-5 flex gap-2">
							<Button className="flex-1 bg-orange-500 hover:bg-orange-600">Send Email</Button>
							<Button variant="secondary" className="flex-1">
								Block User
							</Button>
							<Button className="text-dashboard-primary bg-dashboard-primary/10 hover:bg-dashboard-primary hover:text-white" size="icon">
								<PencilLine size={12} />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Customer Details */}
				<Card className="border-none gap-0 pb-0">
					<CardHeader className="flex flex-row items-center justify-between border-b !pb-4 font-hanken">
						<CardTitle>Customer Details</CardTitle>
						<Badge className="bg-green-100 text-green-600">Active User</Badge>
					</CardHeader>
					<CardContent className="py-0">
						<InfoRow label="Account ID" value="#AC-278699" />
						<InfoRow label="Customer Email" value="michaelaminer@dayrep.com" />
						<InfoRow label="Delivery Address" value="62, rue des Nations Unies 22000 SAINT-BRIEUC new bangladesh top of country " />
						<InfoRow label="Language" value="English" />
						<InfoRow label="Latest Invoice ID" value="#INV2540" />
					</CardContent>
				</Card>
			</div>

			{/* Right Column */}
			<div className="xl:col-span-8 space-y-5">
				{/* Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					{/* <StatCard title="Total Invoice" value="234" icon={<ArrowDown />} /> */}
					<StatCard title="Total Order" value="219" icon={<ArrowDown />} />
					<StatCard title="Total Reward Points" value="$2,189" icon={<ArrowDown />} />
					<StatCard title="Total Expense" value="$2,189" icon={<ArrowDown />} />
				</div>

				{/* Transaction History */}
				<Card className="pb-0 border-none gap-0">
					<CardHeader className="border-b !pb-3 font-hanken">
						<CardTitle>Transaction History</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<DataTable data={transactionData} columns={transactionColumns} pageSize={5} sizeFixed />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
