'use client';
import { create } from 'zustand';
import { api, authApi } from '@/lib/axiosInstance';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';

interface AuthState {
	user: any | null;
	isAuthenticated: boolean;
	hasHydrated: boolean;
	loginCustomer: (payload: { phone: string; password: string }) => Promise<void>;
	checkAuth: () => Promise<void>;
	logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	hasHydrated: false,

	loginCustomer: async (payload) => {
		await api.post(apiEndpoint.auth.customer.signIn, payload);
		await api.get(apiEndpoint.auth.verifyMe).then((res) => {
			set({ user: res.data.payload, isAuthenticated: true });
		});
	},

	checkAuth: async () => {
		try {
			const res = await authApi.get(apiEndpoint.auth.verifyMe);
			set({
				user: res.data.payload,
				isAuthenticated: true,
				hasHydrated: true,
			});
		} catch {
			set({ user: null, isAuthenticated: false, hasHydrated: true });
		}
	},

	logout: async () => {
		await authApi.post(apiEndpoint.auth.signOut);
		set({ user: null, isAuthenticated: false });
	},
}));
