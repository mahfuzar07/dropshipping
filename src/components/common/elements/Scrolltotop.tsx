'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollToTop() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		if (typeof window === 'undefined' || !('scrollRestoration' in window.history)) return;
		window.history.scrollRestoration = 'manual';
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname, searchParams]);

	return null;
}
