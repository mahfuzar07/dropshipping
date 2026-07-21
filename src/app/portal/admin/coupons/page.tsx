'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/axiosInstance';
import { Ticket, Plus, Edit, Trash2, Calendar, Loader2 } from 'lucide-react';
import DataTable, { DataTableColumnConfig } from '@/components/ui/custom/DataTable';
import { SortingState } from '@tanstack/react-table';

interface Coupon {
	id: number;
	code: string;
	discount_type: 'flat' | 'percent';
	discount_value: string;
	min_order_amount: string | null;
	valid_from: string;
	valid_until: string;
	used_count: number;
	max_uses: number | null;
	is_active: boolean;
}

export default function CouponsPage() {
	const queryClient = useQueryClient();
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [globalSearch, setGlobalSearch] = useState('');
	const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
	const [sorting, setSorting] = useState<SortingState>([]);

	// Form & Modal States
	const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	// Form values
	const [code, setCode] = useState('');
	const [discountType, setDiscountType] = useState<'flat' | 'percent'>('percent');
	const [discountValue, setDiscountValue] = useState('');
	const [minOrder, setMinOrder] = useState('');
	const [maxUses, setMaxUses] = useState('');
	const [validFrom, setValidFrom] = useState('');
	const [validUntil, setValidUntil] = useState('');
	const [isActive, setIsActive] = useState(true);

	// Build URL Query Params for Server-Side Filtering/Pagination
	const queryParams = useMemo(() => {
		const params = new URLSearchParams();
		params.set('page', String(pageIndex + 1));
		params.set('limit', String(pageSize));

		if (globalSearch) {
			params.set('search', globalSearch);
		}

		Object.entries(columnFilters).forEach(([key, val]) => {
			if (key === 'search') return;
			if (val === 'ALL_VALS') return;
			params.set(key, String(val));
		});

		if (sorting.length > 0) {
			const sortStr = sorting.map(s => `${s.desc ? '-' : ''}${s.id}`).join(',');
			params.set('ordering', sortStr);
		}

		return params.toString();
	}, [pageIndex, pageSize, globalSearch, columnFilters, sorting]);

	// Fetch coupons from backend
	const { data: couponsResponse, isLoading, isError, refetch } = useAppData<any, 'single'>({
		key: [QueriesKey.ADMIN_COUPONS, queryParams],
		api: `/api/order/coupons/?${queryParams}`,
		auth: true,
		responseType: 'single',
		onError: () => {
			toast.error('Failed to load coupons');
		}
	});

	const coupons: Coupon[] = couponsResponse?.data || couponsResponse?.results || [];
	const totalCount = couponsResponse?.count || coupons.length;

	// Column Configuration
	const columnsConfig: DataTableColumnConfig<Coupon>[] = [
		{
			key: 'code',
			label: 'Coupon Code',
			sortable: true,
			filterable: true,
			render: (row) => (
				<div className="flex items-center gap-2">
					<div className="p-2 rounded-lg bg-orange-50 text-[#F16A38] border border-orange-100">
						<Ticket size={16} />
					</div>
					<span className="font-bold text-slate-800 tracking-wide text-sm">{row.code}</span>
				</div>
			)
		},
		{
			key: 'discount_type',
			label: 'Type',
			sortable: true,
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Percentage', value: 'percent' },
				{ label: 'Flat Cash', value: 'flat' }
			],
			render: (row) => <span className="capitalize font-semibold text-slate-600">{row.discount_type}</span>
		},
		{
			key: 'discount_value',
			label: 'Discount',
			sortable: true,
			render: (row) => (
				<span className="font-bold text-slate-800">
					{row.discount_type === 'percent' ? `${Number(row.discount_value)}%` : `৳${Number(row.discount_value).toLocaleString()}`}
				</span>
			)
		},
		{
			key: 'min_order_amount',
			label: 'Min Order',
			sortable: true,
			render: (row) => <span className="font-medium text-slate-600">৳{Number(row.min_order_amount || 0).toLocaleString()}</span>
		},
		{
			key: 'used_count',
			label: 'Uses',
			sortable: true,
			render: (row) => <span className="font-medium text-slate-600">{row.used_count} times</span>
		},
		{
			key: 'valid_until',
			label: 'Expiry Date',
			sortable: true,
			render: (row) => (
				<span className="flex items-center gap-1 text-slate-500 text-xs">
					<Calendar size={13} /> {row.valid_until}
				</span>
			)
		},
		{
			key: 'is_active',
			label: 'Status',
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Active', value: 'true' },
				{ label: 'Expired/Inactive', value: 'false' }
			],
			render: (row) => (
				<button onClick={() => handleToggleActive(row)} className="focus:outline-none cursor-pointer">
					<Badge className={row.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}>
						{row.is_active ? 'Active' : 'Inactive'}
					</Badge>
				</button>
			)
		}
	];

	// Action Handlers
	const handleAddCoupon = () => {
		setIsEdit(false);
		setCode('');
		setDiscountType('percent');
		setDiscountValue('');
		setMinOrder('');
		setMaxUses('');
		setValidFrom(new Date().toISOString().split('T')[0]); // Default start date to today
		setValidUntil(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days default
		setIsActive(true);
		setIsOpen(true);
	};

	const handleEditCouponOpen = (coupon: Coupon) => {
		setSelectedCoupon(coupon);
		setCode(coupon.code);
		setDiscountType(coupon.discount_type);
		setDiscountValue(coupon.discount_value.toString());
		setMinOrder(coupon.min_order_amount?.toString() || '');
		setMaxUses(coupon.max_uses?.toString() || '');
		setValidFrom(coupon.valid_from);
		setValidUntil(coupon.valid_until);
		setIsActive(coupon.is_active);
		setIsEdit(true);
		setIsOpen(true);
	};

	const handleSaveCoupon = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!code || !discountValue) return;
		setIsSaving(true);

		try {
			const payload = {
				code: code.toUpperCase(),
				discount_type: discountType,
				discount_value: discountValue,
				min_order_amount: minOrder || '0',
				max_uses: maxUses ? parseInt(maxUses) : null,
				valid_from: validFrom,
				valid_until: validUntil,
				is_active: isActive
			};

			if (isEdit && selectedCoupon) {
				await authApi.patch(`/api/order/coupons/${selectedCoupon.id}/`, payload);
				toast.success('Coupon updated successfully');
			} else {
				await authApi.post('/api/order/coupons/', payload);
				toast.success('Coupon registered successfully');
			}

			setIsOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_COUPONS] });
		} catch (e) {
			toast.error('Failed to save coupon settings');
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteCoupon = async (coupon: Coupon) => {
		if (!confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;
		setIsSaving(true);
		try {
			await authApi.delete(`/api/order/coupons/${coupon.id}/`);
			toast.success('Coupon deleted');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_COUPONS] });
		} catch (e) {
			toast.error('Failed to delete coupon');
		} finally {
			setIsSaving(false);
		}
	};

	const handleToggleActive = async (coupon: Coupon) => {
		try {
			await authApi.patch(`/api/order/coupons/${coupon.id}/`, { is_active: !coupon.is_active });
			toast.success(coupon.is_active ? 'Coupon deactivated' : 'Coupon activated');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_COUPONS] });
		} catch (e) {
			toast.error('Failed to toggle coupon status');
		}
	};

	const handleBulkDelete = async (selected: Coupon[]) => {
		if (!confirm(`Delete ${selected.length} coupons?`)) return;
		setIsSaving(true);
		try {
			await Promise.all(
				selected.map((c) => authApi.delete(`/api/order/coupons/${c.id}/`))
			);
			toast.success('Bulk coupon delete completed');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_COUPONS] });
		} catch (e) {
			toast.error('Bulk deletion failed');
		} finally {
			setIsSaving(false);
		}
	};

	const bulkActionsConfig = [
		{
			label: 'Delete Selected',
			onClick: handleBulkDelete,
			variant: 'destructive' as const
		}
	];

	return (
		<div className="space-y-6 font-play">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Discount Coupons</h2>
					<p className="text-xs text-slate-400">Configure promotional campaign codes, flat cuts, and checkout minimum limits.</p>
				</div>
			</div>

			{/* Main Data Table */}
			<DataTable<Coupon>
				data={coupons}
				columnsConfig={columnsConfig}
				isLoading={isLoading}
				isError={isError}
				totalCount={totalCount}
				pageIndex={pageIndex}
				pageSize={pageSize}
				onPageChange={setPageIndex}
				onPageSizeChange={setPageSize}
				onSortingChange={setSorting}
				onFiltersChange={(filters) => {
					setColumnFilters(filters);
					if (filters.search !== undefined) {
						setGlobalSearch(filters.search);
					}
				}}
				onRefresh={refetch}
				onCreate={handleAddCoupon}
				onEdit={handleEditCouponOpen}
				onDelete={handleDeleteCoupon}
				bulkActions={bulkActionsConfig}
				exportName="coupons-report"
			/>

			{/* Add/Edit Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-md bg-white">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">
							{isEdit ? 'Edit Coupon Settings' : 'Create Coupon'}
						</DialogTitle>
						<DialogDescription>Setup coupon campaigns with expiration limits.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveCoupon} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Coupon Code</label>
							<Input required value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. EID2026" className="uppercase" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Discount Type</label>
								<Select value={discountType} onValueChange={(val: 'flat' | 'percent') => setDiscountType(val)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="percent">Percent (%)</SelectItem>
										<SelectItem value="flat">Flat Cash (৳)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Value</label>
								<Input required type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder="15" />
							</div>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Minimum Purchase (৳)</label>
							<Input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="500" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Max Uses</label>
								<Input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Unlimited" />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Status</label>
								<Select value={isActive ? 'true' : 'false'} onValueChange={(val) => setIsActive(val === 'true')}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="true">Active</SelectItem>
										<SelectItem value="false">Inactive</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Valid From</label>
								<Input required type="date" value={validFrom} onChange={e => setValidFrom(e.target.value)} />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Valid Until</label>
								<Input required type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" disabled={isSaving} onClick={() => setIsOpen(false)}>Cancel</Button>
							<Button type="submit" disabled={isSaving} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold flex items-center gap-2">
								{isSaving && <Loader2 size={16} className="animate-spin" />}
								{isSaving ? 'Saving...' : 'Save Coupon'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
