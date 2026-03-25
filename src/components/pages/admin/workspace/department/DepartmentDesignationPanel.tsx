'use client';
import React, { useState } from 'react';
import { Trash2, Plus, Building2, X, PencilLine, Eye, Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/utils';
import { useAppData } from '@/hooks/use-appdata';
import { APIResponse } from '@/types/types';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { toast } from 'sonner';
import ConfirmModal from '@/components/common/alert-dialog/ConfirmDialog';

interface Designation {
	id: string;
	title: string;
	_count?: { employees: number };
}

export interface Department {
	id: string;
	name: string;
	_count: { employees: number; designations: number };
	designations: Designation[];
}

const DepartmentDesignationPanel: React.FC = () => {
	const [expandedDeptId, setExpandedDeptId] = useState<string | null>(null);
	const { openDrawer } = useLayoutStore();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmType, setConfirmType] = useState<'department' | 'designation' | null>(null);
	const [selectedItem, setSelectedItem] = useState<{ id: string; name: string } | null>(null);

	// ---------------- Fetch
	const {
		data: departmentsData,
		isLoading: departmentLoading,
		refetch,
	} = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DEPARTMENT_GET],
		api: apiEndpoint.workspace.department,
		auth: true,
		responseType: 'single',
	});

	const departments: Department[] = departmentsData?.payload || [];

	// derive fresh data always
	const expandedDept = departments.find((d) => d.id === expandedDeptId);

	// ---------------- Delete Department
	const { remove, isMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DEPARTMENT_DELETE],
		api: apiEndpoint.workspace.department,
		auth: true,
		responseType: 'single',
		enabled: false,
		invalidateKeys: [[QueriesKey.DEPARTMENT_GET]],
		onSuccess: () => {
			toast.success('Department removed!');
			refetch();
		},
	});

	// ---------------- Delete Designation
	const { remove: removeDesignation, isMutating: isDesignationMutating } = useAppData<APIResponse, 'single'>({
		key: [QueriesKey.DESIGNATION_DELETE],
		api: apiEndpoint.workspace.designation,
		auth: true,
		responseType: 'single',
		enabled: false,
		invalidateKeys: [[QueriesKey.DEPARTMENT_GET]],
		onSuccess: () => {
			toast.success('Designation removed!');
			refetch();
		},
	});

	// ---------------- Helpers
	const hasChildren = (dept: Department) => dept._count?.designations > 0;

	const openDeleteModal = (id: string, name: string, type: 'department' | 'designation', hasChildren?: boolean) => {
		if (type === 'department' && hasChildren) {
			toast.warning('Cannot delete department with Designations');
			return;
		}
		setSelectedItem({ id, name });
		setConfirmType(type);
		setConfirmOpen(true);
	};

	// ---------------- Confirm Delete
	const handleConfirmDelete = async () => {
		if (!selectedItem) return;

		try {
			if (confirmType === 'department') {
				await remove(selectedItem.id);
				toast.success('Department deleted!');
			} else {
				await removeDesignation(selectedItem.id);
				toast.success('Designation deleted!');
			}
			setConfirmOpen(false);
		} catch (error: any) {
			const msg = error?.response?.data?.message || 'Delete failed';
			toast.warning(msg);
		}
	};

	// ---------------- Handlers
	const handleOpen = (dept: Department) => setExpandedDeptId(dept.id);
	const handleClose = () => setExpandedDeptId(null);

	return (
		<div className="space-y-6 relative z-0">
			<Card className="border-none shadow-sm bg-gradient-to-b from-white to-slate-50/50">
				<CardHeader className="border-b !pb-4 font-hanken flex items-center justify-between">
					<CardTitle className="uppercase">Departments & Designations</CardTitle>

					<Button
						onClick={() => openDrawer({ drawerType: 'add-department', drawerData: {} })}
						className={cn('gap-2 bg-dashboard-primary hover:bg-dashboard-primary/80 shadow-sm', 'transition-all duration-200')}
					>
						<Plus className="h-4 w-4" />
						Create Department
					</Button>
				</CardHeader>


				<CardContent className="">
					{/* Loading Skeleton */}
					{departmentLoading && (
						<div className="space-y-4 grid gap-5 grid-cols-1 xl:grid-cols-3">
							{[...Array(3)].map((_, i) => (
								<Skeleton key={i} className="h-20 w-full rounded-xl" />
							))}
						</div>
					)}

					{/* No Departments */}
					{!departmentLoading && departments.length === 0 && (
						<div className="py-12 text-center text-slate-500">
							<Building2 className="mx-auto h-12 w-12 opacity-40 mb-3" />
							<p className="text-lg font-medium">No departments yet</p>
							<p className="text-sm mt-1">Create your first department to get started.</p>
						</div>
					)}

					{/* Departments Grid */}
					{!departmentLoading && departments.length > 0 && (
						<div className="grid gap-5 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
							{departments.map((dept) => (
								<div
									key={dept.id}
									className="group rounded-xl border bg-white overflow-hidden hover:shadow transition-all duration-200 cursor-pointer"
								>
									<div className="flex md:flex-row flex-col md:items-center gap-5 justify-between px-5 py-8 bg-slate-50/70 hover:bg-slate-100 transition-colors select-none">
										<div className="flex items-center gap-3 flex-1 min-w-0">
											{/* <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" /> */}
											<Network className="h-5 w-5 text-slate-500 flex-shrink-0" />
											<div className="min-w-0">
												<h3 className="font-semibold text-slate-800 truncate">{dept.name}</h3>
												<div className="flex items-center gap-3 text-xs text-dashboard-muted mt-2">
													<Badge variant="secondary" className="text-xs font-normal">
														{dept._count.employees} - Employees
													</Badge>
													<Badge variant="outline" className="text-xs font-normal">
														{dept._count.designations} - Designations
													</Badge>
												</div>
											</div>
										</div>
										<div className="space-x-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
											<Button onClick={() => handleOpen(dept)} size="sm" variant="secondary">
												<Eye size={12} />
											</Button>
											<Button
												onClick={() => openDrawer({ drawerType: 'add-department', drawerData: { id: dept.id } })}
												className="text-dashboard-primary bg-dashboard-primary/10 hover:bg-dashboard-primary hover:text-white"
												size="sm"
											>
												<PencilLine size={12} />
											</Button>

											<Button
												onClick={() => openDeleteModal(dept.id, dept.name, 'department', hasChildren(dept))}
												size="sm"
												className="bg-red-100 text-red-500 hover:bg-red-600 hover:text-white disabled:opacity-50 !disabled:cursor-not-allowed"
											>
												<Trash2 size={12} />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			<ConfirmModal
				open={confirmOpen}
				message={selectedItem?.name || ''}
				onConfirm={handleConfirmDelete}
				onCancel={() => setConfirmOpen(false)}
				isMutating={confirmType === 'department' ? isMutating : isDesignationMutating}
			/>

			{/* Framer Motion Modal */}
			<AnimatePresence>
				{expandedDept && (
					<>
						{/* Backdrop */}
						<motion.div
							className="fixed w-full h-full inset-0 bg-black/40 z-30 "
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={handleClose}
						/>

						{/* Modal Panel */}
						<motion.div
							className="fixed inset-0 flex items-center justify-center z-40 px-2 mt-20 2xl:mt-0"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
						>
							<Card className="w-full max-w-2xl rounded-xl shadow-xl overflow-hidden relative">
								<Button
									variant="ghost"
									size="icon"
									className="absolute top-4 right-4 bg-slate-100 text-slate-500 hover:text-slate-700"
									onClick={handleClose}
								>
									<X className="h-5 w-5" />
								</Button>
								<CardHeader className="px-6 py-4 border-b">
									<CardTitle className="md:text-lg  font-semibold">{expandedDept.name}</CardTitle>
									<div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
										<Badge variant="secondary" className="text-xs font-normal">
											{expandedDept._count.employees} Employees
										</Badge>
										<Badge variant="outline" className="text-xs font-normal">
											{expandedDept._count.designations} Designations
										</Badge>
									</div>
								</CardHeader>

								<CardContent className="md:px-5 py-0 space-y-1 overflow-y-scroll max-h-[400px] 2xl:max-h-[800px]">
									{expandedDept.designations.length === 0 ? (
										<p className="text-sm text-slate-500 italic py-3">No designations yet</p>
									) : (
										expandedDept.designations.map((des) => (
											<div
												key={des.id}
												className="flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-150"
											>
												<div className="flex items-center gap-2.5 min-w-0">
													<span className="font-medium md:text-base text-sm text-slate-800 truncate">{des.title}</span>
													<Badge variant="secondary" className="text-xs">
														{des._count?.employees || 0}
													</Badge>
												</div>

												<div className="flex gap-1.5">
													<Button
														onClick={() =>
															openDrawer({
																drawerType: 'add-designation',
																drawerData: { departmentId: expandedDept.id, designationId: des.id },
															})
														}
														className="text-dashboard-primary bg-dashboard-primary/10 hover:bg-dashboard-primary hover:text-white"
														size="sm"
													>
														<PencilLine size={12} />
													</Button>

													<Button
														size="sm"
														className="bg-red-100 text-red-500 hover:bg-red-600 hover:text-white disabled:opacity-50 !disabled:cursor-not-allowed"
														onClick={() => openDeleteModal(des.id, des.title, 'designation')}
													>
														<Trash2 size={12} />
													</Button>
												</div>
											</div>
										))
									)}
									<div className="flex items-center justify-end mt-4">
										<Button
											variant="ghost"
											className=" text-dashboard-primary/80 hover:text-dashboard-primary hover:bg-indigo-50/60 gap-1.5"
											onClick={() => openDrawer({ drawerType: 'add-designation', drawerData: { departmentId: expandedDept.id } })}
										>
											<Plus className="h-4 w-4" />
											Add Designation
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

export default DepartmentDesignationPanel;
