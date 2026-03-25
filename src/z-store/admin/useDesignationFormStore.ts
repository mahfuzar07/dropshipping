import { create } from 'zustand';

export interface DesignationFormData {
	title: string;
}
export type DesignationErrors = Partial<Record<keyof DesignationFormData, string>>;

const defaultFormData: DesignationFormData = {
	title: '',
};

type DesignationStore = {
	formData: DesignationFormData;
	hasExistingData: boolean;
	errors: DesignationErrors;
	setField: <K extends keyof DesignationFormData>(field: K, value: DesignationFormData[K]) => void;

	setFormData: (data: Partial<DesignationFormData>) => void;

	initializeForm: (data: Partial<DesignationFormData>) => void;

	resetForm: () => void;
	setError: (field: keyof DesignationFormData, message?: string) => void;

	clearErrors: () => void;
	validateForm: () => boolean;
	setHasExistingData: (val: boolean) => void;
};

export const useDesignationFormStore = create<DesignationStore>((set, get) => ({
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
			},
			errors: {},
			hasExistingData: true,
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

	clearErrors: () =>
		set(() => ({
			errors: {},
		})),
	validateForm: () => {
		const { formData } = get();
		const newErrors: DesignationErrors = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Designation title is required';
		}

		set({ errors: newErrors });

		return Object.keys(newErrors).length === 0;
	},
	setHasExistingData: (val) =>
		set(() => ({
			hasExistingData: val,
		})),
}));
