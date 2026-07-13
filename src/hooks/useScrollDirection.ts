'use client';

import { useEffect, useState } from 'react';

export function useScrollDirection() {
	const [isVisible, setIsVisible] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollY = window.scrollY;

			// If scrolling up, show header
			if (currentScrollY < lastScrollY) {
				setIsVisible(true);
			}
			// If scrolling down and past threshold, hide header
			else if (currentScrollY > lastScrollY && currentScrollY > 100) {
				setIsVisible(false);
			}

			setLastScrollY(currentScrollY);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [lastScrollY]);

	return isVisible;
}
