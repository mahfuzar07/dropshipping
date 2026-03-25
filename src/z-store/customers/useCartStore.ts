import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
	id: string;
	name: string;
	description: string;
	price: number;
	quantity: number;
	image: string;
}

interface CartState {
	items: CartItem[];
	total: number;
	addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
	removeFromCart: (id: string) => void;
	incrementQuantity: (id: string) => void;
	decrementQuantity: (id: string) => void;
	updateCartQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
}

export const useCartStore = create<CartState>()(
	persist(
		(set, get) => {
			const calculateTotal = (items: CartItem[]) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);

			return {
				items: [],
				total: 0,

				addToCart: (newItem) =>
					set((state) => {
						const existingItem = state.items.find((item) => item.id === newItem.id);

						let updatedItems: CartItem[];

						if (existingItem) {
							updatedItems = state.items.map((item) =>
								item.id === newItem.id ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } : item
							);
						} else {
							updatedItems = [...state.items, { ...newItem, quantity: newItem.quantity || 1 }];
						}

						return {
							items: updatedItems,
							total: calculateTotal(updatedItems),
						};
					}),

				removeFromCart: (id) =>
					set((state) => {
						const updatedItems = state.items.filter((item) => item.id !== id);
						return {
							items: updatedItems,
							total: calculateTotal(updatedItems),
						};
					}),

				incrementQuantity: (id) =>
					set((state) => {
						const updatedItems = state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
						return {
							items: updatedItems,
							total: calculateTotal(updatedItems),
						};
					}),

				decrementQuantity: (id) =>
					set((state) => {
						const updatedItems = state.items.map((item) => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
						return {
							items: updatedItems,
							total: calculateTotal(updatedItems),
						};
					}),

				updateCartQuantity: (id, quantity) =>
					set((state) => {
						const updatedItems = state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
						return {
							items: updatedItems,
							total: calculateTotal(updatedItems),
						};
					}),

				clearCart: () => set({ items: [], total: 0 }),
			};
		},
		{
			name: 'cart-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({ items: state.items }),
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
				}
			},
		}
	)
);
