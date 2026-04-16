'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, HomeIcon, LocationEdit, Plus, Truck } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';

const provinces = [
	{ value: 'Dhaka', label: 'Dhaka' },
	{ value: 'Chattogram', label: 'Chattogram' },
];

const cities = [
	{ value: 'Dhaka - North', label: 'Dhaka - North' },
	{ value: 'Dhaka - South', label: 'Dhaka - South' },
];

const zones = [
	{ value: 'Mirpur Section 1', label: 'Mirpur Section 1' },
	{ value: 'Mirpur Section 2', label: 'Mirpur Section 2' },
];

export default function AddressForm() {
	const [formData, setFormData] = useState({
		fullName: '',
		phone: '',
		province: '',
		city: '',
		zone: '',
		address: '',
		landmark: '',
		label: 'HOME' as 'HOME' | 'OFFICE',
	});
	const { create: submitAddress, isMutating: isAddressLoading } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address added successfully!');

			setFormData({
				fullName: '',
				phone: '',
				province: '',
				city: '',
				zone: '',
				address: '',
				landmark: '',
				label: 'HOME',
			});
		},

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.fullName || !formData.phone || !formData.province || !formData.city || !formData.zone || !formData.address) {
			toast.error('Please fill all required fields');
			return;
		}

		const data = new FormData();
		data.append('full_name', formData.fullName);
		data.append('phone', formData.phone);
		data.append('province', formData.province);
		data.append('city', formData.city);
		data.append('zone', formData.zone);
		data.append('address', formData.address);
		data.append('landmark', formData.landmark);
		data.append('label', formData.label);
		submitAddress(data);
	};
	return (
		<div className="">
			<form onSubmit={handleSubmit} className="space-y-4">
				<label className="text-sm font-medium mb-3">Full Name *</label>
				<Input placeholder="Full Name *" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />

				<label className="text-sm font-medium">Phone Number *</label>
				<Input placeholder="Phone Number *" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

				<div className="grid md:grid-cols-2 gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Province / Region *</label>

						<Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Province" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									{provinces.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">City *</label>

						<Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select City" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									{cities.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-4">
					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Zone *</label>

						<Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Zone" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									{zones.map((item) => (
										<SelectItem key={item.value} value={item.value}>
											{item.label}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-sm font-medium">Landmark *</label>
						<Input
							placeholder="E.g. beside train station"
							value={formData.landmark}
							onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
						/>
					</div>
				</div>

				<label className="text-sm font-medium">Street House *</label>
				<Input
					placeholder="House no, road no, block etc."
					value={formData.address}
					onChange={(e) => setFormData({ ...formData, address: e.target.value })}
				/>

				<div className="flex items-center gap-5">
					<label className="text-sm font-medium">Select a label for effective delivery:</label>
					<div className="flex gap-4">
						<Button
							type="button"
							variant={formData.label === 'HOME' ? 'default' : 'outline'}
							className={formData.label === 'HOME' ? 'bg-orange-500 hover:bg-orange-600' : ''}
							onClick={() => setFormData({ ...formData, label: 'HOME' })}
						>
							<HomeIcon /> HOME
						</Button>
						<Button
							type="button"
							variant={formData.label === 'OFFICE' ? 'default' : 'outline'}
							className={formData.label === 'OFFICE' ? 'bg-teal-500 hover:bg-teal-600' : ''}
							onClick={() => setFormData({ ...formData, label: 'OFFICE' })}
						>
							<BriefcaseBusiness /> OFFICE
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
