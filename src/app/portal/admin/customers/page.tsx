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
import { User, UserCheck, Plus, Edit, Trash2, Calendar, ShieldCheck, Mail, ShieldAlert, Loader2 } from 'lucide-react';
import DataTable, { DataTableColumnConfig } from '@/components/ui/custom/DataTable';
import { SortingState } from '@tanstack/react-table';

interface CustomerUser {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	username: string;
	is_verified: boolean;
	user_type: string;
	is_active: boolean;
	date_joined: string;
}

export default function AdminCustomerManagementPage() {
	const queryClient = useQueryClient();
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [globalSearch, setGlobalSearch] = useState('');
	const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
	const [sorting, setSorting] = useState<SortingState>([]);

	// Form & Modal states
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerUser | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	// Form field values
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [userType, setUserType] = useState('Customer');
	const [password, setPassword] = useState('');
	const [isActive, setIsActive] = useState(true);
	const [isVerified, setIsVerified] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

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
			const sortStr = sorting.map((s) => `${s.desc ? '-' : ''}${s.id}`).join(',');
			params.set('ordering', sortStr);
		}

		return params.toString();
	}, [pageIndex, pageSize, globalSearch, columnFilters, sorting]);

	// Fetch customers/users list from backend
	const {
		data: customersResponse,
		isLoading,
		isError,
		refetch,
	} = useAppData<any, 'single'>({
		key: [QueriesKey.ADMIN_CUSTOMERS, queryParams],
		api: `/api/user/customer/?${queryParams}`,
		auth: true,
		responseType: 'single',
		onError: () => {
			toast.error('Failed to load customers');
		},
	});

	const customers: CustomerUser[] = customersResponse?.data || customersResponse?.results || [];
	const totalCount = customersResponse?.count || customers.length;

	// Column configuration
	const columnsConfig: DataTableColumnConfig<CustomerUser>[] = [
		{
			key: 'username',
			label: 'Username',
			sortable: true,
			filterable: true,
			render: (row) => (
				<div className="flex items-center gap-2">
					<div className="h-9 w-9 rounded-xl bg-orange-50 text-[#F16A38] border border-orange-100 flex items-center justify-center font-bold">
						<User size={16} />
					</div>
					<div>
						<p className="font-bold text-slate-800 text-sm">@{row.username}</p>
						<p className="text-[11px] text-slate-400">ID: {row.id}</p>
					</div>
				</div>
			),
		},
		{
			key: 'first_name',
			label: 'Full Name',
			sortable: true,
			render: (row) => (
				<span className="font-semibold text-slate-800">
					{row.first_name} {row.last_name}
				</span>
			),
		},
		{
			key: 'email',
			label: 'Email Address',
			sortable: true,
			filterable: true,
			render: (row) => (
				<span className="flex items-center gap-1 text-slate-600 text-xs">
					<Mail size={13} className="text-slate-400" /> {row.email}
				</span>
			),
		},
		{
			key: 'user_type',
			label: 'Role / Type',
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Customer', value: 'Customer' },
				{ label: 'Seller', value: 'Seller' },
				{ label: 'Admin', value: 'Admin' },
			],
			render: (row) => (
				<Badge variant="outline" className="capitalize text-xs">
					{row.user_type || 'Customer'}
				</Badge>
			),
		},
		{
			key: 'is_verified',
			label: 'Verified',
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Verified', value: 'true' },
				{ label: 'Unverified', value: 'false' },
			],
			render: (row) => (
				<button onClick={() => handleToggleVerification(row)} className="focus:outline-none cursor-pointer">
					<Badge className={row.is_verified ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}>
						{row.is_verified ? 'Verified' : 'Pending'}
					</Badge>
				</button>
			),
		},
		{
			key: 'date_joined',
			label: 'Joined Date',
			sortable: true,
			render: (row) => (
				<span className="flex items-center gap-1 text-slate-500 text-xs">
					<Calendar size={13} /> {new Date(row.date_joined).toLocaleDateString('en-US')}
				</span>
			),
		},
		{
			key: 'is_active',
			label: 'Status',
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Active', value: 'true' },
				{ label: 'Blacklisted/Suspended', value: 'false' },
			],
			render: (row) => (
				<button onClick={() => handleToggleActive(row)} className="focus:outline-none cursor-pointer">
					<Badge className={row.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}>
						{row.is_active ? 'Active' : 'Suspended'}
					</Badge>
				</button>
			),
		},
	];

	// Action Handlers
	const handleAddCustomer = () => {
		setIsEdit(false);
		setEmail('');
		setFirstName('');
		setLastName('');
		setUsername('');
		setUserType('Customer');
		setPassword('');
		setIsActive(true);
		setIsVerified(false);
		setIsOpen(true);
	};

	const handleEditCustomerOpen = (customer: CustomerUser) => {
		setSelectedCustomer(customer);
		setEmail(customer.email);
		setFirstName(customer.first_name);
		setLastName(customer.last_name);
		setUsername(customer.username);
		setUserType(customer.user_type || 'Customer');
		setPassword('');
		setIsActive(customer.is_active);
		setIsVerified(customer.is_verified);
		setIsEdit(true);
		setIsOpen(true);
	};

	const handleSaveCustomer = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !username) return;
		setIsSaving(true);
		try {
			const payload: Record<string, any> = {
				email,
				username,
				first_name: firstName,
				last_name: lastName,
				user_type: userType,
				is_active: isActive,
				is_verified: isVerified,
			};

			if (password) {
				payload.password = password;
			}

			if (isEdit && selectedCustomer) {
				await authApi.patch(`/api/user/users/${selectedCustomer.id}/`, payload);
				toast.success('Customer profile updated successfully');
			} else {
				await authApi.post('/api/user/signup/', payload);
				toast.success('Customer registered successfully');
			}

			setIsOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CUSTOMERS] });
		} catch (e) {
			toast.error('Failed to save customer account');
		} finally {
			setIsSaving(false);
		}
	};

	const handleDeleteCustomer = async (customer: CustomerUser) => {
		if (!confirm(`Are you sure you want to delete customer @${customer.username}?`)) return;
		try {
			await authApi.delete(`/api/user/users/${customer.id}/`);
			toast.success('Customer account deleted');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CUSTOMERS] });
		} catch (e) {
			toast.error('Failed to delete customer');
		}
	};

	const handleToggleActive = async (customer: CustomerUser) => {
		try {
			await authApi.patch(`/api/user/users/${customer.id}/`, { is_active: !customer.is_active });
			toast.success(customer.is_active ? 'Customer suspended / blacklisted' : 'Customer account re-activated');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CUSTOMERS] });
		} catch (e) {
			toast.error('Failed to modify account status');
		}
	};

	const handleToggleVerification = async (customer: CustomerUser) => {
		try {
			await authApi.patch(`/api/user/users/${customer.id}/`, { is_verified: !customer.is_verified });
			toast.success(customer.is_verified ? 'Account verification revoked' : 'Account verified successfully');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CUSTOMERS] });
		} catch (e) {
			toast.error('Failed to verify customer');
		}
	};

	const handleBulkDelete = async (selected: CustomerUser[]) => {
		if (!confirm(`Delete ${selected.length} customer accounts?`)) return;
		try {
			await Promise.all(selected.map((c) => authApi.delete(`/api/user/users/${c.id}/`)));
			toast.success('Bulk accounts deletion completed');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.ADMIN_CUSTOMERS] });
		} catch (e) {
			toast.error('Bulk deletion failed');
		}
	};

	const bulkActionsConfig = [
		{
			label: 'Delete Accounts',
			onClick: handleBulkDelete,
			variant: 'destructive' as const,
		},
	];

	return (
		<div className="space-y-6 font-play">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Customer Management</h2>
					<p className="text-xs text-slate-400">Review registered shoppers, configure user roles, and manage blacklist/verification flags.</p>
				</div>
			</div>

			{/* Main Data Table */}
			<DataTable<CustomerUser>
				data={customers}
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
				onCreate={handleAddCustomer}
				onEdit={handleEditCustomerOpen}
				onDelete={handleDeleteCustomer}
				bulkActions={bulkActionsConfig}
				exportName="customers-report"
			/>

			{/* Add/Edit Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-md bg-white">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">{isEdit ? 'Edit Customer Settings' : 'Register Customer Account'}</DialogTitle>
						<DialogDescription>Setup logins and customer profiles.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveCustomer} className="space-y-4">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">First Name</label>
								<Input required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Jamil" />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Last Name</label>
								<Input required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Hasan" />
							</div>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Username</label>
							<Input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. jamil_hasan" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
							<Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. jamil@domain.com" />
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Account Status</label>
								<select
									value={isActive ? 'true' : 'false'}
									onChange={(e) => setIsActive(e.target.value === 'true')}
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F16A38] text-slate-800"
								>
									<option value="true">Active</option>
									<option value="false">Suspended</option>
								</select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Verification Status</label>
								<select
									value={isVerified ? 'true' : 'false'}
									onChange={(e) => setIsVerified(e.target.value === 'true')}
									className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#F16A38] text-slate-800"
								>
									<option value="true">Verified</option>
									<option value="false">Pending</option>
								</select>
							</div>
						</div>

						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSaving} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
								{isSaving ? (
									<>
										<Loader2 size={14} className="animate-spin" /> Saving...
									</>
								) : (
									'Save Account'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
