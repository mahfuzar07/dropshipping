'use client';
import { useEffect } from 'react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';

export function useAuthWatcher(redirectTo: string = '/') {
	const { isAuthenticated, hasHydrated } = useAuthStore();
	const { openModal } = useLayoutStore();

	useEffect(() => {
		if (!hasHydrated) return;

		if (!isAuthenticated) {
			openModal({
				modalType: 'login-modal',
				modalData: { redirectTo },
			});
		}
	}, [isAuthenticated, hasHydrated, openModal, redirectTo]);
}
