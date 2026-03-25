'use client';

import CartDrawer from './drawer-item/CartDrawer';
import ProductFilterDrawer from './drawer-item/ProductFilterDrawer';
import DefaultDrawer from './drawer-item/DefaultDrawer';
import AdminDashboardNavigation from './drawer-item/AdminDashboardNavigation';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import MobileSideMenu from './drawer-item/MobileSideMenu';
import SearchDrawer from './drawer-item/SearchDrawer';
import AddCategoryDrawer from './admin-item/AddCategoryDrawer';
import AddCouponDrawer from './admin-item/AddCouponDrawer';
import AddDepartmentDrawer from './admin-item/AddDepartmentDrawer';
import AddDesignationDrawer from './admin-item/AddDesignationDrawer';
import AddEmployeeDrawer from './admin-item/AddEmployeeDrawer';

// mapping drawer type to components
const drawerComponents: Record<string, React.ComponentType<any>> = {
	cart: CartDrawer,
	'product-filter': ProductFilterDrawer,
	'admin-navigation': AdminDashboardNavigation,
	'mobile-side-menu': MobileSideMenu,
	search: SearchDrawer,
	'add-category': AddCategoryDrawer,
	'add-coupon': AddCouponDrawer,
	'add-department': AddDepartmentDrawer,
	'add-designation': AddDesignationDrawer,
	'add-employee': AddEmployeeDrawer,
};

export default function DrawerWrapper() {
	const { drawerType, drawerData } = useLayoutStore();

	const DrawerComponent = drawerType ? drawerComponents[drawerType] : DefaultDrawer;

	if (!drawerType && !DrawerComponent) return null;

	return <DrawerComponent drawerData={drawerData} />;
}
