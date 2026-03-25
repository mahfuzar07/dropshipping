'use client';

import { useEffect, useState } from 'react';

interface FloatingElement {
	id: number;
	type: 'star' | 'moon' | 'cloud';
	x: number;
	y: number;
	duration: number;
	delay: number;
	size: string;
}

export function FloatingElements() {
	const [elements, setElements] = useState<FloatingElement[]>([]);

	useEffect(() => {
		const floatingElements: FloatingElement[] = [
			// Stars
			{ id: 1, type: 'star', x: 15, y: 20, duration: 6, delay: 0, size: 'w-8 h-8' },
			{ id: 2, type: 'star', x: 80, y: 30, duration: 8, delay: 1, size: 'w-6 h-6' },
			{ id: 3, type: 'star', x: 70, y: 70, duration: 7, delay: 2, size: 'w-5 h-5' },
			{ id: 4, type: 'star', x: 20, y: 80, duration: 9, delay: 0.5, size: 'w-7 h-7' },

			// Moon
			{ id: 5, type: 'moon', x: 85, y: 15, duration: 10, delay: 0, size: 'w-12 h-12' },

			// Clouds
			{ id: 6, type: 'cloud', x: 10, y: 50, duration: 12, delay: 0, size: 'w-20 h-20' },
			{ id: 7, type: 'cloud', x: 75, y: 60, duration: 14, delay: 2, size: 'w-16 h-16' },
		];

		setElements(floatingElements);
	}, []);

	const renderElement = (element: FloatingElement) => {
		const baseClasses = 'absolute opacity-60 animate-float';

		switch (element.type) {
			case 'star':
				return (
					<svg
						key={element.id}
						className={`${baseClasses} ${element.size} text-twinkle-yellow fill-current`}
						viewBox="0 0 24 24"
						style={{
							left: `${element.x}%`,
							top: `${element.y}%`,
							animation: `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
						}}
					>
						<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
					</svg>
				);
			case 'moon':
				return (
					<svg
						key={element.id}
						className={`${baseClasses} ${element.size} text-twinkle-yellow fill-current`}
						viewBox="0 0 24 24"
						style={{
							left: `${element.x}%`,
							top: `${element.y}%`,
							animation: `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
						}}
					>
						<path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1 .12-13.5 1 1 0 0 0 1.25 1.25 10 10 0 1 0-.13 15.39z" />
					</svg>
				);
			case 'cloud':
				return (
					<svg
						key={element.id}
						className={`${baseClasses} ${element.size} text-white fill-current`}
						viewBox="0 0 24 24"
						style={{
							left: `${element.x}%`,
							top: `${element.y}%`,
							animation: `float ${element.duration}s ease-in-out ${element.delay}s infinite`,
						}}
					>
						<path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 5.23 11.08 5 12 5c3.04 0 5.71 2.36 5.98 5.31L19.35 10.04M23 17.9v2.04H1V9.98c0-.06 0-.13.02-.19h1.07C2.03 9.86 2 9.93 2 10v8h20v-.1h1M23 9.98h-.9c.05-.05.09-.1.14-.16C23.27 11.25 23.9 14.44 23 17.9h.9c.1-.47.1-.97 0-1.9V9.98z" />
					</svg>
				);
			default:
				return null;
		}
	};

	return (
		<>
			{elements.map((element) => renderElement(element))}

			{/* Keyframe animation */}
			<style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
		</>
	);
}
