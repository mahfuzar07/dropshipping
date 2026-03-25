'use client';
import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, PencilLine, Plus, Search, Trash2 } from 'lucide-react';
import DataTable from '@/components/common/data-table/DataTable';
import TableCheckbox from '@/components/common/data-table/TableCheckbox';
import EmployeeBulkAction from './EmployeeBulkAction';
import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { APIResponse, Customers, Employee } from '@/types/types';
import { formatCurrency, getCurrencyCode, getCurrencySymbol, initCurrency } from '@/lib/utils/formatCurrency';
import LoadingData from '@/components/common/loader/LoadingData';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { cn } from '@/lib/utils/utils';
import getFullImageUrl from '@/lib/utils/getFullImageUrl';
import Link from 'next/link';

const employeesColumns: ColumnDef<Employee>[] = [
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
		id: 'fullName',
		header: 'Employee Name',
		cell: ({ row }) => {
			const name = row.original.fullName || '-';
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
						<AvatarImage src={getFullImageUrl(row.original.avatar || '')} alt="Customer" className='object-contain bg-slate-50'/>
						<AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
					</Avatar>

					<span className="text-dashboard-muted">{name}</span>
				</div>
			);
		},
	},
	// ✅ DEPARTMENT
	{
		accessorKey: 'department',
		header: 'Department',
		cell: ({ row }) => row.original.department?.code || '-',
	},
	// ✅ DESIGNATION
	{
		accessorKey: 'designation',
		header: 'Designation',
		cell: ({ row }) => row.original.designation?.title || '-',
	},

	// ✅ EMAIL
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => row.original.officialEmail || '-',
	},
	// ✅ PHONE
	{
		accessorKey: 'phone',
		header: 'Phone',
		cell: ({ row }) => row.original.officialPhone || '-',
	},

	// ✅ STATUS
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const s = row.original.status;

			const variantMap: Record<string, any> = {
				ACTIVE: 'success',
				INACTIVE: 'secondary',
				ON_LEAVE: 'warning',
				TERMINATED: 'destructive',
				RESIGNED: 'outline',
			};

			const labelMap: Record<string, string> = {
				ACTIVE: 'Active',
				INACTIVE: 'Inactive',
				ON_LEAVE: 'On Leave',
				TERMINATED: 'Terminated',
				RESIGNED: 'Resigned',
			};

			return (
				<Badge variant={variantMap[s] || 'secondary'} className="px-3">
					{labelMap[s] || '-'}
				</Badge>
			);
		},
	},

	// ✅ ACTIONS
	{
		id: 'actions',
		header: 'Action',
		cell: ({ row }) => (
			<div className="flex gap-2 px-1">
				<Link href={`/admin/employee/${row.original.employeeIDCard}`}>
					<Button size="sm" variant="secondary">
						<Eye size={12} />
					</Button>
				</Link>

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

export default function EmployeesTable() {
	const { openDrawer } = useLayoutStore();
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

	const { data: employeesListResponse, isLoading: isFetching } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.EMPLOYEES],
		api: apiEndpoint.employee.getAllEmployees,
		auth: false,
		responseType: 'single',
		enabled: true,
	});
	const employeeList = employeesListResponse?.payload.employees || [];

	const table = useReactTable({
		data: employeeList,
		columns: employeesColumns,
		state: { globalFilter: filter, rowSelection },
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);

	if (isFetching || !ready) return <LoadingData message="Loading Employee Data..." />;

	return (
		<div className="space-y-4">
			<Card className="border-none shadow pb-0 gap-0">
				<CardHeader className="border-b !pb-4 font-hanken flex items-center justify-between">
					<CardTitle className="uppercase">Employees List</CardTitle>

					<Button
						onClick={() => openDrawer({ drawerType: 'add-employee', drawerData: {} })}
						className={cn('gap-2 bg-dashboard-primary hover:bg-dashboard-primary/80 shadow-sm', 'transition-all duration-200')}
					>
						<Plus className="h-4 w-4" />
						Create Employee
					</Button>
				</CardHeader>

				<CardContent className="!px-0">
					<EmployeeBulkAction selectedRows={selectedRows} setRowSelection={setRowSelection} filter={filter} setFilter={setFilter} />

					<DataTable
						data={employeeList}
						columns={employeesColumns}
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
