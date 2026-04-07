import { create } from 'zustand';

export interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
	store: string;
	category: string;
	discount?: boolean;
	rating?: number;
}

interface ProductState {
	products: Product[];
	isLoading: boolean;

	setProducts: (products: Product[]) => void;
	appendProducts: (products: Product[]) => void;
	setLoading: (val: boolean) => void;
	clearProducts: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
	products: [],
	isLoading: false,

	setProducts: (products) => set({ products }),

	appendProducts: (newProducts) =>
		set((state) => ({
			products: [...state.products, ...newProducts],
		})),

	setLoading: (val) => set({ isLoading: val }),

	clearProducts: () => set({ products: [] }),
}));
