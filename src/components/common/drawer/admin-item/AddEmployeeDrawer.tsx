'use client';

import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ChevronRight } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { CardTitle } from '@/components/ui/card';
import EmployeeForm from '@/components/pages/admin/workspace/employee/employee-form/EmployeeForm';

export default function AddEmployeeDrawer() {
	const { isDrawerOpen, closeDrawer, drawerData } = useLayoutStore();

	return (
		<Drawer open={isDrawerOpen} onOpenChange={(open) => !open && closeDrawer()} direction="right">
			<DrawerContent className="h-full !w-full md:min-w-2xl flex flex-col bg-white">
				<button
					className="flex cursor-pointer items-center justify-center  absolute md:w-10 w-8 aspect-square left-3 md:-left-5  md:top-3 top-4 rounded-full bg-slate-100 shadow ring-1  ring-white z-50"
					onClick={closeDrawer}
				>
					<ChevronRight size={22} strokeWidth={2.5} className="text-slate-800" />
				</button>

				<div className="h-full overflow-y-auto">
					<div className="border-b px-5 py-6 font-hanken text-right fixed w-full top-0 h-16 bg-dashboard-background flex- items-center text-lg uppercase text-dashboard-muted">
						<CardTitle>Add Employee</CardTitle>
					</div>
					<div className="text-dashboard-muted space-y-5 mt-16 p-5 ">
						<EmployeeForm />
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
