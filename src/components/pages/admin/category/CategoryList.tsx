'use client';

import { useState } from 'react';
import CategoryTreeItem from './CategoryTreeItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import LoadingData from '@/components/common/loader/LoadingData';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';
import { toast } from 'sonner';
import ConfirmModal from '@/components/common/alert-dialog/ConfirmDialog';


interface CategoryNode {
	id: number;
	name: string;
	slug?: string;
	status: 'ACTIVE' | 'INACTIVE';
	scope: 'PRODUCT' | 'SERVICE' | 'BOTH';
	parentId?: number | null;
	children: CategoryNode[];
	icon?: string;
}

export default function CategoryList() {
	const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
	const { openDrawer } = useLayoutStore();

	const [confirmOpen, setConfirmOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<{ id: number; name: string } | null>(null);

	const { data, isLoading, refetch } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.categories.tree,
		auth: true,
		responseType: 'single',
	});

	const categories: CategoryNode[] = (data?.payload || []).map((cat: CategoryNode) => ({
		...cat,
		children: cat.children || [],
		parentId: cat.parentId ?? null,
	}));

	const toggleExpand = (id: number) => {
		setExpandedIds((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	/* ---------------- DELETE ---------------- */
	const { remove, isMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CATEGORY],
		api: apiEndpoint.categories.category,
		auth: true,
		responseType: 'single',
		enabled: false,
		invalidateKeys: [[QueriesKey.CATEGORIES]],
		onSuccess: () => {
			toast.success('Category removed!');
			refetch();
		},
	});

	// Open modal from child
	const openDeleteModal = (id: number, name: string, hasChildren: boolean) => {
		if (hasChildren) {
			toast.warning('Cannot delete category with children');
			return;
		}
		setSelectedCategory({ id, name });
		setConfirmOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedCategory) return;

		try {
			await remove(selectedCategory.id);
			toast.success('Category deleted successfully!');
			setConfirmOpen(false);
		} catch (error: any) {
			const msg = error?.response?.data?.message || 'Failed to delete category';
			toast.warning(msg);
		}
	};

	if (isLoading) return <LoadingData message="Loading categories..." />;

	return (
		<div className="space-y-1">
			<Card className="shadow border-none">
				<CardHeader className="border-b !pb-3 font-hanken flex items-center justify-between">
					<CardTitle className="text-lg">Categories Trees</CardTitle>
					<Button
						onClick={() => openDrawer({ drawerType: 'add-category', drawerData: {} })}
						className="bg-dashboard-primary text-primary-foreground px-6 py-2 rounded-md"
					>
						<PlusIcon />
						Create Category
					</Button>
				</CardHeader>

				<CardContent className="space-y-2">
					{categories.length === 0 && <p>No categories found</p>}

					{categories.map((category) => (
						<CategoryTreeItem
							key={category.id}
							category={category}
							level={0}
							expandedIds={expandedIds}
							onToggleExpand={toggleExpand}
							onDelete={(id, hasChildren) => openDeleteModal(id, category.name, hasChildren)}
							isMutating={isMutating}
						/>
					))}
				</CardContent>
			</Card>

			{/* Confirm Modal */}
			<ConfirmModal
				open={confirmOpen}
				message={selectedCategory?.name || ''}
				onConfirm={handleConfirmDelete}
				onCancel={() => setConfirmOpen(false)}
				isMutating={isMutating}
			/>
		</div>
	);
}
