import { create } from 'zustand';

export interface Address {
	id: string;
	fullName: string;
	phone: string;
	address: string;
	addressLine2: string;
	city: string;
	district: string;
	postalCode: string;
	label?: 'HOME' | 'OFFICE';
	isDefaultShipping: boolean;
}

interface AddressStore {
	addresses: Address[];
	addAddress: (address: Address) => void;
	setDefaultShipping: (id: string) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
	addresses: [],

	addAddress: (newAddress) =>
		set((state) => ({
			addresses: [
				...state.addresses.map((a) => ({
					...a,
					isDefaultShipping: newAddress.isDefaultShipping ? false : a.isDefaultShipping,
				})),
				newAddress,
			],
		})),

	setDefaultShipping: (id) =>
		set((state) => ({
			addresses: state.addresses.map((addr) => ({
				...addr,
				isDefaultShipping: addr.id === id,
			})),
		})),
}));
