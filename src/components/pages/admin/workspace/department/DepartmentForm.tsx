'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import LoadingData from '@/components/common/loader/LoadingData';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';
import { Textarea } from '@/components/ui/textarea';
import { useDepartmentFormStore } from '@/z-store/admin/useDepartmentFormStore';

export default function DepartmentForm() {
	const { isDrawerOpen, closeDrawer, drawerData } = useLayoutStore();


	const { formData, setField, initializeForm, hasExistingData, setHasExistingData, resetForm, errors, validateForm, clearErrors } =
		useDepartmentFormStore();

	const departmentId = (drawerData as any)?.id;

	/* ---------------- Fetch Single Category ---------------- */
	const { data: singleRes, isLoading: isSingleLoading } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DEPARTMENT_GET, departmentId],
		api: departmentId ? `${apiEndpoint.workspace.department}/${departmentId}` : '',
		auth: true,
		responseType: 'single',
		enabled: !!departmentId,
	});

	const singleDepartment = singleRes?.payload;

	/* ---------------- Initialize Form ---------------- */
	useEffect(() => {
		if (!isDrawerOpen) {
			resetForm();
			clearErrors();
			return;
		}
		if (departmentId && singleDepartment) {
			initializeForm(singleDepartment);
			setHasExistingData(true);
		} else {
			resetForm();
			setHasExistingData(false);
		}
	}, [isDrawerOpen, departmentId, singleDepartment]);

	/* ---------------- Mutation ---------------- */
	const { create, isMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DEPARTMENT_CREATE],
		api: apiEndpoint.workspace.department,
		auth: true,
		responseType: 'single',
		enabled: false,
		invalidateKeys: [[QueriesKey.DEPARTMENT_GET]],
	});

	/* ---------------- Submit ---------------- */
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearErrors();

		if (!validateForm()) {
			toast.error('Please fix the errors');
			return;
		}

		const payload: any = {
			name: formData.name,
			code: formData.code,
			description: formData.description || '',
		};

		if (departmentId) {
			payload.id = String(departmentId);
		}

		try {
			await create(payload);
			toast.success(hasExistingData ? 'Department Updated!' : 'Department Created!');
			closeDrawer();
		} catch (error: any) {
			const message = error?.response?.data?.message;
			toast.warning(message || 'Something went wrong');
		}
	};

	if (isSingleLoading) {
		return <LoadingData message="Loading department details..." />;
	}
	if (isMutating) {
		return <LoadingData message="Saving department..." />;
	}

	return (
		<div className="text-dashboard-muted font-play">
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Name + Status */}
				<div className="grid gap-5 grid-cols-1 md:grid-cols-2">
					<div className="space-y-2">
						<Label>Department Name *</Label>
						<Input value={formData.name} onChange={(e) => setField('name', e.target.value)} placeholder="Enter Department Name" />
						{errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
					</div>

					<div className="space-y-2">
						<Label>Short Code *</Label>
						<Input value={formData.code} onChange={(e) => setField('code', e.target.value)} placeholder="Enter Short Code" />
						{errors.code && <p className="text-red-600 text-sm">{errors.code}</p>}
					</div>
				</div>
				<div className="grid gap-5 grid-cols-1">
					<div className="space-y-2">
						<Label>Description *</Label>
						<Textarea
							placeholder="Type department description..."
							value={formData.description}
							onChange={(e) => setField('description', e.target.value)}
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={closeDrawer}>
						Cancel
					</Button>

					<Button type="submit" className="bg-dashboard-primary hover:bg-dashboard-primary/80">
						{hasExistingData ? 'Save Changes' : 'Create Department'}
					</Button>
				</div>
			</form>
		</div>
	);
}
