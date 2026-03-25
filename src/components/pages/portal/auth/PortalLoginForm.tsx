'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore } from '@/z-store/global/useAuthStore';

export default function PortalLoginForm() {
	const router = useRouter();
	const { loginCustomer } = useAuthStore();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// try {
		// 	await login({ email, password });
		// 	router.push('/portal/admin/dashboard');
		// } catch (err: any) {
		// 	setError(err?.response?.data?.message || 'Login failed');
		// 	setLoading(false);
		// }
	};

	return (
		<div className="min-h-screen bg-dashboard-background flex items-center justify-center px-4">
			<motion.div
				initial={{ y: 30, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.35 }}
				className="w-full max-w-md rounded-2xl bg-white/90 backdrop-blur shadow-md p-8"
			>
				{/* Brand */}
				<div className="mb-8 text-center font-play">
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">Twinkle Bud - Portal</h1>
					<p className="mt-2 text-sm text-gray-500">Sign in & manage your dashboard</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Email */}
					<div className="space-y-1">
						<label className="text-sm font-medium text-gray-700">Email</label>
						<Input
							type="email"
							required
							placeholder="admin@twinklebud.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
						/>
					</div>

					{/* Password */}
					<div className="space-y-1">
						<label className="text-sm font-medium text-gray-700">Password</label>
						<div className="relative">
							<Input
								type={showPassword ? 'text' : 'password'}
								required
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-12 bg-gray-50 border-gray-200 focus:bg-white pr-10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((v) => !v)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
							>
								{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
							</button>
						</div>
					</div>

					{/* Error */}
					{error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">{error}</div>}

					{/* Remember / Forgot */}
					<div className="flex items-center justify-between text-sm">
						<label className="flex items-center gap-2 text-gray-600">
							<Checkbox />
							<span>Remember me</span>
						</label>
						<span className="cursor-pointer text-indigo-600 hover:underline">Forgot password?</span>
					</div>

					{/* Submit */}
					<Button type="submit" disabled={loading} className="w-full bg-dashboard-primary hover:bg-dashboard-primary/80 h-12 text-sm  font-semibold">
						{loading ? 'Signing in…' : 'Sign In'}
					</Button>
				</form>

				{/* Footer */}
				<p className="mt-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Twinklebud. All rights reserved.</p>
			</motion.div>
		</div>
	);
}
