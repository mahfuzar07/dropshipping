'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/z-store/global/useAuthStore';

export default function ClientAuthHydrator() {
	const { checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();

		const interval = setInterval(
			() => {
				checkAuth();
			},
			15 * 60 * 1000,
		);

		return () => clearInterval(interval);
	}, []);

	return null;
}
