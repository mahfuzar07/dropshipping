'use client';

import * as React from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Eye, Pencil, PencilLine, Trash2 } from 'lucide-react';

/* ---------------- types ---------------- */

export type Order = {
	id: string;
	date: string;
	customer: string;
	priority: 'Normal' | 'High';
	total: string;
	payment: 'Paid' | 'Unpaid' | 'Refund';
	items: number;
	delivery: string | null;
	status: 'Draft' | 'Packaging' | 'Completed' | 'Canceled';
};

/* ---------------- columns ---------------- */

const columns: ColumnDef<Order>[] = [
	{ accessorKey: 'id', header: 'Order ID' },
	{ accessorKey: 'date', header: 'Created at' },
	{
		accessorKey: 'customer',
		header: 'Customer',
		cell: ({ row }) => <span className="font-medium text-orange-500">{row.original.customer}</span>,
	},
	{ accessorKey: 'priority', header: 'Priority' },
	{ accessorKey: 'total', header: 'Total' },
	{
		accessorKey: 'payment',
		header: 'Payment Status',
		cell: ({ row }) => {
			const v = row.original.payment;
			const variant = v === 'Paid' ? 'success' : v === 'Unpaid' ? 'secondary' : 'destructive';

			return <Badge variant={variant as any}>{v}</Badge>;
		},
	},
	{ accessorKey: 'items', header: 'Items' },
	{
		accessorKey: 'delivery',
		header: 'Delivery Number',
		cell: ({ row }) => row.original.delivery ?? '-',
	},
	{
		accessorKey: 'status',
		header: 'Order Status',
		cell: ({ row }) => {
			const s = row.original.status;
			const map: Record<string, string> = {
				Draft: 'secondary',
				Packaging: 'warning',
				Completed: 'success',
				Canceled: 'destructive',
			};

			return (
				<Badge variant={map[s] as any} className="px-3">
					{s}
				</Badge>
			);
		},
	},
	{
		id: 'actions',
		header: 'Action',
		cell: () => (
			<div className="flex gap-2 px-1">
				<Button size="sm" variant="secondary">
					<Eye size={16} />
				</Button>

				<Button className="text-dashboard-primary bg-dashboard-primary/10 hover:bg-dashboard-primary hover:text-white" size="sm">
					<PencilLine size={16} />
				</Button>
				<Button size="sm" className="bg-red-100  text-red-500 hover:bg-red-500 disabled:opacity-50 hover:text-white  !disabled:cursor-not-allowed">
					<Trash2 size={16} />
				</Button>
			</div>
		),
	},
];

/* ---------------- component ---------------- */

export default function OrdersTable({ data }: { data: Order[] }) {
	const [globalFilter, setGlobalFilter] = React.useState('');

	const table = useReactTable({
		data,
		columns,
		state: { globalFilter },
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className="space-y-4">
			<Card className="border-none shadow pb-0 gap-0">
				<CardHeader className="border-b !pb-3 font-hanken">
					<div className="flex items-center justify-between flex-wrap gap-3">
						<CardTitle>All Orders List</CardTitle>
						<Input
							placeholder="Search order / customer..."
							value={globalFilter}
							onChange={(e) => setGlobalFilter(e.target.value)}
							className="max-w-xs text-sm"
						/>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((hg) => (
								<TableRow key={hg.id} className="bg-slate-50">
									{hg.headers.map((h) => (
										<TableHead key={h.id} className="h-14 px-3  md:px-5 text-sm font-semibold text-dashboard-muted uppercase">
											{flexRender(h.column.columnDef.header, h.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>

						<TableBody className="text-dashboard-muted">
							{table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} className="transition-colors hover:bg-slate-50">
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="px-3 md:px-5 py-3 text-sm">
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>

				{/* pagination */}
				<div className="flex items-center justify-end gap-2 bg-slate-50 px-4 py-4">
					<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>

					<span className="text-sm">Page {table.getState().pagination.pageIndex + 1}</span>

					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</Card>
		</div>
	);
}
