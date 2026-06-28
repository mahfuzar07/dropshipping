'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
	Users,
	Plus,
	Edit,
	Trash2,
	Check,
	Lock,
	Mail,
	Phone,
	UserPlus
} from 'lucide-react';

interface EmployeeType {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: 'Super Admin' | 'Admin' | 'Manager' | 'Customer Support Agent' | 'Finance Manager';
	department: string;
	status: 'Active' | 'Suspended';
}

export default function EmployeesPage() {
	const [employees, setEmployees] = useState<EmployeeType[]>([
		{ id: 'emp-1', name: 'Mahfuzar Rahman', email: 'mahfuz@updatetech.com', phone: '01711223344', role: 'Super Admin', department: 'Logistics', status: 'Active' },
		{ id: 'emp-2', name: 'Nusrat Jahan', email: 'nusrat@updatetech.com', phone: '01822334455', role: 'Customer Support Agent', department: 'Customer Support', status: 'Active' },
		{ id: 'emp-3', name: 'Sajib Chowdhury', email: 'sajib@updatetech.com', phone: '01933445566', role: 'Finance Manager', department: 'Finance & Accounts', status: 'Active' },
		{ id: 'emp-4', name: 'Fahim Ahmed', email: 'fahim@updatetech.com', phone: '01644556677', role: 'Manager', department: 'Sourcing & SCM', status: 'Active' }
	]);

	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedEmp, setSelectedEmp] = useState<EmployeeType | null>(null);

	// Form
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [role, setRole] = useState<EmployeeType['role']>('Customer Support Agent');
	const [department, setDepartment] = useState('Customer Support');

	const handleAdd = () => {
		setIsEdit(false);
		setName('');
		setEmail('');
		setPhone('');
		setRole('Customer Support Agent');
		setDepartment('Customer Support');
		setIsOpen(true);
	};

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !email) return;

		if (isEdit && selectedEmp) {
			setEmployees(prev => prev.map(emp => emp.id === selectedEmp.id ? { ...emp, name, email, phone, role, department } : emp));
			toast.success('Staff details successfully modified');
		} else {
			const newEmp: EmployeeType = {
				id: `emp-${Date.now()}`,
				name,
				email,
				phone,
				role,
				department,
				status: 'Active'
			};
			setEmployees([...employees, newEmp]);
			toast.success('Staff member invited successfully!');
		}
		setIsOpen(false);
	};

	const handleDelete = (empId: string) => {
		setEmployees(prev => prev.filter(e => e.id !== empId));
		toast.success('Staff access revoked');
	};

	const handleToggleStatus = (empId: string) => {
		setEmployees(prev => prev.map(e => {
			if (e.id === empId) {
				const nextStatus = e.status === 'Active' ? 'Suspended' : 'Active';
				toast.success(`Staff status updated to ${nextStatus}`);
				return { ...e, status: nextStatus };
			}
			return e;
		}));
	};

	return (
		<div className="space-y-6 font-play max-w-5xl mx-auto">
			{/* Top Bar */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Workspace Employee Registry</h2>
					<p className="text-xs text-slate-400">Configure role-based access control (RBAC) permissions for warehouse operators and finance officers.</p>
				</div>
				<Button onClick={handleAdd} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
					<UserPlus size={16} /> Add Employee
				</Button>
			</div>

			{/* Listing */}
			<Card className="shadow-sm">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm border-collapse">
							<thead>
								<tr className="border-b bg-slate-50 text-slate-400 font-bold text-xs uppercase">
									<th className="py-3 px-4">Staff Member</th>
									<th className="py-3 px-4">Contact Info</th>
									<th className="py-3 px-4">Role / RBAC</th>
									<th className="py-3 px-4">Department</th>
									<th className="py-3 px-4 text-center">Status</th>
									<th className="py-3 px-4 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y text-slate-700">
								{employees.map((emp) => (
									<tr key={emp.id} className="hover:bg-slate-50/50 duration-200">
										<td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-2.5">
											<div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
												{emp.name.split(' ').map(n => n[0]).join('')}
											</div>
											{emp.name}
										</td>
										<td className="py-4 px-4 text-xs">
											<p className="flex items-center gap-1 text-slate-500"><Mail size={12} /> {emp.email}</p>
											<p className="flex items-center gap-1 text-slate-400 mt-0.5"><Phone size={12} /> {emp.phone}</p>
										</td>
										<td className="py-4 px-4">
											<Badge className="bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs">
												{emp.role}
											</Badge>
										</td>
										<td className="py-4 px-4 text-xs font-semibold text-slate-500">{emp.department}</td>
										<td className="py-4 px-4 text-center">
											<button onClick={() => handleToggleStatus(emp.id)} className="focus:outline-none">
												<Badge className={emp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}>
													{emp.status}
												</Badge>
											</button>
										</td>
										<td className="py-4 px-4">
											<div className="flex justify-center items-center gap-1">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => {
														setSelectedEmp(emp);
														setName(emp.name);
														setEmail(emp.email);
														setPhone(emp.phone);
														setRole(emp.role);
														setDepartment(emp.department);
														setIsEdit(true);
														setIsOpen(true);
													}}
													className="text-slate-500 hover:text-indigo-600"
												>
													<Edit size={14} />
												</Button>
												<Button size="sm" variant="ghost" onClick={() => handleDelete(emp.id)} className="text-slate-400 hover:text-rose-600">
													<Trash2 size={14} />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Add/Edit Modal */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className="max-w-md bg-white">
					<DialogHeader>
						<DialogTitle className="text-base font-bold">
							{isEdit ? 'Edit Staff Privileges' : 'Invite Staff Member'}
						</DialogTitle>
						<DialogDescription>Setup system access boundaries for new staff recruits.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSave} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Staff Full Name</label>
							<Input required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Contact Email</label>
								<Input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@updatetech.com" />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
								<Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Role (Permissions)</label>
								<Select value={role} onValueChange={(val) => setRole(val as any)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Super Admin">Super Admin</SelectItem>
										<SelectItem value="Admin">Admin</SelectItem>
										<SelectItem value="Manager">Manager</SelectItem>
										<SelectItem value="Customer Support Agent">Customer Support Agent</SelectItem>
										<SelectItem value="Finance Manager">Finance Manager</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Department</label>
								<Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g. Sourcing / Logistics" />
							</div>
						</div>
						<DialogFooter className="pt-2">
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
								<Check size={14} /> Invite Employee
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
