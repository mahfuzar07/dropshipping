'use client';

import { useScrollDirection } from '@/hooks/useScrollDirection';
import HeaderTop from './HeaderTop';
import HeaderBottom from './HeaderBottom';

export default function Header() {
	const isVisible = useScrollDirection();

	return (
		<>
			<header
				className={`sticky w-full md:min-h-[120px] top-0 left-0 right-0 z-50 transition-transform duration-300 bg-white  shadow ${isVisible ? 'translate-y-0' : ''}`}
			>
				<HeaderTop />

				<HeaderBottom />
			</header>
		</>
	);
}
