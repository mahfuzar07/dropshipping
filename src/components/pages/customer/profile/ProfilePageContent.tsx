'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateProfile, getProfile } from '@/lib/api/auth';

/* ======================
   🔹 Types
====================== */
interface UserProfile {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state?: string;
	postal_code?: string;
	country: string;
	dob?: string;
	gender?: string;
}

/* ======================
   🔹 Page
====================== */
export default function ProfilePageContent() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [form, setForm] = useState<Omit<UserProfile, 'id'>>({
		first_name: '',
		last_name: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		state: '',
		postal_code: '',
		country: '',
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const profile = await getProfile();
				setForm({
					first_name: profile.first_name || '',
					last_name: profile.last_name || '',
					email: profile.email || '',
					phone: profile.phone || '',
					address: profile.address || '',
					city: profile.city || '',
					state: profile.state || '',
					postal_code: profile.postal_code || '',
					country: profile.country || '',
					gender: profile.gender || '',
				});
			} catch (err) {
				toast.error('Failed to load profile data.');
			} finally {
				setIsSubmitting(false);
			}
		};
		fetchProfile();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await updateProfile(form);
			toast.success('Profile updated successfully!');
		} catch (err) {
			toast.error('Failed to update profile.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-16 h-16 flex items-center justify-center p-3 rounded-full flex-shrink-0">
						<User className="text-orange-300 text-4xl" />
					</div>
					<div>
						<h1 className="font-serif text-3xl font-medium">My Profile</h1>
						<p className="text-muted-foreground">Update your personal information</p>
					</div>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit}>
				<AnimatePresence>
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
						<Card className="shadow-none">
							<CardHeader>
								<CardTitle className="flex items-center gap-2 font-medium">
									<span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
									<span className="font-serif text-md">Personal Info</span>
								</CardTitle>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="grid md:grid-cols-2 gap-4">
									<Input
										value={form.first_name}
										placeholder="Enter Your First Name..."
										onChange={(e) =>
											setForm({
												...form,
												first_name: e.target.value,
											})
										}
									/>
									<Input
										value={form.last_name}
										placeholder="Enter Your Last Name..."
										onChange={(e) =>
											setForm({
												...form,
												last_name: e.target.value,
											})
										}
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<Input
										type="email"
										placeholder="Enter Your Email..."
										value={form.email}
										onChange={(e) =>
											setForm({
												...form,
												email: e.target.value,
											})
										}
									/>
									<Input
										placeholder="Enter Your Phone Number..."
										value={form.phone}
										onChange={(e) =>
											setForm({
												...form,
												phone: e.target.value,
											})
										}
									/>
								</div>
								<div className="grid md:grid-cols-2 gap-4">
									<Input
										value={form.gender}
										placeholder="Enter Your Gender..."
										onChange={(e) =>
											setForm({
												...form,
												gender: e.target.value,
											})
										}
									/>
									<Input
										value={form.address}
										placeholder="Enter Your Address..."
										onChange={(e) =>
											setForm({
												...form,
												address: e.target.value,
											})
										}
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<Input
										value={form.city}
										placeholder="Enter Your City..."
										onChange={(e) =>
											setForm({
												...form,
												city: e.target.value,
											})
										}
									/>
									<Input
										value={form.state}
										placeholder="Enter Your State..."
										onChange={(e) =>
											setForm({
												...form,
												state: e.target.value,
											})
										}
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<Input
										value={form.postal_code}
										placeholder="Enter Your Postal Code..."
										onChange={(e) =>
											setForm({
												...form,
												postal_code: e.target.value,
											})
										}
									/>
									<Input
										value={form.country}
										placeholder="Enter Your Country..."
										onChange={(e) =>
											setForm({
												...form,
												country: e.target.value,
											})
										}
									/>
								</div>

								<div className="pt-4">
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? 'Updating...' : 'Update Profile'}
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</AnimatePresence>
			</form>
		</div>
	);
}
