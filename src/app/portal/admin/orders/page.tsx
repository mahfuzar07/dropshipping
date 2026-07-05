'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
	Eye,
	Printer,
	ShieldAlert,
	Trash2,
	Plus,
	Calendar,
	Truck,
	User,
	MapPin,
	CreditCard,
} from 'lucide-react';
import DataTable, { DataTableColumnConfig } from '@/components/ui/custom/DataTable';
import { SortingState } from '@tanstack/react-table';

interface OrderItem {
	product_id: string;
	product_name: string;
	product_image: string;
	item_total?: number | string;
	variants: Array<{
		variant: {
			image?: string;
			color_name?: string;
			sizes?: Array<{ size_name: string; price: string }>;
		};
		quantity: Record<string, number>;
	}>;
}

interface Order {
	id: number;
	order_number: string;
	product_name: string;
	product_id: string;
	product_image: string;
	variants: any[];
	items?: OrderItem[];
	total_price: string;
	shipping_method: string;
	shipping_charge: string;
	payment_method: string;
	status: string;
	status_display: string;
	created_at: string;
	address?: {
		full_name: string;
		phone: string;
		address: string;
		address_line2?: string;
		city: string;
		district: string;
		postal_code: string;
	};
}

export default function AdminOrderManagementPage() {
	const queryClient = useQueryClient();
	const [pageIndex, setPageIndex] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [globalSearch, setGlobalSearch] = useState('');
	const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
	const [sorting, setSorting] = useState<SortingState>([]);

	// Detail & Edit Modals State
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isSlipPrintOpen, setIsSlipPrintOpen] = useState(false);

	// Editing states
	const [editAddressLine, setEditAddressLine] = useState('');
	const [editTotalPrice, setEditTotalPrice] = useState('0');
	const [editStatus, setEditStatus] = useState('pending');

	// Create states
	const [createEmail, setCreateEmail] = useState('');
	const [createFullName, setCreateFullName] = useState('');
	const [createPhone, setCreatePhone] = useState('');
	const [createAddress, setCreateAddress] = useState('');
	const [createCity, setCreateCity] = useState('');
	const [createDistrict, setCreateDistrict] = useState('');
	const [createZip, setCreateZip] = useState('');

	// Build URL Query Params for Server-Side Filtering/Pagination
	const queryParams = useMemo(() => {
		const params = new URLSearchParams();
		params.set('view', 'admin');
		params.set('page', String(pageIndex + 1));
		params.set('limit', String(pageSize));

		if (globalSearch) {
			params.set('search', globalSearch);
		}

		Object.entries(columnFilters).forEach(([key, val]) => {
			if (key === 'search') return;
			if (val === 'ALL_VALS') return;
			if (typeof val === 'object' && val !== null) {
				if (val.min) params.set(`${key}_min`, val.min);
				if (val.max) params.set(`${key}_max`, val.max);
				if (val.start) params.set(`${key}_start`, val.start);
				if (val.end) params.set(`${key}_end`, val.end);
			} else {
				params.set(key, String(val));
			}
		});

		if (sorting.length > 0) {
			const sortStr = sorting.map(s => `${s.desc ? '-' : ''}${s.id}`).join(',');
			params.set('ordering', sortStr);
		}

		return params.toString();
	}, [pageIndex, pageSize, globalSearch, columnFilters, sorting]);

	// Fetch dynamic orders list from backend
	const { data: ordersResponse, isLoading, isError, refetch } = useAppData<any, 'single'>({
		key: [QueriesKey.USER_ORDERS, queryParams],
		api: `${apiEndpoint.orders.ORDERS()}?${queryParams}`,
		auth: true,
		responseType: 'single',
		onError: (error) => {
			toast.error('Failed to load orders from backend');
		}
	});

	const orders: Order[] = ordersResponse?.data || ordersResponse?.results || [];
	const totalCount = ordersResponse?.count || orders.length;

	// Column Definition
	const columnsConfig: DataTableColumnConfig<Order>[] = [
		{
			key: 'order_number',
			label: 'Order No.',
			sortable: true,
			filterable: true,
			render: (row) => <span className="font-bold text-slate-800">#{row.order_number}</span>
		},
		{
			key: 'created_at',
			label: 'Date',
			sortable: true,
			filterable: true,
			filterType: 'date-range',
			render: (row) => new Date(row.created_at).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})
		},
		{
			key: 'customer',
			label: 'Customer',
			render: (row) => (
				<div>
					<p className="font-semibold text-slate-800">{row.address?.full_name || 'Guest Customer'}</p>
					<p className="text-xs text-slate-400">{row.address?.phone || ''}</p>
				</div>
			)
		},
		{
			key: 'status',
			label: 'Status',
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Pending', value: 'pending' },
				{ label: 'Confirmed', value: 'confirmed' },
				{ label: 'Processing', value: 'processing' },
				{ label: 'Packed', value: 'packed' },
				{ label: 'Shipped', value: 'shipped' },
				{ label: 'Delivered', value: 'delivered' },
				{ label: 'Cancelled', value: 'cancelled' },
			],
			render: (row) => {
				const statusMap: Record<string, string> = {
					pending: 'bg-amber-50 text-amber-600 border-amber-200',
					confirmed: 'bg-sky-50 text-sky-600 border-sky-200',
					processing: 'bg-blue-50 text-blue-600 border-blue-200',
					packed: 'bg-purple-50 text-purple-600 border-purple-200',
					shipped: 'bg-indigo-50 text-indigo-600 border-indigo-200',
					delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
					cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
				};
				const cls = statusMap[row.status?.toLowerCase()] || 'bg-slate-50 text-slate-600 border-slate-200';
				return <Badge className={cls}>{row.status_display || row.status}</Badge>;
			}
		},
		{
			key: 'shipping_method',
			label: 'Shipping',
			sortable: true,
			filterable: true,
			filterType: 'select',
			filterOptions: [
				{ label: 'Air', value: 'air' },
				{ label: 'Sea', value: 'sea' }
			],
			render: (row) => <Badge variant="outline" className="uppercase text-xs">{row.shipping_method || 'Air'}</Badge>
		},
		{
			key: 'total_price',
			label: 'Grand Total',
			sortable: true,
			filterable: true,
			filterType: 'number-range',
			render: (row) => <span className="font-semibold text-slate-800">৳{Number(row.total_price || 0).toLocaleString()}</span>
		}
	];

	// CRUD Handlers
	const handleViewOrder = (order: Order) => {
		setSelectedOrder(order);
		setIsDetailOpen(true);
	};

	const handleEditOrderOpen = (order: Order) => {
		setSelectedOrder(order);
		setEditAddressLine(order.address?.address || '');
		setEditTotalPrice(order.total_price);
		setEditStatus(order.status);
		setIsEditOpen(true);
	};

	const handleSaveOrderChanges = async () => {
		if (!selectedOrder) return;
		try {
			const payload = {
				status: editStatus,
				total_price: editTotalPrice,
				address: {
					...(selectedOrder.address || {}),
					address: editAddressLine
				}
			};
			await axios.patch(`/api/order/orders/${selectedOrder.id}/`, payload);
			toast.success('Order successfully updated');
			setIsEditOpen(false);
			setIsDetailOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.USER_ORDERS] });
		} catch (e) {
			toast.error('Failed to save order details');
		}
	};

	const handleDeleteOrder = async (order: Order) => {
		if (!confirm(`Are you sure you want to delete order #${order.order_number}?`)) return;
		try {
			await axios.delete(`/api/order/orders/${order.id}/`);
			toast.success('Order deleted successfully');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.USER_ORDERS] });
		} catch (e) {
			toast.error('Failed to delete order');
		}
	};

	// Bulk Actions
	const handleBulkStatusUpdate = async (selected: Order[], nextStatus: string) => {
		try {
			await Promise.all(
				selected.map((o) => axios.patch(`/api/order/orders/${o.id}/`, { status: nextStatus }))
			);
			toast.success(`Bulk status updated to ${nextStatus}`);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.USER_ORDERS] });
		} catch (e) {
			toast.error('Bulk update failed');
		}
	};

	const handleBulkDelete = async (selected: Order[]) => {
		if (!confirm(`Delete ${selected.length} orders?`)) return;
		try {
			await Promise.all(
				selected.map((o) => axios.delete(`/api/order/orders/${o.id}/`))
			);
			toast.success('Bulk delete completed');
			queryClient.invalidateQueries({ queryKey: [QueriesKey.USER_ORDERS] });
		} catch (e) {
			toast.error('Bulk delete failed');
		}
	};

	const bulkActionsConfig = [
		{
			label: 'Mark Confirmed',
			onClick: (rows: Order[]) => handleBulkStatusUpdate(rows, 'confirmed'),
		},
		{
			label: 'Mark Processing',
			onClick: (rows: Order[]) => handleBulkStatusUpdate(rows, 'processing'),
		},
		{
			label: 'Delete Orders',
			onClick: handleBulkDelete,
			variant: 'destructive' as const,
		}
	];

	// Create order handler
	const handleCreateOrder = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			// Step 1: Create delivery address
			const addressRes = await axios.post('/api/user/delivery-addresses/', {
				full_name: createFullName,
				phone: createPhone,
				address: createAddress,
				city: createCity,
				district: createDistrict,
				postal_code: createZip,
			});
			const addressId = addressRes.data.id;

			// Step 2: Create consolidated order
			await axios.post('/api/order/orders/', {
				address_id: addressId,
				shipping_charge: '150',
				payment_method: 'cod',
			});

			toast.success('Consolidated order created successfully!');
			setIsCreateOpen(false);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.USER_ORDERS] });
		} catch (e) {
			toast.error('Failed to create manual order');
		}
	};

	return (
		<div className="space-y-6 font-play">
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Order Management</h2>
					<p className="text-xs text-slate-400">Process dispatch status, review shipping methods, and manage courier receipts.</p>
				</div>
			</div>

			{/* Main Data Table */}
			<DataTable<Order>
				data={orders}
				columnsConfig={columnsConfig}
				isLoading={isLoading}
				isError={isError}
				totalCount={totalCount}
				pageIndex={pageIndex}
				pageSize={pageSize}
				onPageChange={setPageIndex}
				onPageSizeChange={setPageSize}
				onSortingChange={setSorting}
				onFiltersChange={(filters) => {
					setColumnFilters(filters);
					if (filters.search !== undefined) {
						setGlobalSearch(filters.search);
					}
				}}
				onRefresh={refetch}
				onCreate={() => setIsCreateOpen(true)}
				onView={handleViewOrder}
				onEdit={handleEditOrderOpen}
				onDelete={handleDeleteOrder}
				bulkActions={bulkActionsConfig}
				exportName="orders-report"
			/>

			{/* Order Details Dialog */}
			{selectedOrder && (
				<Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
					<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
						<DialogHeader>
							<div className="flex justify-between items-center pr-6">
								<DialogTitle className="text-xl font-bold">Order Details #{selectedOrder.order_number}</DialogTitle>
								<Badge className="bg-indigo-50 border border-indigo-200 text-indigo-600">
									Shipping: {selectedOrder.shipping_method?.toUpperCase() || 'Air'}
								</Badge>
							</div>
							<DialogDescription>
								Review customer shipping address, invoice details, and dispatch status.
							</DialogDescription>
						</DialogHeader>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
							{/* Client Details */}
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold text-slate-700 text-xs border-b pb-1.5 mb-2 uppercase tracking-wide flex items-center gap-1.5">
										<User className="h-4 w-4 text-orange-500" /> Customer Details
									</h4>
									<p className="text-sm font-bold text-slate-800">{selectedOrder.address?.full_name || 'Guest User'}</p>
									<p className="text-xs text-slate-500">Phone: {selectedOrder.address?.phone || 'No phone'}</p>
								</div>
								<div>
									<h4 className="font-semibold text-slate-700 text-xs border-b pb-1.5 mb-2 uppercase tracking-wide flex items-center gap-1.5">
										<MapPin className="h-4 w-4 text-orange-500" /> Shipping Address
									</h4>
									{selectedOrder.address ? (
										<div className="text-xs text-slate-600 leading-relaxed">
											<p>{selectedOrder.address.address}</p>
											{selectedOrder.address.address_line2 && <p>{selectedOrder.address.address_line2}</p>}
											<p>{selectedOrder.address.district}, {selectedOrder.address.city} - {selectedOrder.address.postal_code}</p>
										</div>
									) : (
										<p className="text-xs text-slate-400">No address recorded</p>
									)}
								</div>
							</div>

							{/* Actions Control */}
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold text-slate-700 text-xs border-b pb-1.5 mb-2 uppercase tracking-wide flex items-center gap-1.5">
										<Truck className="h-4 w-4 text-orange-500" /> Fulfillment Status
									</h4>
									<div className="flex gap-2">
										<Select
											value={selectedOrder.status}
											onValueChange={(val) => {
												setEditStatus(val);
												handleStatusChangeDirect(selectedOrder.id, val);
											}}
										>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Update status" />
											</SelectTrigger>
											<SelectContent>
												{['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'].map((s) => (
													<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>

								{/* Control operations */}
								<div className="flex flex-wrap gap-2 pt-2">
									<Button variant="outline" size="sm" onClick={() => handleEditOrderOpen(selectedOrder)} className="text-xs font-semibold text-slate-700">
										Edit Address/Price
									</Button>
									<Button variant="destructive" size="sm" onClick={() => handleDeleteOrder(selectedOrder)} className="text-xs font-semibold">
										Delete Order
									</Button>
								</div>
							</div>
						</div>

						{/* Items list */}
						<div className="mt-6">
							<h4 className="font-semibold text-slate-700 text-xs border-b pb-1.5 mb-3 uppercase tracking-wide">
								Order Items
							</h4>
							<div className="space-y-2.5">
								{selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
									selectedOrder.items.map((item, idx) => (
										<div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
											<div>
												<p className="font-bold text-slate-800 text-sm">{item.product_name}</p>
												<p className="text-xs text-slate-400">ID: {item.product_id}</p>
											</div>
											<div className="text-right">
												<p className="text-xs font-bold text-[#F16A38]">৳{Number(item.item_total || 0).toLocaleString()}</p>
											</div>
										</div>
									))
								) : (
									<div className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
										<div>
											<p className="font-bold text-slate-800 text-sm">{selectedOrder.product_name || 'Legacy Order Product'}</p>
											<p className="text-xs text-slate-400">ID: {selectedOrder.product_id}</p>
										</div>
										<div className="text-right">
											<p className="text-xs font-bold text-[#F16A38]">৳{Number(selectedOrder.total_price || 0).toLocaleString()}</p>
										</div>
									</div>
								)}
							</div>
							<div className="flex justify-between items-center border-t pt-3.5 mt-4">
								<span className="font-bold text-slate-700">Grand Total</span>
								<span className="text-lg font-extrabold text-[#F16A38]">৳{Number(selectedOrder.total_price || 0).toLocaleString()}</span>
							</div>
						</div>

						<DialogFooter className="mt-6 border-t pt-4">
							<Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close Details</Button>
							<Button onClick={() => setIsSlipPrintOpen(true)} className="bg-indigo-650 hover:bg-indigo-705 text-white font-semibold gap-2">
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
						<DialogDescription>Input client details to register a manual dropshipping delivery.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleCreateOrder} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Customer Full Name</label>
							<Input required value={createFullName} onChange={e => setCreateFullName(e.target.value)} placeholder="Full name" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Customer Phone</label>
							<Input required value={createPhone} onChange={e => setCreatePhone(e.target.value)} placeholder="01XXXXXXXXX" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address (Optional)</label>
							<Input value={createEmail} onChange={e => setCreateEmail(e.target.value)} placeholder="name@domain.com" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Street Address</label>
							<Input required value={createAddress} onChange={e => setCreateAddress(e.target.value)} placeholder="House, Road, Area" />
						</div>
						<div className="grid grid-cols-3 gap-2">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">City</label>
								<Input required value={createCity} onChange={e => setCreateCity(e.target.value)} placeholder="Dhaka" />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">District</label>
								<Input required value={createDistrict} onChange={e => setCreateDistrict(e.target.value)} placeholder="Dhaka" />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Zip Code</label>
								<Input required value={createZip} onChange={e => setCreateZip(e.target.value)} placeholder="1212" />
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-650 font-semibold">Place Order</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Order Edit Modal */}
			{selectedOrder && (
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogContent className="max-w-md bg-white">
						<DialogHeader>
							<DialogTitle className="text-lg font-bold">Edit Order #{selectedOrder.order_number}</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Shipping Address Line</label>
								<Input value={editAddressLine} onChange={e => setEditAddressLine(e.target.value)} />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Grand Total (৳)</label>
								<Input type="number" value={editTotalPrice} onChange={e => setEditTotalPrice(e.target.value)} />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Fulfillment Status</label>
								<Select value={editStatus} onValueChange={setEditStatus}>
									<SelectTrigger className="w-full">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'].map((s) => (
											<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
							<Button onClick={handleSaveOrderChanges} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold">Save Changes</Button>
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
						<div className="border border-dashed p-6 bg-slate-50 rounded-lg space-y-6 text-slate-800 font-sans" id="printable-area">
							<div className="flex justify-between items-start border-b pb-4">
								<div>
									<h2 className="text-2xl font-black text-[#F16A38]">UPDATE SHIPPING</h2>
									<p className="text-xs text-slate-400">Dhaka Office, Bangladesh</p>
								</div>
								<div className="text-right">
									<h4 className="font-extrabold text-sm text-indigo-600 uppercase">Packing Slip</h4>
									<p className="text-xs font-semibold">Order: #{selectedOrder.order_number}</p>
									<p className="text-xs text-slate-500">Date: {new Date(selectedOrder.created_at).toLocaleDateString('en-US')}</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4 text-xs">
								<div>
									<h5 className="font-bold text-slate-500 uppercase mb-1">Ship To:</h5>
									<p className="font-bold">{selectedOrder.address?.full_name || 'Guest User'}</p>
									<p>{selectedOrder.address?.phone || ''}</p>
									<p>{selectedOrder.address?.address || ''}</p>
								</div>
								<div className="text-right">
									<h5 className="font-bold text-slate-500 uppercase mb-1">Carrier Details:</h5>
									<p className="font-bold">SKY SHIP LOGISTICS</p>
									<p>Method: {selectedOrder.shipping_method?.toUpperCase() || 'Air'}</p>
									<p className="font-bold text-[#F16A38] uppercase">{selectedOrder.payment_method === 'card' ? 'Online Card Payment' : 'Cash On Delivery (COD)'}</p>
								</div>
							</div>

							{/* Items table */}
							<table className="w-full text-left text-xs border-collapse">
								<thead>
									<tr className="border-b-2 border-slate-300 font-bold">
										<th className="pb-2">Description</th>
										<th className="pb-2 text-right">Price</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{selectedOrder.items && Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
										selectedOrder.items.map((i, idx) => (
											<tr key={idx} className="py-2">
												<td className="py-2">
													<p className="font-bold">{i.product_name}</p>
													<p className="text-slate-400 text-[10px]">ID: {i.product_id}</p>
												</td>
												<td className="py-2 text-right">৳{Number(i.item_total || 0).toLocaleString()}</td>
											</tr>
										))
									) : (
										<tr className="py-2">
											<td className="py-2">
												<p className="font-bold">{selectedOrder.product_name || 'Legacy Order Product'}</p>
												<p className="text-slate-400 text-[10px]">ID: {selectedOrder.product_id}</p>
											</td>
											<td className="py-2 text-right">৳{Number(selectedOrder.total_price || 0).toLocaleString()}</td>
										</tr>
									)}
								</tbody>
							</table>

							<div className="border-t pt-4 text-right text-xs">
								<p className="font-bold">Subtotal: ৳{Number(selectedOrder.total_price || 0).toLocaleString()}</p>
								<p className="text-lg font-black text-[#F16A38] mt-1">Total COD Amount: ৳{Number(selectedOrder.total_price || 0).toLocaleString()}</p>
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

	// Helper to change status directly from detail view dropdown
	async function handleStatusChangeDirect(orderId: number, nextStatus: string) {
		try {
			await axios.patch(`/api/order/orders/${orderId}/`, { status: nextStatus });
			toast.success(`Order status updated to ${nextStatus}`);
			queryClient.invalidateQueries({ queryKey: [QueriesKey.USER_ORDERS] });
		} catch (e) {
			toast.error('Failed to update status');
		}
	}
}
