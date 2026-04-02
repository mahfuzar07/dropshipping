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

/* ======================
   🔹 Types
====================== */
interface UserProfile {
	id: number;
	name: string;
	email: string;
	phone_number: string;
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
	const [form, setForm] = useState<Omit<UserProfile, 'id'>>({
		name: '',
		email: '',
		phone_number: '',
		address: '',
		city: '',
		state: '',
		postal_code: '',
		country: '',
	});

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

			<form>
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
										value={form.name}
										onChange={(e) =>
											setForm({
												...form,
												name: e.target.value,
											})
										}
									/>
									<Input
										type="email"
										value={form.email}
										onChange={(e) =>
											setForm({
												...form,
												email: e.target.value,
											})
										}
									/>
								</div>

								<div className="grid md:grid-cols-2 gap-4">
									<Input
										value={form.phone_number}
										onChange={(e) =>
											setForm({
												...form,
												phone_number: e.target.value,
											})
										}
									/>
									<Input
										value={form.address}
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
										onChange={(e) =>
											setForm({
												...form,
												city: e.target.value,
											})
										}
									/>
									<Input
										value={form.state}
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
										onChange={(e) =>
											setForm({
												...form,
												postal_code: e.target.value,
											})
										}
									/>
									<Input
										value={form.country}
										onChange={(e) =>
											setForm({
												...form,
												country: e.target.value,
											})
										}
									/>
								</div>

								<div className="pt-4">
									<Button type="submit">Update Profile</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</AnimatePresence>
			</form>
		</div>
	);
}
