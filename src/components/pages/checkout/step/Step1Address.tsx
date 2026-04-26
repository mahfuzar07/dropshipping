'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useCheckoutStore } from '@/z-store/checkout/useCheckoutStore';
import { HomeIcon, LocationEdit, MapPin, Phone, Plus } from 'lucide-react';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
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

export default function Step1Address() {
	const { nextStep, setAddress } = useCheckoutStore();
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

	// ✅ Normalize API → UI
	const addressList: AddressUI[] =
		addressresponse?.results?.map((addr: any) => ({
			id: addr.id,
			fullName: addr.full_name,
			address: addr.address,
			city: addr.city,
			phone: addr.phone,
			label: 'HOME',
			isDefaultShipping: addr.is_default,
			isDefaultBilling: addr.is_default,
			zone: addr.city,
		})) || [];

	// ✅ Get default (fallback প্রথমটা)
	const defaultAddress = addressList.find((a) => a.isDefaultShipping) || addressList[0];

	// ✅ Continue handler
	const handleNext = () => {
		if (!defaultAddress) {
			toast.error('No address available');
			return;
		}

		setAddress(defaultAddress);
		nextStep();
	};

	return (
		<div>
			<h1 className="text-lg font-semibold mb-5 flex items-center gap-2">
				<MapPin size={18} />
				Delivery Information
			</h1>

			<div className="flex w-full justify-end mt-5 mb-5">
				<Button size="sm" className="bg-orange-300/20 text-orange-500 hover:bg-orange-300/30">
					Choose Address
				</Button>
				<div className="border-l pl-3 ml-3">
					<Button size="sm" onClick={() => openModal({ modalType: 'add-address-modal' })} className="bg-orange-300 hover:bg-orange-500">
						<Plus /> Add New
					</Button>
				</div>
			</div>

			{/* Card UI */}
			{!defaultAddress ? (
				<p className="text-center text-muted-foreground py-10">No address found.</p>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="rounded-2xl w-full border bg-white transition p-5 flex flex-col gap-4"
				>
					{/* Top Row */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="bg-orange-100 p-2 rounded-full">
								<HomeIcon size={16} className="text-orange-500" />
							</div>
							<div>
								<p className="font-semibold">{defaultAddress.fullName}</p>
								<p className="text-xs text-muted-foreground">{defaultAddress.label}</p>
							</div>
						</div>

						<button className="text-sm flex items-center gap-1 text-blue-600 hover:underline">
							<LocationEdit size={14} /> Edit
						</button>
					</div>

					{/* Address */}
					<div className="text-sm text-muted-foreground leading-relaxed">
						{defaultAddress.address}, {defaultAddress.city}
					</div>

					{/* Phone */}
					<div className="flex items-center gap-2 text-sm">
						<Phone size={14} />
						{defaultAddress.phone}
					</div>

					{/* Badge */}
					<div className="flex items-center gap-2">
						<span className="text-[11px] bg-green-100 text-green-600 px-3 py-1.5 rounded-full font-medium">Default Shipping</span>
					</div>
				</motion.div>
			)}

			{/* Continue */}
			<Button className="w-full mt-6 bg-orange-400 hover:bg-orange-500 text-white font-semibold h-12 rounded-xl" onClick={handleNext}>
				Continue to Shipping →
			</Button>
		</div>
	);
}
