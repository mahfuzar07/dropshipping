import { create } from 'zustand';

export interface Address {
	id: string;
	fullName: string;
	phone: string;
	province: string;
	city: string;
	zone: string;
	address: string;
	landmark?: string;
	label: 'HOME' | 'OFFICE';
	isDefaultShipping: boolean;
	isDefaultBilling: boolean;
}

interface AddressStore {
	addresses: Address[];
	addAddress: (address: Omit<Address, 'id'>) => void;
	updateAddress: (id: string, address: Partial<Address>) => void;
	deleteAddress: (id: string) => void;
	setDefaultShipping: (id: string) => void;
	setDefaultBilling: (id: string) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
	addresses: [],
	
	addAddress: (newAddress) =>
		set((state) => ({
			addresses: [...state.addresses, { ...newAddress, id: Date.now().toString() }],
		})),
	updateAddress: (id, updated) =>
		set((state) => ({
			addresses: state.addresses.map((addr) => (addr.id === id ? { ...addr, ...updated } : addr)),
		})),
	deleteAddress: (id) =>
		set((state) => ({
			addresses: state.addresses.filter((addr) => addr.id !== id),
		})),
	setDefaultShipping: (id) =>
		set((state) => ({
			addresses: state.addresses.map((addr) => ({
				...addr,
				isDefaultShipping: addr.id === id,
			})),
		})),
	setDefaultBilling: (id) =>
		set((state) => ({
			addresses: state.addresses.map((addr) => ({
				...addr,
				isDefaultBilling: addr.id === id,
			})),
		})),
}));
