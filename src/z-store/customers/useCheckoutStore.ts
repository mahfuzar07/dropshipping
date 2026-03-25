import { create } from 'zustand';

interface CheckoutFormData {
	email: string;
	firstName: string;
	lastName: string;
	company: string;
	address: string;
	city: string;
	postalCode: number;
	apartment: string;
	phone: string;
	shippingMethod: 'standard' | 'express';
	paymentMethod: 'cod' | 'card' | 'bkash';
	cardNumber: string;
	expiryDate: string;
	cvv: string;
	nameOnCard: string;
	saveInfo: boolean;
	newsletter: boolean;
	note: string;
	differentBillingAddress: boolean;
	hasCoupon: boolean;
	couponCode: string;
}

interface CheckoutState {
	formData: CheckoutFormData;
	errors: Record<string, string>;
	isProcessing: boolean;
	step: number;
	totals: {
		subtotal: number;
		shipping: number;
		discount: number;
		tax: number;
		total: number;
	};
	updateFormField: (field: keyof CheckoutFormData, value: string | boolean) => void;
	setErrors: (errors: Record<string, string>) => void;
	clearErrors: () => void;
	setProcessing: (isProcessing: boolean) => void;
	setStep: (step: number) => void;
	calculateTotals: (subtotal: number) => void;
	applyCouponCode: () => void;
	resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => {
	const calculateTotals = (subtotal: number, shippingMethod: 'standard' | 'express', couponCode?: string) => {
		const coupons: Record<string, number> = {
			SAVE10: 0.1, // 10% discount
			SAVE20: 0.2, // 20% discount
		};
		const discountRate = (couponCode && coupons[couponCode.trim().toUpperCase()]) || 0;
		const discountAmount = subtotal * discountRate;
		const shipping = shippingMethod === 'express' ? 25 : subtotal > 100 ? 0 : 15;
		const tax = (subtotal - discountAmount) * 0.08;
		const total = subtotal - discountAmount + shipping + tax;

		return { subtotal, shipping, discount: discountAmount, tax, total };
	};

	return {
		formData: {
			email: '',
			firstName: '',
			lastName: '',
			company: '',
			address: '',
			city: '',
			postalCode: 0,
			apartment: '',
			phone: '',
			shippingMethod: 'standard',
			paymentMethod: 'cod',
			cardNumber: '',
			expiryDate: '',
			cvv: '',
			nameOnCard: '',
			saveInfo: false,
			newsletter: false,
			note: '',
			couponCode: '',
			hasCoupon: false,
			differentBillingAddress: false,
		},
		errors: {},
		isProcessing: false,
		step: 1,
		totals: {
			subtotal: 0,
			shipping: 0,
			discount: 0,
			tax: 0,
			total: 0,
		},

		updateFormField: (field, value) =>
			set((state) => {
				const newFormData = { ...state.formData, [field]: value };
				const newErrors = { ...state.errors };
				if (newErrors[field]) {
					delete newErrors[field];
				}
				return { formData: newFormData, errors: newErrors };
			}),

		setErrors: (errors) => set({ errors }),

		clearErrors: () => set({ errors: {} }),

		setProcessing: (isProcessing) => set({ isProcessing }),

		setStep: (step) => set({ step }),

		calculateTotals: (subtotal) =>
			set((state) => ({
				totals: calculateTotals(subtotal, state.formData.shippingMethod, state.formData.hasCoupon ? state.formData.couponCode : undefined),
			})),

		applyCouponCode: () =>
			set((state) => {
				const code = state.formData.couponCode.trim().toUpperCase();
				if (!code) {
					return { errors: { ...state.errors, couponCode: 'Please enter a coupon code.' } };
				}

				const coupons: Record<string, number> = {
					SAVE10: 0.1, // 10% discount
					SAVE20: 0.2, // 20% discount
				};

				if (coupons[code]) {
					return {
						errors: { ...state.errors, couponCode: '' },
						totals: calculateTotals(state.totals.subtotal, state.formData.shippingMethod, code),
					};
				} else {
					return { errors: { ...state.errors, couponCode: 'Invalid coupon code.' } };
				}
			}),

		resetCheckout: () =>
			set({
				formData: {
					email: '',
					firstName: '',
					lastName: '',
					company: '',
					address: '',
					city: '',
					postalCode: 0,
					apartment: '',
					phone: '',
					shippingMethod: 'standard',
					paymentMethod: 'cod',
					cardNumber: '',
					expiryDate: '',
					cvv: '',
					nameOnCard: '',
					saveInfo: false,
					newsletter: false,
					note: '',
					couponCode: '',
					hasCoupon: false,
					differentBillingAddress: false,
				},
				errors: {},
				isProcessing: false,
				step: 1,
				totals: {
					subtotal: 0,
					shipping: 0,
					discount: 0,
					tax: 0,
					total: 0,
				},
			}),
	};
});
