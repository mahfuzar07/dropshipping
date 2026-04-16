'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, HomeIcon, LocationEdit, Plus } from 'lucide-react';

import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import AddressForm from './AddressForm';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

type AddressUI = {
	id: number;
	fullName: string;
	address: string;
	city: string;
	phone: string;
	label: 'HOME' | 'OFFICE';
	isDefaultShipping: boolean;
	isDefaultBilling: boolean;
	zone: string;
};

export default function AddressPageContent() {
	const [isAdding, setIsAdding] = useState(false);
	const [shippingOpen, setShippingOpen] = useState(false);
	const [selectedShippingId, setSelectedShippingId] = useState<string>('');
	const { openDrawer, openModal } = useLayoutStore();
	// ✅ Fetch address
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
			city: addr.city,
			phone: addr.phone,
			label: 'HOME', // backend না থাকলে default
			isDefaultShipping: addr.is_default,
			isDefaultBilling: addr.is_default,
			zone: addr.city,
		})) || [];

	// ✅ Set default selected
	useEffect(() => {
		if (addressList.length > 0) {
			const defaultAddr = addressList.find((a) => a.isDefaultShipping);
			setSelectedShippingId(defaultAddr ? defaultAddr.id.toString() : addressList[0].id.toString());
		}
	}, [addressList]);

	// ✅ Set default API
	const { create: setDefaultAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_SET_DEFAULT],
		api: apiEndpoint.users.DELIVERY_ADDRESS_SET_DEFAULT(selectedShippingId),
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Default address updated!');
			setShippingOpen(false);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update');
		},
	});

	const handleSetDefaultShipping = () => {
		if (!selectedShippingId) return;
		setDefaultAddress(Number(selectedShippingId));
	};

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
					<Dialog open={shippingOpen} onOpenChange={setShippingOpen}>
						<DialogTrigger asChild>
							<Button className="bg-orange-300/20 text-orange-500 hover:bg-orange-300/30">Make default shipping address</Button>
						</DialogTrigger>

						<DialogContent className="max-w-xl">
							<DialogHeader>
								<DialogTitle>Select Default Shipping Address</DialogTitle>
							</DialogHeader>

							<RadioGroup value={selectedShippingId} onValueChange={setSelectedShippingId} className="space-y-4 mt-4">
								{addressList.map((addr) => (
									<div key={addr.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
										<RadioGroupItem value={addr.id.toString()} id={addr.id.toString()} />

										<Label htmlFor={addr.id.toString()} className="flex-1 cursor-pointer">
											<p className="font-medium">{addr.fullName}</p>
											<p className="text-sm text-muted-foreground">
												{addr.address}, {addr.city}
											</p>
											<p className="text-sm text-muted-foreground">{addr.phone}</p>

											<div className="flex gap-2 mt-2">
												<span className="text-xs px-2 py-1 rounded bg-orange-500 text-white flex items-center gap-1">
													<HomeIcon size={14} /> {addr.label}
												</span>

												{addr.isDefaultShipping && <span className="text-xs text-green-600 font-semibold">✔ Default</span>}
											</div>
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
							<Plus className="mr-2" /> Add New Address
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Address List */}
			<div className="">
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
								<div className="md:col-span-3">
									<p className="font-medium">{addr.fullName}</p>
									<span className="text-xs px-2 py-1 rounded bg-orange-500 text-white inline-flex items-center gap-1 mt-1">
										<HomeIcon size={14} /> {addr.label}
									</span>
								</div>

								<div className="md:col-span-5">
									<p>{addr.address}</p>
									<p className="text-sm text-muted-foreground">{addr.city}</p>
								</div>

								<div className="md:col-span-3">
									<p>{addr.phone}</p>
									{addr.isDefaultShipping && <p className="text-xs text-blue-600 font-medium mt-1">Default Shipping</p>}
								</div>

								<div className="md:col-span-1 flex justify-end">
									<button className="text-sm flex items-center gap-1 bg-slate-600 text-white px-2 py-1 rounded hover:bg-slate-500">
										<LocationEdit size={14} /> Edit
									</button>
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}
