'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Home, Briefcase, Pencil, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { deliveryAddress, getDeliveryAddress } from '@/lib/api/auth';

/* ---------------- options ---------------- */

const provinces = ['Dhaka', 'Chattogram'];
const cities = ['Dhaka North', 'Dhaka South'];
const zones = ['Mirpur 1', 'Mirpur 2'];

/* ---------------- type ---------------- */

interface Address {
	id: string;
	full_name: string;
	phone: string;
	province: string;
	city: string;
	zone: string;
	address: string;
	landmark?: string;
	label: 'HOME' | 'OFFICE';
	isDefaultShipping: boolean;
	isDefaultBilling: boolean;
}

/* ---------------- component ---------------- */

export default function AddressBookPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [isAdding, setIsAdding] = useState(false);

	const [formData, setFormData] = useState<Omit<Address, 'id' | 'isDefaultBilling' | 'isDefaultShipping'>>({
		full_name: '',
		phone: '',
		province: '',
		city: '',
		zone: '',
		address: '',
		landmark: '',
		label: 'HOME',
	});

	/* ---------- add address ---------- */

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.full_name || !formData.phone || !formData.address) return;

		const newAddress: Address = {
			...formData,
			id: Date.now().toString(),
			isDefaultShipping: addresses.length === 0,
			isDefaultBilling: addresses.length === 0,
		};

		setAddresses((prev) => [...prev, newAddress]);
		setIsAdding(false);
		console.log('New Address:', formData); // For debugging
		try {
			setIsSubmitting(true);
			await deliveryAddress(formData);
			toast.success('Address saved successfully!');
		} catch (err) {
			toast.error(err?.response?.data?.message || 'Failed to save address. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
		setFormData({
			full_name: '',
			phone: '',
			province: '',
			city: '',
			zone: '',
			address: '',
			landmark: '',
			label: 'HOME',
		});
	};

	/* ---------- default সেট ---------- */

	const setDefaultShipping = (id: string) => {
		setAddresses((prev) =>
			prev.map((a) => ({
				...a,
				isDefaultShipping: a.id === id,
			})),
		);
	};

	const setDefaultBilling = (id: string) => {
		setAddresses((prev) =>
			prev.map((a) => ({
				...a,
				isDefaultBilling: a.id === id,
			})),
		);
	};

	useEffect(() => {
		const fetchUserAddress = async () => {
			try {
				const address = await getDeliveryAddress();
				setAddresses(address?.results || []);
				console.log('Fetched Address:', address); // For debugging
				// setForm({
				// 	first_name: profile.first_name || '',
				// 	last_name: profile.last_name || '',
				// 	email: profile.email || '',
				// 	phone: profile.phone || '',
				// 	address: profile.address || '',
				// 	city: profile.city || '',
				// 	state: profile.state || '',
				// 	postal_code: profile.postal_code || '',
				// 	country: profile.country || '',
				// 	gender: profile.gender || '',
				// });
			} catch (err) {
				toast.error('Failed to load profile data.');
			} finally {
				setIsSubmitting(false);
			}
		};
		fetchUserAddress();
	}, []);

	return (
		<div className="px-3 md:px-8 py-8">
			{/* Header */}
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-8">
				<div className="bg-slate-100 w-14 h-14 flex items-center justify-center rounded-full">
					<MapPin className="text-orange-400 w-6 h-6" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold">Address Book</h1>
					<p className="text-gray-500">Manage your addresses</p>
				</div>
			</motion.div>

			{/* Address List */}
			{addresses.length === 0 ? (
				<p className="text-center text-gray-500 mb-6">No address added</p>
			) : (
				<div className="space-y-4 mb-8">
					<AnimatePresence>
						{addresses.map((addr) => (
							<motion.div key={addr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border p-4 rounded flex justify-between">
								<div>
									<p className="font-medium">{addr.full_name}</p>
									<p className="text-sm text-gray-500">
										{addr.address}, {addr.zone}, {addr.city}
									</p>

									<div className="flex gap-2 mt-2">
										<span className="text-xs bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
											{addr.label === 'HOME' ? <Home size={12} /> : <Briefcase size={12} />}
											{addr.label}
										</span>

										{addr.isDefaultShipping && <span className="text-xs text-blue-500">Shipping</span>}
										{addr.isDefaultBilling && <span className="text-xs text-green-500">Billing</span>}
									</div>
								</div>

								<div className="flex flex-col gap-2 items-end">
									<button onClick={() => setDefaultShipping(addr.id)} className="text-xs text-blue-500">
										Set Shipping
									</button>

									<button onClick={() => setDefaultBilling(addr.id)} className="text-xs text-green-500">
										Set Billing
									</button>

									<button className="flex items-center gap-1 text-sm">
										<Pencil size={14} /> Edit
									</button>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			)}

			{/* Add Button */}
			{!isAdding ? (
				<Button onClick={() => setIsAdding(true)}>
					<Plus className="mr-2" /> Add Address
				</Button>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4 border p-5 rounded">
					<Input placeholder="Full Name" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />

					<Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />

					<div className="grid grid-cols-3 gap-5">
						{/* Province */}
						<div className="space-y-2">
							<Select value={formData.province} onValueChange={(value) => setFormData({ ...formData, province: value })}>
								<SelectTrigger>
									<SelectValue placeholder="Select Province" />
								</SelectTrigger>
								<SelectContent>
									{provinces.map((p) => (
										<SelectItem key={p} value={p}>
											{p}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* City */}
						<div className="space-y-2">
							<Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
								<SelectTrigger>
									<SelectValue placeholder="Select City" />
								</SelectTrigger>
								<SelectContent>
									{cities.map((c) => (
										<SelectItem key={c} value={c}>
											{c}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Zone */}
						<div className="space-y-2">
							<Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
								<SelectTrigger>
									<SelectValue placeholder="Select Zone" />
								</SelectTrigger>
								<SelectContent>
									{zones.map((z) => (
										<SelectItem key={z} value={z}>
											{z}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<Textarea placeholder="Full Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

					{/* Label */}
					<div className="flex gap-3">
						<Button
							type="button"
							variant={formData.label === 'HOME' ? 'default' : 'outline'}
							onClick={() => setFormData({ ...formData, label: 'HOME' })}
						>
							<Home className="mr-1" /> Home
						</Button>

						<Button
							type="button"
							variant={formData.label === 'OFFICE' ? 'default' : 'outline'}
							onClick={() => setFormData({ ...formData, label: 'OFFICE' })}
						>
							<Briefcase className="mr-1" /> Office
						</Button>
					</div>

					<div className="flex gap-3">
						<Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
							Cancel
						</Button>

						{/* <Button type="submit">Save</Button> */}
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? 'Saving...' : 'Save'}
						</Button>
					</div>
				</form>
			)}
		</div>
	);
}
