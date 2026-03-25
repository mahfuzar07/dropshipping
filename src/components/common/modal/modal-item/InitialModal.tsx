'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/z-store/global/useAuthStore';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ModalProps {
	modalData?: unknown;
}

export default function InitialModal({ modalData }: ModalProps) {
	const { isModalOpen, closeModal } = useLayoutStore();

	const handleClose = () => {
		closeModal();
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>Initial Modal</DialogTitle>
				</DialogHeader>

				<div className="p-4">
					<div className="text-center mb-6">
						<h1 className="text-2xl font-bold">Welcome to Modal</h1>
						<p className="text-sm text-gray-500">Please select a modal type to view content.</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
