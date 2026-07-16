'use client';

import React from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import AdminNavigation from '../../navigations/AdminNavigation';

export default function AdminNavigationDrawer({ drawerData }: { drawerData?: any }) {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const currentPath = drawerData?.currentPath || '/admin/dashboard';

	return (
		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="left">
			<DrawerContent className="h-full !w-[280px] flex flex-col border-none bg-white">
				<div className="w-full flex flex-col h-full overflow-y-auto">
					<AdminNavigation currentPath={currentPath} closeDrawer={closeDrawer} />
				</div>
			</DrawerContent>
		</Drawer>
	);
}
