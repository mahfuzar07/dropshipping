import { create } from 'zustand';

export type Status = 'ACTIVE' | 'INACTIVE';
export type CategoryScope = 'PRODUCT' | 'SERVICE' | 'BOTH';

export interface CategoryFormData {
	name: string;
	slug?: string;

	icon: string;
	banner: string;

	iconFile: File | null;
	bannerFile: File | null;

	removeIcon: boolean;
	removeBanner: boolean;

	parentId?: number;
	status: Status;
	scope: CategoryScope;
}
export type CategoryErrors = Partial<Record<keyof CategoryFormData, string>>;

const defaultFormData: CategoryFormData = {
	name: '',
	slug: '',

	icon: '',
	banner: '',

	iconFile: null,
	bannerFile: null,

	removeIcon: false,
	removeBanner: false,

	parentId: undefined,
	status: 'ACTIVE',
	scope: 'PRODUCT',
};

type CategoryStore = {
	formData: CategoryFormData;
	hasExistingData: boolean;
	errors: CategoryErrors;
	setField: <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => void;

	setFormData: (data: Partial<CategoryFormData>) => void;

	initializeForm: (data: Partial<CategoryFormData>) => void;

	setImage: (field: 'icon' | 'banner', file: File, preview: string) => void;

	removeImage: (field: 'icon' | 'banner') => void;

	resetForm: () => void;
	setError: (field: keyof CategoryFormData, message?: string) => void;

	setErrors: (errors: CategoryErrors) => void;

	clearErrors: () => void;
	validateForm: () => boolean;
	setHasExistingData: (val: boolean) => void;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const useCategoryFormStore = create<CategoryStore>((set, get) => ({
	formData: defaultFormData,
	hasExistingData: false,
	errors: {},
	setField: (field, value) =>
		set((state) => ({
			formData: {
				...state.formData,
				[field]: value,
			},
			errors: {
				...state.errors,
				[field]: undefined,
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
				iconFile: null,
				bannerFile: null,
				removeIcon: false,
				removeBanner: false,
			},
			errors: {},
			hasExistingData: true,
		})),

	setImage: (field, file, preview) =>
		set((state) => ({
			formData: {
				...state.formData,
				[field]: preview,
				[`${field}File`]: file,
				[`remove${capitalize(field)}`]: false,
			},
			errors: {
				...state.errors,
				[field]: undefined,
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
			errors: {},
			hasExistingData: false,
		})),
	setError: (field, message) =>
		set((state) => ({
			errors: {
				...state.errors,
				[field]: message,
			},
		})),

	setErrors: (errors) =>
		set(() => ({
			errors,
		})),

	clearErrors: () =>
		set(() => ({
			errors: {},
		})),
	validateForm: () => {
		const { formData } = get();
		const newErrors: CategoryErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Category name is required';
		}

		const hasIcon = !!formData.iconFile || (formData.icon && !formData.removeIcon);
		if (!hasIcon) {
			newErrors.icon = 'Category icon is required';
		}

		set({ errors: newErrors });

		return Object.keys(newErrors).length === 0;
	},
	setHasExistingData: (val) =>
		set(() => ({
			hasExistingData: val,
		})),
}));
