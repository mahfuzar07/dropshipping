'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function SignInPageContent() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState('john@example.com');
	const [password, setPassword] = useState('password123');
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			alert('Sign in successful!');
		}, 1000);
	};

	return (
		<div className="w-full max-w-md">
			<div className="mb-8">
				<h2 className="text-3xl font-bold text-foreground">Sign In</h2>
				<p className="text-muted-foreground mt-2">Sign in to your account to continue shopping</p>
			</div>

			{/* Social Sign In */}
			<div className="space-y-3 mb-6">
				<button className="w-full h-12 rounded-lg border border-border hover:bg-secondary transition flex items-center justify-center gap-3">
					<svg className="w-5 h-5" viewBox="0 0 24 24">
						<path fill="#1F2937" d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0z" />
						<path
							fill="#fff"
							d="M12 5.3c3.656 0 6.697 2.995 6.697 6.7 0 3.368-2.596 6.159-5.953 6.618v-4.642h2.06V12.05h-2.06v-1.52c0-.437.19-.855.5-1.158v-1.96h-1.12c-.512.283-.895.643-1.059 1.023v2.015h-2.03v1.788h2.03v4.642c-3.357-.459-5.953-3.25-5.953-6.618 0-3.705 3.041-6.7 6.697-6.7z"
						/>
					</svg>
					<span className="text-sm font-medium">Sign in with Facebook</span>
				</button>

				<button className="w-full h-12 rounded-lg border border-border hover:bg-secondary transition flex items-center justify-center gap-3">
					<svg className="w-5 h-5" viewBox="0 0 24 24">
						<path
							fill="#EA4335"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="#4285F4"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					<span className="text-sm font-medium">Sign in with Google</span>
				</button>
			</div>

			<div className="relative mb-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-border"></div>
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="px-2 bg-background text-muted-foreground">or</span>
				</div>
			</div>

			{/* Sign In Form */}
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
						Email Address
					</label>
					<Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
						Password
					</label>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="h-11 pr-10"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
						</button>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<label className="flex items-center gap-2">
						<input type="checkbox" className="w-4 h-4 rounded border-border" />
						<span className="text-sm text-muted-foreground">Remember me</span>
					</label>
					<Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition">
						Forgot password?
					</Link>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
					{isLoading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>

			<p className="text-center text-sm text-muted-foreground mt-6">
				Don&apos;t have an account?{' '}
				<Link href="/sign-up" className="font-semibold text-primary hover:text-primary/80 transition">
					Sign up
				</Link>
			</p>
		</div>
	);
}
