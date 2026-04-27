'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/hooks/use-appdata';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { APIResponse } from '@/types/types';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useState } from 'react';
import { toast } from 'sonner';

type AddressUI = {
	id: number;
	fullName: string;
	phone: string;
	address: string;
	city: string;
	isDefaultShipping: boolean;
};

interface ModalProps {
	modalData?: AddressUI[];
}

export default function SelectAddressModal({ modalData = [] }: ModalProps) {
	const { isModalOpen, closeModal } = useLayoutStore();

	const [selectedShippingId, setSelectedShippingId] = useState<number | null>(
		() => modalData.find((a) => a.isDefaultShipping)?.id ?? modalData[0]?.id ?? null,
	);

	const { create: setDefaultAddress, isMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DELIVERY_ADDRESS_LIST],
		api: apiEndpoint.users.DELIVERY_ADDRESS(),
		auth: true,
		responseType: 'single',
		enabled: false,
		placeholderData: {} as APIResponse,
		optimistic: false,
		invalidateKeys: [[QueriesKey.DELIVERY_ADDRESS_LIST]],
		onSuccess: () => {
			toast.success('Default address updated!');
			closeModal();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update default address');
		},
	});

	const handleConfirm = async () => {
		if (!selectedShippingId || isMutating) return;
		await setDefaultAddress({}, 'set_default', selectedShippingId);
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Select Default Address</DialogTitle>
				</DialogHeader>

				<div className="space-y-3 mt-4">
					{modalData.map((addr) => {
						const isSelected = selectedShippingId === addr.id;
						return (
							<div
								key={addr.id}
								onClick={() => !isMutating && setSelectedShippingId(addr.id)}
								className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
									${isSelected ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/20' : 'hover:bg-accent/50'}
									${isMutating ? 'opacity-50 pointer-events-none' : ''}`}
							>
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
									{addr.isDefaultShipping && <span className="text-xs text-green-600 font-semibold mt-1 block">Current Default</span>}
								</div>
							</div>
						);
					})}
				</div>

				<DialogFooter className="mt-4">
					<Button variant="outline" onClick={closeModal} disabled={isMutating}>
						Cancel
					</Button>
					<Button onClick={handleConfirm} disabled={!selectedShippingId || isMutating}>
						{isMutating ? 'Saving...' : 'Confirm'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
