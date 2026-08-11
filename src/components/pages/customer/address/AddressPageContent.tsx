'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, HomeIcon, LocationEdit, PencilLine, Plus, Trash2, CheckCircle2, MapPinned } from 'lucide-react';

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

// Shape of a single address record as it comes back from the API (snake_case).
type AddressAPI = {
	id: number | string;
	full_name?: string;
	phone?: string;
	address?: string;
	address_line2?: string;
	city?: string;
	district?: string;
	postal_code?: string;
	label?: string;
	is_default?: boolean;
};

/* ====================== Single Address Card ====================== */

function AddressCard({
	addr,
	isDeleting,
	onEdit,
	onDelete,
}: {
	addr: AddressUI;
	isDeleting: boolean;
	onEdit: (addr: AddressUI) => void;
	onDelete: (id: number) => void;
}) {
	const [confirmOpen, setConfirmOpen] = useState(false);

	// Close the confirm dialog once the delete request settles (success or error —
	// either way a toast already told the user what happened).
	const [wasDeleting, setWasDeleting] = useState(false);
	useEffect(() => {
		if (isDeleting) setWasDeleting(true);
		if (wasDeleting && !isDeleting) {
			setConfirmOpen(false);
			setWasDeleting(false);
		}
	}, [isDeleting, wasDeleting]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0 }}
			className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
		>
			<div className="grid items-start md:grid-cols-12 gap-4">
				<div className="md:col-span-4">
					<div className="flex items-start gap-3">
						<div className={`p-2.5 rounded-full mt-0.5 ${addr.label === 'OFFICE' ? 'bg-blue-100' : 'bg-orange-100'}`}>
							{addr.label === 'OFFICE' ? (
								<BriefcaseBusiness size={16} className="text-blue-500" />
							) : (
								<HomeIcon size={16} className="text-orange-500" />
							)}
						</div>
						<div>
							<div className="flex items-center gap-2 flex-wrap">
								<p className="font-semibold">{addr.fullName}</p>
								<span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
									{addr.label === 'OFFICE' ? 'Office' : 'Home'}
								</span>
							</div>
							<p className="text-xs text-muted-foreground mt-0.5">{addr.phone}</p>
							{addr.isDefaultShipping && (
								<span className="inline-flex items-center gap-1 mt-1.5 text-xs text-green-600 font-medium">
									<CheckCircle2 size={12} />
									Default Shipping
								</span>
							)}
						</div>
					</div>
				</div>

				<div className="md:col-span-6 text-sm">
					<p>{addr.address}</p>
					{addr.addressLine2 && <p className="text-muted-foreground">{addr.addressLine2}</p>}
					<p className="text-muted-foreground mt-0.5">{[addr.district, addr.city, addr.postalCode].filter(Boolean).join(', ')}</p>
				</div>

				<div className="md:col-span-2 flex md:justify-end items-start gap-2">
					<Button
						aria-label="Edit address"
						className="text-orange-400 bg-orange-100 hover:bg-orange-300 hover:text-white"
						size="sm"
						onClick={() => onEdit(addr)}
					>
						<PencilLine size={12} />
					</Button>

					<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
						<DialogTrigger asChild>
							<Button
								aria-label="Delete address"
								size="sm"
								className="bg-red-100 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isDeleting}
							>
								<Trash2 size={12} />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Delete this address?</DialogTitle>
							</DialogHeader>
							<p className="text-sm text-muted-foreground">
								{addr.fullName} · {addr.address} — this can't be undone.
							</p>
							<DialogFooter className="mt-4 gap-2">
								<Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={isDeleting}>
									Cancel
								</Button>
								<Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => onDelete(addr.id)} disabled={isDeleting}>
									{isDeleting ? 'Deleting...' : 'Delete'}
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</motion.div>
	);
}

/* ====================== Loading Skeleton ====================== */

function AddressCardSkeleton() {
	return (
		<div className="bg-card border border-border rounded-2xl p-5 animate-pulse">
			<div className="grid md:grid-cols-12 gap-4">
				<div className="md:col-span-4 flex items-start gap-3">
					<div className="w-9 h-9 rounded-full bg-slate-200 flex-shrink-0" />
					<div className="space-y-2 flex-1">
						<div className="h-4 w-28 bg-slate-200 rounded" />
						<div className="h-3 w-20 bg-slate-200 rounded" />
					</div>
				</div>
				<div className="md:col-span-6 space-y-2">
					<div className="h-4 w-3/4 bg-slate-200 rounded" />
					<div className="h-3 w-1/2 bg-slate-200 rounded" />
				</div>
				<div className="md:col-span-2 flex md:justify-end gap-2">
					<div className="h-8 w-8 bg-slate-200 rounded" />
					<div className="h-8 w-8 bg-slate-200 rounded" />
				</div>
			</div>
		</div>
	);
}

/* ====================== Main Page ====================== */

export default function AddressPageContent() {
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const { openModal } = useLayoutStore();

	const {
		data: addressresponse,
		isLoading,
		refetch,
	} = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS,
		auth: true,
		responseType: 'single',
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to fetch address');
		},
	});

	const rawList: AddressAPI[] = Array.isArray((addressresponse as any)?.results) ? (addressresponse as any).results : [];

	const addressList: AddressUI[] = rawList
		.map((addr): AddressUI | null => {
			const id = Number(addr.id);
			// Skip malformed records instead of letting NaN ids break keys / delete / edit.
			if (!addr || Number.isNaN(id)) return null;

			const label: 'HOME' | 'OFFICE' = addr.label === 'OFFICE' ? 'OFFICE' : 'HOME';

			return {
				id,
				fullName: addr.full_name ?? '',
				address: addr.address ?? '',
				addressLine2: addr.address_line2 ?? '',
				city: addr.city ?? '',
				district: addr.district ?? '',
				postalCode: addr.postal_code ?? '',
				phone: addr.phone ?? '',
				label,
				isDefaultShipping: Boolean(addr.is_default),
			};
		})
		.filter((addr): addr is AddressUI => addr !== null);

	// ✅ Delete API
	const { remove: removeAddress } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS,
		auth: true,
		responseType: 'single',
		enabled: false,
		onSuccess: () => {
			toast.success('Address removed successfully!');
			setDeletingId(null);
			refetch?.();
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
				toast.error('এটি ডিফল্ট ঠিকানা — মুছে ফেলার আগে অন্য একটি ঠিকানা ডিফল্ট হিসেবে সেট করুন।');
				return;
			}
			setDeletingId(id);
			removeAddress({ id });
		},
		[addressList, removeAddress],
	);

	const handleEditAddress = useCallback(
		(addr: AddressUI) => {
			openModal({ modalType: 'edit-address-modal', modalData: addr });
		},
		[openModal],
	);

	const handleSelectAddress = useCallback(
		(list: AddressUI[]) => {
			openModal({ modalType: 'select-address-modal', modalData: list });
		},
		[openModal],
	);

	return (
		<div className="px-3 md:px-8 py-8 md:py-10 rounded bg-background">
			{/* Header */}
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b pb-5 mb-6">
				<div className="flex items-center gap-3">
					<div className="bg-gradient-to-br from-orange-200 to-orange-400 w-16 h-16 flex items-center justify-center rounded-full shadow-sm">
						<LocationEdit className="text-white w-8 h-8" />
					</div>
					<div>
						<h1 className="text-3xl font-medium">Address Book</h1>
						<p className="text-muted-foreground">Manage your saved addresses for faster checkout.</p>
					</div>
				</div>

				<div className="flex justify-end mt-8 gap-3">
					<Button
						onClick={() => handleSelectAddress(addressList)}
						disabled={addressList.length < 2}
						className="bg-orange-300/20 text-orange-500 hover:bg-orange-300/30 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Make default
					</Button>

					<div className="border-l pl-3">
						<Button onClick={() => openModal({ modalType: 'add-address-modal', modalData: { onSuccess: refetch } })} className="bg-orange-300 hover:bg-orange-500">
							<Plus /> Add New Address
						</Button>
					</div>
				</div>
			</motion.div>

			{/* Address List */}
			<div className="space-y-3">
				{isLoading ? (
					Array.from({ length: 3 }).map((_, i) => <AddressCardSkeleton key={i} />)
				) : addressList.length === 0 ? (
					<div className="text-center py-20">
						<div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
							<MapPinned className="w-12 h-12 text-muted-foreground" />
						</div>
						<h2 className="text-xl font-semibold">No addresses saved yet</h2>
						<p className="text-muted-foreground mt-2 max-w-sm mx-auto">Add a delivery address to make checkout faster next time.</p>
					</div>
				) : (
					<AnimatePresence>
						{addressList.map((addr) => (
							<AddressCard key={addr.id} addr={addr} isDeleting={deletingId === addr.id} onEdit={handleEditAddress} onDelete={handleRemoveAddress} />
						))}
					</AnimatePresence>
				)}
			</div>
		</div>
	);
}
