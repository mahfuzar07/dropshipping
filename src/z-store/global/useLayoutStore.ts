import { create } from 'zustand';

interface LayoutState {
	isModalOpen: boolean;
	modalType: string;
	modalData: unknown;
	isDrawerOpen: boolean;
	drawerType: string;
	drawerData: unknown;
	openModal: (params: { modalType: string; modalData?: any }) => void;
	closeModal: () => void;
	openDrawer: (params: { drawerType: string; drawerData?: any }) => void;
	closeDrawer: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
	isModalOpen: false,
	modalType: '',
	modalData: null,
	isDrawerOpen: false,
	drawerType: '',
	drawerData: null,

	openModal: ({ modalType, modalData }) =>
		set({
			isModalOpen: true,
			modalType,
			modalData: modalData ?? null,
		}),

	closeModal: () =>
		set({
			isModalOpen: false,
			modalType: '',
			modalData: null,
		}),

	openDrawer: ({ drawerType, drawerData }) =>
		set({
			isDrawerOpen: true,
			drawerType,
			drawerData: drawerData ?? null,
		}),

	closeDrawer: () =>
		set({
			isDrawerOpen: false,
			drawerType: '',
			drawerData: null,
		}),
}));
