'use client';
import { create } from 'zustand';

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
			const { getSession } = await import('next-auth/react');
			const session = (await getSession()) as any;

			if (!session?.accessToken && !session?.user) {
				set({ user: null, isAuthenticated: false, hasHydrated: true });
				return;
			}

			const profileData = session?.user?.profile_data || session?.user;

			if (!profileData) {
				set({ user: null, isAuthenticated: false, hasHydrated: true });
				return;
			}

			const name =
				profileData.first_name || profileData.last_name
					? `${profileData.first_name ?? ''} ${profileData.last_name ?? ''}`.trim()
					: profileData.email?.split('@')[0] || 'User';

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
