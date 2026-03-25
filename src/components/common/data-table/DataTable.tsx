'use client';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	useReactTable,
	RowSelectionState,
	Updater,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from './TablePagination';
import { Binoculars } from 'lucide-react';

type DataTableProps<TData> = {
	data: TData[];
	columns: ColumnDef<TData, any>[];
	globalFilter?: string;
	onGlobalFilterChange?: (value: string) => void;
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: (updater: Updater<RowSelectionState>) => void;
	pageSize?: number;
	sizeFixed?: boolean;
};

export default function DataTable<TData>({
	data,
	columns,
	globalFilter,
	onGlobalFilterChange,
	rowSelection,
	onRowSelectionChange,
	pageSize,
	sizeFixed = false,
}: DataTableProps<TData>) {
	const table = useReactTable({
		data,
		columns,
		state: { globalFilter, rowSelection },
		enableRowSelection: true,
		onRowSelectionChange,
		onGlobalFilterChange,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((hg) => (
						<TableRow key={hg.id} className="bg-slate-50">
							{hg.headers.map((h) => (
								<TableHead key={h.id} className="h-14 px-3 md:px-5 font-semibold text-sm  text-dashboard-muted capitalize">
									{flexRender(h.column.columnDef.header, h.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>

				<TableBody className="text-dashboard-muted">
					{table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow key={row.id} className="transition-colors hover:bg-slate-50">
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className="px-3 md:px-5 py-3 text-sm">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="py-8">
								<div className="flex flex-col font-hanken items-center justify-center gap-3 text-center">
									<div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
										<Binoculars size={30} />
									</div>

									<div>
										<p className="text-base  font-medium text-slate-700">No data found</p>
										<p className="mt-0.5 text-xs text-slate-500">Try adjusting your search or filters</p>
									</div>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<TablePagination table={table} pageSize={pageSize} sizeFixed={sizeFixed} />
		</>
	);
}
