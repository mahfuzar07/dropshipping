'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	getPaginationRowModel,
	ColumnDef,
	flexRender,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import {
	Search,
	Filter,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Download,
	Upload,
	RefreshCw,
	Plus,
	Trash2,
	Eye,
	Edit,
	MoreHorizontal,
	Columns,
	Bookmark,
	Save,
	X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Column Config interface
export interface DataTableColumnConfig<T> {
	key: keyof T | string;
	label: string;
	sortable?: boolean;
	filterable?: boolean;
	filterType?: 'text' | 'select' | 'date-range' | 'number-range';
	filterOptions?: { label: string; value: string }[];
	render?: (row: T) => React.ReactNode;
}

// Saved View schema
interface SavedView {
	name: string;
	filters: Record<string, any>;
	sorting: SortingState;
	visibility: VisibilityState;
}

interface DataTableProps<T> {
	data: T[];
	columnsConfig: DataTableColumnConfig<T>[];
	isLoading?: boolean;
	isError?: boolean;
	totalCount?: number;
	pageIndex: number;
	pageSize: number;
	onPageChange: (index: number) => void;
	onPageSizeChange: (size: number) => void;
	onSortingChange?: (sorting: SortingState) => void;
	onFiltersChange?: (filters: Record<string, any>) => void;
	onRefresh?: () => void;
	onCreate?: () => void;
	onView?: (row: T) => void;
	onEdit?: (row: T) => void;
	onDelete?: (row: T) => void;
	bulkActions?: {
		label: string;
		icon?: React.ComponentType<{ className?: string }>;
		onClick: (selectedRows: T[]) => void;
		variant?: 'default' | 'destructive' | 'outline';
	}[];
	importLabel?: string;
	onImport?: (data: any[]) => void;
	exportName?: string;
}

export default function DataTable<T extends { id: any; created_at?: string; updated_at?: string; created_by?: string }>({
	data,
	columnsConfig,
	isLoading = false,
	isError = false,
	totalCount = 0,
	pageIndex,
	pageSize,
	onPageChange,
	onPageSizeChange,
	onSortingChange,
	onFiltersChange,
	onRefresh,
	onCreate,
	onView,
	onEdit,
	onDelete,
	bulkActions = [],
	importLabel = 'Import',
	onImport,
	exportName = 'table-data',
}: DataTableProps<T>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const [globalSearch, setGlobalSearch] = useState('');
	const [isFiltersOpen, setIsFiltersOpen] = useState(false);
	const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
	
	// Saved Views State
	const [savedViews, setSavedViews] = useState<SavedView[]>([]);
	const [newViewName, setNewViewName] = useState('');
	const [isSaveViewOpen, setIsSaveViewOpen] = useState(false);

	// Load saved views from localStorage
	useEffect(() => {
		const stored = localStorage.getItem(`saved_views_${exportName}`);
		if (stored) {
			try {
				setSavedViews(JSON.parse(stored));
			} catch (e) {
				console.error('Failed to parse saved views');
			}
		}
	}, [exportName]);

	// Forward sorting changes
	const handleSortingChange = (updater: any) => {
		const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
		setSorting(nextSorting);
		onSortingChange?.(nextSorting);
	};

	// Column filter changes handler
	const handleFilterChange = (key: string, value: any) => {
		const updated = { ...columnFilters, [key]: value };
		if (value === '' || value === undefined || value === null) {
			delete updated[key];
		}
		setColumnFilters(updated);
		onFiltersChange?.(updated);
	};

	const clearAllFilters = () => {
		setColumnFilters({});
		setGlobalSearch('');
		onFiltersChange?.({});
	};

	// Map config to TanStack column definitions
	const columns = useMemo<ColumnDef<T>[]>(() => {
		const cols: ColumnDef<T>[] = [
			{
				id: 'select',
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
						onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
						aria-label="Select all"
						className="translate-y-[2px]"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Select row"
						className="translate-y-[2px]"
					/>
				),
				enableSorting: false,
				enableHiding: false,
			},
		];

		columnsConfig.forEach((cfg) => {
			cols.push({
				id: cfg.key as string,
				accessorKey: cfg.key as string,
				header: ({ column }) => {
					if (cfg.sortable) {
						return (
							<Button
								variant="ghost"
								onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
								className="hover:bg-slate-100 dark:hover:bg-slate-800 -ml-4"
							>
								{cfg.label}
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						);
					}
					return <span>{cfg.label}</span>;
				},
				cell: ({ row }) => {
					if (cfg.render) {
						return cfg.render(row.original);
					}
					const val = row.original[cfg.key as keyof T];
					if (typeof val === 'boolean') {
						return val ? 'Yes' : 'No';
					}
					return (val as React.ReactNode) ?? '';
				},
			});
		});

		// Audit Fields (created_at, updated_at, created_by)
		if (data.length > 0) {
			if ('created_at' in data[0]) {
				cols.push({
					id: 'created_at',
					accessorKey: 'created_at',
					header: 'Created At',
					cell: ({ row }) => {
						const date = row.original.created_at;
						return date ? new Date(date).toLocaleString() : '';
					},
				});
			}
			if ('updated_at' in data[0]) {
				cols.push({
					id: 'updated_at',
					accessorKey: 'updated_at',
					header: 'Updated At',
					cell: ({ row }) => {
						const date = row.original.updated_at;
						return date ? new Date(date).toLocaleString() : '';
					},
				});
			}
		}

		// Action column
		if (onView || onEdit || onDelete) {
			cols.push({
				id: 'actions',
				header: 'Actions',
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{onView && (
								<DropdownMenuItem onClick={() => onView(row.original)} className="cursor-pointer">
									<Eye className="mr-2 h-4 w-4" /> View Details
								</DropdownMenuItem>
							)}
							{onEdit && (
								<DropdownMenuItem onClick={() => onEdit(row.original)} className="cursor-pointer">
									<Edit className="mr-2 h-4 w-4" /> Edit
								</DropdownMenuItem>
							)}
							{onDelete && (
								<DropdownMenuItem
									onClick={() => onDelete(row.original)}
									className="text-red-600 focus:text-red-700 cursor-pointer"
								>
									<Trash2 className="mr-2 h-4 w-4" /> Delete
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				),
				enableSorting: false,
				enableHiding: false,
			});
		}

		return cols;
	}, [columnsConfig, onView, onEdit, onDelete, data]);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
		},
		onSortingChange: handleSortingChange,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: true,
		pageCount: Math.ceil(totalCount / pageSize),
	});

	const selectedRows = useMemo(() => {
		return table.getSelectedRowModel().rows.map((r) => r.original);
	}, [rowSelection, data]);

	// EXPORTS
	const exportToCSV = () => {
		if (data.length === 0) return;
		const headers = columnsConfig.map((c) => c.label).join(',');
		const rows = data.map((row) =>
			columnsConfig
				.map((c) => {
					const val = row[c.key as keyof T];
					return `"${String(val ?? '').replace(/"/g, '""')}"`;
				})
				.join(',')
		);
		const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
		const encodedUri = encodeURI(csvContent);
		const link = document.createElement('a');
		link.setAttribute('href', encodedUri);
		link.setAttribute('download', `${exportName}-${new Date().toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportToJSON = () => {
		const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
		const link = document.createElement('a');
		link.setAttribute('href', jsonString);
		link.setAttribute('download', `${exportName}-${new Date().toISOString().slice(0, 10)}.json`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const exportToPrint = () => {
		const printWindow = window.open('', '_blank');
		if (!printWindow) return;
		
		const htmlHeaders = columnsConfig.map((c) => `<th>${c.label}</th>`).join('');
		const htmlRows = data
			.map(
				(row) =>
					`<tr>${columnsConfig
						.map((c) => `<td>${String(row[c.key as keyof T] ?? '')}</td>`)
						.join('')}</tr>`
			)
			.join('');

		printWindow.document.write(`
			<html>
				<head>
					<title>${exportName} Export</title>
					<style>
						body { font-family: sans-serif; padding: 20px; }
						table { width: 100%; border-collapse: collapse; margin-top: 20px; }
						th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
						th { background-color: #f5f5f5; }
					</style>
				</head>
				<body>
					<h2>${exportName.toUpperCase()} REPORT</h2>
					<p>Generated on: ${new Date().toLocaleString()}</p>
					<table>
						<thead><tr>${htmlHeaders}</tr></thead>
						<tbody>${htmlRows}</tbody>
					</table>
					<script>window.print();</script>
				</body>
			</html>
		`);
		printWindow.document.close();
	};

	// CSV File Import Handler
	const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !onImport) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const text = event.target?.result as string;
			if (!text) return;

			const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
			if (lines.length <= 1) return;

			const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
			const parsed = lines.slice(1).map((line) => {
				const values = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());
				const obj: Record<string, any> = {};
				headers.forEach((header, index) => {
					obj[header] = values[index] ?? '';
				});
				return obj;
			});

			onImport(parsed);
			toast.success('CSV data parsed and imported successfully');
		};
		reader.readAsText(file);
	};

	// Save Current View
	const saveCurrentView = () => {
		if (!newViewName.trim()) return;
		const view: SavedView = {
			name: newViewName.trim(),
			filters: columnFilters,
			sorting,
			visibility: columnVisibility,
		};
		const updated = [...savedViews, view];
		setSavedViews(updated);
		localStorage.setItem(`saved_views_${exportName}`, JSON.stringify(updated));
		setNewViewName('');
		setIsSaveViewOpen(false);
		toast.success(`View "${view.name}" saved successfully!`);
	};

	const applySavedView = (view: SavedView) => {
		setColumnFilters(view.filters);
		onFiltersChange?.(view.filters);
		setSorting(view.sorting);
		onSortingChange?.(view.sorting);
		setColumnVisibility(view.visibility);
		toast.success(`Applied saved view: ${view.name}`);
	};

	const deleteSavedView = (name: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const updated = savedViews.filter((v) => v.name !== name);
		setSavedViews(updated);
		localStorage.setItem(`saved_views_${exportName}`, JSON.stringify(updated));
		toast.success(`Deleted saved view: ${name}`);
	};

	return (
		<div className="space-y-4 font-hanken">
			{/* Top Toolbar */}
			<div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
				
				{/* Search bar */}
				<div className="relative flex-1 min-w-[280px]">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
					<Input
						placeholder="Search in table..."
						value={globalSearch}
						onChange={(e) => {
							setGlobalSearch(e.target.value);
							handleFilterChange('search', e.target.value);
						}}
						className="pl-10 h-10 w-full rounded-xl border-slate-200 dark:border-slate-800 focus-visible:ring-primary"
					/>
					{globalSearch && (
						<button
							onClick={() => {
								setGlobalSearch('');
								handleFilterChange('search', '');
							}}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Toolbar Actions */}
				<div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
					{/* Toggle Filter Panel */}
					<Button
						variant="outline"
						size="sm"
						onClick={() => setIsFiltersOpen(!isFiltersOpen)}
						className={`h-10 rounded-xl px-4 flex gap-2 items-center ${
							isFiltersOpen ? 'bg-orange-50 border-orange-200 text-primary hover:bg-orange-50' : ''
						}`}
					>
						<Filter className="h-4 w-4" />
						Filters
						{Object.keys(columnFilters).filter((k) => k !== 'search').length > 0 && (
							<span className="bg-primary text-white text-[10px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
								{Object.keys(columnFilters).filter((k) => k !== 'search').length}
							</span>
						)}
					</Button>

					{/* Column Visibility */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-10 rounded-xl px-4 flex gap-2 items-center">
								<Columns className="h-4 w-4" />
								Columns
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
							<DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{table
								.getAllColumns()
								.filter((col) => col.getCanHide())
								.map((col) => (
									<DropdownMenuCheckboxItem
										key={col.id}
										className="capitalize cursor-pointer"
										checked={col.getIsVisible()}
										onCheckedChange={(value) => col.toggleVisibility(!!value)}
									>
										{columnsConfig.find((c) => c.key === col.id)?.label || col.id}
									</DropdownMenuCheckboxItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Saved Views */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-10 rounded-xl px-4 flex gap-2 items-center">
								<Bookmark className="h-4 w-4" />
								Saved Views
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel className="flex justify-between items-center">
								<span>Views</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setIsSaveViewOpen(true)}
									className="h-6 w-6 p-0 hover:bg-slate-100"
								>
									<Save className="h-3.5 w-3.5" />
								</Button>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							{savedViews.length === 0 ? (
								<p className="text-xs text-muted-foreground text-center py-2">No saved views yet</p>
							) : (
								savedViews.map((v) => (
									<DropdownMenuItem
										key={v.name}
										onClick={() => applySavedView(v)}
										className="flex justify-between items-center cursor-pointer"
									>
										<span className="truncate">{v.name}</span>
										<button
											onClick={(e) => deleteSavedView(v.name, e)}
											className="text-red-500 hover:text-red-700 p-1 hover:bg-slate-100 rounded"
										>
											<X className="h-3 w-3" />
										</button>
									</DropdownMenuItem>
								))
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Import Action */}
					{onImport && (
						<div className="relative">
							<input
								type="file"
								accept=".csv"
								id="csv-file-input"
								className="hidden"
								onChange={handleCsvImport}
							/>
							<Button
								variant="outline"
								size="sm"
								className="h-10 rounded-xl px-4 flex gap-2 items-center"
								onClick={() => document.getElementById('csv-file-input')?.click()}
							>
								<Upload className="h-4 w-4" />
								{importLabel}
							</Button>
						</div>
					)}

					{/* Export Action */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-10 rounded-xl px-4 flex gap-2 items-center">
								<Download className="h-4 w-4" />
								Export
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuLabel>Download Format</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">CSV (.csv)</DropdownMenuItem>
							<DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">Excel (.xlsx)</DropdownMenuItem>
							<DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">JSON (.json)</DropdownMenuItem>
							<DropdownMenuItem onClick={exportToPrint} className="cursor-pointer">Print / PDF</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Refresh Action */}
					{onRefresh && (
						<Button
							variant="outline"
							size="icon"
							onClick={onRefresh}
							className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
							disabled={isLoading}
						>
							<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
						</Button>
					)}

					{/* Create Action */}
					{onCreate && (
						<Button
							onClick={onCreate}
							size="sm"
							className="h-10 rounded-xl px-4 bg-primary text-white hover:bg-primary/90 flex gap-1.5 items-center font-medium shadow-sm"
						>
							<Plus className="h-4 w-4" />
							Create
						</Button>
					)}
				</div>
			</div>

			{/* Column-Specific Filter Panel */}
			<AnimatePresence>
				{isFiltersOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="overflow-hidden"
					>
						<div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 items-end shadow-sm">
							{columnsConfig
								.filter((c) => c.filterable)
								.map((col) => {
									const currentVal = columnFilters[col.key as string] !== undefined
										? columnFilters[col.key as string]
										: (col.filterType === 'date-range' || col.filterType === 'number-range' ? {} : '');

									return (
										<div key={col.key as string} className="space-y-1.5">
											<label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
												{col.label}
											</label>

											{col.filterType === 'select' ? (
												<Select
													value={currentVal || "ALL_VALS"}
													onValueChange={(v) => {
														const filterVal = v === 'ALL_VALS' ? '' : v;
														handleFilterChange(col.key as string, filterVal);
													}}
												>
													<SelectTrigger className="rounded-xl border-slate-200 dark:border-slate-800">
														<SelectValue placeholder="All" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="ALL_VALS">All</SelectItem>
														{col.filterOptions?.map((opt) => (
															<SelectItem key={opt.value} value={opt.value}>
																{opt.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											) : col.filterType === 'date-range' ? (
												<div className="flex gap-2 items-center">
													<Input
														type="date"
														value={currentVal.start ?? ''}
														onChange={(e) =>
															handleFilterChange(col.key as string, {
																...currentVal,
																start: e.target.value,
															})
														}
														className="rounded-xl border-slate-200 dark:border-slate-800 text-xs px-2 h-9"
													/>
													<span className="text-slate-400 text-xs">to</span>
													<Input
														type="date"
														value={currentVal.end ?? ''}
														onChange={(e) =>
															handleFilterChange(col.key as string, {
																...currentVal,
																end: e.target.value,
															})
														}
														className="rounded-xl border-slate-200 dark:border-slate-800 text-xs px-2 h-9"
													/>
												</div>
											) : col.filterType === 'number-range' ? (
												<div className="flex gap-2 items-center">
													<Input
														placeholder="Min"
														type="number"
														value={currentVal.min ?? ''}
														onChange={(e) =>
															handleFilterChange(col.key as string, {
																...currentVal,
																min: e.target.value,
															})
														}
														className="rounded-xl border-slate-200 dark:border-slate-800 h-9"
													/>
													<span className="text-slate-400 text-xs">-</span>
													<Input
														placeholder="Max"
														type="number"
														value={currentVal.max ?? ''}
														onChange={(e) =>
															handleFilterChange(col.key as string, {
																...currentVal,
																max: e.target.value,
															})
														}
														className="rounded-xl border-slate-200 dark:border-slate-800 h-9"
													/>
												</div>
											) : (
												<Input
													placeholder={`Filter ${col.label}...`}
													value={currentVal}
													onChange={(e) => handleFilterChange(col.key as string, e.target.value)}
													className="rounded-xl border-slate-200 dark:border-slate-800 h-9"
												/>
											)}
										</div>
									);
								})}

							{/* Clear & Save View Actions */}
							<div className="flex gap-2 justify-end">
								<Button
									variant="ghost"
									size="sm"
									onClick={clearAllFilters}
									className="text-slate-500 text-xs hover:bg-slate-100 rounded-xl"
								>
									Clear All
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Bulk Actions Panel */}
			<AnimatePresence>
				{selectedRows.length > 0 && (
					<motion.div
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						className="flex items-center justify-between p-3 px-5 rounded-2xl bg-slate-900 text-white shadow-lg border border-slate-800"
					>
						<span className="text-sm font-medium">
							{selectedRows.length} item{selectedRows.length > 1 ? 's' : ''} selected
						</span>
						<div className="flex items-center gap-2">
							{bulkActions.map((act) => (
								<Button
									key={act.label}
									variant={act.variant || 'default'}
									size="sm"
									onClick={() => act.onClick(selectedRows)}
									className="rounded-xl h-9"
								>
									{act.icon && <act.icon className="mr-1.5 h-4 w-4" />}
									{act.label}
								</Button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Table Wrapper with horizontal scrolling indicator */}
			<div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
				<div className="overflow-x-auto scrollbar-thin">
					<Table>
						<TableHeader className="bg-slate-50/75 dark:bg-slate-850/50">
							{table.getHeaderGroups().map((group) => (
								<TableRow key={group.id} className="border-b border-slate-100 dark:border-slate-800">
									{group.headers.map((hdr) => (
										<TableHead key={hdr.id} className="text-slate-500 font-semibold px-6 py-4">
											{hdr.isPlaceholder ? null : flexRender(hdr.column.columnDef.header, hdr.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-64 text-center">
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
											<span className="text-sm text-muted-foreground font-medium">Loading data...</span>
										</div>
									</TableCell>
								</TableRow>
							) : isError ? (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-64 text-center">
										<div className="flex flex-col items-center justify-center gap-2 text-red-500">
											<span className="text-sm font-semibold">Error Loading Data</span>
											<span className="text-xs text-muted-foreground">Please refresh or try again later.</span>
										</div>
									</TableCell>
								</TableRow>
							) : data.length === 0 ? (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-64 text-center">
										<p className="text-slate-400 font-medium text-sm">No results found.</p>
									</TableCell>
								</TableRow>
							) : (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										className="hover:bg-slate-50/50 dark:hover:bg-slate-850/30 transition-all border-b border-slate-100 dark:border-slate-800"
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id} className="px-6 py-4 text-[14px]">
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Server-Side Pagination Bar */}
				<div className="flex flex-col sm:flex-row items-center justify-between p-4 px-6 gap-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/20">
					<div className="text-xs text-muted-foreground font-medium">
						Showing {data.length} of {totalCount} records
					</div>
					<div className="flex items-center gap-5">
						{/* Page size dropdown */}
						<div className="flex items-center gap-2">
							<span className="text-xs text-muted-foreground font-medium">Rows per page:</span>
							<Select
								value={String(pageSize)}
								onValueChange={(val) => onPageSizeChange(Number(val))}
							>
								<SelectTrigger className="h-8 w-16 rounded-lg text-xs border-slate-200 dark:border-slate-800">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="10">10</SelectItem>
									<SelectItem value="20">20</SelectItem>
									<SelectItem value="50">50</SelectItem>
									<SelectItem value="100">100</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Paginate Buttons */}
						<div className="flex items-center gap-1.5">
							<Button
								variant="outline"
								size="icon"
								onClick={() => onPageChange(0)}
								disabled={pageIndex === 0 || isLoading}
								className="h-8 w-8 rounded-lg"
							>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => onPageChange(pageIndex - 1)}
								disabled={pageIndex === 0 || isLoading}
								className="h-8 w-8 rounded-lg"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-xs font-semibold text-slate-600 px-2">
								{pageIndex + 1} / {Math.max(1, Math.ceil(totalCount / pageSize))}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={() => onPageChange(pageIndex + 1)}
								disabled={pageIndex >= Math.ceil(totalCount / pageSize) - 1 || isLoading}
								className="h-8 w-8 rounded-lg"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => onPageChange(Math.max(0, Math.ceil(totalCount / pageSize) - 1))}
								disabled={pageIndex >= Math.ceil(totalCount / pageSize) - 1 || isLoading}
								className="h-8 w-8 rounded-lg"
							>
								<ChevronsRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Save View Modal Dialog */}
			<Dialog open={isSaveViewOpen} onOpenChange={setIsSaveViewOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Save Current View</DialogTitle>
					</DialogHeader>
					<div className="space-y-4 py-2">
						<Input
							placeholder="e.g. Pending Sea Shipments"
							value={newViewName}
							onChange={(e) => setNewViewName(e.target.value)}
							className="rounded-xl"
						/>
					</div>
					<DialogFooter className="flex sm:justify-end gap-2">
						<Button variant="ghost" onClick={() => setIsSaveViewOpen(false)} className="rounded-xl">
							Cancel
						</Button>
						<Button onClick={saveCurrentView} className="bg-primary text-white hover:bg-primary/90 rounded-xl">
							Save View
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
