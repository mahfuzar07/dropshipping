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

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	isAuthenticated: false,
	hasHydrated: false,

	loginCustomer: async (payload) => {
		const { signIn } = await import('next-auth/react');
		const result = await signIn('credentials', {
			email: payload.phone,
			password: payload.password,
			redirect: false,
		});

		if (result?.error) {
			throw new Error(result.error);
		}

		await get().checkAuth();
	},

	checkAuth: async () => {
		try {
			const res = await authApi.get(apiEndpoint.users.PROFILE());
			const profile = res.data;
			profile.name = profile.first_name || profile.last_name 
				? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
				: '';
			set({
				user: profile,
				isAuthenticated: true,
				hasHydrated: true,
			});
		} catch {
			set({ user: null, isAuthenticated: false, hasHydrated: true });
		}
	},

	logout: async () => {
		const { signOut } = await import('next-auth/react');
		await signOut({ redirect: false });
		set({ user: null, isAuthenticated: false });
	},
}));
