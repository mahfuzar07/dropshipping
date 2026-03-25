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
import { useDesignationFormStore } from '@/z-store/admin/useDesignationFormStore';


export default function DesignationForm() {
	const { isDrawerOpen, closeDrawer, drawerData } = useLayoutStore();


	const { formData, setField, initializeForm, hasExistingData, setHasExistingData, resetForm, errors, validateForm, clearErrors } =
		useDesignationFormStore();

		console.log('designation form drawer data', drawerData);

	const departmentId = (drawerData as any)?.departmentId;
	const designationId = (drawerData as any)?.designationId;

	/* ---------------- Fetch Single Category ---------------- */
	const { data: singleRes, isLoading: isSingleLoading } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DESIGNATION_GET, designationId],
		api: designationId ? `${apiEndpoint.workspace.designationDetail(designationId)}` : '',
		auth: true,
		responseType: 'single',
		enabled: !!designationId,
	});

	const singleDesignation = singleRes?.payload;

	/* ---------------- Initialize Form ---------------- */
	useEffect(() => {
		if (!isDrawerOpen) {
			resetForm();
			clearErrors();
			return;
		}
		if (designationId && singleDesignation) {
			initializeForm(singleDesignation);
			setHasExistingData(true);
		} else {
			resetForm();
			setHasExistingData(false);
		}
	}, [isDrawerOpen, designationId, singleDesignation]);

	/* ---------------- Mutation ---------------- */
	const { create, isMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DESIGNATION_CREATE],
		api: apiEndpoint.workspace.designation,
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
			title: formData.title,
			departmentId: departmentId,

		};

		if (designationId) {
			payload.id = String(designationId);
		}

		try {
			await create(payload);
			toast.success(hasExistingData ? 'Designation Updated!' : 'Designation Created!');
			closeDrawer();
		} catch (error: any) {
			const message = error?.response?.data?.message;
			toast.warning(message || 'Something went wrong');
		}
	};

	if (isSingleLoading) {
		return <LoadingData message="Loading designation details..." />;
	}
	if (isMutating) {
		return <LoadingData message="Saving designation..." />;
	}

	return (
		<div className="text-dashboard-muted font-play">
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Name + Status */}

				<div className="space-y-2">
					<Label>Designation Title *</Label>
					<Input value={formData.title} onChange={(e) => setField('title', e.target.value)} placeholder="Enter Designation Title" />
					{errors.title && <p className="text-red-600 text-sm">{errors.title}</p>}
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={closeDrawer}>
						Cancel
					</Button>

					<Button type="submit" className="bg-dashboard-primary hover:bg-dashboard-primary/80">
						{hasExistingData ? 'Save Changes' : 'Create Designation'}
					</Button>
				</div>
			</form>
		</div>
	);
}
