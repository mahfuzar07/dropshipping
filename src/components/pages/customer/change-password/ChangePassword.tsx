'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Eye, EyeClosed, Key, KeyIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { changePassword } from '@/lib/api/auth';

type ChangePasswordPayload = {
	old_password: string;
	new_password: string;
	confrim_password: string;
};

export default function ChangePassword() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState<ChangePasswordPayload>({
		old_password: '',
		new_password: '',
		confrim_password: '',
	});

	const [show, setShow] = useState({
		current: false,
		new: false,
		confirm: false,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await changePassword(form);
			toast.success('Password updated successfully!');
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Failed to update password. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-16 h-16 flex items-center justify-center p-3 rounded-full flex-shrink-0">
						<KeyIcon className="text-orange-400 text-4xl" />
					</div>
					<div>
						<h1 className="font-serif text-3xl font-medium">Change Password</h1>
						<p className="text-muted-foreground">Update your account password securely</p>
					</div>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit}>
				<Card className="shadow-none max-w-xl border-none p-0">
					<CardHeader className="px-3">
						<CardTitle className="font-serif text-md">Security Information</CardTitle>
					</CardHeader>

					<CardContent className="space-y-4 px-3">
						{/* Current Password */}
						<Label htmlFor="old_password" className="mb-1">
							Current Password
						</Label>
						<div className="relative">
							<Input
								type={show.current ? 'text' : 'password'}
								value={form.old_password}
								onChange={(e) =>
									setForm({
										...form,
										old_password: e.target.value,
									})
								}
							/>
							<button
								type="button"
								onClick={() =>
									setShow({
										...show,
										current: !show.current,
									})
								}
								className="absolute right-3 top-3.5 text-muted-foreground"
							>
								{show.current ? <Eye size={18} /> : <EyeClosed size={18} />}
							</button>
						</div>

						{/* New Password */}
						<Label htmlFor="new_password" className="mb-1">
							New Password
						</Label>
						<div className="relative">
							<Input
								type={show.new ? 'text' : 'password'}
								value={form.new_password}
								onChange={(e) =>
									setForm({
										...form,
										new_password: e.target.value,
									})
								}
							/>
							<button type="button" onClick={() => setShow({ ...show, new: !show.new })} className="absolute right-3 top-3.5 text-muted-foreground">
								{show.new ? <Eye size={18} /> : <EyeClosed size={18} />}
							</button>
						</div>

						{/* Confirm Password */}
						<Label htmlFor="confrim_password" className="mb-1">
							Confirm New Password
						</Label>
						<div className="relative">
							<Input
								type={show.confirm ? 'text' : 'password'}
								value={form.confrim_password}
								onChange={(e) =>
									setForm({
										...form,
										confrim_password: e.target.value,
									})
								}
							/>
							<button
								type="button"
								onClick={() =>
									setShow({
										...show,
										confirm: !show.confirm,
									})
								}
								className="absolute right-3 top-3.5 text-muted-foreground"
							>
								{show.confirm ? <Eye size={18} /> : <EyeClosed size={18} />}
							</button>
						</div>

						<div className="pt-4">
							{/* <Button type="submit">'Update Password</Button> */}
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? 'Updating...' : 'Update Password'}
							</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
