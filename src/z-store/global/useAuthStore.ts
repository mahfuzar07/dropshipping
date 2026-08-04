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
			const res = await authApi.get(apiEndpoint.auth.AUTH_SESSION());

			const profileData = res.data?.user?.profile_data;

			if (!profileData) {
				set({ user: null, isAuthenticated: false, hasHydrated: true });
				return;
			}

			const name = profileData.first_name || profileData.last_name ? `${profileData.first_name ?? ''} ${profileData.last_name ?? ''}`.trim() : '';

			set({
				user: { ...profileData, name },
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
