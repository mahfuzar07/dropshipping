import { create } from 'zustand';

/* ================= TYPES ================= */

type ShippingMethod = 'std' | 'exp' | 'ovn' | '';

interface Payment {
	cardName: string;
	cardNumber: string;
	expiry: string;
	cvv: string;
}

interface OrderSummary {
	discount: number;
}

interface CheckoutState {
	step: number;
	address: number | null;
	shipping: ShippingMethod;
	payment: Payment;
	orderSummary: OrderSummary;

	setAddress: (id: number) => void;
	setShipping: (method: ShippingMethod) => void;
	setPayment: (data: Partial<Payment>) => void;

	nextStep: () => void;
	prevStep: () => void;
	goTo: (n: number) => void;
}

/* ================= STORE ================= */

export const useCheckoutStore = create<CheckoutState>((set) => ({
	step: 1,
	address: null,
	shipping: '',

	payment: {
		cardName: '',
		cardNumber: '',
		expiry: '',
		cvv: '',
	},

	orderSummary: {
		discount: 200,
	},

	setAddress: (id) => set({ address: id }),
	setShipping: (method) => set({ shipping: method }),
	setPayment: (data) => set((s) => ({ payment: { ...s.payment, ...data } })),

	nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
	prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
	goTo: (n) => set({ step: n }),
}));
