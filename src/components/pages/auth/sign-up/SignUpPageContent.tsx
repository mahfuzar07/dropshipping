'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export default function SignUpPageContent() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2>(1);
	const [showPassword, setShowPassword] = useState(false);

	// Step 1 - Form Data

	const [email, setEmail] = useState('john@example.com');
	const [password, setPassword] = useState('SecurePass123!');
	const [confirmPassword, setConfirmPassword] = useState('SecurePass123!');

	// Step 2 - OTP Data
	const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
	const [timeLeft, setTimeLeft] = useState(120);
	const [isVerifying, setIsVerifying] = useState(false);

	// Password validation
	const passwordRequirements = {
		length: password.length >= 8,
		uppercase: /[A-Z]/.test(password),
		lowercase: /[a-z]/.test(password),
		number: /[0-9]/.test(password),
		special: /[!@#$%^&*]/.test(password),
		match: password === confirmPassword && password.length > 0,
	};

	const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

	const handleStep1Submit = (e: React.FormEvent) => {
		e.preventDefault();
		if (email && allRequirementsMet) {
			setStep(2);
		}
	};

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) return;
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Auto-focus next input
		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			nextInput?.focus();
		}
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-${index - 1}`);
			prevInput?.focus();
		}
	};

	const handleOtpVerify = async () => {
		setIsVerifying(true);
		// Simulate verification
		setTimeout(() => {
			setIsVerifying(false);
			router.push('/');
		}, 1500);
	};

	return (
		<div className="w-full max-w-md">
			{/* Step Indicator */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-border'}`} />
					<div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
				</div>
				<h2 className="text-3xl font-bold text-foreground">{step === 1 ? 'Create Account' : 'Verify Email'}</h2>
				<p className="text-muted-foreground mt-2">
					{step === 1 ? 'Join our global shopping community' : `We've sent a verification code to ${email}`}
				</p>
			</div>

			{/* Step 1 - Account Details */}
			{step === 1 && (
				<>
					{/* Social Sign Up */}
					<div className="space-x-3 mb-6 flex">
						<button className="w-full h-12 rounded-lg border border-border hover:bg-secondary transition flex items-center justify-center gap-3">
							<svg className="w-5 h-5" viewBox="0 0 24 24">
								<path fill="#1F2937" d="M12 0c6.627 0 12 5.373 12 12s-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0z" />
								<path
									fill="#fff"
									d="M12 5.3c3.656 0 6.697 2.995 6.697 6.7 0 3.368-2.596 6.159-5.953 6.618v-4.642h2.06V12.05h-2.06v-1.52c0-.437.19-.855.5-1.158v-1.96h-1.12c-.512.283-.895.643-1.059 1.023v2.015h-2.03v1.788h2.03v4.642c-3.357-.459-5.953-3.25-5.953-6.618 0-3.705 3.041-6.7 6.697-6.7z"
								/>
							</svg>
							<span className="text-sm font-medium">Sign up with Facebook</span>
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
							<span className="text-sm font-medium">Sign up with Google</span>
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

					{/* Sign Up Form */}
					<form onSubmit={handleStep1Submit} className="space-y-4">
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

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
								Confirm Password
							</label>
							<Input
								id="confirmPassword"
								type={showPassword ? 'text' : 'password'}
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="h-11"
							/>
						</div>

						{/* Password Requirements */}
						<div className="bg-secondary/50 hidden rounded-lg p-4 space-y-2">
							<p className="text-xs font-medium text-foreground">Password requirements:</p>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									{passwordRequirements.length ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
									<span className="text-xs text-muted-foreground">At least 8 characters</span>
								</div>
								<div className="flex items-center gap-2">
									{passwordRequirements.uppercase ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
									<span className="text-xs text-muted-foreground">One uppercase letter</span>
								</div>
								<div className="flex items-center gap-2">
									{passwordRequirements.lowercase ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
									<span className="text-xs text-muted-foreground">One lowercase letter</span>
								</div>
								<div className="flex items-center gap-2">
									{passwordRequirements.number ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
									<span className="text-xs text-muted-foreground">One number</span>
								</div>
								<div className="flex items-center gap-2">
									{passwordRequirements.special ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
									<span className="text-xs text-muted-foreground">One special character (!@#$%^&*)</span>
								</div>
								<div className="flex items-center gap-2">
									{passwordRequirements.match ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
									<span className="text-xs text-muted-foreground">Passwords match</span>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 mt-2">
							<input type="checkbox" className="w-4 h-4 rounded border-border" />
							<span className="text-xs text-muted-foreground">
								I agree to the <button className="text-primary hover:underline">Terms of Service</button> and{' '}
								<button className="text-primary hover:underline">Privacy Policy</button>
							</span>
						</div>

						<Button
							type="submit"
							disabled={!email || !allRequirementsMet}
							className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Continue
						</Button>
					</form>
				</>
			)}

			{/* Step 2 - OTP Verification */}
			{step === 2 && (
				<div className="space-y-6">
					<div>
						<p className="text-muted-foreground mb-4">Enter the 6-digit code we sent to your email</p>

						<div className="flex gap-2 justify-center mb-6">
							{otp.map((digit, index) => (
								<input
									key={index}
									id={`otp-${index}`}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) => handleOtpChange(index, e.target.value)}
									onKeyDown={(e) => handleOtpKeyDown(index, e)}
									className="w-12 h-14 text-center text-2xl font-bold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
								/>
							))}
						</div>

						<div className="flex items-center justify-center gap-2">
							<span className="text-sm text-muted-foreground">Code expires in: </span>
							<span className="text-sm font-semibold text-primary">
								{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
							</span>
						</div>
					</div>

					<Button
						onClick={handleOtpVerify}
						disabled={isVerifying || otp.join('').length !== 6}
						className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isVerifying ? 'Verifying...' : 'Verify Email'}
					</Button>

					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
						<button className="text-sm font-semibold text-primary hover:text-primary/80 transition">Resend Code</button>
					</div>

					<button onClick={() => setStep(1)} className="w-full text-sm font-medium text-muted-foreground hover:text-foreground transition">
						← Back to Account Details
					</button>
				</div>
			)}

			{step === 1 && (
				<p className="text-center text-sm text-muted-foreground mt-6">
					Already have an account?{' '}
					<Link href="/sign-in" className="font-semibold text-primary hover:text-primary/80 transition">
						Sign in
					</Link>
				</p>
			)}
		</div>
	);
}
