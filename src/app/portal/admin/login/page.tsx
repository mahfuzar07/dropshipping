'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			const result = await signIn('credentials', {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError('Invalid administration credentials');
				toast.error('Sign in failed. Please check your credentials.');
			} else {
				toast.success('Successfully authenticated');
				router.push('/admin/dashboard');
			}
		} catch (err) {
			setError('An error occurred during authentication. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 font-play relative overflow-hidden">
			{/* Decorative background gradients */}
			<div className="absolute top-0 left-0 w-96 h-96 bg-[#F16A38] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600 opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

			<Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white shadow-2xl relative z-10 duration-300">
				<CardHeader className="space-y-2 text-center pb-6">
					<div className="flex justify-center mb-2">
						<div className="h-12 w-12 rounded-xl bg-[#F16A38]/10 flex items-center justify-center border border-[#F16A38]/20">
							<ShieldAlert className="h-6 w-6 text-[#F16A38]" />
						</div>
					</div>
					<CardTitle className="text-2xl font-bold tracking-tight text-white">Admin Portal</CardTitle>
					<CardDescription className="text-slate-400 text-sm">
						Sign in to access your administration workspace
					</CardDescription>
				</CardHeader>

				<CardContent className="space-y-4">
					{error && (
						<div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
							<ShieldAlert className="h-4 w-4 shrink-0" />
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-slate-300 text-xs font-semibold">
								Email Address
							</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
								<Input
									id="email"
									type="email"
									placeholder="admin@dropship.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="bg-slate-950/50 border-slate-800 text-slate-200 pl-10 focus:border-[#F16A38] focus:ring-1 focus:ring-[#F16A38] h-11"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="password" className="text-slate-300 text-xs font-semibold">
								Password
							</Label>
							<div className="relative">
								<KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-4 w-4" />
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="bg-slate-950/50 border-slate-800 text-slate-200 pl-10 pr-10 focus:border-[#F16A38] focus:ring-1 focus:ring-[#F16A38] h-11"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
								>
									{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between text-xs pt-1">
							<Label className="flex items-center gap-2 text-slate-400 cursor-pointer">
								<Checkbox className="border-slate-700 data-[state=checked]:bg-[#F16A38] data-[state=checked]:border-[#F16A38] rounded" />
								<span>Keep me signed in</span>
							</Label>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-[#F16A38] hover:bg-[#d65727] text-white font-semibold h-11 rounded-lg mt-2 transition-all duration-300 shadow-md shadow-[#F16A38]/10"
						>
							{isLoading ? 'Authenticating...' : 'Sign In'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
