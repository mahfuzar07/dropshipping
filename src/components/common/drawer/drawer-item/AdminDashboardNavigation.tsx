'use client';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ChevronLeft } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import AdminNavigation from '../../navigations/AdminNavigation';

export default function AdminDashboardNavigation() {
	const { isDrawerOpen, closeDrawer, drawerData } = useLayoutStore();
	const typedDrawerData = drawerData as { currentPath?: string } | undefined;
	const currentPath = typedDrawerData?.currentPath ?? '';

	return (
		<Drawer
			open={isDrawerOpen}
			onOpenChange={(open) => {
				if (!open) closeDrawer();
			}}
			direction="left"
		>
			<DrawerContent className="h-full md:w-[400px] flex flex-col">
				<button
					className="flex items-center justify-center  absolute w-10 h-10 -right-5 top-2 rounded-full bg-slate-700 shadow ring-1 ring-white/50"
					onClick={closeDrawer}
				>
					<ChevronLeft size={26} strokeWidth={2.5} className="text-slate-100" />
				</button>

				<AdminNavigation currentPath={currentPath} closeDrawer={closeDrawer} />
			</DrawerContent>
		</Drawer>
	);
}
