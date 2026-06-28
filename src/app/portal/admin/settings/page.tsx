'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
	Store,
	Coins,
	CreditCard,
	Mail,
	MessageSquare,
	ShieldCheck,
	Download,
	Upload,
	Check,
	Lock
} from 'lucide-react';

export default function AdminSettingsPage() {
	const [activeSection, setActiveSection] = useState<'store' | 'currency' | 'gateways' | 'comms' | 'backup'>('store');

	// Store info states
	const [storeName, setStoreName] = useState('Update Tech Dropshipping');
	const [contactEmail, setContactEmail] = useState('support@updatetech.com');
	const [vatPercent, setVatPercent] = useState('5');

	// Exchange Rates
	const [cnyRate, setCnyRate] = useState('17.00');
	const [usdRate, setUsdRate] = useState('118.50');

	// Gateways
	const [bkashAppKey, setBkashAppKey] = useState('bksh_app_key_82910391');
	const [bkashSecret, setBkashSecret] = useState('••••••••••••••••••••••••••••••••');
	const [nagadMerchantId, setNagadMerchantId] = useState('nagad_m_90192');

	const handleSaveStore = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success('Store profile and tax rules updated successfully!');
	};

	const handleSaveCurrency = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success('RMB/USD local exchange tariffs synced successfully!');
	};

	const handleSaveGateways = (e: React.FormEvent) => {
		e.preventDefault();
		toast.success('Payment gateway merchant credentials stored securely!');
	};

	const handleBackup = () => {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
			loading: 'Compiling database snapshots & media resources...',
			success: 'Backup dropshipping_backup_20260624.sql created and downloaded!',
			error: 'Backup failed'
		});
	};

	const handleRestore = () => {
		toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
			loading: 'Restoring from backup snapshot...',
			success: 'Database restored successfully. Cache flushed!',
			error: 'Restore failed'
		});
	};

	return (
		<div className="space-y-6 font-play max-w-5xl mx-auto">
			{/* Top bar */}
			<div className="bg-white p-5 rounded-xl border shadow-sm">
				<h2 className="text-xl font-bold text-slate-800">System Preferences & Settings</h2>
				<p className="text-xs text-slate-400 font-medium">Manage localized currencies, payment channels, messaging gateways, and database backups.</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				{/* Sidebar tab controller */}
				<div className="md:col-span-1 space-y-1">
					{[
						{ id: 'store', label: 'Store Information', icon: Store },
						{ id: 'currency', label: 'Currency Settings', icon: Coins },
						{ id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
						{ id: 'comms', label: 'Email & SMS APIs', icon: Mail },
						{ id: 'backup', label: 'Backup & Restore', icon: ShieldCheck }
					].map((item) => (
						<button
							key={item.id}
							onClick={() => setActiveSection(item.id as any)}
							className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold border transition duration-200 ${
								activeSection === item.id
									? 'bg-orange-50 border-orange-200 text-[#F16A38]'
									: 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
							}`}
						>
							<item.icon size={16} />
							<span>{item.label}</span>
						</button>
					))}
				</div>

				{/* Active preference editor card */}
				<div className="md:col-span-3">
					{activeSection === 'store' && (
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800">Store Settings & Taxes</CardTitle>
								<CardDescription>Primary store credentials and local tax declarations</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSaveStore} className="space-y-4">
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Store Public Name</label>
										<Input value={storeName} onChange={e => setStoreName(e.target.value)} />
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Primary Contact Email</label>
											<Input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} />
										</div>
										<div>
											<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Local VAT / Sales Tax (%)</label>
											<Input type="number" value={vatPercent} onChange={e => setVatPercent(e.target.value)} />
										</div>
									</div>
									<div className="flex justify-end pt-3">
										<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
											<Check size={14} /> Save Preferences
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

					{activeSection === 'currency' && (
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800">Exchange conversion rules</CardTitle>
								<CardDescription>Configure dropship cost calculators (Base exchange: BDT)</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSaveCurrency} className="space-y-4">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Chinese Yuan Rate (RMB → BDT)</label>
											<Input value={cnyRate} onChange={e => setCnyRate(e.target.value)} />
											<p className="text-[10px] text-slate-400 mt-1">Used to calculate BDT base cost from 1688 product offers.</p>
										</div>
										<div>
											<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">US Dollar Rate (USD → BDT)</label>
											<Input value={usdRate} onChange={e => setUsdRate(e.target.value)} />
										</div>
									</div>
									<div className="flex justify-end pt-3">
										<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
											<Check size={14} /> Update Rates
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

					{activeSection === 'gateways' && (
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800">Merchant Payment Gateways</CardTitle>
								<CardDescription>Setup mobile and international payment channels</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSaveGateways} className="space-y-4">
									<div className="border-b pb-4 mb-4">
										<h4 className="font-bold text-sm text-[#F16A38] mb-3 flex items-center gap-1.5">
											bKash Merchant credentials <Badge className="bg-pink-50 border-pink-100 text-pink-600 text-[10px]">Mobile API</Badge>
										</h4>
										<div className="grid grid-cols-2 gap-4">
											<div>
												<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">App Key</label>
												<Input value={bkashAppKey} onChange={e => setBkashAppKey(e.target.value)} />
											</div>
											<div>
												<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">App Secret</label>
												<Input type="password" value={bkashSecret} onChange={e => setBkashSecret(e.target.value)} />
											</div>
										</div>
									</div>

									<div>
										<h4 className="font-bold text-sm text-amber-600 mb-3 flex items-center gap-1.5">
											Nagad Checkout credentials <Badge className="bg-amber-50 border-amber-100 text-amber-600 text-[10px]">Mobile API</Badge>
										</h4>
										<div className="max-w-xs">
											<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Merchant ID</label>
											<Input value={nagadMerchantId} onChange={e => setNagadMerchantId(e.target.value)} />
										</div>
									</div>

									<div className="flex justify-end pt-3">
										<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
											<Check size={14} /> Connect Gateways
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					)}

					{activeSection === 'comms' && (
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800">Email & SMS Gateways</CardTitle>
								<CardDescription>Setup notification triggers for transactional messages</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">SMTP Senders Domain</label>
										<Input placeholder="mail.updatetech.com" />
									</div>
									<div>
										<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">SMS API Auth Token (BulkSMS)</label>
										<Input placeholder="sms_auth_tok_•••••••" />
									</div>
								</div>
								<div className="flex items-center justify-between p-3.5 bg-slate-50 border rounded-lg">
									<div>
										<h4 className="font-semibold text-sm text-slate-800">WhatsApp Dispatch notifications</h4>
										<p className="text-xs text-slate-400">Trigger WhatsApp notifications automatically on order dispatch.</p>
									</div>
									<input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 h-4 w-4" />
								</div>
								<div className="flex justify-end pt-2">
									<Button onClick={() => toast.success('Comms channels settings saved')} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold">
										Save Settings
									</Button>
								</div>
							</CardContent>
						</Card>
					)}

					{activeSection === 'backup' && (
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base font-bold text-slate-800">Backup & Restore Center</CardTitle>
								<CardDescription>Ensure data safety with local backups and system restoration overrides</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="p-4 bg-slate-50 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div>
										<h4 className="font-semibold text-sm text-slate-800">Create System Backup</h4>
										<p className="text-xs text-slate-400">Download SQL dump and media catalog archive.</p>
									</div>
									<Button onClick={handleBackup} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shrink-0">
										<Download size={16} /> Backup Now
									</Button>
								</div>

								<div className="p-4 bg-slate-50 border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
									<div>
										<h4 className="font-semibold text-sm text-slate-800">Restore System State</h4>
										<p className="text-xs text-slate-400">Restore tables and static media files from a previous backup file.</p>
									</div>
									<Button onClick={handleRestore} variant="outline" className="text-slate-700 font-semibold gap-1.5 shrink-0">
										<Upload size={16} /> Restore Backup
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
