'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, PencilLine, Search, Trash2 } from 'lucide-react';
import DataTable from '@/components/common/data-table/DataTable';
import TableCheckbox from '@/components/common/data-table/TableCheckbox';
import CustomerBulkAction from './CustomerBulkAction';
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { APIResponse, Customers } from '@/types/types';
import { formatCurrency, getCurrencyCode, getCurrencySymbol, initCurrency } from '@/lib/utils/formatCurrency';
import LoadingData from '@/components/common/loader/LoadingData';

const customerColumns: ColumnDef<Customers>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<div className="flex items-center justify-center">
				<TableCheckbox
					checked={table.getIsAllRowsSelected()}
					indeterminate={!table.getIsAllRowsSelected() && table.getIsSomeRowsSelected()}
					onChange={(value) => table.toggleAllRowsSelected(!!value)}
				/>
			</div>
		),
		cell: ({ row }) => (
			<div className="flex items-center justify-center">
				<TableCheckbox checked={row.getIsSelected()} indeterminate={row.getIsSomeSelected()} onChange={row.getToggleSelectedHandler()} />
			</div>
		),
		enableSorting: false,
		enableHiding: false,
		size: 10,
	},

	// ✅ CUSTOMER NAME (no accessorKey because nested)
	{
		id: 'customerName',
		header: 'Customer Name',
		cell: ({ row }) => {
			const name = row.original.customer?.name || '-';
			const initials =
				name !== '-'
					? name
							.split(' ')
							.map((n) => n[0])
							.slice(0, 2)
							.join('')
							.toUpperCase()
					: '-';

			return (
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarImage src="/" alt="Customer" />
						<AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
					</Avatar>

					<span className="text-dashboard-muted">{name}</span>
				</div>
			);
		},
	},

	// ✅ EMAIL
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => row.original.email || '-',
	},
	// ✅ PHONE
	{
		accessorKey: 'phone',
		header: 'Phone',
		cell: ({ row }) => row.original.phone || '-',
	},

	// ✅ ORDERS (number → default 0)
	{
		accessorKey: 'orders',
		header: 'Orders',
		cell: ({ row }) => Number(row.original.orders) || 0,
	},

	// ✅ TOTAL SPENT (number → default 0)
	{
		accessorKey: 'total',
		header: 'Total Spent',
		cell: ({ row }) => formatCurrency(Number(row.original.total) || 5),
	},

	// ✅ CITY / ADDRESS
	{
		accessorKey: 'address',
		header: 'City',
		cell: ({ row }) => row.original.address || '-',
	},

	// ✅ STATUS
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const s = row.original.status || '-';

			const map: Record<string, any> = {
				Active: 'success',
				Blocked: 'destructive',
			};

			return (
				<Badge variant={map[s] || 'secondary'} className="px-3">
					{s}
				</Badge>
			);
		},
	},

	// ✅ ACTIONS
	{
		id: 'actions',
		header: 'Action',
		cell: () => (
			<div className="flex gap-2 px-1">
				<Button size="sm" variant="secondary">
					<Eye size={12} />
				</Button>

				<Button className="text-dashboard-primary bg-dashboard-primary/10 hover:bg-dashboard-primary hover:text-white" size="sm">
					<PencilLine size={12} />
				</Button>

				<Button size="sm" className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 !disabled:cursor-not-allowed">
					<Trash2 size={12} />
				</Button>
			</div>
		),
	},
];

export default function CustomersTable() {
	const [filter, setFilter] = React.useState('');
	const [rowSelection, setRowSelection] = React.useState({});
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		async function loadCurrency() {
			await initCurrency();
			setReady(true);
		}
		loadCurrency();
	}, []);

	const { data: customerListResponse, isLoading: isFetching } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.USER_LIST],
		api: apiEndpoint.users.list,
		auth: false,
		responseType: 'single',
		enabled: true,
	});
	const customerList = customerListResponse?.payload.customers || [];

	const table = useReactTable({
		data: customerList,
		columns: customerColumns,
		state: { globalFilter: filter, rowSelection },
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

	if (isFetching || !ready) return <LoadingData message="Loading Customers Data..." />;

	return (
		<div className="space-y-4">
			<Card className="border-none shadow pb-0 gap-0">
				<CardHeader className="border-b !pb-3 font-hanken">
					<div className="flex items-center justify-between flex-wrap gap-3">
						<CardTitle className="uppercase">All Customers List</CardTitle>
					</div>
				</CardHeader>

				<CardContent className="!px-0">
					<CustomerBulkAction selectedRows={selectedRows} setRowSelection={setRowSelection} filter={filter} setFilter={setFilter} />

					<DataTable
						data={customerList}
						columns={customerColumns}
						globalFilter={filter}
						onGlobalFilterChange={setFilter}
						rowSelection={rowSelection}
						onRowSelectionChange={setRowSelection}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
