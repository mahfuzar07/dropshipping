'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

import { User, Mail, Phone, MapPin, Building2, Globe, Hash, Calendar, VenetianMask, Loader2 } from 'lucide-react';

import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { updateProfile } from '@/lib/api/auth';
import { APIResponse } from '@/types/types';

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

type ProfileForm = Omit<UserProfile, 'id'>;

const EMPTY_FORM: ProfileForm = {
	first_name: '',
	last_name: '',
	email: '',
	phone: '',
	address: '',
	city: '',
	state: '',
	postal_code: '',
	country: '',
	dob: '',
	gender: '',
};

/* ======================
   🔹 Field config (drives layout so we don't repeat six near-identical blocks)
====================== */
const FIELDS: Array<{
	key: keyof ProfileForm;
	label: string;
	placeholder: string;
	icon: React.ElementType;
	type?: string;
	as?: 'input' | 'select';
	options?: { label: string; value: string }[];
}> = [
	{ key: 'first_name', label: 'First name', placeholder: 'Jane', icon: User },
	{ key: 'last_name', label: 'Last name', placeholder: 'Doe', icon: User },
	{ key: 'email', label: 'Email', placeholder: 'jane@example.com', icon: Mail, type: 'email' },
	{ key: 'phone', label: 'Phone', placeholder: '+880 1XXX-XXXXXX', icon: Phone, type: 'tel' },
	{
		key: 'gender',
		label: 'Gender',
		placeholder: 'Select gender',
		icon: VenetianMask,
		as: 'select',
		options: [
			{ label: 'Male', value: 'male' },
			{ label: 'Female', value: 'female' },
			{ label: 'Other', value: 'other' },
			{ label: 'Prefer not to say', value: 'unspecified' },
		],
	},
	{ key: 'dob', label: 'Date of birth', placeholder: '', icon: Calendar, type: 'date' },
	{ key: 'address', label: 'Address', placeholder: 'House 12, Road 4', icon: MapPin },
	{ key: 'city', label: 'City', placeholder: 'Dhaka', icon: Building2 },
	{ key: 'state', label: 'State / Division', placeholder: 'Dhaka', icon: Building2 },
	{ key: 'postal_code', label: 'Postal code', placeholder: '5800', icon: Hash },
	{ key: 'country', label: 'Country', placeholder: 'Bangladesh', icon: Globe },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ======================
   🔹 Page
====================== */
export default function ProfilePageContent() {
	const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		data: profileData,
		isLoading: isLoadingProfile,
		refetch: refetchProfile,
	} = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.USER_PROFILE],
		api: apiEndpoint.users.PROFILE(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to load profile');
		},
	});

	// Single source of truth for the GET — no duplicate network call.
	useEffect(() => {
		const profile = (profileData as any)?.data ?? profileData;
		if (!profile) return;

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
			dob: profile.dob || '',
			gender: profile.gender || '',
		});
	}, [profileData]);

	const handleChange = (key: keyof ProfileForm, value: string) => {
		setForm((prev) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!form.first_name.trim() || !form.last_name.trim()) {
			toast.error('First and last name are required.');
			return;
		}
		if (form.email && !EMAIL_RE.test(form.email)) {
			toast.error('Enter a valid email address.');
			return;
		}

		setIsSubmitting(true);
		try {
			await updateProfile(form);
			toast.success('Profile updated successfully!');
			refetchProfile?.();
		} catch (err: any) {
			toast.error(err?.response?.data?.message || 'Failed to update profile.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const initials = `${form.first_name?.[0] ?? ''}${form.last_name?.[0] ?? ''}`.toUpperCase() || 'U';

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 border-b pb-5">
				<div className="flex items-center gap-4">
					<div className="relative w-16 h-16 flex-shrink-0">
						<div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-white font-serif text-xl font-semibold shadow-sm">
							{isLoadingProfile ? <User className="text-white/90" /> : initials}
						</div>
					</div>
					<div>
						<h1 className="font-serif text-3xl font-medium">My Profile</h1>
						<p className="text-muted-foreground">Update your personal information</p>
					</div>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit}>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
					<Card className="shadow-none">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 font-medium">
								<span className="bg-slate-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
								<span className="font-serif text-md">Personal Info</span>
							</CardTitle>
						</CardHeader>

						<CardContent className="space-y-5">
							{isLoadingProfile ? (
								<div className="grid md:grid-cols-2 gap-4">
									{Array.from({ length: 10 }).map((_, i) => (
										<Skeleton key={i} className="h-10 w-full rounded-md" />
									))}
								</div>
							) : (
								<div className="grid md:grid-cols-2 gap-4">
									{FIELDS.map(({ key, label, placeholder, icon: Icon, type, as, options }) => (
										<div key={key} className="space-y-1.5">
											<Label htmlFor={key} className="text-xs text-muted-foreground">
												{label}
											</Label>
											<div className="relative">
												<Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
												{as === 'select' ? (
													<select
														id={key}
														value={form[key] ?? ''}
														onChange={(e) => handleChange(key, e.target.value)}
														className="flex h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
													>
														<option value="" disabled>
															{placeholder}
														</option>
														{options?.map((opt) => (
															<option key={opt.value} value={opt.value}>
																{opt.label}
															</option>
														))}
													</select>
												) : (
													<Input
														id={key}
														type={type || 'text'}
														value={form[key] ?? ''}
														placeholder={placeholder}
														onChange={(e) => handleChange(key, e.target.value)}
														className="pl-9"
													/>
												)}
											</div>
										</div>
									))}
								</div>
							)}

							<div className="pt-4">
								<Button type="submit" disabled={isSubmitting || isLoadingProfile} className="min-w-36">
									{isSubmitting ? (
										<span className="flex items-center gap-2">
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating...
										</span>
									) : (
										'Update Profile'
									)}
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</form>
		</div>
	);
}
