'use client';

import AddressForm from '@/components/pages/customer/address/AddressForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

interface ModalProps {
	modalData?: unknown;
}

export default function EditAddressModal({ modalData }: ModalProps) {
	const { isModalOpen, closeModal } = useLayoutStore();

	const handleClose = () => {
		closeModal();
	};

	console.log('modalData', modalData);

	return (
		<Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Edit Address</DialogTitle>
				</DialogHeader>

				<AddressForm key={JSON.stringify(modalData)} modalData={modalData} />
			</DialogContent>
		</Dialog>
	);
}
