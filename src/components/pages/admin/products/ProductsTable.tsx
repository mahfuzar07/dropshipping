'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, PencilLine, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import DataTable from '@/components/common/data-table/DataTable';

export type Product = {
	title: string;
	category?: string;
	price?: string;
	discount?: number;
	stock: string;
	status: 'Draft' | 'Inactive' | 'Active' | 'Out Of Stock';
};

export const productColumns: ColumnDef<Product>[] = [
	{
		accessorKey: 'title',
		header: 'Product & Varients',
		cell: () => (
			<div className="flex items-center gap-3">
				<div className="relative h-10 w-10 md:h-12 md:w-12 rounded-md bg-slate-100">
					<Image src="https://techzaa.in/larkon/admin/assets/images/product/p-1.png" alt="" fill className="w-full h-full object-contain" />
				</div>
				<div className="max-w-md line-clamp-1 flex flex-col items-start">
					<h1 className="font-medium capitalize text-dashboard-muted lg:text-[15.5px] text-sm">Black T-shirt</h1>
					<div className="flex items-center gap-1 text-xs mt-0.5">
						<p className="border-r pr-1">Size</p>
						<p className="">Color</p>
					</div>
				</div>
			</div>
		),
	},
	{ accessorKey: 'price', header: 'Price' },
	{
		accessorKey: 'stock',
		header: 'Stock',
		cell: ({ row }) => {
			const v = row.original.stock;

			return (
				<div className="">
					<p className="">
						<strong>486</strong> Item Left
					</p>
					<p className="">155 Sold</p>
				</div>
			);
		},
	},
	{ accessorKey: 'category', header: 'Category' },
	{ accessorKey: 'discount', header: 'Discount' },
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

export default function ProductsTable({ data }: { data: Product[] }) {
	const [filter, setFilter] = React.useState('');

	return (
		<div className="space-y-4">
			<Card className="border-none shadow pb-0 overflow-hidden gap-0">
				<CardHeader className="border-b !pb-4 font-hanken">
					<div className="flex items-center justify-between flex-wrap gap-3">
						<CardTitle>All Product List</CardTitle>
						<div className="flex items-center gap-2">
							<div className="relative hidden md:block bg-dashboard-background rounded overflow-hidden">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Search Product..."
									value={filter}
									onChange={(e) => setFilter(e.target.value)}
									className="w-55 pl-10 border-none shadow-none rounded-none"
								/>
							</div>
							<Link
								href="/admin/products/add-product"
								className="bg-dashboard-primary flex-shrink-0 w-max text-sm md:text-sm text-primary-foreground px-6 py-2.5 rounded-md hover:bg-opacity-90 font-medium transition-colors"
							>
								+ New Products
							</Link>
						</div>
					</div>
				</CardHeader>

				<CardContent className="p-0">
					<DataTable data={data} columns={productColumns} globalFilter={filter} onGlobalFilterChange={setFilter} />
				</CardContent>
			</Card>
		</div>
	);
}
