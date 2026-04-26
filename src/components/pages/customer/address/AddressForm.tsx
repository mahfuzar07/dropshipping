'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

import { Checkbox } from '@/components/ui/checkbox';
import { useAddressStore } from '@/z-store/customers/useAddressStore';

const provinces = [
	{ value: 'Dhaka', label: 'Dhaka' },
	{ value: 'Chattogram', label: 'Chattogram' },
];

const cities = [
	{ value: 'Dhaka North', label: 'Dhaka North' },
	{ value: 'Dhaka South', label: 'Dhaka South' },
];

const zones = [
	{ value: 'Mirpur 1', label: 'Mirpur 1' },
	{ value: 'Mirpur 2', label: 'Mirpur 2' },
];

export default function AddressForm() {
	const { closeModal } = useLayoutStore();
	const { addAddress } = useAddressStore();

	const [formData, setFormData] = useState({
		id: '',
		fullName: '',
		phone: '',
		address: '',
		addressLine2: '',
		city: '',
		district: '',
		postalCode: '',
		isDefault: false,
	});

	const { create: submitAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address added successfully!');
			closeModal();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.fullName || !formData.phone || !formData.district || !formData.city || !formData.postalCode || !formData.address) {
			toast.error('Please fill all required fields');
			return;
		}

		// ✅ API Data
		const data = new FormData();
		data.append('full_name', formData.fullName);
		data.append('phone', formData.phone);
		data.append('district', formData.district);
		data.append('city', formData.city);
		data.append('address_line2', formData.postalCode);
		data.append('address', formData.address);
		data.append('postal_code', formData.postalCode);
		data.append('is_default', formData.isDefault.toString());

		submitAddress(data);

		// ✅ Local Store Sync
		addAddress({
			id: Date.now().toString(),
			fullName: formData.fullName,
			phone: formData.phone,
			address: formData.address,
			addressLine2: formData.postalCode,
			city: formData.city,
			district: formData.district,
			postalCode: formData.postalCode,
			isDefaultShipping: formData.isDefault,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Name */}
			<div>
				<Input placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
			</div>

			{/* Phone */}
			<div>
				<Input placeholder="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
			</div>

			{/* Province + City */}
			<div className="grid grid-cols-2 gap-3">
				<Select value={formData.district} onValueChange={(v) => setFormData({ ...formData, district: v })}>
					<SelectTrigger>
						<SelectValue placeholder="District" />
					</SelectTrigger>
					<SelectContent>
						{provinces.map((p) => (
							<SelectItem key={p.value} value={p.value}>
								{p.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={formData.city} onValueChange={(v) => setFormData({ ...formData, city: v })}>
					<SelectTrigger>
						<SelectValue placeholder="City" />
					</SelectTrigger>
					<SelectContent>
						{cities.map((c) => (
							<SelectItem key={c.value} value={c.value}>
								{c.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Zone */}
			<Input
				placeholder="Postal Code"
				value={formData.postalCode}
				onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
			/>

			{/* Address */}
			<Input placeholder="House / Road / Block" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

			{/* Landmark */}
			<Input placeholder="Address Line 2" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />

			{/* Default checkbox */}
			<div className="flex items-center gap-2">
				<Checkbox checked={formData.isDefault} onCheckedChange={(val) => setFormData({ ...formData, isDefault: !!val })} />
				<label className="text-sm">Set as default address</label>
			</div>

			{/* Buttons */}
			<div className="flex justify-end gap-2 pt-3">
				<Button type="button" variant="outline" onClick={closeModal}>
					Cancel
				</Button>
				<Button type="submit">Save Address</Button>
			</div>
		</form>
	);
}
