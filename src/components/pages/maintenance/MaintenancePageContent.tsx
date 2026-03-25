'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FloatingElements } from '@/components/common/elements/FloatingElements';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useEffect } from 'react';

export default function MaintenancePage() {
	const { openModal } = useLayoutStore();

	const { hasHydrated, logout, isAuthenticated, user } = useAuthStore();

	console.log('user', user);

	if (!hasHydrated) return <div>Loading...</div>;

	return (
		<main className="min-h-screen bg-gradient-to-br from-twinkle-yellow via-twinkle-blue to-twinkle-purple flex items-center justify-center p-4 overflow-hidden relative">
			<FloatingElements />

			<div className="relative z-10 text-center max-w-lg">
				<div className="mb-8">
					<h1 className="text-5xl md:text-6xl font-bold text-twinkle-dark mb-4 leading-tight">TwinkleBud is Getting Ready!</h1>
					<p className="text-lg md:text-xl text-twinkle-dark-muted leading-relaxed">We're crafting something joyful for your little ones.</p>
				</div>

				<div className="flex flex-col gap-5 items-center">
					<Link href="/about">
						<Button className="bg-twinkle-accent hover:bg-twinkle-accent-dark text-white rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
							About Twinkle Bud
						</Button>
					</Link>

					{isAuthenticated && (
						<div className="bg-twinkle-accent/10 text-twinkle-accent rounded-xl px-6 py-4 text-center shadow-md">
							<h2 className="text-xl font-semibold">Welcome back!</h2>
							<p className="text-sm text-gray-700 mt-1">{user?.phone}</p>
						</div>
					)}

					{isAuthenticated ? (
						<Button
							onClick={logout}
							className="bg-slate-300 w-max hover:bg-slate-200 text-twinkle-accent rounded-full px-8 py-6 text-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
						>
							Logout
						</Button>
					) : (
						<Button
							onClick={() => openModal({ modalType: 'login-modal' })}
							className="bg-slate-300 w-max hover:bg-slate-200 text-twinkle-accent rounded-full px-8 py-6 text-md font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
						>
							Login / Registration
						</Button>
					)}
				</div>
			</div>
		</main>
	);
}
