'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, HomeIcon, LocationEdit, PencilLine, Plus, Trash2 } from 'lucide-react';

import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { QueryClient } from '@tanstack/react-query';

type AddressUI = {
	id: number | null | string;
	fullName: string;
	phone: string;
	address: string;
	addressLine2: string;
	city: string;
	district: string;
	postalCode: string;
	label?: 'HOME' | 'OFFICE';
	isDefaultShipping: boolean;
};

export default function AddressPageContent() {
	const [shippingOpen, setShippingOpen] = useState(false);
	const [selectedShippingId, setSelectedShippingId] = useState<number | null>(null);
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const { openModal } = useLayoutStore();

	// ✅ Fetch address list
	const { data: addressresponse } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to fetch address');
		},
	});

	// ✅ Normalize API → UI
	const addressList: AddressUI[] =
		addressresponse?.results?.map((addr: any) => ({
			id: addr.id,
			fullName: addr.full_name,
			address: addr.address,
			addressLine2: addr.address_line2,
			city: addr.city,
			district: addr.district,
			postalCode: addr.postal_code,
			phone: addr.phone,
			label: addr.label ?? 'HOME',
			isDefaultShipping: addr.is_default,
		})) || [];

	// ✅ Set default selected — stable dependency দিয়ে infinite re-render ঠেকানো
	useEffect(() => {
		if (addressList.length === 0) return;
		const defaultAddr = addressList.find((a) => a.isDefaultShipping);
		const fallback = addressList[0];
		setSelectedShippingId(Number(defaultAddr?.id ?? fallback.id));
	}, [addressresponse]);

	// ✅ Set default API — dynamic id সহ
	const { create: setDefaultAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS_SET_DEFAULT(Number(selectedShippingId)),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Default address updated!');
			setShippingOpen(false);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update default address');
		},
	});

	const handleSetDefaultShipping = () => {
		if (!selectedShippingId) return;
		setDefaultAddress({});
	};

	// ✅ Delete API — dynamic endpoint দিয়ে
	const { remove: removeAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address removed successfully!');
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to remove address');
		},
	});

	// ✅ Delete handler — id set করে তারপর remove call
	const handleRemoveAddress = useCallback(
		(id: AddressUI['id']) => {
			const target = addressList.find((a) => Number(a.id) === Number(id));

			// ❌ যদি default হয় → block
			if (target?.isDefaultShipping) {
				toast.error('Default address delete করতে চাইলে আগে অন্য একটা default করুন');
				return;
			}

			setDeletingId(Number(id));
			removeAddress(Number(id));
		},
		[addressList, removeAddress],
	);

	// ✅ Edit handler
	const handleEditAddress = useCallback(
		(addr: AddressUI) => {
			openModal({ modalType: 'edit-address-modal', modalData: addr });
		},
		[openModal],
	);

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b pb-3">
				<div className="flex items-center gap-3">
					<div className="bg-slate-100 w-16 h-16 flex items-center justify-center rounded-full">
						<LocationEdit className="text-orange-400 w-8 h-8" />
					</div>
					<div>
						<h1 className="text-3xl font-medium">Address Book</h1>
						<p className="text-muted-foreground">Manage your saved addresses for faster checkout.</p>
					</div>
				</div>

				<div className="flex justify-end mt-8">
					{/* ✅ Make Default Dialog */}
					<Dialog open={shippingOpen} onOpenChange={setShippingOpen}>
						<DialogTrigger asChild>
							<Button className="bg-orange-300/20 text-orange-500 hover:bg-orange-300/30">Make default</Button>
						</DialogTrigger>

						<DialogContent className="max-w-xl">
							<DialogHeader>
								<DialogTitle>Select Default Shipping Address</DialogTitle>
							</DialogHeader>

							<RadioGroup
								value={selectedShippingId !== null ? String(selectedShippingId) : ''}
								onValueChange={(val) => setSelectedShippingId(Number(val))}
								className="space-y-4 mt-4"
							>
								{addressList.map((addr) => (
									<div key={addr.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
										<RadioGroupItem value={String(addr.id)} id={`addr-${addr.id}`} />
										<Label htmlFor={`addr-${addr.id}`} className="flex-1 cursor-pointer">
											<p className="font-medium">{addr.fullName}</p>
											<p className="text-sm text-muted-foreground">
												{addr.address}, {addr.city}
											</p>
											<p className="text-sm text-muted-foreground">{addr.phone}</p>
											{addr.isDefaultShipping && <span className="text-xs text-green-600 font-semibold mt-1 block">✔ Default</span>}
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

					<div className="border-l pl-3 ml-3">
						<Button onClick={() => openModal({ modalType: 'add-address-modal' })} className="bg-orange-300 hover:bg-orange-500">
							<Plus /> Add New Address
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Address List */}
			<div>
				{addressList.length === 0 ? (
					<p className="text-center text-muted-foreground py-10">No addresses saved yet.</p>
				) : (
					<AnimatePresence>
						{addressList.map((addr) => (
							<motion.div
								key={addr.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								className="grid items-center md:grid-cols-12 gap-4 px-4 py-5 border-b hover:bg-accent/30"
							>
								<div className="md:col-span-4">
									<div className="flex items-start gap-3">
										<div className="bg-orange-100 p-2 rounded-full mt-1">
											{addr.label === 'OFFICE' ? (
												<BriefcaseBusiness size={16} className="text-blue-500" />
											) : (
												<HomeIcon size={16} className="text-orange-500" />
											)}
										</div>
										<div>
											<p className="font-semibold">{addr.fullName}</p>
											<p className="text-xs text-muted-foreground">{addr.phone}</p>
											{addr.isDefaultShipping && <span className="text-xs text-green-600 font-medium">Default Shipping</span>}
										</div>
									</div>
								</div>

								<div className="md:col-span-6">
									<p>{addr.address}</p>
									<p className="text-sm text-muted-foreground">{addr.city}</p>
								</div>

								<div className="md:col-span-2 flex justify-end gap-2">
									{/* ✅ Edit button with handler */}
									<Button
										className="text-orange-400 bg-orange-100 hover:bg-orange-300 hover:text-white"
										size="sm"
										onClick={() => handleEditAddress(addr)}
									>
										<PencilLine size={12} />
									</Button>

									{/* ✅ Delete button with loading state */}
									<Button
										size="sm"
										className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
										onClick={() => handleRemoveAddress(addr.id)}
										disabled={deletingId === Number(addr.id)}
									>
										<Trash2 size={12} />
									</Button>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}
