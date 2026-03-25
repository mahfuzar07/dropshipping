import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Mails, Search, Trash2, UserLock, CheckCircle, FilterIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@radix-ui/react-label';
import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { OptionsSettings } from '@/types/types';
import { Calendar } from '@/components/ui/calendar';
import { DateRangePicker, DateRangeValue } from '@/components/ui/custom/DateRangePicker';

export default function CustomerBulkAction({
	selectedRows,
	setRowSelection,
	filter,
	setFilter,
}: {
	selectedRows: any[];
	setRowSelection: (value: {}) => void;
	filter: string;
	setFilter: (value: string) => void;
}) {
	const isDisabled = selectedRows.length === 0;

	// ---- Advanced Filters State ----
	const [showFilters, setShowFilters] = React.useState(false);
	const [filters, setFilters] = React.useState({
		status: 'all',
		city: '',
		orders: 'any',
	});
	const [createdRange, setCreatedRange] = React.useState<DateRangeValue>({});
	const [lastOrderRange, setLastOrderRange] = React.useState<DateRangeValue>({});

	// ---- Handlers ----
	const handleBulkDelete = () => {
		console.log('DELETE:', selectedRows);
		setRowSelection({});
	};

	const handleBulkBlock = () => {
		console.log('BLOCK:', selectedRows);
		setRowSelection({});
	};

	const handleBulkActivate = () => {
		console.log('ACTIVATE:', selectedRows);
		setRowSelection({});
	};

	const handleExport = (type: 'csv' | 'xlsx' | 'pdf') => {
		console.log('EXPORT', type, selectedRows, 'FILTERS:', filters, 'SEARCH:', filter);
	};

	const handleApplyFilters = () => {
		console.log('APPLY FILTERS:', {
			filters,
			createdRange,
			lastOrderRange,
		});
	};

	const handleResetFilters = () => {
		setFilters({
			status: 'all',
			city: '',
			orders: 'any',
		});
		setCreatedRange({});
		setLastOrderRange({});
		setShowFilters(false);
	};

	return (
		<>
			{/* BULK BAR */}
			<div className="flex md:flex-row flex-col-reverse gap-2 md:items-center justify-between px-3 md:px-5 py-2 rounded bg-dashboard-background/40">
				{/* LEFT: BULK ACTIONS */}
				<div className="flex items-center flex-wrap gap-2 md:ml-5">
					<span className="text-sm text-dashboard-muted-foreground border-r border-slate-200 pr-3">
						<strong>{selectedRows.length}</strong> Selected
					</span>

					<Button variant="secondary" disabled={isDisabled} onClick={handleBulkDelete}>
						<Trash2 size={12} />
						<span className="md:block hidden text-xs">Delete</span>
					</Button>

					<Button variant="secondary" disabled={isDisabled} onClick={handleBulkBlock}>
						<UserLock size={12} />
						<span className="md:block hidden text-xs">Block</span>
					</Button>

					<Button variant="secondary" disabled={isDisabled} onClick={handleBulkActivate}>
						<CheckCircle size={12} />
						<span className="md:block hidden text-xs">Activate</span>
					</Button>

					<Button variant="secondary" disabled={isDisabled}>
						<Mails size={12} />
						<span className="md:block hidden text-xs">Emails</span>
					</Button>

					{/* EXPORT (Selected) */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" disabled={isDisabled} className="gap-2">
								<Download size={12} />
								<span className="md:block hidden text-xs">Export</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem onClick={() => handleExport('csv')}>Export CSV</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleExport('xlsx')}>Export Excel</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleExport('pdf')}>Export PDF</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* RIGHT: SEARCH + FILTERS */}
				<div className="flex items-center gap-2">
					<div className="relative md:ml-auto bg-dashboard-background rounded overflow-hidden">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search Customer..."
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
							className="max-w-xs pl-8 h-10 border-none shadow-none rounded-none placeholder:text-sm"
						/>
					</div>

					<div className="border-r border-slate-200 h-5"></div>

					{/* EXPORT (All / Filtered) */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="secondary" className="gap-2">
								<Download size={12} />
								<span className="md:block hidden text-xs">Export</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start">
							<DropdownMenuItem onClick={() => handleExport('csv')}>Export CSV</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleExport('xlsx')}>Export Excel</DropdownMenuItem>
							<DropdownMenuItem onClick={() => handleExport('pdf')}>Export PDF</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button variant="secondary" onClick={() => setShowFilters((p) => !p)} className={showFilters ? 'bg-primary/10' : ''}>
						<FilterIcon size={12} />
						<span className="md:block hidden text-xs">Filters</span>
					</Button>
				</div>
			</div>

			{/* ADVANCED FILTERS PANEL */}
			{showFilters && (
				<div className="mt-2 p-4 border rounded bg-dashboard-background grid md:grid-cols-6 gap-4 items-end">
					<div className="space-y-2">
						<Label className="text-sm">Status </Label>
						<SearchableSelect
							options={[
								{ value: 'all', label: 'All' },
								{ value: 'active', label: 'Active' },
								{ value: 'blocked', label: 'Blocked' },
							]}
							value={filters.status}
							onChange={(value) =>
								setFilters((prev) => ({
									...prev,
									status: value as OptionsSettings['value'],
								}))
							}
							placeholder="Select Status"
						/>
					</div>

					{/* Orders */}
					<div className="space-y-2">
						<Label className="text-sm">Orders </Label>
						<SearchableSelect
							options={[
								{ value: 'any', label: 'Any' },
								{ value: '0', label: '0 Orders' },
								{ value: 'gt0', label: 'More than 0' },
							]}
							value={filters.orders}
							onChange={(value) =>
								setFilters((prev) => ({
									...prev,
									orders: value as OptionsSettings['value'],
								}))
							}
							placeholder="Order count"
						/>
					</div>

					{/* Created From */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Customer Join Date</label>

						<DateRangePicker value={createdRange} onChange={setCreatedRange} placeholder="Select date range" />
					</div>

					{/* Created To */}
					<div className="space-y-2">
						<label className="text-sm font-medium">Order Date</label>
						<DateRangePicker value={lastOrderRange} onChange={setLastOrderRange} placeholder="Select date range" />
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<Button size="sm" className="bg-dashboard-primary hover:bg-dashboard-primary/80" onClick={handleApplyFilters}>
							Apply
						</Button>
						<Button size="sm" variant="ghost" onClick={handleResetFilters}>
							Reset
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
