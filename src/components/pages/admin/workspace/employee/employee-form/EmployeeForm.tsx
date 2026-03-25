'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import LoadingData from '@/components/common/loader/LoadingData';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { useEmployeeFormStore } from '@/z-store/admin/useEmployeeFormStore';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';
import CoreEmployeeInfoForm from './CoreEmployeeInfoForm';

export default function EmployeeForm() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();

	const { formData, setField, setImage, removeImage, resetForm, errors, validateForm, clearErrors, hasExistingData, setHasExistingData } =
		useEmployeeFormStore();

	useEffect(() => {
		if (!isDrawerOpen) {
			resetForm();
			clearErrors();
			return;
		}
		resetForm();
	}, [isDrawerOpen]);

	/* ---------------- Create Employee ---------------- */
	const { create, isMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.EMPLOYEE],
		api: apiEndpoint.workspace.employee,
		auth: true,
		responseType: 'single',
		enabled: false,
		// invalidateKeys: [[QueriesKey.SITE_SETTINGS_GET]],
		onSuccess: () => {
			toast.success('Employee Created!');
			closeDrawer();
			toast.success(hasExistingData ? 'Employee Updated!' : 'Employee Created!');
			setHasExistingData(true);
		},
		onError: (error: any) => {
			const msg = error?.response?.data?.message || 'Something went wrong!';
			toast.error(msg);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearErrors();

		if (!validateForm()) {
			toast.error('Please fix the errors');
			return;
		}

		const form = new FormData();

		Object.entries(formData).forEach(([key, value]) => {
			if (value == null) return;

			if (key === 'avatarFile' && value instanceof File) {
				form.append('avatar', value);
			} else if (key === 'removeAvatar') {
				if (value) form.append(key, 'true');
			} else if (typeof value !== 'object') {
				form.append(key, String(value));
			}
		});

		try {
			await create(form as any);
		} catch (err: any) {
			const msg = err?.response?.data?.message || 'Failed to save data';
			toast.error(msg);
		}
	};

	if (isMutating) return <LoadingData message="Saving employee..." />;

	return (
		<div className="text-dashboard-muted font-play">
			<form onSubmit={handleSubmit} className="space-y-5">
				<CoreEmployeeInfoForm />

				{/* Actions Button */}
				<div className="flex justify-end gap-3">
					<Button type="button" variant="outline" onClick={closeDrawer}>
						Cancel
					</Button>

					<Button type="submit" className="bg-dashboard-primary hover:bg-dashboard-primary/80">
						Create Employee
					</Button>
				</div>
			</form>
		</div>
	);
}
