export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen flex">
			{/* Left Side - Hero Section */}
			<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-white flex-col justify-between p-12">
				<div>
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
						<svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
							<path d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
					</div>
					<h1 className="text-5xl font-bold mt-8 leading-tight">Welcome back to your shopping journey</h1>
					<p className="text-white/80 text-lg mt-4">Shop globally, save locally. Your favorite brands, delivered to your doorstep.</p>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex -space-x-3">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="w-10 h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-sm font-semibold"
							>
								{i}
							</div>
						))}
					</div>
					<div>
						<p className="text-white font-semibold">⭐⭐⭐⭐⭐ 5.0</p>
						<p className="text-white/70 text-sm">from 2000+ happy customers</p>
					</div>
				</div>
			</div>

			{/* Right Side - Sign In Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-background">{children}</div>
		</div>
	);
}
