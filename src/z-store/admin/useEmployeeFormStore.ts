'use client';

import { create } from 'zustand';

export enum RoleType {
	SUPER_ADMIN = 'SUPER_ADMIN',
	HR_ADMIN = 'HR_ADMIN',
	DEPARTMENT_LEAD = 'DEPARTMENT_LEAD',
	STAFF = 'STAFF',
	ACCOUNTS = 'ACCOUNTS',
	CALL_CENTER = 'CALL_CENTER',
	PACKER = 'PACKER',
	DELIVERY = 'DELIVERY',
}

export interface EmployeeFormData {
	officialEmail: string;
	officialPhone: string;
	password?: string;
	confirmPassword?: string;

	departmentId: string;
	designationId: string;

	role: RoleType;

	fullName: string;
	avatar?: string;
	avatarFile?: File | null;
	removeAvatar: false;

	gender?: string;
	dateOfBirth?: string;

	experience?: number;
	bio?: string;

	alternativePhone?: string;
	alternativeEmail?: string;

	address?: string;
	emergencyContact?: string;

	joiningDate: string;
	lastWorkingDay?: string;

	employeeIDCard?: string;
	departmentCode?: string;
}

export type EmployeeErrors = Partial<Record<keyof EmployeeFormData, string>>;

const defaultFormData: EmployeeFormData = {
	officialEmail: '',
	officialPhone: '',

	password: '',
	confirmPassword: '',

	departmentId: '',
	designationId: '',

	role: RoleType.STAFF,

	fullName: '',
	avatar: '',
	avatarFile: null,
	removeAvatar: false,

	gender: '',
	dateOfBirth: '',

	experience: 0,
	bio: '',

	alternativePhone: '',
	alternativeEmail: '',

	address: '',
	emergencyContact: '',

	joiningDate: '',

	employeeIDCard: '',
	departmentCode: '',
};

type EmployeeStore = {
	formData: EmployeeFormData;
	hasExistingData: boolean;
	errors: EmployeeErrors;

	setField: <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => void;

	setFormData: (data: Partial<EmployeeFormData>) => void;

	initializeForm: (data: Partial<EmployeeFormData>) => void;

	setImage: (field: 'avatar', file: File, preview: string) => void;

	removeImage: (field: 'avatar') => void;

	resetForm: () => void;

	setError: (field: keyof EmployeeFormData, message?: string) => void;

	setErrors: (errors: EmployeeErrors) => void;

	clearErrors: () => void;

	validateForm: () => boolean;

	setHasExistingData: (val: boolean) => void;
};

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const useEmployeeFormStore = create<EmployeeStore>((set, get) => ({
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
			formData: { ...state.formData, ...data },
		})),

	initializeForm: (data) =>
		set(() => ({
			formData: { ...defaultFormData, ...data, avatarFile: null, removeAvatar: false },
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
			errors: { ...state.errors, [field]: message },
		})),

	setErrors: (errors) => set(() => ({ errors })),

	clearErrors: () => set(() => ({ errors: {} })),

	validateForm: () => {
		const { formData } = get();
		const newErrors: EmployeeErrors = {};

		if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
		if (!formData.officialEmail.trim()) newErrors.officialEmail = 'Official email is required';
		if (!formData.officialPhone.trim()) newErrors.officialPhone = 'Official phone is required';
		if (!formData.departmentId) newErrors.departmentId = 'Department is required';
		if (!formData.designationId) newErrors.designationId = 'Designation is required';
		if (!formData.joiningDate) newErrors.joiningDate = 'Joining date is required';
		if (!formData.password && !get().hasExistingData) newErrors.password = 'Password is required';
		if (!formData.confirmPassword && !get().hasExistingData) newErrors.confirmPassword = 'Please confirm your password';
		if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

		set({ errors: newErrors });

		return Object.keys(newErrors).length === 0;
	},

	setHasExistingData: (val) => set(() => ({ hasExistingData: val })),
}));
