'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { Checkbox } from '@/components/ui/checkbox';

const provinces = [
	{ value: 'Dhaka', label: 'Dhaka' },
	{ value: 'Chattogram', label: 'Chattogram' },
];

const cities = [
	{ value: 'Dhaka North', label: 'Dhaka North' },
	{ value: 'Dhaka South', label: 'Dhaka South' },
];

const normalize = (val?: string | null): string => {
	if (!val) return '';
	return val
		.toLowerCase()
		.split(' ')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');
};

const initFormData = (modalData?: any) => {
	if (!modalData) {
		return {
			id: '',
			fullName: '',
			phone: '',
			address: '',
			addressLine2: '',
			city: '',
			district: '',
			postalCode: '',
			isDefault: false,
		};
	}

	const cityNormalized = normalize(modalData.city);
	const districtNormalized = normalize(modalData.district);

	return {
		id: String(modalData.id ?? ''),
		fullName: modalData.fullName ?? modalData.full_name ?? '',
		phone: modalData.phone ?? '',
		address: modalData.address ?? '',
		addressLine2: modalData.addressLine2 ?? modalData.address_line2 ?? '',
		// ✅ array-এর সাথে match করো, না মিললে normalized value রাখো
		city: cities.find((c) => c.value.toLowerCase() === cityNormalized.toLowerCase())?.value ?? cityNormalized,
		district: provinces.find((p) => p.value.toLowerCase() === districtNormalized.toLowerCase())?.value ?? districtNormalized,
		postalCode: modalData.postalCode ?? modalData.postal_code ?? '',
		isDefault: modalData.isDefaultShipping ?? modalData.is_default ?? false,
	};
};

interface Props {
	modalData?: any;
}

export default function AddressForm({ modalData }: Props) {
	const { closeModal } = useLayoutStore();

	// ✅ useEffect নেই — সরাসরি modalData দিয়ে initialize
	const [formData, setFormData] = useState(() => initFormData(modalData));

	const isEdit = Boolean(formData.id);

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

	const { update: updateAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address updated successfully!');
			closeModal();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update address');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.fullName || !formData.phone || !formData.city || !formData.postalCode || !formData.address) {
			toast.error('Please fill all required fields');
			return;
		}

		const data = new FormData();
		data.append('full_name', formData.fullName);
		data.append('phone', formData.phone);
		data.append('district', formData.district);
		data.append('city', formData.city);
		data.append('address', formData.address);
		data.append('address_line2', formData.addressLine2 ?? '');
		data.append('postal_code', formData.postalCode);
		data.append('is_default', String(formData.isDefault));

		if (isEdit) {
			updateAddress(Number(formData.id), data);
		} else {
			submitAddress(data);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<Input placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))} />

			<Input placeholder="Phone Number" type="tel" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} />

			<div className="grid grid-cols-2 gap-3">
				<Select value={formData.district} onValueChange={(v) => setFormData((p) => ({ ...p, district: v }))}>
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

				<Select value={formData.city} onValueChange={(v) => setFormData((p) => ({ ...p, city: v }))}>
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

			<Input placeholder="Postal Code" value={formData.postalCode} onChange={(e) => setFormData((p) => ({ ...p, postalCode: e.target.value }))} />

			<Input placeholder="House / Road / Block" value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} />

			<Input
				placeholder="Address Line 2 (Optional)"
				value={formData.addressLine2}
				onChange={(e) => setFormData((p) => ({ ...p, addressLine2: e.target.value }))}
			/>

			<div className="flex items-center gap-2">
				<Checkbox checked={formData.isDefault} onCheckedChange={(val) => setFormData((p) => ({ ...p, isDefault: !!val }))} />
				<label className="text-sm">Set as default address</label>
			</div>

			<div className="flex justify-end gap-2 pt-3">
				<Button type="button" variant="outline" onClick={closeModal}>
					Cancel
				</Button>
				<Button type="submit">{isEdit ? 'Update Address' : 'Save Address'}</Button>
			</div>
		</form>
	);
}
