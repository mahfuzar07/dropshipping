'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Folder, Plus, Edit, Trash2, FolderPlus } from 'lucide-react';
import DataTable, { DataTableColumnConfig } from '@/components/ui/custom/DataTable';
import { SortingState } from '@tanstack/react-table';

interface Category {
	id: number;
	category_id: string;
	name: string;
	icon: string;
	subcategories?: any[];
}

export default function AdminCategoriesPage() {
	const queryClient = useQueryClient();
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [globalSearch, setGlobalSearch] = useState('');
	const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
	const [sorting, setSorting] = useState<SortingState>([]);

	// Modal controls
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);

	// Form values
	const [name, setName] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [icon, setIcon] = useState('');

	// Build URL Query Params for Server-Side Filtering/Pagination
	const queryParams = useMemo(() => {
		const params = new URLSearchParams();
		params.set('view', 'admin');
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

	// Fetch categories from backend
	const { data: categoriesResponse, isLoading, isError, refetch } = useAppData<any, 'single'>({
		key: [QueriesKey.CATEGORIES, queryParams],
		api: `/api/products/categories/?${queryParams}`,
		auth: true,
		responseType: 'single',
		onError: () => {
			toast.error('Failed to load categories');
		}
	});

	const categories: Category[] = categoriesResponse?.data || categoriesResponse?.results || [];
	const totalCount = categoriesResponse?.count || categories.length;

	// Column Configuration
	const columnsConfig: DataTableColumnConfig<Category>[] = [
		{
			key: 'id',
			label: 'ID',
			sortable: true
		},
		{
			key: 'icon',
			label: 'Icon',
			render: (row) => (
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F16A38] text-lg font-bold border border-orange-100">
					{row.icon || '📁'}
				</div>
			)
		},
		{
			key: 'name',
			label: 'Category Name',
			sortable: true,
			filterable: true,
			render: (row) => <span className="font-semibold text-slate-800">{row.name}</span>
		},
		{
			key: 'category_id',
			label: 'Category Slug/ID',
			sortable: true,
			filterable: true,
			render: (row) => <Badge variant="outline" className="text-xs">{row.category_id}</Badge>
		},
		{
			key: 'subcategories',
			label: 'Subcategories',
			render: (row) => <span className="text-muted-foreground text-sm font-medium">{row.subcategories?.length || 0} sub-groups</span>
		}
	];

	// Action Handlers
	const handleAddCategory = () => {
		setIsEdit(false);
		setName('');
		setCategoryId('');
		setIcon('📁');
		setIsOpen(true);
	};

	const handleEditCategoryOpen = (cat: Category) => {
		setSelectedCategory(cat);
		setName(cat.name);
		setCategoryId(cat.category_id);
		setIcon(cat.icon || '📁');
		setIsEdit(true);
		setIsOpen(true);
	};

	const handleSaveCategory = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !categoryId.trim()) return;

		try {
			const payload = {
				name,
				category_id: categoryId.toLowerCase().replace(/\s+/g, '-'),
				icon: icon || '📁'
			};

			if (isEdit && selectedCategory) {
				await axios.patch(`/api/products/categories/${selectedCategory.id}/`, payload);
				toast.success('Category updated successfully');
			} else {
				await axios.post('/api/products/categories/', payload);
				toast.success('New category registered');
			}

			setIsOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (e) {
			toast.error('Failed to save category');
		}
	};

	const handleDeleteCategory = async (cat: Category) => {
		if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
		try {
			await axios.delete(`/api/products/categories/${cat.id}/`);
			toast.success('Category deleted successfully');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (e) {
			toast.error('Failed to delete category');
		}
	};

	const handleBulkDelete = async (selected: Category[]) => {
		if (!confirm(`Delete ${selected.length} categories?`)) return;
		try {
			await Promise.all(
				selected.map((c) => axios.delete(`/api/products/categories/${c.id}/`))
			);
			toast.success('Bulk deletion finished');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.CATEGORIES] });
		} catch (e) {
			toast.error('Bulk deletion failed');
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
					<h2 className="text-xl font-bold text-slate-800">Categories Management</h2>
					<p className="text-xs text-slate-400">Configure root and nested product groups for storefront navigation navigation schemas.</p>
				</div>
			</div>

			{/* Main Data Table */}
			<DataTable<Category>
				data={categories}
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
				onCreate={handleAddCategory}
				onEdit={handleEditCategoryOpen}
				onDelete={handleDeleteCategory}
				bulkActions={bulkActionsConfig}
				exportName="categories-report"
			/>

			{/* Add/Edit Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-md bg-white">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">
							{isEdit ? 'Edit Category Settings' : 'Create Category'}
						</DialogTitle>
						<DialogDescription>Setup root navigation categories.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveCategory} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Category Name</label>
							<Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Smart Watch" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Slug / Unique ID</label>
							<Input required value={categoryId} onChange={e => setCategoryId(e.target.value)} placeholder="e.g. smart-watch" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Icon Emoji</label>
							<Input value={icon} onChange={e => setIcon(e.target.value)} placeholder="e.g. ⌚" />
						</div>
						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold">Save Category</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
