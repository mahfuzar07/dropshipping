'use client';

import React from 'react';
import InitialModal from './modal-item/InitialModal';
import LoginModal from './modal-item/LoginModal';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

const modalComponents: Record<string, React.ComponentType<any>> = {
	initial: InitialModal,
	'login-modal': LoginModal,
};

export default function ModalWrapper() {
	const { modalType, modalData } = useLayoutStore();

	if (!modalType) return null;

	const ModalContentComponent = modalComponents[modalType];

	if (!ModalContentComponent) return null;

	return <ModalContentComponent modalData={modalData} />;
}
