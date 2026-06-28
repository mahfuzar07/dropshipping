'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
	Plus,
	X,
	ArrowLeft,
	Upload,
	Trash2,
	DollarSign
} from 'lucide-react';

interface VariantRow {
	sku: string;
	size: string;
	color: string;
	stock: string;
	price: string;
}

export default function AddProductPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [category, setCategory] = useState('');
	const [baseCny, setBaseCny] = useState('');
	const [markupPercent, setMarkupPercent] = useState('30');
	const [sourceUrl, setSourceUrl] = useState('');
	const [sourcePlatform, setSourcePlatform] = useState('1688');
	const [variants, setVariants] = useState<VariantRow[]>([
		{ sku: '', size: '', color: '', stock: '100', price: '0' }
	]);

	// Auto calculate BDT and Sell Price
	const baseBdt = baseCny ? parseFloat(baseCny) * 17 : 0;
	const computedPrice = baseBdt ? Math.round(baseBdt * (1 + parseFloat(markupPercent) / 100)) : 0;

	const handleAddVariant = () => {
		setVariants([...variants, { sku: '', size: '', color: '', stock: '100', price: computedPrice.toString() }]);
	};

	const handleRemoveVariant = (index: number) => {
		if (variants.length === 1) return;
		setVariants(variants.filter((_, i) => i !== index));
	};

	const handleVariantChange = (index: number, field: keyof VariantRow, value: string) => {
		setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name || !category || !baseCny) {
			toast.error('Please complete all required fields');
			return;
		}

		toast.success('Product successfully added!');
		router.push('/admin/products');
	};

	return (
		<div className="space-y-6 font-play max-w-4xl mx-auto">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon" onClick={() => router.push('/admin/products')} className="bg-slate-50">
					<ArrowLeft size={18} />
				</Button>
				<div>
					<h2 className="text-xl font-bold text-slate-800">Add Sourced Product</h2>
					<p className="text-xs text-slate-400">Map dropshipping offers to the local storefront catalog.</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic information */}
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="text-base font-bold text-slate-800">Basic Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Product Name *</label>
							<Input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Wireless Bluetooth Earbuds Pro with ANC" />
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Category *</label>
								<Select onValueChange={setCategory}>
									<SelectTrigger>
										<SelectValue placeholder="Select Category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="electronics">Smart Electronics</SelectItem>
										<SelectItem value="home">Home & Living</SelectItem>
										<SelectItem value="fashion">Fashion & Apparel</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Sourcing Platform</label>
								<Select defaultValue={sourcePlatform} onValueChange={setSourcePlatform}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1688">1688.com</SelectItem>
										<SelectItem value="Alibaba">Alibaba</SelectItem>
										<SelectItem value="Taobao">Taobao</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">1688 Sourcing / Product Offer URL</label>
							<Input value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} placeholder="https://detail.1688.com/offer/..." />
						</div>
					</CardContent>
				</Card>

				{/* Margins */}
				<Card className="shadow-sm">
					<CardHeader>
						<CardTitle className="text-base font-bold text-slate-800">Tariff & Markup Margin Settings</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Wholesale Cost (CNY) *</label>
							<Input required type="number" value={baseCny} onChange={e => setBaseCny(e.target.value)} placeholder="¥10.00" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Cost (BDT equivalent)</label>
							<Input disabled value={`৳${baseBdt.toLocaleString()}`} className="bg-slate-50 font-bold" />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Target Markup (%)</label>
							<Input type="number" value={markupPercent} onChange={e => setMarkupPercent(e.target.value)} />
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Final BDT Price</label>
							<Input disabled value={`৳${computedPrice.toLocaleString()}`} className="bg-orange-50 font-bold text-[#F16A38] border-orange-200" />
						</div>
					</CardContent>
				</Card>

				{/* Sourced Variants */}
				<Card className="shadow-sm">
					<CardHeader className="flex flex-row justify-between items-center pb-3">
						<CardTitle className="text-base font-bold text-slate-800">Sourced Variants</CardTitle>
						<Button type="button" size="sm" variant="outline" onClick={handleAddVariant} className="gap-1 text-slate-700">
							<Plus size={14} /> Add Variant
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{variants.map((variant, index) => (
							<div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-3.5 bg-slate-50/50 border rounded-xl relative group">
								<div>
									<label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase">Variant SKU</label>
									<Input placeholder="e.g. EP-BLACK" value={variant.sku} onChange={e => handleVariantChange(index, 'sku', e.target.value)} />
								</div>
								<div>
									<label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase">Size</label>
									<Input placeholder="e.g. M / XL" value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} />
								</div>
								<div>
									<label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase">Color</label>
									<Input placeholder="e.g. Black" value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} />
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase">Stock</label>
										<Input type="number" value={variant.stock} onChange={e => handleVariantChange(index, 'stock', e.target.value)} />
									</div>
									<div>
										<label className="block text-[10px] font-semibold text-slate-400 mb-1 uppercase">Price (৳)</label>
										<Input type="number" value={variant.price || computedPrice.toString()} onChange={e => handleVariantChange(index, 'price', e.target.value)} />
									</div>
								</div>
								<div className="flex justify-end md:justify-center md:pb-1.5">
									<Button type="button" size="sm" variant="ghost" onClick={() => handleRemoveVariant(index)} className="text-rose-500 hover:text-rose-700">
										<Trash2 size={16} />
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Save */}
				<div className="flex justify-end gap-3.5 pb-12">
					<Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
					<Button type="submit" className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold px-6">Save Sourced Product</Button>
				</div>
			</form>
		</div>
	);
}
