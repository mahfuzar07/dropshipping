import { create } from 'zustand';

export type Status = 'DRAFT' | 'ACTIVE' | 'INACTIVE';
export type ViewType = 'RADIO' | 'SELECT';

export interface AttributeValue {
	id?: string;
	value: string;
	hexColor?: string | null;
}

export interface ProductAttribute {
	id?: string;
	code: string;
	name: string;
	viewType: ViewType;
	status?: Status;
	values: AttributeValue[];
}

export interface ProductVariant {
	id?: string;
	sku?: string;
	barcode?: string;
	price: number;
	stock: number;
	discount: number;
	discountType: 'FIXED' | 'PERCENT';
	isActive: boolean;
	isDefault: boolean;
	attributeValueIds?: string[];
	attributeValues?: AttributeValue[];
	images?: string[];
}

export interface ProductFormData {
	id?: string;
	title: string;
	slug: string;
	description?: string | null;
	currency: string;
	status: Status;
	categoryId: number;
	images: string[];
	attributes: ProductAttribute[];
	variants: ProductVariant[];
	uploadedImages: File[];
}

export type ProductErrors = Partial<Record<keyof ProductFormData, string>>;

const defaultFormData: ProductFormData = {
	title: '',
	slug: '',
	description: '',
	currency: 'BDT',
	status: 'DRAFT',
	categoryId: 1,
	images: [],
	attributes: [],
	variants: [],
	uploadedImages: [],
};

type ProductStore = {
	formData: ProductFormData;
	errors: ProductErrors;
	hasExistingData: boolean;

	setField: <K extends keyof ProductFormData>(field: K, value: ProductFormData[K]) => void;
	setFormData: (data: Partial<ProductFormData>) => void;
	initializeForm: (data: Partial<ProductFormData>) => void;
	addImage: (file: File, preview: string) => void;
	removeImage: (index: number) => void;
	addAttribute: (attr: ProductAttribute) => void;
	removeAttribute: (index: number) => void;
	addVariant: (variant: ProductVariant) => void;
	removeVariant: (index: number) => void;
	setError: (field: keyof ProductFormData, message?: string) => void;
	setErrors: (errors: ProductErrors) => void;
	clearErrors: () => void;
	resetForm: () => void;
	validateForm: () => boolean;
};

export const useProductFormStore = create<ProductStore>((set, get) => ({
	formData: defaultFormData,
	errors: {},
	hasExistingData: false,

	setField: (field, value) =>
		set((state) => ({
			formData: { ...state.formData, [field]: value },
			errors: { ...state.errors, [field]: undefined },
		})),

	setFormData: (data) =>
		set((state) => ({
			formData: { ...state.formData, ...data },
		})),

	initializeForm: (data) =>
		set(() => ({
			formData: { ...defaultFormData, ...data },
			errors: {},
			hasExistingData: true,
		})),

	addImage: (file, preview) =>
		set((state) => ({
			formData: {
				...state.formData,
				uploadedImages: [...state.formData.uploadedImages, file],
				images: [...state.formData.images, preview],
			},
		})),

	removeImage: (index) =>
		set((state) => {
			const images = [...state.formData.images];
			const uploadedImages = [...state.formData.uploadedImages];
			images.splice(index, 1);
			uploadedImages.splice(index, 1);
			return { formData: { ...state.formData, images, uploadedImages } };
		}),

	addAttribute: (attr) =>
		set((state) => ({
			formData: { ...state.formData, attributes: [...state.formData.attributes, attr] },
		})),

	removeAttribute: (index) =>
		set((state) => {
			const attributes = [...state.formData.attributes];
			attributes.splice(index, 1);
			return { formData: { ...state.formData, attributes } };
		}),

	addVariant: (variant) =>
		set((state) => ({
			formData: { ...state.formData, variants: [...state.formData.variants, variant] },
		})),

	removeVariant: (index) =>
		set((state) => {
			const variants = [...state.formData.variants];
			variants.splice(index, 1);
			return { formData: { ...state.formData, variants } };
		}),

	setError: (field, message) => set((state) => ({ errors: { ...state.errors, [field]: message } })),

	setErrors: (errors) => set(() => ({ errors })),
	clearErrors: () => set(() => ({ errors: {} })),

	resetForm: () => set(() => ({ formData: defaultFormData, errors: {}, hasExistingData: false })),

	validateForm: () => {
		const { formData } = get();
		const newErrors: ProductErrors = {};

		if (!formData.title.trim()) newErrors.title = 'Product title is required';
		if (!formData.slug.trim()) newErrors.slug = 'Product slug is required';
		if (formData.categoryId <= 0) newErrors.categoryId = 'Category is required';

		set({ errors: newErrors });
		return Object.keys(newErrors).length === 0;
	},
}));
