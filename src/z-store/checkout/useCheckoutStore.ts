import { create } from 'zustand';

/* ================= TYPES ================= */

export type ShippingInterface = {
	id: number;
	method: string;
	label: string;
	price: number;
	duration: string;
	icon: React.ReactNode;
};

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
	shipping: ShippingInterface | null;
	payment: Payment;
	orderSummary: OrderSummary;
	appliedCoupon: any | null;
	placedOrder: any | null;

	setAddress: (id: number) => void;
	setShipping: (shippingInfo: ShippingInterface | null) => void;
	setPayment: (data: Partial<Payment>) => void;
	setAppliedCoupon: (coupon: any | null) => void;
	setDiscount: (discount: number) => void;
	setPlacedOrder: (order: any | null) => void;

	nextStep: () => void;
	prevStep: () => void;
	goTo: (n: number) => void;
}

/* ================= STORE ================= */

export const useCheckoutStore = create<CheckoutState>((set) => ({
	step: 1,
	address: null,
	shipping: null,
	appliedCoupon: null,
	placedOrder: null,

	payment: {
		cardName: '',
		cardNumber: '',
		expiry: '',
		cvv: '',
	},

	orderSummary: {
		discount: 0,
	},

	setAddress: (id) => set({ address: id }),
	setShipping: (shippingInfo) => set({ shipping: shippingInfo }),
	setPayment: (data) => set((s) => ({ payment: { ...s.payment, ...data } })),
	setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
	setDiscount: (discount) => set((s) => ({ orderSummary: { ...s.orderSummary, discount } })),
	setPlacedOrder: (order) => set({ placedOrder: order }),

	nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) })),
	prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
	goTo: (n) => set({ step: n }),
}));
