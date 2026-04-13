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
import { useAddressStore } from '@/z-store/customers/useAddressStore';
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

export default function AddressPageContent() {
	const { addresses, addAddress, setDefaultShipping, setDefaultBilling } = useAddressStore();
	const [isAdding, setIsAdding] = useState(false);
	const [shippingOpen, setShippingOpen] = useState(false);
	const [billingOpen, setBillingOpen] = useState(false);

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

	const { data: addressresponse, isLoading: isLoadingAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const addressList = addressresponse?.results || [];

	console.log('Address List:', addressList);
	const [selectedShippingId, setSelectedShippingId] = useState(addressList?.[0]?.id || '');

	const { create: submitAddress, isMutating: isAddressLoading } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address added successfully!');
			setIsAdding(false);
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

	const { create: defaultAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_SET_DEFAULT, selectedShippingId],
		api: apiEndpoint.users.DELIVERY_ADDRESS_SET_DEFAULT(selectedShippingId),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address added successfully!');
			setIsAdding(false);
		},

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	// ✅ Submit Handler
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.fullName || !formData.phone || !formData.province || !formData.city || !formData.zone || !formData.address) {
			toast.error('Please fill all required fields');
			return;
		}

		addAddress({
			...formData,
			isDefaultShipping: addresses.length === 0,
			isDefaultBilling: addresses.length === 0,
		});

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

	const handleSetDefaultShipping = () => {
		if (!selectedShippingId) return;
		defaultAddress(selectedShippingId); // trigger API
	};

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b pb-3">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-16 h-16 flex items-center justify-center p-3 rounded-full flex-shrink-0">
						<LocationEdit className="text-orange-400 text-4xl" />
					</div>
					<div>
						<h1 className="font-serif text-3xl font-medium">Address Book</h1>
						<p className="text-muted-foreground">Manage your saved addresses for faster checkout.</p>
					</div>
				</div>

				<div className="flex justify-end gap-5 text-sm font-medium mt-8">
					<Dialog open={shippingOpen} onOpenChange={setShippingOpen}>
						<DialogTrigger asChild>
							<button className="hover:text-primary transition-colors cursor-pointer">Make default shipping address</button>
						</DialogTrigger>
						<DialogContent className="max-w-xl">
							<DialogHeader>
								<DialogTitle>Select Default Shipping Address</DialogTitle>
							</DialogHeader>
							<RadioGroup value={selectedShippingId} onValueChange={setSelectedShippingId} className="space-y-4 mt-4">
								{addressList.map((addr) => (
									<div key={addr.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50">
										<RadioGroupItem value={addr.id} id={addr.id} />
										<Label htmlFor={addr.id} className="flex-1 cursor-pointer">
											<p className="font-medium">{addr.fullName}</p>
											<p className="text-sm text-muted-foreground">
												{addr.address}, {addr.zone}, {addr.city}
											</p>
											<p className="text-sm text-muted-foreground">{addr.phone}</p>
											<span
												className={`inline-flex items-center gap-1 mt-1 text-xs px-2 py-1 rounded-full ${
													addr.label === 'HOME' ? 'bg-orange-500 text-white' : 'bg-teal-500 text-white'
												}`}
											>
												{addr.label === 'HOME' ? <HomeIcon /> : <BriefcaseBusiness />}
												{addr.label}
											</span>
										</Label>
									</div>
								))}
							</RadioGroup>
							<div className="flex justify-end gap-3 mt-6">
								<Button variant="outline" onClick={() => setShippingOpen(false)}>
									Cancel
								</Button>
								<Button onClick={handleSetDefaultShipping} disabled={!selectedShippingId}>
									Confirm
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</motion.div>

			{/* Address List */}
			<div className="space-y-6 mb-10">
				{addressList.length === 0 ? (
					<p className="text-center text-muted-foreground py-10">No addresses saved yet.</p>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-12 text-sm font-medium text-muted-foreground border-b mb-0 pb-3 bg-slate-50 p-4">
							<div className="col-span-3">Full Name</div>
							<div className="col-span-5">Address</div>
							<div className="col-span-3 md:px-2 px-0">Phone Number</div>
							<div className="col-span-1 text-right">Actions</div>
						</div>

						<AnimatePresence>
							{addressList.map((addr) => (
								<motion.div
									key={addr.id}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className="grid mb-0 grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border-b last:border-b-0 hover:bg-accent/30 transition"
								>
									<div className="col-span-3">
										<p className="font-medium">{addr.fullName}</p>
										<div className="flex items-center gap-2 mt-1">
											<span
												className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 text-white ${
													addr.label === 'HOME' ? 'bg-orange-500' : 'bg-teal-500'
												}`}
											>
												{addr.label === 'HOME' ? <HomeIcon /> : <BriefcaseBusiness />}
												{addr.label}
											</span>
										</div>
									</div>
									<div className="col-span-5">
										<p>{addr.address}</p>
										<p className="text-sm text-muted-foreground">
											{addr.zone}, {addr.city}
										</p>
										{addr.landmark && <p className="text-sm text-muted-foreground">Near: {addr.landmark}</p>}
									</div>
									<div className="col-span-3">
										<p>{addr.phone}</p>
										<div className="flex flex-col gap-1 mt-2">
											{addr.isDefaultShipping && <span className="text-xs text-blue-600 font-medium">Default Shipping</span>}
											{addr.isDefaultBilling && <span className="text-xs text-blue-600 font-medium">Default Billing</span>}
										</div>
									</div>
									<div className="col-span-1">
										<button className="text-sm flex items-center justify-end gap-1 hover:underline bg-slate-600 text-white hover:bg-slate-500 px-2 py-1 rounded transition">
											<LocationEdit /> EDIT
										</button>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</>
				)}
			</div>

			{/* Add New Address */}
			{!isAdding ? (
				<Button onClick={() => setIsAdding(true)} className="bg-teal-500 hover:bg-teal-600 ml-auto flex items-center">
					<Plus className="mr-2" /> ADD NEW ADDRESS
				</Button>
			) : (
				<Card className="shadow-md border">
					<CardHeader>
						<CardTitle>Add New Address</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<label className="text-sm font-medium">Full Name *</label>
							<Input placeholder="Full Name *" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />

							<label className="text-sm font-medium">Phone Number *</label>
							<Input
								placeholder="Phone Number *"
								type="tel"
								value={formData.phone}
								onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
							/>

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

							<div>
								<p className="text-sm text-muted-foreground mb-3">Select a label for effective delivery:</p>
								<div className="flex gap-4">
									<Button
										type="button"
										variant={formData.label === 'HOME' ? 'default' : 'outline'}
										className={formData.label === 'HOME' ? 'bg-orange-500 hover:bg-orange-600' : ''}
										onClick={() => setFormData({ ...formData, label: 'HOME' })}
									>
										<HomeIcon className="mr-2" /> HOME
									</Button>
									<Button
										type="button"
										variant={formData.label === 'OFFICE' ? 'default' : 'outline'}
										className={formData.label === 'OFFICE' ? 'bg-teal-500 hover:bg-teal-600' : ''}
										onClick={() => setFormData({ ...formData, label: 'OFFICE' })}
									>
										<BriefcaseBusiness className="mr-2" /> OFFICE
									</Button>
								</div>
							</div>

							<div className="flex justify-end gap-4">
								<Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
									Cancel
								</Button>
								<Button type="submit" className="bg-orange-500 hover:bg-orange-600">
									SAVE ADDRESS
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
