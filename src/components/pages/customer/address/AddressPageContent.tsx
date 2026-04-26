'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, HomeIcon, LocationEdit, PencilLine, Plus, Trash2 } from 'lucide-react';

import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

type AddressUI = {
	id: number;
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
	const [defaultingId, setDefaultingId] = useState<number | null>(null);

	const { openModal } = useLayoutStore();


	const { data: addressresponse } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to fetch address');
		},
	});


	const addressList: AddressUI[] =
		addressresponse?.results?.map((addr: any) => ({
			id: Number(addr.id),
			fullName: addr.full_name,
			address: addr.address,
			addressLine2: addr.address_line2 ?? '',
			city: addr.city ?? '',
			district: addr.district ?? '',
			postalCode: addr.postal_code ?? '',
			phone: addr.phone,
			label: addr.label ?? 'HOME',
			isDefaultShipping: addr.is_default,
		})) || [];

	// ✅ Dialog খোলার সময় current default select করো
	useEffect(() => {
		if (!shippingOpen) return;
		if (addressList.length === 0) return;
		const defaultAddr = addressList.find((a) => a.isDefaultShipping);
		setSelectedShippingId(defaultAddr?.id ?? addressList[0].id);
	}, [shippingOpen, addressresponse]);

	// ✅ Set default
	const { create: setDefaultAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS_SET_DEFAULT(Number(defaultingId)),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Default address updated!');
			setShippingOpen(false);
			setDefaultingId(null);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update default address');
			setDefaultingId(null);
		},
	});

	useEffect(() => {
		if (!defaultingId) return;
		setDefaultAddress({});
	}, [defaultingId]);

	const handleSetDefaultShipping = () => {
		if (!selectedShippingId) return;
		setDefaultingId(selectedShippingId);
	};

	// ✅ Delete API
	const { remove: removeAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address removed successfully!');
			setDeletingId(null);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to remove address');
			setDeletingId(null);
		},
	});

	const handleRemoveAddress = useCallback(
		(id: number) => {
			const target = addressList.find((a) => a.id === id);
			if (target?.isDefaultShipping) {
				toast.error('Default address delete করতে চাইলে আগে অন্য একটা default করুন');
				return;
			}
			setDeletingId(id);
			removeAddress(id);
		},
		[addressList, removeAddress],
	);

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

				<div className="flex justify-end mt-8 gap-3">
					{/* Make Default Dialog */}
					<Dialog open={shippingOpen} onOpenChange={setShippingOpen}>
						<DialogTrigger asChild>
							<Button className="bg-orange-300/20 text-orange-500 hover:bg-orange-300/30">Make default</Button>
						</DialogTrigger>

						<DialogContent className="max-w-xl">
							<DialogHeader>
								<DialogTitle>Select Default Shipping Address</DialogTitle>
							</DialogHeader>

							{/* ✅ Shadcn RadioGroup বাদ — custom selection */}
							<div className="space-y-3 mt-4">
								{addressList.map((addr) => {
									const isSelected = selectedShippingId === addr.id;
									return (
										<div
											key={addr.id}
											onClick={() => setSelectedShippingId(addr.id)}
											className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
												${isSelected ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20' : 'hover:bg-accent/50'}`}
										>
											{/* Custom radio indicator */}
											<div
												className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
												${isSelected ? 'border-orange-400' : 'border-gray-300'}`}
											>
												{isSelected && <div className="w-2 h-2 rounded-full bg-orange-400" />}
											</div>

											<div className="flex-1">
												<p className="font-medium">{addr.fullName}</p>
												<p className="text-sm text-muted-foreground">
													{addr.address}, {addr.city}
												</p>
												<p className="text-sm text-muted-foreground">{addr.phone}</p>
												{addr.isDefaultShipping && <span className="text-xs text-green-600 font-semibold mt-1 block">✔ Current Default</span>}
											</div>
										</div>
									);
								})}
							</div>

							<div className="flex justify-end gap-3 mt-6">
								<Button variant="outline" onClick={() => setShippingOpen(false)}>
									Cancel
								</Button>
								<Button onClick={handleSetDefaultShipping} disabled={!selectedShippingId || defaultingId !== null}>
									{defaultingId ? 'Saving...' : 'Confirm'}
								</Button>
							</div>
						</DialogContent>
					</Dialog>

					<div className="border-l pl-3">
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
									<Button
										className="text-orange-400 bg-orange-100 hover:bg-orange-300 hover:text-white"
										size="sm"
										onClick={() => handleEditAddress(addr)}
									>
										<PencilLine size={12} />
									</Button>

									<Button
										size="sm"
										className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
										onClick={() => handleRemoveAddress(addr.id)}
										disabled={deletingId === addr.id}
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
