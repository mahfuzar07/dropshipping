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
	Ticket,
	Plus,
	Edit,
	Trash2,
	Check,
	Calendar
} from 'lucide-react';

interface CouponType {
	id: string;
	code: string;
	discountType: 'flat' | 'percent';
	discountValue: number;
	minOrderAmount: number;
	validUntil: string;
	usedCount: number;
	maxUses: number | null;
	isActive: boolean;
}

export default function CouponsPage() {
	const [coupons, setCoupons] = useState<CouponType[]>([
		{ id: 'c-1', code: 'EID2026', discountType: 'percent', discountValue: 15, minOrderAmount: 1000, validUntil: '2026-07-15', usedCount: 142, maxUses: 500, isActive: true },
		{ id: 'c-2', code: 'WELCOME100', discountType: 'flat', discountValue: 100, minOrderAmount: 500, validUntil: '2026-12-31', usedCount: 580, maxUses: null, isActive: true },
		{ id: 'c-3', code: 'WINTER50', discountType: 'flat', discountValue: 50, minOrderAmount: 300, validUntil: '2026-02-28', usedCount: 89, maxUses: 100, isActive: false }
	]);

	const [isOpen, setIsOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null);

	// Form states
	const [code, setCode] = useState('');
	const [discountType, setDiscountType] = useState<'flat' | 'percent'>('percent');
	const [discountValue, setDiscountValue] = useState('');
	const [minOrder, setMinOrder] = useState('');
	const [validUntil, setValidUntil] = useState('');

	const handleAddCoupon = () => {
		setIsEdit(false);
		setCode('');
		setDiscountType('percent');
		setDiscountValue('');
		setMinOrder('');
		setValidUntil('');
		setIsOpen(true);
	};

	const handleSaveCoupon = (e: React.FormEvent) => {
		e.preventDefault();
		if (!code || !discountValue) return;

		if (isEdit && selectedCoupon) {
			setCoupons(prev => prev.map(c => c.id === selectedCoupon.id ? {
				...c,
				code: code.toUpperCase(),
				discountType,
				discountValue: parseFloat(discountValue),
				minOrderAmount: parseFloat(minOrder || '0'),
				validUntil
			} : c));
			toast.success('Coupon details modified successfully');
		} else {
			const newCop: CouponType = {
				id: `c-${Date.now()}`,
				code: code.toUpperCase(),
				discountType,
				discountValue: parseFloat(discountValue),
				minOrderAmount: parseFloat(minOrder || '0'),
				validUntil: validUntil || '2026-12-31',
				usedCount: 0,
				maxUses: null,
				isActive: true
			};
			setCoupons([newCop, ...coupons]);
			toast.success('Discount coupon successfully registered!');
		}
		setIsOpen(false);
	};

	const handleDelete = (couponId: string) => {
		setCoupons(prev => prev.filter(c => c.id !== couponId));
		toast.success('Coupon deleted');
	};

	const handleToggleActive = (couponId: string) => {
		setCoupons(prev => prev.map(c => {
			if (c.id === couponId) {
				const next = !c.isActive;
				toast.success(next ? 'Coupon activated' : 'Coupon deactivated');
				return { ...c, isActive: next };
			}
			return c;
		}));
	};

	return (
		<div className="space-y-6 font-play max-w-4xl mx-auto">
			{/* Top Bar */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Discount Coupons</h2>
					<p className="text-xs text-slate-400">Setup promotional codes, flat discounts and minimum order thresholds.</p>
				</div>
				<Button onClick={handleAddCoupon} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1.5">
					<Plus size={16} /> Add Coupon
				</Button>
			</div>

			{/* Coupons Listing */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{coupons.map((coupon) => (
					<Card key={coupon.id} className={`hover:shadow-md transition duration-300 ${coupon.isActive ? 'bg-white' : 'bg-slate-50/50'}`}>
						<CardHeader className="pb-3 flex flex-row justify-between items-start">
							<div className="flex items-center gap-2">
								<div className={`p-2 rounded-lg ${coupon.isActive ? 'bg-orange-50 text-[#F16A38]' : 'bg-slate-100 text-slate-400'}`}>
									<Ticket size={20} />
								</div>
								<div>
									<h3 className="font-bold text-slate-800 tracking-wider text-base">{coupon.code}</h3>
									<p className="text-[10px] text-slate-400">ID: {coupon.id}</p>
								</div>
							</div>
							<button onClick={() => handleToggleActive(coupon.id)} className="focus:outline-none">
								<Badge className={coupon.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}>
									{coupon.isActive ? 'Active' : 'Expired'}
								</Badge>
							</button>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="text-xs text-slate-500 space-y-1">
								<div className="flex justify-between">
									<span>Discount:</span>
									<span className="font-bold text-slate-700">
										{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Min. Purchase:</span>
									<span className="font-semibold text-slate-700">৳{coupon.minOrderAmount}</span>
								</div>
								<div className="flex justify-between">
									<span>Total Uses:</span>
									<span className="font-semibold text-slate-700">{coupon.usedCount} times</span>
								</div>
								<div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t">
									<span className="flex items-center gap-0.5"><Calendar size={12} /> Valid Until:</span>
									<span className="font-semibold">{coupon.validUntil}</span>
								</div>
							</div>

							<div className="flex justify-end gap-1.5 pt-2 border-t">
								<Button
									size="sm"
									variant="ghost"
									onClick={() => {
										setSelectedCoupon(coupon);
										setCode(coupon.code);
										setDiscountType(coupon.discountType);
										setDiscountValue(coupon.discountValue.toString());
										setMinOrder(coupon.minOrderAmount.toString());
										setValidUntil(coupon.validUntil);
										setIsEdit(true);
										setIsOpen(true);
									}}
									className="text-slate-500 hover:text-indigo-600"
								>
									<Edit size={14} className="mr-0.5" /> Edit
								</Button>
								<Button size="sm" variant="ghost" onClick={() => handleDelete(coupon.id)} className="text-slate-500 hover:text-rose-600">
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
							{isEdit ? 'Edit Coupon Settings' : 'Register Coupon Code'}
						</DialogTitle>
						<DialogDescription>Setup coupon campaigns with expiration limits.</DialogDescription>
					</DialogHeader>
					<form onSubmit={handleSaveCoupon} className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Coupon Code</label>
							<Input required value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. EID2026" />
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Discount Type</label>
								<Select value={discountType} onValueChange={(val) => setDiscountType(val as any)}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="percent">Percentage (%)</SelectItem>
										<SelectItem value="flat">Flat Cash (৳)</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Discount Value</label>
								<Input required type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} />
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Min. Order Amount (৳)</label>
								<Input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} placeholder="e.g. 500" />
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Expiry Date</label>
								<Input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
							</div>
						</div>
						<DialogFooter className="pt-2">
							<Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
							<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold gap-1">
								<Check size={14} /> Save Coupon
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
