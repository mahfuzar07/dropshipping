'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
	Search,
	UserCheck,
	UserMinus,
	Eye,
	Star,
	BookOpen,
	DollarSign,
	Tag,
	Ban,
	Plus
} from 'lucide-react';

interface CustomerActivity {
	date: string;
	event: string;
}

interface CustomerTicket {
	id: string;
	subject: string;
	status: 'Open' | 'Resolved' | 'Closed';
}

interface CustomerType {
	id: string;
	name: string;
	email: string;
	phone: string;
	segment: 'VIP' | 'Regular' | 'Wholesale' | 'New';
	lifetimeValue: number;
	ordersCount: number;
	joinedDate: string;
	isBlacklisted: boolean;
	notes: string;
	tags: string[];
	activityLog: CustomerActivity[];
	tickets: CustomerTicket[];
}

const initialCustomers: CustomerType[] = [
	{
		id: 'cust-1',
		name: 'Jamil Hasan',
		email: 'jamil.hasan@gmail.com',
		phone: '01712345678',
		segment: 'VIP',
		lifetimeValue: 12500,
		ordersCount: 8,
		joinedDate: '2026-01-15',
		isBlacklisted: false,
		notes: 'Prefers air shipping for rapid delivery. High conversion rate client.',
		tags: ['Repeat Buyer', 'Dhanmondi'],
		activityLog: [
			{ date: '2026-06-24', event: 'Placed order #839201' },
			{ date: '2026-06-23', event: 'Viewed Smart Watch collection' }
		],
		tickets: [
			{ id: 't-101', subject: 'Inquiry on bulk shipment costs', status: 'Resolved' }
		]
	},
	{
		id: 'cust-2',
		name: 'Farhana Chowdhury',
		email: 'farhana.chowdhury@outlook.com',
		phone: '01887654321',
		segment: 'Regular',
		lifetimeValue: 4800,
		ordersCount: 3,
		joinedDate: '2026-03-22',
		isBlacklisted: false,
		notes: 'Always checks discount coupons prior to order placement.',
		tags: ['Coupon Seeker'],
		activityLog: [
			{ date: '2026-06-23', event: 'Abandoned cart with 2 products' }
		],
		tickets: []
	},
	{
		id: 'cust-3',
		name: 'Ahsan Kabir',
		email: 'kabir99@yahoo.com',
		phone: '01633445566',
		segment: 'Wholesale',
		lifetimeValue: 45000,
		ordersCount: 14,
		joinedDate: '2025-11-05',
		isBlacklisted: false,
		notes: 'Store reseller based in Chittagong. High volume orders.',
		tags: ['Reseller', 'Chittagong'],
		activityLog: [
			{ date: '2026-06-22', event: 'Inquired about ocean freight bulk clearance' }
		],
		tickets: [
			{ id: 't-92', subject: 'VAT clearance copy request', status: 'Resolved' }
		]
	},
	{
		id: 'cust-4',
		name: 'Imtiaz Ahmed',
		email: 'imtiaz.a@gmail.com',
		phone: '01511223344',
		segment: 'New',
		lifetimeValue: 0,
		ordersCount: 0,
		joinedDate: '2026-06-24',
		isBlacklisted: false,
		notes: 'Newly registered shopper.',
		tags: ['Cold Lead'],
		activityLog: [
			{ date: '2026-06-24', event: 'Registered account via phone OTP' }
		],
		tickets: []
	},
	{
		id: 'cust-5',
		name: 'Shakil Anwar',
		email: 'shakil.anwar@gmail.com',
		phone: '01999888777',
		segment: 'Regular',
		lifetimeValue: 1200,
		ordersCount: 2,
		joinedDate: '2026-02-18',
		isBlacklisted: true,
		notes: 'Blacklisted due to consecutive return claims and abusive feedback to courier agents.',
		tags: ['High Risk', 'Blacklisted'],
		activityLog: [
			{ date: '2026-05-10', event: 'Claimed dispute for damage on #490212' }
		],
		tickets: [
			{ id: 't-88', subject: 'Delivery refund complaint', status: 'Closed' }
		]
	}
];

export default function CustomerManagementPage() {
	const [customers, setCustomers] = useState<CustomerType[]>(initialCustomers);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);

	// Notes & Tag editor states
	const [customerNotes, setCustomerNotes] = useState('');
	const [newTag, setNewTag] = useState('');

	const filteredCustomers = customers.filter(c =>
		c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
		c.phone.includes(searchQuery)
	);

	const handleBlacklistToggle = (customerId: string) => {
		setCustomers(prev => prev.map(c => {
			if (c.id === customerId) {
				const nextStatus = !c.isBlacklisted;
				toast.success(nextStatus ? 'Customer moved to blacklist' : 'Customer removed from blacklist');
				return { ...c, isBlacklisted: nextStatus };
			}
			return c;
		}));

		if (selectedCustomer && selectedCustomer.id === customerId) {
			setSelectedCustomer(prev => prev ? { ...prev, isBlacklisted: !prev.isBlacklisted } : null);
		}
	};

	const handleSaveNotes = () => {
		if (!selectedCustomer) return;
		setCustomers(prev => prev.map(c => c.id === selectedCustomer.id ? { ...c, notes: customerNotes } : c));
		toast.success('Customer notes successfully updated');
	};

	const handleAddTag = () => {
		if (!selectedCustomer || !newTag.trim()) return;
		setCustomers(prev => prev.map(c => {
			if (c.id === selectedCustomer.id) {
				const updatedTags = c.tags.includes(newTag.trim()) ? c.tags : [...c.tags, newTag.trim()];
				setSelectedCustomer({ ...c, tags: updatedTags });
				return { ...c, tags: updatedTags };
			}
			return c;
		}));
		setNewTag('');
		toast.success('Tag added successfully');
	};

	return (
		<div className="space-y-6 font-play">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Customer Management</h2>
					<p className="text-xs text-slate-400">Manage buyer profiles, analyze lifetime value, segment target groups and handle blacklist overrides.</p>
				</div>
				<div className="relative w-full md:w-72">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
					<Input
						placeholder="Search Name, Phone, Email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 h-9"
					/>
				</div>
			</div>

			{/* Customers Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredCustomers.map((customer) => (
					<Card key={customer.id} className={`hover:shadow-md transition duration-300 ${customer.isBlacklisted ? 'border-rose-200 bg-rose-50/10' : 'bg-white'}`}>
						<CardHeader className="pb-3 flex flex-row items-start justify-between">
							<div className="flex items-center gap-3">
								<div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${customer.isBlacklisted ? 'bg-rose-100 text-rose-600' : 'bg-orange-50 text-[#F16A38]'}`}>
									{customer.name.split(' ').map(n => n[0]).join('')}
								</div>
								<div>
									<h3 className="font-bold text-slate-800 flex items-center gap-1.5">
										{customer.name}
										{customer.segment === 'VIP' && <Star size={14} className="fill-amber-400 text-amber-400" />}
									</h3>
									<p className="text-xs text-slate-400">{customer.phone}</p>
								</div>
							</div>
							<Badge
								className={`
									${customer.segment === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
									${customer.segment === 'Regular' ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
									${customer.segment === 'Wholesale' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : ''}
									${customer.segment === 'New' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
								`}
							>
								{customer.segment}
							</Badge>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-center text-xs">
								<div>
									<p className="text-slate-400 font-medium">Orders</p>
									<p className="font-bold text-slate-700 mt-0.5">{customer.ordersCount}</p>
								</div>
								<div>
									<p className="text-slate-400 font-medium">LTV</p>
									<p className="font-bold text-slate-700 mt-0.5">৳{customer.lifetimeValue.toLocaleString()}</p>
								</div>
								<div>
									<p className="text-slate-400 font-medium">Joined</p>
									<p className="font-bold text-slate-700 mt-0.5">{customer.joinedDate.split('-')[0]}</p>
								</div>
							</div>

							{/* Tags */}
							<div className="flex flex-wrap gap-1">
								{customer.tags.map((tag) => (
									<Badge key={tag} variant="outline" className="text-[10px] text-slate-500 bg-white">
										{tag}
									</Badge>
								))}
							</div>

							<div className="flex justify-between items-center pt-2 border-t">
								<Button
									size="sm"
									variant="ghost"
									onClick={() => {
										setSelectedCustomer(customer);
										setCustomerNotes(customer.notes);
										setIsDetailOpen(true);
									}}
									className="text-[#F16A38] hover:text-orange-600 font-semibold gap-1"
								>
									<Eye size={14} /> Profile Detail
								</Button>

								<Button
									size="sm"
									variant="ghost"
									onClick={() => handleBlacklistToggle(customer.id)}
									className={customer.isBlacklisted ? 'text-emerald-600 hover:text-emerald-700 gap-1' : 'text-rose-600 hover:text-rose-700 gap-1'}
								>
									<Ban size={14} /> {customer.isBlacklisted ? 'Unblacklist' : 'Blacklist'}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Customer Details Drawer / Dialog */}
			{selectedCustomer && (
				<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
					<DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white">
						<DialogHeader>
							<div className="flex items-center justify-between pr-6">
								<DialogTitle className="text-xl font-bold">{selectedCustomer.name}</DialogTitle>
								<Badge className={selectedCustomer.isBlacklisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}>
									{selectedCustomer.isBlacklisted ? 'Blacklisted' : 'Active Account'}
								</Badge>
							</div>
						</DialogHeader>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
							{/* Info Panel */}
							<div className="md:col-span-1 space-y-4">
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact</h4>
									<p className="text-sm font-semibold text-slate-800">{selectedCustomer.email}</p>
									<p className="text-xs text-slate-500 mt-0.5">{selectedCustomer.phone}</p>
								</div>
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Joined Date</h4>
									<p className="text-xs text-slate-700">{selectedCustomer.joinedDate}</p>
								</div>
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Value metrics</h4>
									<p className="text-sm font-bold text-[#F16A38]">৳{selectedCustomer.lifetimeValue.toLocaleString()}</p>
									<p className="text-[10px] text-slate-400">{selectedCustomer.ordersCount} total orders processed</p>
								</div>
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Segment tags</h4>
									<div className="flex flex-wrap gap-1">
										{selectedCustomer.tags.map(t => (
											<Badge key={t} variant="outline" className="text-[10px] bg-slate-50 text-slate-500">
												{t}
											</Badge>
										))}
									</div>
									<div className="flex gap-1.5 mt-2">
										<Input
											placeholder="Add tag"
											value={newTag}
											onChange={e => setNewTag(e.target.value)}
											className="h-7 text-xs"
										/>
										<Button size="sm" onClick={handleAddTag} className="bg-slate-100 text-slate-800 hover:bg-slate-200">
											Add
										</Button>
									</div>
								</div>
							</div>

							{/* Notes & Actions Panel */}
							<div className="md:col-span-2 space-y-4 border-l pl-0 md:pl-6">
								{/* Notes Editor */}
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Customer notes (Admin logs)</h4>
									<textarea
										value={customerNotes}
										onChange={e => setCustomerNotes(e.target.value)}
										className="w-full text-xs p-2.5 border rounded-lg focus:outline-indigo-500 min-h-24 bg-slate-50 text-slate-700"
										placeholder="Add warnings, reselling details or contact schedules..."
									/>
									<Button size="sm" onClick={handleSaveNotes} className="mt-1.5 bg-[#F16A38] hover:bg-orange-600 text-white font-semibold">
										Save notes
									</Button>
								</div>

								{/* Log activity events */}
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Shopper activity log</h4>
									<div className="space-y-1.5 max-h-32 overflow-y-auto">
										{selectedCustomer.activityLog.map((act, index) => (
											<div key={index} className="flex justify-between items-center text-xs p-1.5 border-b last:border-0 text-slate-600">
												<span>{act.event}</span>
												<span className="text-slate-400">{act.date}</span>
											</div>
										))}
									</div>
								</div>

								{/* Tickets history */}
								<div>
									<h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Support requests</h4>
									{selectedCustomer.tickets.length > 0 ? (
										<div className="space-y-1">
											{selectedCustomer.tickets.map(t => (
												<div key={t.id} className="flex justify-between items-center text-xs bg-slate-50 border p-2 rounded">
													<span className="font-semibold text-slate-700">{t.subject} (#{t.id})</span>
													<Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px]">{t.status}</Badge>
												</div>
											))}
										</div>
									) : (
										<p className="text-xs text-slate-400">No support tickets filed.</p>
									)}
								</div>
							</div>
						</div>

						<DialogFooter className="mt-6 border-t pt-4">
							<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close Profile</Button>
							<Button
								variant={selectedCustomer.isBlacklisted ? 'outline' : 'destructive'}
								onClick={() => handleBlacklistToggle(selectedCustomer.id)}
								className="font-semibold"
							>
								{selectedCustomer.isBlacklisted ? 'Remove Blacklist' : 'Blacklist Customer'}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
