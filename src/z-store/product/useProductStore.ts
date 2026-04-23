import { create } from 'zustand';

type Product = {
	_id: string;
	offer_id: string;
	title: string;
	url: string;
	image: string;

	product_name: string;
	promotion: string;
	rating: string;
	sold: string;

	price: {
		amount: string;
		currency: string;
		overseas: string;
		unit: string;
	};

	seller_icon: string;
	is_ad: boolean;
	moq: null | number;
};

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
