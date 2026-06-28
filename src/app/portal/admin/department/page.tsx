'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
	Building2,
	Plus,
	Edit,
	Trash2,
	Check,
	Users
} from 'lucide-react';

interface DepartmentType {
	id: string;
	name: string;
	code: string;
	employeesCount: number;
	head: string;
}

export default function DepartmentsPage() {
	const [departments, setDepartments] = useState<DepartmentType[]>([
		{ id: 'dep-1', name: 'Logistics & Fulfillment', code: 'LOG', employeesCount: 4, head: 'Mahfuzar Rahman' },
		{ id: 'dep-2', name: 'Customer Support', code: 'CS', employeesCount: 6, head: 'Nusrat Jahan' },
		{ id: 'dep-3', name: 'Finance & Accounts', code: 'FIN', employeesCount: 2, head: 'Sajib Chowdhury' },
		{ id: 'dep-4', name: 'Sourcing & SCM', code: 'SCM', employeesCount: 3, head: 'Fahim Ahmed' }
	]);

	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedDep, setSelectedDep] = useState<DepartmentType | null>(null);

	// Form
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [head, setHead] = useState('');

	const handleAdd = () => {
		setIsEdit(false);
		setName('');
		setCode('');
		setHead('');
		setIsOpen(true);
	};

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !code) return;

		if (isEdit && selectedDep) {
			setDepartments(prev => prev.map(d => d.id === selectedDep.id ? { ...d, name, code: code.toUpperCase(), head } : d));
			toast.success('Department updated successfully');
		} else {
			const newDep: DepartmentType = {
				id: `dep-${Date.now()}`,
				name,
				code: code.toUpperCase(),
				employeesCount: 0,
				head: head || 'Unassigned'
			};
			setDepartments([...departments, newDep]);
			toast.success('Department created successfully!');
		}
		setIsOpen(false);
	};

	const handleDelete = (depId: string) => {
		setDepartments(prev => prev.filter(d => d.id !== depId));
		toast.success('Department deleted');
	};

	return (
		<div className="space-y-6 font-play max-w-4xl mx-auto">
			{/* Top Bar */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Workspace Departments</h2>
					<p className="text-xs text-slate-400">Configure organizational chart divisions for staff permission bindings.</p>
				</div>
				<Button onClick={handleAdd} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
					<Plus size={16} /> Add Department
				</Button>
			</div>

			{/* Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{departments.map((dep) => (
					<Card key={dep.id} className="hover:shadow-md transition duration-300 bg-white">
						<CardHeader className="pb-3 flex flex-row justify-between items-start">
							<div className="flex items-center gap-3">
								<div className="p-2.5 bg-orange-50 text-[#F16A38] rounded-xl border border-orange-100">
									<Building2 size={22} />
								</div>
								<div>
									<h3 className="font-bold text-slate-800 text-base">{dep.name} ({dep.code})</h3>
									<p className="text-xs text-slate-500">Manager: {dep.head}</p>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg">
								<Users size={16} className="text-slate-400" />
								<span>Active staff: <strong className="text-slate-700 font-bold">{dep.employeesCount} members</strong></span>
							</div>

							<div className="flex justify-end gap-1.5 pt-2 border-t">
								<Button
									size="sm"
									variant="ghost"
									onClick={() => {
										setSelectedDep(dep);
										setName(dep.name);
										setCode(dep.code);
										setHead(dep.head);
										setIsEdit(true);
										setIsOpen(true);
									}}
									className="text-slate-500 hover:text-indigo-600"
								>
									<Edit size={14} className="mr-0.5" /> Edit
								</Button>
								<Button size="sm" variant="ghost" onClick={() => handleDelete(dep.id)} className="text-slate-500 hover:text-rose-600">
									<Trash2 size={14} className="mr-0.5" /> Delete
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Add/Edit Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-md bg-white">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">
							{isEdit ? 'Edit Department' : 'Create Department'}
						</DialogTitle>
						<DialogDescription>Setup system departments for staff categorization.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSave} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Department Name</label>
							<Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sourcing & Procurement" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Code Reference</label>
								<Input required value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SCM" />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Department Head</label>
								<Input value={head} onChange={e => setHead(e.target.value)} placeholder="Full Name" />
							</div>
						</div>
						<DialogFooter className="pt-2">
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
								<Check size={14} /> Save Department
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
