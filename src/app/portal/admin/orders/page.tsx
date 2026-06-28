'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
	Search,
	Filter,
	Eye,
	Clock,
	Printer,
	ShieldAlert,
	Merge,
	Split,
	Trash2,
	Plus,
	Check,
	AlertCircle,
	XCircle
} from 'lucide-react';

// Order Type definitions
interface OrderItemType {
	id: string;
	name: string;
	quantity: number;
	price: number;
	variant: string;
}

interface OrderType {
	id: string;
	orderNumber: string;
	customerName: string;
	customerEmail: string;
	phone: string;
	date: string;
	status: 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Refunded' | 'Returned';
	totalPrice: number;
	shippingMethod: 'air' | 'sea';
	address: string;
	items: OrderItemType[];
	riskScore: number; // 0 to 100
	riskReasons: string[];
}

const initialOrders: OrderType[] = [
	{
		id: 'ord-1',
		orderNumber: '839201',
		customerName: 'Jamil Hasan',
		customerEmail: 'jamil.hasan@gmail.com',
		phone: '01712345678',
		date: '2026-06-24',
		status: 'Pending',
		totalPrice: 1540,
		shippingMethod: 'air',
		address: 'House 42, Road 12, Dhanmondi, Dhaka',
		items: [
			{ id: 'item-1', name: 'Wireless Bluetooth Earbuds Pro', quantity: 1, price: 1200, variant: 'Color: Black' },
			{ id: 'item-2', name: 'Universal Travel Adapter USB-C', quantity: 1, price: 340, variant: 'Standard' }
		],
		riskScore: 12,
		riskReasons: []
	},
	{
		id: 'ord-2',
		orderNumber: '920391',
		customerName: 'Farhana Chowdhury',
		customerEmail: 'farhana.chowdhury@outlook.com',
		phone: '01887654321',
		date: '2026-06-23',
		status: 'Processing',
		totalPrice: 2450,
		shippingMethod: 'air',
		address: 'Flat 4B, Sector 3, Uttara, Dhaka',
		items: [
			{ id: 'item-3', name: 'Premium Leather Smart Watch', quantity: 1, price: 2450, variant: 'Brown Strap' }
		],
		riskScore: 68,
		riskReasons: ['Multiple recent order cancellations', 'High shipping destination match rate failure']
	},
	{
		id: 'ord-3',
		orderNumber: '104928',
		customerName: 'Sajid Islam',
		customerEmail: 'sajid99@gmail.com',
		phone: '01911223344',
		date: '2026-06-24',
		status: 'Shipped',
		totalPrice: 850,
		shippingMethod: 'sea',
		address: 'Vill: Sonapur, P.O: Sonapur, Feni Sadar, Feni',
		items: [
			{ id: 'item-4', name: 'Ergonomic Memory Foam Pillow', quantity: 2, price: 425, variant: 'Size: L' }
		],
		riskScore: 25,
		riskReasons: []
	},
	{
		id: 'ord-4',
		orderNumber: '758192',
		customerName: 'Rakibul Islam',
		customerEmail: 'rakib@gmail.com',
		phone: '01555554444',
		date: '2026-06-21',
		status: 'Delivered',
		totalPrice: 1200,
		shippingMethod: 'air',
		address: 'Cha-89/1, North Badda, Dhaka',
		items: [
			{ id: 'item-5', name: 'Wireless Bluetooth Earbuds Pro', quantity: 1, price: 1200, variant: 'Color: White' }
		],
		riskScore: 5,
		riskReasons: []
	}
];

export default function OrderManagementPage() {
	const [orders, setOrders] = useState<OrderType[]>(initialOrders);
	const [selectedTab, setSelectedTab] = useState<string>('All');
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
	const [selectedOrdersForBulk, setSelectedOrdersForBulk] = useState<string[]>([]);

	// Modals State
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isSplitOpen, setIsSplitOpen] = useState(false);
	const [isMergeOpen, setIsMergeOpen] = useState(false);
	const [isSlipPrintOpen, setIsSlipPrintOpen] = useState(false);

	// Manual Order Creation State
	const [newOrderName, setNewOrderName] = useState('');
	const [newOrderPhone, setNewOrderPhone] = useState('');
	const [newOrderAddress, setNewOrderAddress] = useState('');
	const [newOrderProduct, setNewOrderProduct] = useState('Wireless Bluetooth Earbuds Pro');
	const [newOrderPrice, setNewOrderPrice] = useState('1200');
	const [newOrderQty, setNewOrderQty] = useState('1');

	// Order Editing State
	const [editAddress, setEditAddress] = useState('');
	const [editPrice, setEditPrice] = useState(0);

	// Filter & Search Logic
	const filteredOrders = useMemo(() => {
		return orders.filter((order) => {
			const matchesTab = selectedTab === 'All' || order.status === selectedTab;
			const matchesSearch =
				order.orderNumber.includes(searchQuery) ||
				order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.phone.includes(searchQuery);
			return matchesTab && matchesSearch;
		});
	}, [orders, selectedTab, searchQuery]);

	// Order Handlers
	const handleStatusChange = (orderId: string, newStatus: OrderType['status']) => {
		setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
		toast.success(`Order status updated to ${newStatus}`);
		if (selectedOrder && selectedOrder.id === orderId) {
			setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
		}
	};

	const handleCreateOrder = (e: React.FormEvent) => {
		e.preventDefault();
		const newOrd: OrderType = {
			id: `ord-${Date.now()}`,
			orderNumber: Math.floor(100000 + Math.random() * 900000).toString(),
			customerName: newOrderName,
			customerEmail: `${newOrderName.toLowerCase().replace(/\s/g, '')}@gmail.com`,
			phone: newOrderPhone,
			date: new Date().toISOString().split('T')[0],
			status: 'Pending',
			totalPrice: parseFloat(newOrderPrice) * parseInt(newOrderQty),
			shippingMethod: 'air',
			address: newOrderAddress,
			items: [
				{
					id: `item-${Date.now()}`,
					name: newOrderProduct,
					quantity: parseInt(newOrderQty),
					price: parseFloat(newOrderPrice),
					variant: 'Standard'
				}
			],
			riskScore: 10,
			riskReasons: []
		};
		setOrders([newOrd, ...orders]);
		setIsCreateOpen(false);
		toast.success('Manual order created successfully!');
	};

	const handleEditOrder = () => {
		if (!selectedOrder) return;
		setOrders(prev =>
			prev.map(o =>
				o.id === selectedOrder.id ? { ...o, address: editAddress, totalPrice: editPrice } : o
			)
		);
		setIsEditOpen(false);
		setIsDetailOpen(false);
		toast.success('Order details updated');
	};

	const handleCancelOrder = (orderId: string) => {
		handleStatusChange(orderId, 'Cancelled');
		setIsDetailOpen(false);
	};

	const handleMergeOrders = (targetOrderId: string) => {
		// Simulation: merge ord-1 and ord-2 together
		const ord1 = orders.find(o => o.id === 'ord-1');
		const ord2 = orders.find(o => o.id === 'ord-2');
		if (ord1 && ord2) {
			const merged: OrderType = {
				...ord1,
				orderNumber: `M-${ord1.orderNumber}`,
				totalPrice: ord1.totalPrice + ord2.totalPrice,
				items: [...ord1.items, ...ord2.items],
				status: 'Pending'
			};
			setOrders(prev => prev.filter(o => o.id !== 'ord-1' && o.id !== 'ord-2').concat(merged));
			setIsMergeOpen(false);
			toast.success('Orders successfully merged!');
		}
	};

	const handleSplitOrder = () => {
		// Simulation: Split multi-item orders
		if (!selectedOrder || selectedOrder.items.length < 2) {
			toast.error('Order must have multiple items to split');
			return;
		}
		const itemToSplit = selectedOrder.items[1];
		const remainingItems = [selectedOrder.items[0]];

		const splitOrd: OrderType = {
			...selectedOrder,
			id: `ord-split-${Date.now()}`,
			orderNumber: `${selectedOrder.orderNumber}-B`,
			totalPrice: itemToSplit.price * itemToSplit.quantity,
			items: [itemToSplit]
		};

		setOrders(prev =>
			prev
				.map(o =>
					o.id === selectedOrder.id
						? {
								...o,
								orderNumber: `${o.orderNumber}-A`,
								totalPrice: o.totalPrice - splitOrd.totalPrice,
								items: remainingItems
						  }
						: o
				)
				.concat(splitOrd)
		);
		setIsSplitOpen(false);
		setIsDetailOpen(false);
		toast.success('Order split completed successfully!');
	};

	const handleBulkAction = (action: string) => {
		if (selectedOrdersForBulk.length === 0) {
			toast.error('No orders selected');
			return;
		}
		if (action === 'process') {
			setOrders(prev =>
				prev.map(o =>
					selectedOrdersForBulk.includes(o.id) ? { ...o, status: 'Processing' } : o
				)
			);
			toast.success('Bulk status updated to Processing');
		} else if (action === 'print') {
			setIsSlipPrintOpen(true);
		}
		setSelectedOrdersForBulk([]);
	};

	return (
		<div className="space-y-6 font-play">
			{/* Top Bar actions */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Order Management</h2>
					<p className="text-xs text-slate-400">Process, merge, split, dispatch and print courier manifests.</p>
				</div>
				<div className="flex items-center gap-2">
					<Button onClick={() => setIsCreateOpen(true)} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-2">
						<Plus size={16} /> Create Order
					</Button>
				</div>
			</div>

			{/* Filters and search */}
			<div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white p-4 rounded-xl border">
				{/* Tab status selectors */}
				<div className="flex flex-wrap gap-1.5 overflow-x-auto w-full xl:w-auto">
					{['All', 'Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((tab) => (
						<button
							key={tab}
							onClick={() => setSelectedTab(tab)}
							className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition duration-200 border ${
								selectedTab === tab
									? 'bg-orange-50 border-orange-200 text-[#F16A38]'
									: 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				<div className="flex items-center gap-2 w-full xl:w-auto">
					<div className="relative flex-1 xl:w-64">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
						<Input
							placeholder="Search Order, Customer..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 h-9"
						/>
					</div>
					{selectedOrdersForBulk.length > 0 && (
						<div className="flex items-center gap-1">
							<Button size="sm" variant="outline" onClick={() => handleBulkAction('process')} className="h-9 gap-1 text-slate-700">
								<Check size={14} /> Process ({selectedOrdersForBulk.length})
							</Button>
							<Button size="sm" variant="outline" onClick={() => handleBulkAction('print')} className="h-9 gap-1 text-slate-700">
								<Printer size={14} /> Print Slips
							</Button>
						</div>
					)}
				</div>
			</div>

			{/* Order Listing Table */}
			<Card className="shadow-sm">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm border-collapse">
							<thead>
								<tr className="border-b bg-slate-50 text-slate-400 font-semibold uppercase text-xs">
									<th className="py-3 px-4 w-12 text-center">
										<input
											type="checkbox"
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedOrdersForBulk(filteredOrders.map(o => o.id));
												} else {
													setSelectedOrdersForBulk([]);
												}
											}}
											checked={selectedOrdersForBulk.length === filteredOrders.length && filteredOrders.length > 0}
											className="rounded border-slate-300"
										/>
									</th>
									<th className="py-3 px-4">Order No.</th>
									<th className="py-3 px-4">Date</th>
									<th className="py-3 px-4">Customer</th>
									<th className="py-3 px-4">Status</th>
									<th className="py-3 px-4">Method</th>
									<th className="py-3 px-4">Total</th>
									<th className="py-3 px-4">Risk Rating</th>
									<th className="py-3 px-4 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{filteredOrders.map((order) => (
									<tr key={order.id} className="hover:bg-slate-50/50 duration-200">
										<td className="py-3 px-4 text-center">
											<input
												type="checkbox"
												checked={selectedOrdersForBulk.includes(order.id)}
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedOrdersForBulk([...selectedOrdersForBulk, order.id]);
													} else {
														setSelectedOrdersForBulk(selectedOrdersForBulk.filter(id => id !== order.id));
													}
												}}
												className="rounded border-slate-300"
											/>
										</td>
										<td className="py-3 px-4 font-bold text-slate-800">#{order.orderNumber}</td>
										<td className="py-3 px-4 text-slate-500">{order.date}</td>
										<td className="py-3 px-4">
											<div>
												<p className="font-semibold text-slate-800">{order.customerName}</p>
												<p className="text-xs text-slate-400">{order.phone}</p>
											</div>
										</td>
										<td className="py-3 px-4">
											<Badge
												className={`
													${order.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
													${order.status === 'Confirmed' ? 'bg-sky-50 text-sky-600 border-sky-200' : ''}
													${order.status === 'Processing' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
													${order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : ''}
													${order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}
													${order.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-200' : ''}
												`}
											>
												{order.status}
											</Badge>
										</td>
										<td className="py-3 px-4 uppercase font-semibold text-xs text-slate-600">{order.shippingMethod}</td>
										<td className="py-3 px-4 font-bold text-slate-700">৳{order.totalPrice}</td>
										<td className="py-3 px-4">
											<div className="flex items-center gap-1.5">
												<div className={`w-2.5 h-2.5 rounded-full ${order.riskScore > 50 ? 'bg-rose-500' : order.riskScore > 20 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
												<span className="text-xs font-semibold text-slate-600">{order.riskScore > 50 ? 'High' : order.riskScore > 20 ? 'Medium' : 'Low'} ({order.riskScore}%)</span>
											</div>
										</td>
										<td className="py-3 px-4 text-center">
											<Button
												size="sm"
												variant="ghost"
												onClick={() => {
													setSelectedOrder(order);
													setEditAddress(order.address);
													setEditPrice(order.totalPrice);
													setIsDetailOpen(true);
												}}
												className="hover:text-[#F16A38] text-slate-600"
											>
												<Eye size={16} className="mr-1" /> View
											</Button>
										</td>
									</tr>
								))}
								{filteredOrders.length === 0 && (
									<tr>
										<td colSpan={9} className="py-10 text-center text-slate-400 font-semibold">
											No orders match current criteria.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Order Details Drawer / Modal */}
			{selectedOrder && (
				<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
					<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
						<DialogHeader>
							<div className="flex justify-between items-center pr-6">
								<DialogTitle className="text-xl font-bold">Order Details #{selectedOrder.orderNumber}</DialogTitle>
								<Badge className="bg-indigo-50 border border-indigo-200 text-indigo-600">Risk Score: {selectedOrder.riskScore}%</Badge>
							</div>
							<DialogDescription>
								Verify dropshipping risk factors and manage shipping pipeline.
							</DialogDescription>
						</DialogHeader>

						{/* Quick warning alert if high risk */}
						{selectedOrder.riskScore > 50 && (
							<div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex gap-2.5 text-rose-700 text-sm">
								<ShieldAlert className="shrink-0" />
								<div>
									<p className="font-bold">Fraud Alert Warning</p>
									<ul className="list-disc pl-4 mt-1 text-xs space-y-0.5">
										{selectedOrder.riskReasons.map((reason, idx) => (
											<li key={idx}>{reason}</li>
										))}
									</ul>
								</div>
							</div>
						)}

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
							{/* Client Details */}
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold text-slate-700 text-sm border-b pb-1.5 mb-2 uppercase">Customer details</h4>
									<p className="text-sm font-bold text-slate-800">{selectedOrder.customerName}</p>
									<p className="text-xs text-slate-500">{selectedOrder.customerEmail}</p>
									<p className="text-xs text-slate-500">Phone: {selectedOrder.phone}</p>
								</div>
								<div>
									<h4 className="font-semibold text-slate-700 text-sm border-b pb-1.5 mb-2 uppercase">Shipping Address</h4>
									<p className="text-xs text-slate-600 leading-relaxed">{selectedOrder.address}</p>
								</div>
							</div>

							{/* Actions Control */}
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold text-slate-700 text-sm border-b pb-1.5 mb-2 uppercase">Fulfillment Controls</h4>
									<div className="flex gap-2">
										<Select
											value={selectedOrder.status}
											onValueChange={(val) => handleStatusChange(selectedOrder.id, val as OrderType['status'])}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Update status" />
											</SelectTrigger>
											<SelectContent>
												{['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'In Transit', 'Delivered', 'Cancelled', 'Refunded', 'Returned'].map((s) => (
													<SelectItem key={s} value={s}>{s}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Order Editing or Splitting/Merging actions */}
								<div className="flex flex-wrap gap-2">
									<Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="text-xs font-semibold text-slate-700">
										Edit Address/Price
									</Button>
									<Button variant="outline" size="sm" onClick={() => setIsSplitOpen(true)} className="text-xs font-semibold text-slate-700 gap-1.5">
										<Split size={14} /> Split Order
									</Button>
									<Button variant="outline" size="sm" onClick={() => setIsMergeOpen(true)} className="text-xs font-semibold text-slate-700 gap-1.5">
										<Merge size={14} /> Merge Order
									</Button>
									<Button variant="destructive" size="sm" onClick={() => handleCancelOrder(selectedOrder.id)} className="text-xs font-semibold gap-1.5">
										<Trash2 size={14} /> Cancel Order
									</Button>
								</div>
							</div>
						</div>

						{/* Items list */}
						<div className="mt-6">
							<h4 className="font-semibold text-slate-700 text-sm border-b pb-1.5 mb-3 uppercase">Order items</h4>
							<div className="space-y-2.5">
								{selectedOrder.items.map((item) => (
									<div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
										<div>
											<p className="font-bold text-slate-800 text-sm">{item.name}</p>
											<p className="text-xs text-slate-400">{item.variant}</p>
										</div>
										<div className="text-right">
											<p className="text-sm font-semibold text-slate-700">{item.quantity} x ৳{item.price}</p>
											<p className="text-xs font-bold text-[#F16A38]">৳{item.quantity * item.price}</p>
										</div>
									</div>
								))}
							</div>
							<div className="flex justify-between items-center border-t pt-3.5 mt-4">
								<span className="font-bold text-slate-700">Grand Total</span>
								<span className="text-lg font-extrabold text-[#F16A38]">৳{selectedOrder.totalPrice}</span>
							</div>
						</div>

						<DialogFooter className="mt-6 border-t pt-4">
							<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close Details</Button>
							<Button onClick={() => setIsSlipPrintOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2">
								<Printer size={16} /> Print Packing Slip
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Manual Order Creation Modal */}
			<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<DialogContent className="max-w-md bg-white">
					<DialogHeader>
						<DialogTitle className="text-lg font-bold">Manual Order Creation</DialogTitle>
						<DialogDescription>Create orders for phone or walk-in dropshipping queries.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreateOrder} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Customer Name</label>
							<Input required value={newOrderName} onChange={e => setNewOrderName(e.target.value)} placeholder="Full name" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
							<Input required value={newOrderPhone} onChange={e => setNewOrderPhone(e.target.value)} placeholder="01XXXXXXXXX" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Delivery Address</label>
							<Input required value={newOrderAddress} onChange={e => setNewOrderAddress(e.target.value)} placeholder="Full street address, district" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Price (৳)</label>
								<Input required type="number" value={newOrderPrice} onChange={e => setNewOrderPrice(e.target.value)} />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Quantity</label>
								<Input required type="number" value={newOrderQty} onChange={e => setNewOrderQty(e.target.value)} />
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold">Place Order</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Order Edit Modal */}
			{selectedOrder && (
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogContent className="max-w-md bg-white">
						<DialogHeader>
							<DialogTitle className="text-lg font-bold">Edit Order #{selectedOrder.orderNumber}</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Shipping Address</label>
								<Input value={editAddress} onChange={e => setEditAddress(e.target.value)} />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Grand Total (৳)</label>
								<Input type="number" value={editPrice} onChange={e => setEditPrice(parseFloat(e.target.value))} />
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
							<Button onClick={handleEditOrder} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold">Save Changes</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Order Split Modal */}
			{selectedOrder && (
				<Dialog open={isSplitOpen} onOpenChange={setIsSplitOpen}>
					<DialogContent className="max-w-md bg-white">
						<DialogHeader>
							<DialogTitle className="text-lg font-bold">Split Order #{selectedOrder.orderNumber}</DialogTitle>
							<DialogDescription>Split items into separate parcel consignments.</DialogDescription>
						</DialogHeader>
						<div className="space-y-3 p-3 bg-slate-50 border rounded-lg">
							<p className="text-xs font-semibold text-slate-500 uppercase">Items to split</p>
							{selectedOrder.items.map((i, index) => (
								<div key={i.id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
									<span>{i.name} (x{i.quantity})</span>
									<span className="font-bold text-slate-700">৳{i.price * i.quantity}</span>
								</div>
							))}
						</div>
						<DialogFooter className="pt-4">
							<Button variant="outline" onClick={() => setIsSplitOpen(false)}>Cancel</Button>
							<Button onClick={handleSplitOrder} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Execute Split</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Order Merge Modal */}
			{selectedOrder && (
				<Dialog open={isMergeOpen} onOpenChange={setIsMergeOpen}>
					<DialogContent className="max-w-md bg-white">
						<DialogHeader>
							<DialogTitle className="text-lg font-bold">Merge Consignments</DialogTitle>
							<DialogDescription>Combine orders directed to identical customer phone numbers.</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<p className="text-sm text-slate-600">The system found another open order for <strong>{selectedOrder.customerName}</strong>. Merging will bundle them into a single shipment.</p>
							<div className="p-3 bg-slate-50 border rounded-lg space-y-2 text-xs">
								<p className="font-semibold text-slate-500 uppercase">Orders to Merge</p>
								<p>• Order #839201 (৳1,540)</p>
								<p>• Order #920391 (৳2,450)</p>
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button variant="outline" onClick={() => setIsMergeOpen(false)}>Cancel</Button>
							<Button onClick={() => handleMergeOrders(selectedOrder.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">Confirm Merge</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Print Slip / Label preview Modal */}
			{selectedOrder && (
				<Dialog open={isSlipPrintOpen} onOpenChange={setIsSlipPrintOpen}>
					<DialogContent className="max-w-2xl bg-white max-h-[85vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="text-lg font-bold">Courier Invoice / Packing Slip Preview</DialogTitle>
						</DialogHeader>
						{/* Print layout representation */}
						<div className="border border-dashed p-6 bg-slate-50 rounded-lg space-y-6 text-slate-800 font-sans print-area" id="printable-area">
							<div className="flex justify-between items-start border-b pb-4">
								<div>
									<h2 className="text-2xl font-black text-[#F16A38]">UPDATE SHIPPING</h2>
									<p className="text-xs text-slate-400">Dhaka Office, Bangladesh</p>
								</div>
								<div className="text-right">
									<h4 className="font-extrabold text-sm text-indigo-600 uppercase">Packing Slip</h4>
									<p className="text-xs font-semibold">Order: #{selectedOrder.orderNumber}</p>
									<p className="text-xs text-slate-500">Date: {selectedOrder.date}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 text-xs">
								<div>
									<h5 className="font-bold text-slate-500 uppercase mb-1">Ship To:</h5>
									<p className="font-bold">{selectedOrder.customerName}</p>
									<p>{selectedOrder.phone}</p>
									<p>{selectedOrder.address}</p>
								</div>
								<div className="text-right">
									<h5 className="font-bold text-slate-500 uppercase mb-1">Carrier Details:</h5>
									<p className="font-bold">SKY SHIP LOGISTICS</p>
									<p>Method: {selectedOrder.shippingMethod.toUpperCase()}</p>
									<p className="font-bold text-[#F16A38]">Cash On Delivery (COD)</p>
								</div>
							</div>

							{/* Items table */}
							<table className="w-full text-left text-xs border-collapse">
								<thead>
									<tr className="border-b-2 border-slate-300 font-bold">
										<th className="pb-2">Description</th>
										<th className="pb-2 text-center">Qty</th>
										<th className="pb-2 text-right">Price</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{selectedOrder.items.map((i) => (
										<tr key={i.id} className="py-2">
											<td className="py-2">
												<p className="font-bold">{i.name}</p>
												<p className="text-slate-400 text-[10px]">{i.variant}</p>
											</td>
											<td className="py-2 text-center">{i.quantity}</td>
											<td className="py-2 text-right">৳{i.price}</td>
										</tr>
									))}
								</tbody>
							</table>

							<div className="border-t pt-4 text-right text-xs">
								<p className="font-bold">Subtotal: ৳{selectedOrder.totalPrice}</p>
								<p className="text-lg font-black text-[#F16A38] mt-1">Total COD Amount: ৳{selectedOrder.totalPrice}</p>
							</div>

							{/* Customs Declaration mock bar */}
							<div className="bg-slate-200/60 p-3 rounded text-[10px] text-slate-600 flex justify-between items-center border">
								<div>
									<p className="font-bold">Customs Declaration (Dropship procurement CN-BD)</p>
									<p>Content: E-Commerce goods. Total declared weight: 350g.</p>
								</div>
								<div className="text-right border-l pl-3 font-semibold">
									<p>HS Code: 8518.21.00</p>
									<p>SkyShip Clearance: Passed</p>
								</div>
							</div>
						</div>
						<DialogFooter className="gap-2">
							<Button variant="outline" onClick={() => setIsSlipPrintOpen(false)}>Close Preview</Button>
							<Button onClick={() => {
								window.print();
								toast.success('Print job dispatched');
							}} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5">
								<Printer size={16} /> Print Document
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
