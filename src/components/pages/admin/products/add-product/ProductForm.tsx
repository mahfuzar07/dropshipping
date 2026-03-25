'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { APIResponse, SettingsFormData } from '@/types/types';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { toast } from 'sonner';
import LoadingData from '@/components/common/loader/LoadingData';
import ProductInformation from './ProductInformation';
import Inventory from './Inventory';
import ProductGallery from './ProductGallery';
import { initCurrency } from '@/lib/utils/formatCurrency';

const defaultFormData: SettingsFormData = {
	storeName: '',
	storeLogo: '',
	storeIcon: '',
	storeLogoFile: null,
	storeIconFile: null,
	contactPhone: '',
	contactEmail: '',
	address: '',

	metaTitle: '',
	metaTagline: '',
	canonicalUrl: '',
	metaKeywords: [],
	metaDescription: '',

	facebookUrl: '',
	instagramUrl: '',
	youtubeUrl: '',
	xUrl: '',
	whatsappNumber: '',

	googleAnalyticsId: '',
	googleAdsConversionId: '',
	facebookPixelId: '',
	metaPixelToken: '',

	country: 'BD',
	language: 'en',
	currency: 'BDT',
	theme: 'light',
};

export default function ProductForm() {
	const router = useRouter();
	const [formData, setFormData] = useState<SettingsFormData>(defaultFormData);
	const [hasExistingSettings, setHasExistingSettings] = useState(false);

	//  Fetch existing settings
	const { data: existingSettingsResponse, isLoading: isFetching } = useAppData<APIResponse, 'single'>({
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

		setFormData({
			...defaultFormData,
			...sanitized,
			storeLogoFile: null,
			storeIconFile: null,
		});

		setHasExistingSettings(true);
	}, [existingSettings]);

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

	//  Form handlers
	const handleFormDataChange = (field: keyof SettingsFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData((prev) => ({ ...prev, [field]: e.target.value ?? '' }));
	};
	//  Form submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const submitData = new FormData();

		Object.entries(formData).forEach(([key, value]) => {
			if (value == null) return;

			if (key === 'metaKeywords' && Array.isArray(value)) {
				value.forEach((v) => submitData.append('metaKeywords[]', v));
			} else if ((key === 'storeLogoFile' || key === 'storeIconFile') && value instanceof File) {
				submitData.append(key === 'storeLogoFile' ? 'storeLogo' : 'storeIcon', value);
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
		<div className="h-full">
			<form onSubmit={handleSubmit}>
				<div className="space-y-5 h-full">
					<div className="grid md:grid-cols-12 grid-cols-1 gap-3 h-full">
						<div className="md:col-span-6 space-y-3">
							<ProductInformation formData={formData} setFormData={setFormData} handleFormDataChange={handleFormDataChange} />
						</div>
						<div className="md:col-span-6">
							<ProductGallery formData={formData} setFormData={setFormData} handleFormDataChange={handleFormDataChange} />
						</div>
					</div>
					<Inventory formData={formData} setFormData={setFormData} handleFormDataChange={handleFormDataChange} />

					{/* Bottom Actions */}
					<div className="flex justify-end gap-3">
						<Button type="button" variant="outline" onClick={() => router.push('/admin/dashboard')}>
							Discard
						</Button>
						<Button type="submit" disabled={isMutating} className="bg-dashboard-primary min-w-[150px] hover:bg-dashboard-primary/80">
							{isMutating ? 'Saving...' : hasExistingSettings ? 'Save Changes' : 'Published Product'}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
