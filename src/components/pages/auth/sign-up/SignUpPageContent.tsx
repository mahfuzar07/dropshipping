'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { signupUser, verifyOTP } from '@/lib/api/auth';
import { toast } from 'sonner';

export default function SignUpPageContent() {
	const router = useRouter();
	const [step, setStep] = useState<1 | 2>(1);
	const [showPassword, setShowPassword] = useState(false);

	// Step 1 - Form Data
	const [email, setEmail] = useState('john@example.com');
	const [firstName, setFirstName] = useState('John');
	const [password, setPassword] = useState('SecurePass123!');
	const [confirmPassword, setConfirmPassword] = useState('SecurePass123!');
	const [agreedToTerms, setAgreedToTerms] = useState(true);

	// Step 2 - OTP Data
	const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
	const [timeLeft, setTimeLeft] = useState(120);

	// Loading and error states
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

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

	const handleStep1Submit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email || !firstName || !allRequirementsMet || !agreedToTerms) {
			setError('Please fill all fields and agree to terms');
			return;
		}

		setIsLoading(true);
		try {
			const response = await signupUser({
				email,
				password,
				first_name: firstName,
				user_type: 'CUSTOMER',
				is_staff: false,
			});
			// console.log('Signup response:', response.status);
			// if (response.status) {
			toast.success(response.message || 'Signup successful! Check your email for OTP.');
			setStep(2);
			// } else {
			// 	setError(response.message || 'Signup failed. Please try again.');
			// 	toast.error(response.message || 'Signup failed');
			// }
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
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
		setIsLoading(true);
		setError('');
		try {
			const otpCode = otp.join('');
			if (otpCode.length !== 6) {
				setError('Please enter all 6 digits');
				setIsLoading(false);
				return;
			}

			const response = await verifyOTP({
				otp_identifier: email,
				otp: otpCode,
				otp_type: 'Registration',
			});

			if (response.status) {
				toast.success(response.message || 'Email verified successfully!');
				// Redirect to home or dashboard
				router.push('/');
			} else {
				setError(response.message || 'OTP verification failed. Please try again.');
				toast.error(response.message || 'Verification failed');
			}
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'OTP verification failed. Please try again.';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full max-w-md">
			{/* Step Indicator */}
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-4">
					<div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? 'bg-orange-300' : 'bg-border'}`} />
					<div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? 'bg-orange-300' : 'bg-border'}`} />
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

					{/* Sign Up Form */}
					<form onSubmit={handleStep1Submit} className="space-y-4">
						{error && <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>}

						<div>
							<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
								Email Address
							</label>
							<Input
								id="email"
								type="email"
								placeholder="your@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-11"
								disabled={isLoading}
							/>
						</div>

						<div>
							<label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
								First Name
							</label>
							<Input
								id="firstName"
								type="text"
								placeholder="John"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="h-11"
								disabled={isLoading}
							/>
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
									disabled={isLoading}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									disabled={isLoading}
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
								disabled={isLoading}
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
							<Checkbox
								checked={agreedToTerms}
								onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
								className="peer w-4 h-4 rounded border-border data-[state=checked]:bg-orange-300 data-[state=checked]:border-orange-300"
								disabled={isLoading}
							/>
							<span className="text-xs text-muted-foreground">
								I agree to the <button className="text-primary hover:underline">Terms of Service</button> and{' '}
								<button className="text-primary hover:underline">Privacy Policy</button>
							</span>
						</div>

						<Button
							type="submit"
							disabled={!email || !firstName || !allRequirementsMet || !agreedToTerms || isLoading}
							className="w-full h-11 bg-orange-300 hover:bg-orange-400 text-primary-foreground font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Creating Account...' : 'Sign Up'}
						</Button>
					</form>
				</>
			)}

			{/* Step 2 - OTP Verification */}
			{step === 2 && (
				<div className="space-y-6">
					{error && <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg text-sm">{error}</div>}

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
									disabled={isLoading}
									className="w-12 h-14 text-center text-2xl font-bold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
						disabled={isLoading || otp.join('').length !== 6}
						className="w-full h-11  text-primary-foreground bg-orange-300 hover:bg-orange-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? 'Verifying...' : 'Verify Email'}
					</Button>

					<div className="text-center">
						<p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
						<button className="text-sm font-semibold text-primary hover:text-primary/80 transition disabled:opacity-50" disabled={isLoading}>
							Resend Code
						</button>
					</div>

					<button
						onClick={() => {
							setStep(1);
							setError('');
						}}
						disabled={isLoading}
						className="w-full text-sm font-medium text-muted-foreground hover:text-foreground transition disabled:opacity-50"
					>
						← Back to Account Details
					</button>
				</div>
			)}

			{step === 1 && (
				<p className="text-center text-sm text-muted-foreground mt-6">
					Already have an account?{' '}
					<Link href="/sign-in" className="font-semibold hover:underline text-primary hover:text-primary/80 transition">
						Sign in
					</Link>
				</p>
			)}
		</div>
	);
}
