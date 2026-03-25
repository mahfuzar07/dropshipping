import { create } from 'zustand';

export interface DepartmentFormData {
	name: string;
	code: string;
	description?: string;
}
export type DepartmentErrors = Partial<Record<keyof DepartmentFormData, string>>;

const defaultFormData: DepartmentFormData = {
	name: '',
	code: '',
	description: '',
};

type DepartmentStore = {
	formData: DepartmentFormData;
	hasExistingData: boolean;
	errors: DepartmentErrors;
	setField: <K extends keyof DepartmentFormData>(field: K, value: DepartmentFormData[K]) => void;

	setFormData: (data: Partial<DepartmentFormData>) => void;

	initializeForm: (data: Partial<DepartmentFormData>) => void;

	resetForm: () => void;
	setError: (field: keyof DepartmentFormData, message?: string) => void;



	clearErrors: () => void;
	validateForm: () => boolean;
	setHasExistingData: (val: boolean) => void;
};

export const useDepartmentFormStore = create<DepartmentStore>((set, get) => ({
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
		const newErrors: DepartmentErrors = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Department name is required';
		}

		if (!formData.code.trim()) {
			newErrors.code = 'Department code is required';
		}

		set({ errors: newErrors });

		return Object.keys(newErrors).length === 0;
	},
	setHasExistingData: (val) =>
		set(() => ({
			hasExistingData: val,
		})),
}));
