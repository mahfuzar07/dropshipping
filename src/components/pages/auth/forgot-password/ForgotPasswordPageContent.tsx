'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check } from 'lucide-react';
import { passwordReset, sendOTP, verifyOTP } from '@/lib/api/auth';
import { toast } from 'sonner';

type ForgotPasswordStep = 'email' | 'otp' | 'password' | 'success';

export default function ForgotPasswordPageContent() {
	const [step, setStep] = useState<ForgotPasswordStep>('email');
	const [email, setEmail] = useState('john@example.com');
	const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
	const [newPassword, setNewPassword] = useState('NewPass123!');
	const [confirmPassword, setConfirmPassword] = useState('NewPass123!');
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		sendOTP({
			otp_identifier: email,
		})
			.then((response) => {
				toast.success(response.message || 'Verification code sent! Check your email.');
				setStep('otp');
			})
			.finally(() => {
				setIsLoading(false);
			});
		// setTimeout(() => {
		// 	setIsLoading(false);
		// 	setStep('otp');
		// }, 1000);
	};

	// passwordReset({
	// 	reset_identifier: email,
	// 	password: newPassword,
	// 	confirm_password: confirmPassword,
	// });

	const handleOtpChange = (index: number, value: string) => {
		if (value.length > 1) return;
		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < 5) {
			const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
			nextInput?.focus();
		}
	};

	const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
			prevInput?.focus();
		}
	};

	const handleOtpSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		verifyOTP({
			otp_identifier: email,
			otp: otp.join(''),
			otp_type: 'Reset Password',
		})
			.then((response) => {
				toast.success(response.message || 'OTP verified! You can now reset your password.');
				if (otp.join('').length === 6) {
					setStep('password');
				}
			})
			.catch((err) => {
				const errorMessage = err.response?.data?.message || err.message || 'OTP verification failed. Please try again.';
				toast.error(errorMessage);
			})
			.finally(() => {
				// setIsLoading(false);
			});
		// setTimeout(() => {
		// 	toast.success('OTP verified! You can now reset your password.');
		// 	if (otp.join('').length === 6) {
		// 		setStep('password');
		// 	}
		// }, 1000);
	};

	const handlePasswordSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (newPassword === confirmPassword && newPassword.length >= 8) {
			setIsLoading(true);
			passwordReset({
				reset_identifier: email,
				password: newPassword,
				confirm_password: confirmPassword,
			})
				.then((response) => {
					toast.success(response.message || 'Password reset successful! You can now sign in with your new password.');
					setStep('success');
				})
				.catch((err) => {
					const errorMessage = err.response?.data?.message || err.message || 'Password reset failed. Please try again.';
					toast.error(errorMessage);
				})
				.finally(() => {
					setIsLoading(false);
				});
			// setTimeout(() => {
			// 	setIsLoading(false);
			// 	setStep('success');
			// }, 1000);
		}
	};

	return (
		<div className="w-full max-w-md">
			{/* Back Button */}
			<Link href="/sign-in" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition mb-6">
				<ArrowLeft className="w-4 h-4" />
				Back to Sign In
			</Link>

			{/* Step 1 - Email */}
			{step === 'email' && (
				<>
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-foreground">Reset Password</h2>
						<p className="text-muted-foreground mt-2">Enter your email address and we&apos;ll send you a code to reset your password</p>
					</div>

					<form onSubmit={handleEmailSubmit} className="space-y-6">
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
								Email Address
							</label>
							<Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full h-11 bg-orange-300 hover:bg-orange-400 text-primary-foreground  font-semibold"
						>
							{isLoading ? 'Sending code...' : 'Send Verification Code'}
						</Button>
					</form>
				</>
			)}

			{/* Step 2 - OTP */}
			{step === 'otp' && (
				<>
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-foreground">Verify Email</h2>
						<p className="text-muted-foreground mt-2">We&apos;ve sent a 6-digit code to {email}</p>
					</div>

					<form onSubmit={handleOtpSubmit} className="space-y-6">
						<div>
							<p className="text-sm font-medium text-foreground mb-4">Enter verification code:</p>

							<div className="flex gap-2 justify-center mb-6">
								{otp.map((digit, index) => (
									<input
										key={index}
										id={`forgot-otp-${index}`}
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
						</div>

						<Button
							type="submit"
							disabled={otp.join('').length !== 6}
							className="w-full h-11  text-primary-foreground bg-orange-300 hover:bg-orange-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Verify Code
						</Button>

						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-2">Didn&apos;t receive the code?</p>
							<button className="text-sm font-semibold text-primary hover:text-primary/80 transition">Resend Code</button>
						</div>
					</form>
				</>
			)}

			{/* Step 3 - New Password */}
			{step === 'password' && (
				<>
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-foreground">Create New Password</h2>
						<p className="text-muted-foreground mt-2">Enter your new password below</p>
					</div>

					<form onSubmit={handlePasswordSubmit} className="space-y-6">
						<div>
							<label htmlFor="newPassword" className="block text-sm font-medium text-foreground mb-2">
								New Password
							</label>
							<Input
								id="newPassword"
								type="password"
								placeholder="••••••••"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="h-11"
							/>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
								Confirm Password
							</label>
							<Input
								id="confirmPassword"
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="h-11"
							/>
						</div>

						<div className="bg-secondary/50 rounded-lg p-4 text-xs text-muted-foreground space-y-2">
							<p className="font-medium text-foreground">Password must contain:</p>
							<ul className="space-y-1">
								<li>✓ At least 8 characters</li>
								<li>✓ One uppercase letter</li>
								<li>✓ One lowercase letter</li>
								<li>✓ One number</li>
								<li>✓ One special character</li>
							</ul>
						</div>

						<Button
							type="submit"
							disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 8}
							className="w-full h-11  text-primary-foreground bg-orange-300 hover:bg-orange-400 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? 'Resetting...' : 'Reset Password'}
						</Button>
					</form>
				</>
			)}

			{/* Step 4 - Success */}
			{step === 'success' && (
				<>
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/10 mb-6">
							<Check className="w-8 h-8 text-green-500" />
						</div>
						<h2 className="text-3xl font-bold text-foreground mb-2">Password Reset!</h2>
						<p className="text-muted-foreground mb-8">Your password has been successfully reset. You can now sign in with your new password.</p>

						<Link href="/sign-in">
							<Button className="w-full h-11  text-primary-foreground bg-orange-300 hover:bg-orange-400 font-semibold">Back to Sign In</Button>
						</Link>
					</div>
				</>
			)}
		</div>
	);
}
