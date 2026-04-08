'use client';

import { Globe, Truck, Shield, Users } from 'lucide-react';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen flex relative">
			{/* Background Image */}
			<img src="/assets/background/auth-bg.png" alt="Global Shipping Background" className="absolute inset-0 w-full h-full object-cover" />

			{/* Enhanced Overlay */}
			<div className="absolute inset-0 bg-gradient-to-bl from-black/50 via-black/60 to-black/70" />

			{/* Left Side - Form / Children */}
			<div className="w-full lg:w-5/12 flex items-center justify-center p-6 relative bg-white/5 backdrop-blur-xs">
				<div className="w-full max-w-lg bg-white  rounded-xl shadow-xl md:p-10 p-5 border border-white/10">{children}</div>
			</div>

			{/* Right Side - Hero Section */}
			<div className="hidden lg:flex lg:w-7/12 relative overflow-hidden">
				{/* Main Content */}
				<div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
					{/* Top Content */}
					<div className="max-w-xl">
						{/* Branding with Icon */}
						<div className="flex items-center gap-3 mb-6">
							<div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center">
								<Globe className="w-6 h-6 text-white" strokeWidth={2.5} />
							</div>
							<h1 className="text-4xl font-black tracking-tighter uppercase bg-gradient-to-r from-white via-white to-zinc-300 bg-clip-text text-transparent">
								GlobalShip
							</h1>
						</div>

						{/* Headline */}
						<h2 className="text-6xl font-bold leading-[1.05] tracking-tight">
							Shop the world.
							<br />
							<span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">Delivered fast.</span>
						</h2>

						{/* Description */}
						<p className="text-lg text-white/75 mt-6 leading-relaxed max-w-md">
							Premium products from every corner of the globe. Fast, secure, and reliable international shipping to your doorstep.
						</p>

						{/* Feature Badges */}
						<div className="flex flex-wrap gap-3 mt-10">
							<div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-sm font-medium">
								<Truck className="w-4 h-4" />
								Lightning Fast Delivery
							</div>
							<div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-sm font-medium">
								<Globe className="w-4 h-4" />
								100+ Countries
							</div>
							<div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-sm font-medium">
								<Shield className="w-4 h-4" />
								Secure Payments
							</div>
						</div>
					</div>

					{/* Bottom Trust Section */}
					<div className="flex items-center gap-6">
						<div className="flex -space-x-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center text-xs font-bold shadow-xl ring-1 ring-white/10"
								>
									{i}
								</div>
							))}
						</div>

						<div>
							<div className="flex items-center gap-1 text-2xl font-semibold">
								⭐⭐⭐⭐⭐ <span className="text-white/90 text-lg ml-2">5.0</span>
							</div>
							<p className="text-white/70 text-sm mt-1">Trusted by over 15,000+ happy customers worldwide</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
