'use client';

import CartDrawer from './drawer-item/CartDrawer';
import ProductFilterDrawer from './drawer-item/ProductFilterDrawer';
import DefaultDrawer from './drawer-item/DefaultDrawer';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import MobileSideMenu from './drawer-item/MobileSideMenu';
import SearchDrawer from './drawer-item/SearchDrawer';

// mapping drawer type to components
const drawerComponents: Record<string, React.ComponentType<any>> = {
	cart: CartDrawer,
	'product-filter': ProductFilterDrawer,
	'mobile-side-menu': MobileSideMenu,
	search: SearchDrawer,
};

export default function DrawerWrapper() {
	const { drawerType, drawerData } = useLayoutStore();

	const DrawerComponent = drawerType ? drawerComponents[drawerType] : DefaultDrawer;

	if (!drawerType && !DrawerComponent) return null;

	return <DrawerComponent drawerData={drawerData} />;
}
