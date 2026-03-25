'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/axiosInstance';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { Eye, EyeOff, Key, Phone, PhoneCall } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Checkbox } from '@/components/ui/checkbox';

// ---------------- LOGIN FORM ----------------
const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
	const { loginCustomer } = useAuthStore();
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await loginCustomer({ phone, password });

			onSuccess();
		} catch (err: any) {
			setError(err.response?.data?.message || 'Login failed');
			setLoading(false);
		}
	};

	return (
		<motion.div
			key="login"
			initial={{ x: 200, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -200, opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<InputGroup>
					<InputGroupAddon side="left">
						<InputGroupText>{/* <Phone size={16} /> */} +88</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						required
						type="tel"
						placeholder="Phone number"
						className="pl-11 h-11 !bg-white"
						leftAddon
						value={phone}
						onChange={(e) => {
							const raw = e.target.value;
							const digitsOnly = raw.replace(/\D/g, '');

							setPhone(digitsOnly);
						}}
						inputMode="numeric"
						pattern="[0-9]*"
					/>
				</InputGroup>

				<InputGroup>
					<div className="relative w-full">
						<InputGroupAddon side="left">
							<InputGroupText>
								<Key size={16} />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							type={showPassword ? 'text' : 'password'}
							required
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="h-11 pl-10 !bg-white"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</InputGroup>

				{error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}

				{/* Remember / Forgot */}
				<div className="flex items-center justify-between text-sm">
					<label className="flex items-center gap-2 text-gray-600">
						<Checkbox className="data-[state=checked]:bg-twinkle-accent data-[state=checked]:border-twinkle-accent " />
						<span>Remember me</span>
					</label>
					<span className="cursor-pointer text-indigo-600 hover:underline">Forgot password?</span>
				</div>

				<Button
					type="submit"
					disabled={loading}
					className="w-full mt-5 bg-twinkle-accent  hover:bg-twinkle-accent/80 text-white py-4 text-md h-11 rounded-lg disabled:opacity-50"
				>
					{loading ? 'Logging in…' : 'Login'}
				</Button>
			</form>
		</motion.div>
	);
};

// ---------------- REGISTRATION FORM ----------------
const RegistrationForm = ({ onOtpSent }: { onOtpSent: (phone: string) => void }) => {
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await api.post(apiEndpoint.auth.customer.register, { phone, password });
			onOtpSent(phone);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Registration failed');
			setLoading(false);
		}
	};

	return (
		<motion.div
			key="register"
			initial={{ x: 200, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -200, opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<InputGroup>
					<InputGroupAddon side="left">
						<InputGroupText>{/* <Phone size={16} /> */} +88</InputGroupText>
					</InputGroupAddon>
					<InputGroupInput
						required
						type="tel"
						placeholder="Phone number"
						className="pl-11 h-11 !bg-white"
						leftAddon
						value={phone}
						onChange={(e) => {
							const raw = e.target.value;
							const digitsOnly = raw.replace(/\D/g, '');

							setPhone(digitsOnly);
						}}
						inputMode="numeric"
						pattern="[0-9]*"
					/>
				</InputGroup>

				<InputGroup>
					<div className="relative w-full">
						<InputGroupAddon side="left">
							<InputGroupText>
								<Key size={16} />
							</InputGroupText>
						</InputGroupAddon>
						<InputGroupInput
							type={showPassword ? 'text' : 'password'}
							required
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="h-11 pl-10 !bg-white"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
				</InputGroup>

				{error && <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}

				<Button
					type="submit"
					disabled={loading}
					className="w-full mt-3 bg-twinkle-accent  hover:bg-twinkle-accent/80 text-white py-4 text-md h-11 rounded-lg disabled:opacity-50"
				>
					{loading ? 'Sending OTP…' : 'Register'}
				</Button>
			</form>
		</motion.div>
	);
};

// ---------------- OTP FORM ----------------
const OtpForm = ({ phone, onVerified }: { phone: string; onVerified: () => void }) => {
	const [otp, setOtp] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			await api.post(apiEndpoint.auth.customer.verifyOtp, { phone, code: otp });
			onVerified();
		} catch (err: any) {
			setError(err.response?.data?.message || 'OTP verification failed');
			setLoading(false);
		}
	};

	return (
		<motion.div
			key="otp"
			initial={{ x: 200, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			exit={{ x: -200, opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					type="text"
					placeholder="Enter OTP"
					value={otp}
					onChange={(e) => setOtp(e.target.value)}
					className="h-12 bg-gray-50 border-gray-200 focus:bg-white"
					required
				/>

				<div className="text-sm text-gray-500">OTP sent to: {phone}</div>

				{error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</div>}

				<Button
					type="submit"
					disabled={loading}
					className="w-full bg-[#8CB891] hover:bg-[#8CB891]/80 text-white py-5 text-md h-12 rounded-lg disabled:opacity-50"
				>
					{loading ? 'Verifying…' : 'Verify OTP'}
				</Button>
			</form>
		</motion.div>
	);
};

// ---------------- LOGIN MODAL ----------------
export default function LoginModal() {
	const { isModalOpen, closeModal } = useLayoutStore();
	const { user } = useAuthStore();
	const router = useRouter();
	const pathname = usePathname();
	const previousRoute = useRef<string | null>(null);

	const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
	const [phoneForOtp, setPhoneForOtp] = useState('');

	useEffect(() => {
		if (isModalOpen && !previousRoute.current) previousRoute.current = pathname;

		if (user?.role === 'ADMIN') {
			router.push('/admin/dashboard');
		} else if (user) {
			router.push('/');
		}
	}, [isModalOpen, pathname, user, router]);

	const handleSuccess = () => {
		closeModal();

		if (!user) return;

		if (user.role === 'ADMIN') {
			router.push('/admin/dashboard');
		} else {
			router.push('/');
		}

		previousRoute.current = null;
	};

	const handleOtpSent = (phone: string) => {
		setPhoneForOtp(phone);
		setMode('otp');
	};

	const handleVerified = () => {
		setMode('login');
		closeModal();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={(open) => !open && handleSuccess()}>
			<DialogContent className="md:max-w-md w-full gap-0 md:px-5 px-0">
				<DialogHeader>
					<DialogTitle className="text-center mx-auto">
						<div className="relative cursor-pointer w-50 h-14 2xl:h-20">
							<Link href="/">
								<Image fill src="/assets/brand.png" alt="Brand logo" className="w-full h-full object-contain" />
							</Link>
						</div>
					</DialogTitle>
				</DialogHeader>

				<div className="p-5 overflow-hidden">
					<h1 className="text-center font-emily text-twinkle-accent text-2xl font-semibold mb-8">
						{mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'OTP Verification'}
					</h1>

					<AnimatePresence mode="wait">
						{mode === 'login' && <LoginForm onSuccess={handleSuccess} />}
						{mode === 'register' && <RegistrationForm onOtpSent={handleOtpSent} />}
						{mode === 'otp' && <OtpForm phone={phoneForOtp} onVerified={handleVerified} />}
					</AnimatePresence>

					<p className="text-center text-sm text-gray-400 mt-5">
						{mode === 'login' ? (
							<>
								Don't have an account?
								<button onClick={() => setMode('register')} className="ml-1 cursor-pointer hover:text-teal-500 hover:underline text-teal-600">
									Register
								</button>
							</>
						) : mode === 'register' ? (
							<>
								Already have an account?
								<button onClick={() => setMode('login')} className="ml-1 cursor-pointer hover:text-teal-500 hover:underline text-teal-600">
									Login
								</button>
							</>
						) : null}
					</p>
				</div>
			</DialogContent>
		</Dialog>
	);
}
