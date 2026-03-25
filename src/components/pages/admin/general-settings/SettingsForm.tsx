'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SettingsFormData } from '@/types/types';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { toast } from 'sonner';
import LoadingData from '@/components/common/loader/LoadingData';
import StoreSettings from './StoreSettings';
import MetaSettings from './MetaSettings';
import SocialLinks from './SocialLinks';
import AdsMetaSettings from './AdsMetaSettings';
import LocalizationSettings from './LocalizationSettings';
import { useSettingsFormStore } from '@/z-store/admin/useSettingsFormStore';

export interface FormDataResponse {
	payload: SettingsFormData;
	status: string;
	message: string;
}

export default function SettingsForm() {
	const router = useRouter();
	const { formData, initializeForm, hasExistingSettings, setHasExistingSettings } = useSettingsFormStore();

	//  Fetch existing settings
	const { data: existingSettingsResponse, isLoading: isFetching } = useAppData<FormDataResponse, 'single'>({
		key: [QueriesKey.SITE_SETTINGS_GET],
		api: apiEndpoint.settings.siteSettings,
		auth: true,
		responseType: 'single',
		enabled: true,
		refetchOnMount: false,
	});

	const existingSettings = existingSettingsResponse?.payload;

	useEffect(() => {
		if (!existingSettings) return;

		const sanitized = Object.fromEntries(Object.entries(existingSettings).map(([key, val]) => [key, val == null ? '' : val]));

		initializeForm(sanitized);
	}, [existingSettings, initializeForm]);

	//  Mutation (create/update)
	const { create, isMutating } = useAppData<SettingsFormData, 'single'>({
		key: [QueriesKey.SITE_SETTINGS],
		api: apiEndpoint.settings.siteSettings,
		auth: true,
		responseType: 'single',
		enabled: false,
		invalidateKeys: [[QueriesKey.SITE_SETTINGS_GET]],
		onSuccess: () => {
			toast.success(hasExistingSettings ? 'Settings Updated!' : 'Settings Created!');
			setHasExistingSettings(true);
		},
		onError: (error: any) => {
			const msg = error?.response?.data?.message || 'Something went wrong!';
			toast.error(msg);
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const submitData = new FormData();

		Object.entries(formData).forEach(([key, value]) => {
			if (value == null) return;

			if (key === 'metaKeywords' && Array.isArray(value)) {
				value.forEach((v) => submitData.append('metaKeywords[]', v));
			} else if ((key === 'storeLogoFile' || key === 'storeIconFile') && value instanceof File) {
				submitData.append(key === 'storeLogoFile' ? 'storeLogo' : 'storeIcon', value);
			} else if (key === 'removeStoreLogo' || key === 'removeStoreIcon') {
				if (value) submitData.append(key, 'true');
			} else if (typeof value !== 'object') {
				submitData.append(key, String(value));
			}
		});

		try {
			await create(submitData as any);
		} catch (err: any) {
			const msg = err?.response?.data?.message || 'Failed to save settings';
			toast.error(msg);
		}
	};

	if (isFetching) return <LoadingData message="Loading Settings..." />;
	if (isMutating) return <LoadingData message="Saving Settings..." />;

	return (
		<div className="relative">
			<form onSubmit={handleSubmit}>
				<div className="space-y-5">
					<div className="grid md:grid-cols-2 grid-cols-1 gap-5">
						<StoreSettings />
						<MetaSettings />
					</div>

					<div className="grid md:grid-cols-2 grid-cols-1 gap-5">
						<SocialLinks />
						<AdsMetaSettings />
					</div>

					<div className="grid md:grid-cols-1 grid-cols-1 gap-5">
						<LocalizationSettings />
					</div>

					{/* Bottom Actions */}
					<div className="flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard')}>
							Cancel
						</Button>
						<Button type="submit" disabled={isMutating} className="bg-dashboard-primary min-w-[150px] hover:bg-dashboard-primary/80">
							{isMutating ? 'Saving...' : hasExistingSettings ? 'Save Changes' : 'Save Settings'}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
