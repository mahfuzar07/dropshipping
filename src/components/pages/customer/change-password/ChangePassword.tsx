'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, KeyIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

type ShowState = {
	current: boolean;
	new: boolean;
	confirm: boolean;
};

export default function ChangePassword() {
	/* ================= FORM STATE ================= */

	const [form, setForm] = useState<ChangePasswordPayload>({
		old_password: '',
		new_password: '',
		confirm_password: '',
	});

	const [show, setShow] = useState<ShowState>({
		current: false,
		new: false,
		confirm: false,
	});

	/* ================= MUTATION ================= */

	const { create: changePassword, isMutating: isSubmitting } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.CHANGE_PASSWORD],
		api: apiEndpoint.users.CHANGE_PASSWORD(),
		auth: true,
		responseType: 'single',
		enabled: false,

		onSuccess: () => {
			toast.success('Password updated successfully!');

			setForm({
				old_password: '',
				new_password: '',
				confirm_password: '',
			});
		},

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update password');
		},
	});

	/* ================= HELPERS ================= */

	const handleChange = (key: keyof ChangePasswordPayload, value: string) => {
		setForm((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (form.new_password !== form.confirm_password) {
			toast.error("Passwords don't match");
			return;
		}

		const payload = new FormData();
		payload.append('old_password', form.old_password);
		payload.append('new_password', form.new_password);
		payload.append('confirm_password', form.confirm_password);

		changePassword(payload);
	};

	/* ================= UI ================= */

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-full">
						<KeyIcon className="text-orange-400" />
					</div>

					<div>
						<h1 className="font-serif text-2xl md:text-3xl font-medium">Change Password</h1>
						<p className="text-muted-foreground text-sm">Update your account password securely</p>
					</div>
				</div>
			</motion.div>

			{/* Form */}
			<form onSubmit={handleSubmit}>
				<Card className="shadow-none max-w-xl border-none p-0">
					<CardHeader className="px-3">
						<CardTitle className="text-md">Security Information</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4 px-3">
						{/* Current */}
						<div className="space-y-2">
							<Label>Current Password</Label>

							<div className="relative">
								<Input
									type={show.current ? 'text' : 'password'}
									value={form.old_password}
									onChange={(e) => handleChange('old_password', e.target.value)}
								/>

								<button
									type="button"
									onClick={() =>
										setShow((p) => ({
											...p,
											current: !p.current,
										}))
									}
									className="absolute right-3 top-3 text-muted-foreground"
								>
									{show.current ? <Eye size={18} /> : <EyeOff size={18} />}
								</button>
							</div>
						</div>

						{/* New */}
						<div className="space-y-2">
							<Label>New Password</Label>

							<div className="relative">
								<Input
									type={show.new ? 'text' : 'password'}
									value={form.new_password}
									onChange={(e) => handleChange('new_password', e.target.value)}
								/>

								<button
									type="button"
									onClick={() =>
										setShow((p) => ({
											...p,
											new: !p.new,
										}))
									}
									className="absolute right-3 top-3 text-muted-foreground"
								>
									{show.new ? <Eye size={18} /> : <EyeOff size={18} />}
								</button>
							</div>
						</div>

						{/* Confirm */}
						<div className="space-y-2">
							<Label>Confirm Password</Label>

							<div className="relative">
								<Input
									type={show.confirm ? 'text' : 'password'}
									value={form.confirm_password}
									onChange={(e) => handleChange('confirm_password', e.target.value)}
								/>

								<button
									type="button"
									onClick={() =>
										setShow((p) => ({
											...p,
											confirm: !p.confirm,
										}))
									}
									className="absolute right-3 top-3 text-muted-foreground"
								>
									{show.confirm ? <Eye size={18} /> : <EyeOff size={18} />}
								</button>
							</div>
						</div>

						{/* Submit */}
						<div className="pt-4">
							<Button type="submit" disabled={isSubmitting} className="w-full">
								{isSubmitting ? 'Updating...' : 'Update Password'}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
