import { create } from 'zustand';

export interface Address {
	id: number | string;
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

	setAddresses: (addresses: Address[]) => void;
	addAddress: (address: Address) => void;
	updateAddress: (id: Address['id'], updated: Partial<Omit<Address, 'id'>>) => void;
	removeAddress: (id: Address['id']) => void;
	setDefaultShipping: (id: Address['id']) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
	addresses: [],

	// ✅ replace পুরো list (IMPORTANT)
	setAddresses: (addresses) =>
		set(() => ({
			addresses: addresses.map((addr, i) => ({
				...addr,
				isDefaultShipping: addr.isDefaultShipping || i === 0,
			})),
		})),

	addAddress: (newAddress) =>
		set((state) => ({
			addresses: [...state.addresses.map((a) => (newAddress.isDefaultShipping ? { ...a, isDefaultShipping: false } : a)), newAddress],
		})),

	updateAddress: (id, updated) =>
		set((state) => ({
			addresses: state.addresses.map((addr) => {
				if (String(addr.id) !== String(id)) return addr;

				const isBecomingDefault = updated.isDefaultShipping === true;

				return {
					...addr,
					...updated,
					isDefaultShipping: isBecomingDefault || addr.isDefaultShipping,
				};
			}),
		})),

	removeAddress: (id) =>
		set((state) => {
			const filtered = state.addresses.filter((addr) => String(addr.id) !== String(id));

			const removedWasDefault = state.addresses.find((addr) => String(addr.id) === String(id))?.isDefaultShipping;

			if (removedWasDefault && filtered.length > 0) {
				filtered[0] = { ...filtered[0], isDefaultShipping: true };
			}

			return { addresses: filtered };
		}),

	setDefaultShipping: (id) =>
		set((state) => ({
			addresses: state.addresses.map((addr) => ({
				...addr,
				isDefaultShipping: String(addr.id) === String(id),
			})),
		})),
}));
