'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, KeyIcon, Check, X, Loader2 } from 'lucide-react';

import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';

/* ================= TYPES ================= */

type ChangePasswordPayload = {
	old_password: string;
	new_password: string;
	confirm_password: string;
};

type FieldKey = keyof ChangePasswordPayload;

type ShowState = Record<'old_password' | 'new_password' | 'confirm_password', boolean>;

/* ================= PASSWORD RULES ================= */

const RULES: { label: string; test: (v: string) => boolean }[] = [
	{ label: 'At least 8 characters', test: (v) => v.length >= 8 },
	{ label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
	{ label: 'One number', test: (v) => /\d/.test(v) },
	{ label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_COLORS = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-500', 'bg-green-500'];
const STRENGTH_LABELS = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];

/* ================= FIELD CONFIG ================= */

const FIELDS: { key: FieldKey; label: string }[] = [
	{ key: 'old_password', label: 'Current password' },
	{ key: 'new_password', label: 'New password' },
	{ key: 'confirm_password', label: 'Confirm new password' },
];

export default function ChangePassword() {
	/* ================= FORM STATE ================= */

	const [form, setForm] = useState<ChangePasswordPayload>({
		old_password: '',
		new_password: '',
		confirm_password: '',
	});

	const [show, setShow] = useState<ShowState>({
		old_password: false,
		new_password: false,
		confirm_password: false,
	});

	const [touched, setTouched] = useState(false);

	/* ================= MUTATION ================= */

	const { create: changePassword, isMutating: isSubmitting } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CHANGE_PASSWORD],
		api: apiEndpoint.users.CHANGE_PASSWORD(),
		auth: true,
		responseType: 'single',
		enabled: false,

		onSuccess: () => {
			toast.success('Password updated successfully!');
			setForm({ old_password: '', new_password: '', confirm_password: '' });
			setTouched(false);
		},

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update password');
		},
	});

	/* ================= DERIVED VALIDATION ================= */

	const passedRules = useMemo(() => RULES.map((r) => r.test(form.new_password)), [form.new_password]);
	const strength = passedRules.filter(Boolean).length; // 0-4

	const confirmMismatch = touched && form.confirm_password.length > 0 && form.new_password !== form.confirm_password;

	const samePassword = touched && form.old_password.length > 0 && form.new_password.length > 0 && form.old_password === form.new_password;

	const isValid =
		form.old_password.length > 0 &&
		strength === RULES.length &&
		form.new_password === form.confirm_password &&
		form.old_password !== form.new_password;

	/* ================= HELPERS ================= */

	const handleChange = (key: FieldKey, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const toggleShow = (key: FieldKey) => {
		setShow((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched(true);

		if (!form.old_password) {
			toast.error('Enter your current password.');
			return;
		}
		if (strength < RULES.length) {
			toast.error('New password does not meet all requirements.');
			return;
		}
		if (form.old_password === form.new_password) {
			toast.error('New password must be different from the current password.');
			return;
		}
		if (form.new_password !== form.confirm_password) {
			toast.error("Passwords don't match");
			return;
		}

		const payload = new FormData();
		payload.append('old_password', form.old_password);
		payload.append('new_password', form.new_password);
		payload.append('confirm_password', form.confirm_password);

		changePassword({ payload });
	};

	/* ================= UI ================= */

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-gradient-to-br from-orange-200 to-orange-400 w-14 h-14 flex items-center justify-center rounded-full shadow-sm">
						<KeyIcon className="text-white" size={22} />
					</div>

					<div>
						<h1 className="font-serif text-2xl md:text-3xl font-medium">Change Password</h1>
						<p className="text-muted-foreground text-sm">Update your account password securely</p>
					</div>
				</div>
			</motion.div>

			{/* Form */}
			<motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
				<Card className="shadow-none max-w-xl border-none p-0">
					<CardHeader className="px-3">
						<CardTitle className="text-md">Security Information</CardTitle>
					</CardHeader>

					<CardContent className="space-y-5 px-3">
						{FIELDS.map(({ key, label }) => (
							<div key={key} className="space-y-2">
								<div className="flex items-center justify-between">
									<Label htmlFor={key}>{label}</Label>
									{key === 'confirm_password' && confirmMismatch && <span className="text-xs text-red-500">Passwords don&apos;t match</span>}
									{key === 'new_password' && samePassword && <span className="text-xs text-red-500">Must differ from current password</span>}
								</div>

								<div className="relative">
									<Input
										id={key}
										type={show[key] ? 'text' : 'password'}
										value={form[key]}
										autoComplete={key === 'old_password' ? 'current-password' : 'new-password'}
										onChange={(e) => handleChange(key, e.target.value)}
										className={`pr-10 ${
											(key === 'confirm_password' && confirmMismatch) || (key === 'new_password' && samePassword)
												? 'border-red-400 focus-visible:ring-red-400'
												: ''
										}`}
									/>

									<button
										type="button"
										onClick={() => toggleShow(key)}
										aria-label={show[key] ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
									>
										{show[key] ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>

								{/* Strength meter + rule checklist, only for the new password field */}
								{key === 'new_password' && form.new_password.length > 0 && (
									<div className="space-y-2 pt-1">
										<div className="flex items-center gap-2">
											<div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden flex gap-1">
												{Array.from({ length: RULES.length }).map((_, i) => (
													<div
														key={i}
														className={`flex-1 rounded-full transition-colors ${i < strength ? STRENGTH_COLORS[strength] : 'bg-slate-100'}`}
													/>
												))}
											</div>
											<span className="text-xs text-muted-foreground w-16 text-right">{STRENGTH_LABELS[strength]}</span>
										</div>

										<ul className="grid grid-cols-2 gap-x-3 gap-y-1">
											{RULES.map((rule, i) => (
												<li
													key={rule.label}
													className={`flex items-center gap-1.5 text-xs ${passedRules[i] ? 'text-green-600' : 'text-muted-foreground'}`}
												>
													{passedRules[i] ? <Check size={13} /> : <X size={13} />}
													{rule.label}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						))}

						{/* Submit */}
						<div className="pt-2">
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting ? (
									<span className="flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" />
										Updating...
									</span>
								) : (
									'Update Password'
								)}
							</Button>
						</div>
					</CardContent>
				</Card>
			</motion.form>
		</div>
	);
}
