'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { SearchableSelect } from '@/components/ui/custom/searchable-select';
import { DragUploadInput } from '@/components/ui/custom/DragUploadInput';

import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import LoadingData from '@/components/common/loader/LoadingData';
import { toast } from 'sonner';

import { useAppData } from '@/hooks/use-appdata';
import { useCategoryFormStore } from '@/z-store/admin/useCategoryFormStore';

import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';

import getFullImageUrl from '@/lib/utils/getFullImageUrl';
import { APIResponse } from '@/types/types';

type Status = 'ACTIVE' | 'INACTIVE';
type CategoryScope = 'PRODUCT' | 'SERVICE' | 'BOTH';

const statusOptions = [
	{ value: 'ACTIVE', label: 'Active' },
	{ value: 'INACTIVE', label: 'Inactive' },
];

const scopeOptions = [
	{ value: 'PRODUCT', label: 'Product' },
	{ value: 'SERVICE', label: 'Service' },
	{ value: 'BOTH', label: 'Both' },
];

export default function CategoryForm() {
	const { isDrawerOpen, closeDrawer, drawerData } = useLayoutStore();
	const router = useRouter();

	const {
		formData,
		setField,
		initializeForm,
		setImage,
		removeImage,
		hasExistingData,
		setHasExistingData,
		resetForm,
		errors,
		validateForm,
		clearErrors,
	} = useCategoryFormStore();

	const categoryId = (drawerData as any)?.id;

	/* ---------------- Fetch Categories Tree ---------------- */
	const { data: categoriesRes, isLoading: isFetching } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.categories.tree,
		auth: true,
		responseType: 'single',
	});

	const categories = categoriesRes?.payload || [];

	/* ---------------- Fetch Single Category ---------------- */
	const { data: singleRes, isLoading: isSingleLoading } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CATEGORY, categoryId],
		api: categoryId ? `${apiEndpoint.categories.category}/${categoryId}` : '',
		auth: true,
		responseType: 'single',
		enabled: !!categoryId,
	});

	const singleCategory = singleRes?.payload;

	/* ---------------- Initialize Form ---------------- */
	useEffect(() => {
		if (!isDrawerOpen) {
			resetForm();
			clearErrors();
			return;
		}

		// EDIT MODE
		if (categoryId && singleCategory) {
			initializeForm({
				...singleCategory,
				parentId: singleCategory.parentId ?? undefined,
			});
			setHasExistingData(true);
			return;
		}

		// CREATE MODE
		resetForm();
		setHasExistingData(false);
	}, [isDrawerOpen, categoryId, singleCategory]);

	/* ---------------- Parent Options ---------------- */
	const parentOptions = useMemo(() => {
		const flatten = (nodes: any[], excludeId?: number, prefix = ''): any[] => {
			let res: any[] = [];

			nodes.forEach((n) => {
				if (n.id === excludeId) return;

				res.push({
					value: String(n.id),
					label: prefix + n.name,
				});

				if (n.children?.length) {
					res = res.concat(flatten(n.children, excludeId, prefix + '- '));
				}
			});

			return res;
		};

		return [{ value: 'none', label: 'No Parent' }, ...flatten(categories, categoryId)];
	}, [categories, categoryId]);

	/* ---------------- Mutation ---------------- */
	const { create, isMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CATEGORY],
		api: apiEndpoint.categories.category,
		auth: true,
		responseType: 'single',
		enabled: false,
		invalidateKeys: [[QueriesKey.CATEGORIES]],
		onSuccess: () => {
			toast.success(hasExistingData ? 'Category Updated!' : 'Category Created!');
			closeDrawer();
		},
		onError: (error: any) => {
			const msg = error?.response?.data?.message || 'Something went wrong!';
			toast.error(msg);
		},
	});

	/* ---------------- Submit ---------------- */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearErrors();

		if (!validateForm()) {
			toast.error('Please fix the errors');
			return;
		}

		//  prevent self parent
		if (categoryId && formData.parentId === categoryId) {
			toast.error('Category cannot be its own parent');
			return;
		}

		const form = new FormData();

		/* ---------- Basic fields ---------- */
		form.append('name', formData.name);
		form.append('status', formData.status);
		form.append('scope', formData.scope);

		/* ---------- Parent ---------- */
		if (formData.parentId) {
			form.append('parentId', String(formData.parentId));
		} else {
			form.append('parentId', '');
		}

		/* ---------- Files ---------- */
		if (formData.iconFile instanceof File) {
			form.append('icon', formData.iconFile);
		}
		if (formData.bannerFile instanceof File) {
			form.append('banner', formData.bannerFile);
		}

		/* ---------- Remove flags ---------- */
		if (formData.removeIcon) form.append('removeIcon', 'true');
		if (formData.removeBanner) form.append('removeBanner', 'true');

		/* ---------- Update ---------- */
		if (categoryId) {
			form.append('id', String(categoryId));
		}

		await create(form as any);
	};

	/* ---------------- Loading ---------------- */
	if (isFetching || (categoryId && isSingleLoading)) {
		return <LoadingData message="Loading category..." />;
	}

	if (isMutating) {
		return <LoadingData message="Saving category..." />;
	}

	return (
		<div className="text-dashboard-muted font-play">
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Images */}
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-3">
						<Label>Category Icon *</Label>

						<DragUploadInput
							value={formData.iconFile ? URL.createObjectURL(formData.iconFile) : formData.icon ? getFullImageUrl(formData.icon) : undefined}
							onChange={(file, preview) => file && setImage('icon', file, preview)}
							onRemove={() => removeImage('icon')}
						/>

						{errors.icon && <p className="text-red-600 text-sm">{errors.icon}</p>}
					</div>

					<div className="space-y-3">
						<Label>Category Banner *</Label>

						<DragUploadInput
							value={formData.bannerFile ? URL.createObjectURL(formData.bannerFile) : formData.banner ? getFullImageUrl(formData.banner) : undefined}
							onChange={(file, preview) => file && setImage('banner', file, preview)}
							onRemove={() => removeImage('banner')}
						/>
					</div>
				</div>

				{/* Name + Status */}
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Category Name *</Label>
						<Input value={formData.name} onChange={(e) => setField('name', e.target.value)} placeholder="Enter Category Name" />
						{errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
					</div>

					<div className="space-y-2">
						<Label>Status</Label>

						<SearchableSelect options={statusOptions} value={formData.status} onChange={(v) => setField('status', v as Status)} />
					</div>
				</div>

				{/* Parent + Scope */}
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Parent Category</Label>

						<SearchableSelect
							options={parentOptions}
							value={formData.parentId ? String(formData.parentId) : 'none'}
							onChange={(v) => setField('parentId', v === 'none' ? undefined : Number(v))}
						/>
					</div>

					<div className="space-y-2">
						<Label>Category Scope</Label>

						<SearchableSelect options={scopeOptions} value={formData.scope} onChange={(v) => setField('scope', v as CategoryScope)} />
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={closeDrawer}>
						Cancel
					</Button>

					<Button type="submit" className="bg-dashboard-primary hover:bg-dashboard-primary/80">
						{hasExistingData ? 'Save Changes' : 'Create Category'}
					</Button>
				</div>
			</form>
		</div>
	);
}
