import { create } from 'zustand';

/* ================= TYPES ================= */

interface Address {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	zip: string;
	country: string;
}

interface Shipping {
	method: string;
}

interface Payment {
	cardName: string;
	cardNumber: string;
	expiry: string;
	cvv: string;
}

interface OrderItem {
	id: number;
	name: string;
	variant: string;
	qty: number;
	price: number;
	emoji: string;
}

interface OrderSummary {
	items: OrderItem[];
	discount: number;
}

interface CheckoutState {
	step: number;

	address: Address;
	shipping: Shipping;
	payment: Payment;
	orderSummary: OrderSummary;

	setAddress: (data: Partial<Address>) => void;
	setShipping: (data: Partial<Shipping>) => void;
	setPayment: (data: Partial<Payment>) => void;

	nextStep: () => void;
	prevStep: () => void;
	goTo: (n: number) => void;
}

/* ================= STORE ================= */

export const useCheckoutStore = create<CheckoutState>((set) => ({
	step: 1,

	address: {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		zip: '',
		country: '',
	},

	shipping: { method: '' },

	payment: {
		cardName: '',
		cardNumber: '',
		expiry: '',
		cvv: '',
	},

	orderSummary: {
		items: [
			{
				id: 1,
				name: 'Premium Wireless Headphones',
				variant: 'Black / XL',
				qty: 1,
				price: 3499,
				emoji: '🎧',
			},
			{
				id: 2,
				name: 'Leather Phone Case',
				variant: 'iPhone 15 Pro',
				qty: 2,
				price: 899,
				emoji: '📱',
			},
		],
		discount: 200,
	},

	setAddress: (data) => set((s) => ({ address: { ...s.address, ...data } })),
	setShipping: (data) => set((s) => ({ shipping: { ...s.shipping, ...data } })),
	setPayment: (data) => set((s) => ({ payment: { ...s.payment, ...data } })),

	nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
	prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
	goTo: (n) => set({ step: n }),
}));
