'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { useState, useCallback } from 'react';
import FormField from '../FormField';
import { MapPin } from 'lucide-react';

/* ================= TYPES ================= */

type AddressKeys = 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'zip' | 'country';

type ErrorState = Partial<Record<AddressKeys, string>>;

/* ================= CONST ================= */

const COUNTRIES = [
	{ code: 'BD', name: 'Bangladesh' },
	{ code: 'IN', name: 'India' },
	{ code: 'PK', name: 'Pakistan' },
	{ code: 'US', name: 'United States' },
	{ code: 'GB', name: 'United Kingdom' },
	{ code: 'CA', name: 'Canada' },
	{ code: 'AU', name: 'Australia' },
	{ code: 'SG', name: 'Singapore' },
];

/* ================= COMPONENT ================= */

export default function Step1Address() {
	const { address, setAddress, nextStep } = useCheckoutStore();

	const [errors, setErrors] = useState<ErrorState>({});

	const validate = (): ErrorState => {
		const e: ErrorState = {};

		if (!address.firstName.trim()) e.firstName = 'Required';
		if (!address.lastName.trim()) e.lastName = 'Required';
		if (!address.email.includes('@')) e.email = 'Valid email required';
		if (!address.phone.trim()) e.phone = 'Required';
		if (!address.address.trim()) e.address = 'Required';
		if (!address.city.trim()) e.city = 'Required';
		if (!address.zip.trim()) e.zip = 'Required';
		if (!address.country) e.country = 'Required';

		return e;
	};

	const handleNext = () => {
		const e = validate();
		if (Object.keys(e).length) {
			setErrors(e);
			return;
		}
		nextStep();
	};

	const field = useCallback(
		(key: AddressKeys) => ({
			id: key,
			value: address[key] ?? '',
			onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
				setAddress({ [key]: e.target.value });
				setErrors((prev) => ({ ...prev, [key]: '' }));
			},
			className: errors[key] ? 'border-red-400 focus-visible:ring-red-300' : '',
		}),
		[address, errors, setAddress],
	);

	return (
		<div>
			<h1 className="text-md font-semibold text-foreground mb-5 flex items-center gap-1.5">
				<MapPin size={16} className=" shrink-0" />
				Delivery information
			</h1>

			<div className="space-y-4">
				<div className="grid md:grid-cols-2 gap-3">
					<FormField label="First Name" htmlFor="firstName" error={errors.firstName}>
						<Input {...field('firstName')} placeholder="Rahim" />
					</FormField>

					<FormField label="Last Name" htmlFor="lastName" error={errors.lastName}>
						<Input {...field('lastName')} placeholder="Uddin" />
					</FormField>
				</div>

				<FormField label="Email Address" htmlFor="email" error={errors.email}>
					<Input {...field('email')} type="email" placeholder="rahim@example.com" />
				</FormField>

				<FormField label="Phone Number" htmlFor="phone" error={errors.phone}>
					<Input {...field('phone')} placeholder="+880 1XXX-XXXXXX" />
				</FormField>

				<FormField label="Street Address" htmlFor="address" error={errors.address}>
					<Input {...field('address')} placeholder="House 12, Road 5, Block C" />
				</FormField>

				<div className="grid grid-cols-2 gap-3">
					<FormField label="City" htmlFor="city" error={errors.city}>
						<Input {...field('city')} placeholder="Dhaka" />
					</FormField>

					<FormField label="ZIP Code" htmlFor="zip" error={errors.zip}>
						<Input {...field('zip')} placeholder="1212" />
					</FormField>
				</div>

				<FormField label="Country" htmlFor="country" error={errors.country}>
					<Select
						value={address.country}
						onValueChange={(v: string) => {
							setAddress({ country: v });
							setErrors((p) => ({ ...p, country: '' }));
						}}
					>
						<SelectTrigger id="country" className={errors.country ? 'border-red-400' : ''}>
							<SelectValue placeholder="Select country" />
						</SelectTrigger>

						<SelectContent>
							{COUNTRIES.map((c) => (
								<SelectItem key={c.code} value={c.code}>
									{c.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
			</div>

			<Button className="w-full mt-6 bg-orange-300 hover:bg-orange-400 text-white font-semibold tracking-wide h-12 rounded-xl" onClick={handleNext}>
				Continue to Shipping →
			</Button>
		</div>
	);
}
