'use client';

import AddressForm from '@/components/pages/customer/address/AddressForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ModalProps {
	modalData?: unknown;
}

export default function AddAddressModal({ modalData }: ModalProps) {
	const { isModalOpen, closeModal } = useLayoutStore();

	const handleClose = () => {
		closeModal();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Add New Address</DialogTitle>
				</DialogHeader>

				<AddressForm />
			</DialogContent>
		</Dialog>
	);
}
