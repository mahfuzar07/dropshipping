'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
					<img src="/assets/icons/facebook.png" alt="Facebook" className="w-5 h-5" />
					<span className="text-sm font-medium">Sign up with Facebook</span>
				</button>

				<button className="w-full h-12 rounded-lg border border-border hover:bg-secondary transition flex items-center justify-center gap-3">
					<img src="/assets/icons/google.png" alt="Google" className="w-5 h-5" />
					<span className="text-sm font-medium">Sign up with Google</span>
				</button>
			</div>

			<div className="relative mb-6 ">
				<div className="relative flex justify-center items-center text-sm">
					<span className="px-2 bg-transparent text-muted-foreground">Or</span>
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
					<Label className="flex items-center gap-2">
						<Checkbox className="peer data-[state=checked]:bg-orange-300 data-[state=checked]:border-orange-300 w-4 h-4 rounded border-border" />
						<span className="text-sm text-muted-foreground">Remember me</span>
					</Label>
					<Link href="/forgot-password" className="text-sm hover:underline font-medium text-primary hover:text-primary/80 transition">
						Forgot password?
					</Link>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full h-11 text-primary-foreground bg-orange-300 hover:bg-orange-400 font-semibold">
					{isLoading ? 'Signing in...' : 'Sign In'}
				</Button>
			</form>

			<p className="text-center text-sm text-muted-foreground mt-6">
				Don&apos;t have an account?{' '}
				<Link href="/sign-up" className="font-semibold hover:underline text-primary hover:text-primary/80 transition">
					Sign up
				</Link>
			</p>
		</div>
	);
}
