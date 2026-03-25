'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';

export default function DefaultDrawer() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();

	return (
		<Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()} direction="right">
			<DrawerContent className="max-h-[96vh] overflow-y-auto p-4">
				<DrawerHeader>
					<DrawerTitle>Default Drawer</DrawerTitle>
				</DrawerHeader>
				<div className="flex flex-col items-center justify-center py-8">
					<div className="text-muted-foreground text-center">
						<div className="mb-2 text-lg">Welcome to Drawer</div>
						<div className="text-sm">Please select a drawer type to view content.</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
