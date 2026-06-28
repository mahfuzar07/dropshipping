'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
	Truck,
	MapPin,
	ClipboardList,
	Printer,
	Settings2,
	RefreshCw,
	Plus,
	Edit,
	Check,
	Play
} from 'lucide-react';

interface ShippingZone {
	id: string;
	name: string;
	standardRate: number;
	expressRate: number;
	freeShippingThreshold: number | null;
	deliveryEstimate: string;
}

interface CourierIntegration {
	name: string;
	type: '3PL' | 'Courier' | 'Local';
	status: 'Connected' | 'Disconnected';
	logo: string;
}

export default function FulfillmentPage() {
	const [shippingZones, setShippingZones] = useState<ShippingZone[]>([
		{ id: 'zone-1', name: 'Dhaka Metropolitan', standardRate: 60, expressRate: 120, freeShippingThreshold: 2000, deliveryEstimate: '1-3 Days' },
		{ id: 'zone-2', name: 'Chittagong District', standardRate: 120, expressRate: 200, freeShippingThreshold: 3500, deliveryEstimate: '3-5 Days' },
		{ id: 'zone-3', name: 'Sylhet Division', standardRate: 130, expressRate: 220, freeShippingThreshold: null, deliveryEstimate: '4-6 Days' },
		{ id: 'zone-4', name: 'Rest of Bangladesh', standardRate: 150, expressRate: 250, freeShippingThreshold: 5000, deliveryEstimate: '5-7 Days' }
	]);

	const [couriers] = useState<CourierIntegration[]>([
		{ name: 'SkyShip BD', type: '3PL', status: 'Connected', logo: '✈️' },
		{ name: 'Pathao Courier', type: 'Courier', status: 'Connected', logo: '🛵' },
		{ name: 'RedX Delivery', type: 'Courier', status: 'Connected', logo: '📦' },
		{ name: 'Paperfly logistics', type: 'Courier', status: 'Disconnected', logo: '✉️' }
	]);

	const [selectedZone, setSelectedZone] = useState<ShippingZone | null>(null);
	const [editStandard, setEditStandard] = useState(0);
	const [editExpress, setEditExpress] = useState(0);

	const handleSaveZone = () => {
		if (!selectedZone) return;
		setShippingZones(prev => prev.map(z => z.id === selectedZone.id ? { ...z, standardRate: editStandard, expressRate: editExpress } : z));
		setSelectedZone(null);
		toast.success('Shipping zone rates successfully updated!');
	};

	const triggerAutoAssignment = () => {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
			loading: 'Running auto-fulfillment routing engine...',
			success: '24 pending orders assigned to SkyShip & RedX successfully!',
			error: 'Failed to assign couriers'
		});
	};

	const triggerTrackingSync = () => {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
			loading: 'Syncing tracking codes with Pathao/RedX APIs...',
			success: 'Sync complete. 8 orders updated to "In Transit" status.',
			error: 'API timeout'
		});
	};

	return (
		<div className="space-y-6 font-play">
			{/* Top Bar actions */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Fulfillment & Shipping Center</h2>
					<p className="text-xs text-slate-400">Configure logistics channels, auto-assign couriers, and manage delivery tariffs.</p>
				</div>
				<div className="flex items-center gap-2">
					<Button onClick={triggerAutoAssignment} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-2">
						<Play size={16} /> Auto-Fulfill Orders
					</Button>
					<Button onClick={triggerTrackingSync} variant="outline" className="text-slate-700 font-semibold gap-2">
						<RefreshCw size={16} /> Sync Tracking Codes
					</Button>
				</div>
			</div>

			{/* Main content split grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left column: Shipping Zones and tariff manager */}
				<div className="lg:col-span-2 space-y-6">
					<Card className="shadow-sm">
						<CardHeader className="pb-3 border-b flex flex-row justify-between items-center">
							<div>
								<CardTitle className="text-base font-bold text-slate-800">Shipping Zones & Rates</CardTitle>
								<CardDescription>Zone-specific cash on delivery rates (BDT)</CardDescription>
							</div>
							<Button size="sm" variant="outline" className="gap-1 text-xs text-slate-600">
								<Plus size={14} /> Add Zone
							</Button>
						</CardHeader>
						<CardContent className="p-0">
							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<thead>
										<tr className="border-b bg-slate-50 text-slate-400 font-bold text-xs uppercase">
											<th className="py-3 px-4">Zone Name</th>
											<th className="py-3 px-4">Standard Delivery</th>
											<th className="py-3 px-4">Express Delivery</th>
											<th className="py-3 px-4">Free Shipping Min.</th>
											<th className="py-3 px-4">Estimate</th>
											<th className="py-3 px-4 text-center">Action</th>
										</tr>
									</thead>
									<tbody className="divide-y text-slate-700">
										{shippingZones.map((zone) => (
											<tr key={zone.id} className="hover:bg-slate-50/50 duration-200">
												<td className="py-3.5 px-4 font-semibold text-slate-800">{zone.name}</td>
												<td className="py-3.5 px-4 font-bold">৳{zone.standardRate}</td>
												<td className="py-3.5 px-4 font-bold">৳{zone.expressRate}</td>
												<td className="py-3.5 px-4 text-slate-500">
													{zone.freeShippingThreshold ? `৳${zone.freeShippingThreshold}` : 'N/A'}
												</td>
												<td className="py-3.5 px-4 text-xs font-semibold text-slate-500">
													{zone.deliveryEstimate}
												</td>
												<td className="py-3.5 px-4 text-center">
													<Button
														size="sm"
														variant="ghost"
														onClick={() => {
															setSelectedZone(zone);
															setEditStandard(zone.standardRate);
															setEditExpress(zone.expressRate);
														}}
														className="hover:text-indigo-600 text-slate-500"
													>
														<Edit size={14} />
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>

					{/* Automation Settings card */}
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="text-base font-bold text-slate-800">Fulfillment Automation Rules</CardTitle>
							<CardDescription>Determine rules for dropship assignment & parcel routing</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center justify-between p-3.5 bg-slate-50 border rounded-lg">
								<div>
									<h4 className="font-semibold text-sm text-slate-800">Auto Supplier Sourcing</h4>
									<p className="text-xs text-slate-400">Instantly forward order payload to matching 1688 SKU supplier.</p>
								</div>
								<input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 h-4 w-4" />
							</div>

							<div className="flex items-center justify-between p-3.5 bg-slate-50 border rounded-lg">
								<div>
									<h4 className="font-semibold text-sm text-slate-800">Automated Courier Assignment</h4>
									<p className="text-xs text-slate-400">Choose best rate courier automatically based on delivery zone.</p>
								</div>
								<input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 h-4 w-4" />
							</div>

							<div className="flex items-center justify-between p-3.5 bg-slate-50 border rounded-lg">
								<div>
									<h4 className="font-semibold text-sm text-slate-800">Auto Tracking Notifications</h4>
									<p className="text-xs text-slate-400">Send WhatsApp notification to buyer immediately when courier prints label.</p>
								</div>
								<input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 h-4 w-4" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right column: active integrations and edit modal card */}
				<div className="space-y-6">
					{/* Courier Integrations */}
					<Card className="shadow-sm">
						<CardHeader>
							<CardTitle className="text-base font-bold text-slate-800">Logistics Integrations</CardTitle>
							<CardDescription>3PL channels integrated with the store</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{couriers.map((courier) => (
								<div key={courier.name} className="flex justify-between items-center p-3 border rounded-lg hover:shadow-sm duration-200 bg-white">
									<div className="flex items-center gap-3">
										<span className="text-2xl">{courier.logo}</span>
										<div>
											<p className="font-semibold text-sm text-slate-800">{courier.name}</p>
											<p className="text-[10px] text-slate-400">{courier.type}</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge className={courier.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}>
											{courier.status}
										</Badge>
										<Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-600">
											<Settings2 size={14} />
										</Button>
									</div>
								</div>
							))}
						</CardContent>
					</Card>

					{/* Rate Editor Dialog-like Card */}
					{selectedZone && (
						<Card className="border-indigo-200 shadow-sm bg-indigo-50/20">
							<CardHeader>
								<CardTitle className="text-sm font-bold text-slate-800 uppercase">Update Tariff: {selectedZone.name}</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3.5">
								<div>
									<label className="block text-xs font-semibold text-slate-500 mb-1">Standard Rate (৳)</label>
									<Input type="number" value={editStandard} onChange={e => setEditStandard(parseInt(e.target.value))} />
								</div>
								<div>
									<label className="block text-xs font-semibold text-slate-500 mb-1">Express Rate (৳)</label>
									<Input type="number" value={editExpress} onChange={e => setEditExpress(parseInt(e.target.value))} />
								</div>
								<div className="flex gap-2 justify-end pt-2">
									<Button size="sm" variant="outline" onClick={() => setSelectedZone(null)}>Cancel</Button>
									<Button size="sm" onClick={handleSaveZone} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1">
										<Check size={14} /> Save Rates
									</Button>
								</div>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
