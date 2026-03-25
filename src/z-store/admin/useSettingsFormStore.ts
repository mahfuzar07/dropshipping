import { create } from 'zustand';
import { SettingsFormData } from '@/types/types';

const defaultFormData: SettingsFormData = {
	storeName: '',
	storeLogo: '',
	storeIcon: '',
	storeLogoFile: null,
	storeIconFile: null,
	removeStoreLogo: false,
	removeStoreIcon: false,

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

type SettingsStore = {
	formData: SettingsFormData;
	hasExistingSettings: boolean;

	setField: <K extends keyof SettingsFormData>(field: K, value: SettingsFormData[K]) => void;

	setFormData: (data: Partial<SettingsFormData>) => void;
	initializeForm: (data: Partial<SettingsFormData>) => void;

	setImage: (field: 'storeLogo' | 'storeIcon', file: File, preview: string) => void;

	removeImage: (field: 'storeLogo' | 'storeIcon') => void;

	resetForm: () => void;
	setHasExistingSettings: (val: boolean) => void;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const useSettingsFormStore = create<SettingsStore>((set) => ({
	formData: defaultFormData,
	hasExistingSettings: false,

	setField: (field, value) =>
		set((state) => ({
			formData: {
				...state.formData,
				[field]: value,
			},
		})),

	setFormData: (data) =>
		set((state) => ({
			formData: {
				...state.formData,
				...data,
			},
		})),

	initializeForm: (data) =>
		set(() => ({
			formData: {
				...defaultFormData,
				...data,
				storeLogoFile: null,
				storeIconFile: null,
				removeStoreLogo: false,
				removeStoreIcon: false,
			},
			hasExistingSettings: true,
		})),

	setImage: (field, file, preview) =>
		set((state) => ({
			formData: {
				...state.formData,
				[field]: preview,
				[`${field}File`]: file,
				[`remove${capitalize(field)}`]: false,
			},
		})),

	removeImage: (field) =>
		set((state) => ({
			formData: {
				...state.formData,
				[field]: '',
				[`${field}File`]: null,
				[`remove${capitalize(field)}`]: true,
			},
		})),

	resetForm: () =>
		set(() => ({
			formData: defaultFormData,
			hasExistingSettings: false,
		})),

	setHasExistingSettings: (val) =>
		set(() => ({
			hasExistingSettings: val,
		})),
}));
