'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
	Search,
	Edit,
	Check,
	Trash2,
	Eye,
	Coins,
	PackageOpen,
	ArrowRightLeft,
	ExternalLink
} from 'lucide-react';

interface ProductVariant {
	sku: string;
	stock: number;
	price: number;
}

interface ProductType {
	id: string;
	name: string;
	slug: string;
	category: string;
	baseCostCny: number;
	baseCostBdt: number;
	sellingPrice: number;
	markupPercent: number;
	stock: number;
	variants: ProductVariant[];
	sourceUrl: string;
	isActive: boolean;
	image: string;
}

const initialProducts: ProductType[] = [
	{
		id: 'prod-1',
		name: 'Wireless Bluetooth Earbuds Pro with ANC',
		slug: 'wireless-bluetooth-earbuds-pro-anc',
		category: 'Smart Electronics',
		baseCostCny: 45,
		baseCostBdt: 765,
		sellingPrice: 1200,
		markupPercent: 56.8,
		stock: 120,
		variants: [
			{ sku: 'EP-BLACK', stock: 75, price: 1200 },
			{ sku: 'EP-WHITE', stock: 45, price: 1200 }
		],
		sourceUrl: 'https://detail.1688.com/offer/6389104.html',
		isActive: true,
		image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=120&auto=format&fit=crop&q=60'
	},
	{
		id: 'prod-2',
		name: 'Premium Leather Smart Watch GPS Series 7',
		slug: 'premium-leather-smartwatch-gps-7',
		category: 'Smart Electronics',
		baseCostCny: 95,
		baseCostBdt: 1615,
		sellingPrice: 2450,
		markupPercent: 51.7,
		stock: 85,
		variants: [
			{ sku: 'SW-BROWN', stock: 50, price: 2450 },
			{ sku: 'SW-BLACK', stock: 35, price: 2450 }
		],
		sourceUrl: 'https://detail.1688.com/offer/7592019.html',
		isActive: true,
		image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=120&auto=format&fit=crop&q=60'
	},
	{
		id: 'prod-3',
		name: 'Ergonomic Orthopedic Memory Foam Pillow',
		slug: 'ergonomic-orthopedic-memory-foam-pillow',
		category: 'Home & Living',
		baseCostCny: 15,
		baseCostBdt: 255,
		sellingPrice: 425,
		markupPercent: 66.6,
		stock: 240,
		variants: [
			{ sku: 'FOAM-L', stock: 140, price: 425 },
			{ sku: 'FOAM-M', stock: 100, price: 400 }
		],
		sourceUrl: 'https://detail.1688.com/offer/8390192.html',
		isActive: true,
		image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=120&auto=format&fit=crop&q=60'
	}
];

export default function AdminProductsPage() {
	const [products, setProducts] = useState<ProductType[]>(initialProducts);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

	// Modals State
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isMarkupOpen, setIsMarkupOpen] = useState(false);

	// Editor states
	const [editStock, setEditStock] = useState(0);
	const [editPrice, setEditPrice] = useState(0);
	const [markupPercent, setMarkupPercent] = useState(30);

	const handleStatusToggle = (productId: string) => {
		setProducts(prev => prev.map(p => {
			if (p.id === productId) {
				const nextVal = !p.isActive;
				toast.success(nextVal ? 'Product activated successfully!' : 'Product hidden from storefront');
				return { ...p, isActive: nextVal };
			}
			return p;
		}));
	};

	const handleSaveProduct = () => {
		if (!selectedProduct) return;
		setProducts(prev => prev.map(p => {
			if (p.id === selectedProduct.id) {
				return { ...p, stock: editStock, sellingPrice: editPrice };
			}
			return p;
		}));
		setIsEditOpen(false);
		toast.success('Inventory settings updated successfully!');
	};

	const handleSaveMarkup = () => {
		if (!selectedProduct) return;
		setProducts(prev => prev.map(p => {
			if (p.id === selectedProduct.id) {
				const markupMultiplier = 1 + (markupPercent / 100);
				const calculatedPrice = Math.round(p.baseCostBdt * markupMultiplier);
				return { ...p, markupPercent: markupPercent, sellingPrice: calculatedPrice };
			}
			return p;
		}));
		setIsMarkupOpen(false);
		toast.success(`Markup set to ${markupPercent}%. Price recalculated!`);
	};

	const filteredProducts = products.filter(p =>
		p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		p.category.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="space-y-6 font-play">
			{/* Top Bar actions */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border shadow-sm">
				<div>
					<h2 className="text-xl font-bold text-slate-800">Sourced Products</h2>
					<p className="text-xs text-slate-400">Configure margins, monitor inventory levels, and check 1688 wholesale sources.</p>
				</div>
				<div className="relative w-full md:w-72">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
					<Input
						placeholder="Search product, category..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9 h-9"
					/>
				</div>
			</div>

			{/* Products Table */}
			<Card className="shadow-sm">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm border-collapse">
							<thead>
								<tr className="border-b bg-slate-50 text-slate-400 font-bold text-xs uppercase">
									<th className="py-3 px-4">Product Info</th>
									<th className="py-3 px-4">Base (CNY)</th>
									<th className="py-3 px-4">Base (BDT)</th>
									<th className="py-3 px-4">Selling BDT</th>
									<th className="py-3 px-4">Markup</th>
									<th className="py-3 px-4">Stock</th>
									<th className="py-3 px-4 text-center">Status</th>
									<th className="py-3 px-4 text-center">Action</th>
								</tr>
							</thead>
							<tbody className="divide-y text-slate-700">
								{filteredProducts.map((prod) => (
									<tr key={prod.id} className="hover:bg-slate-50/50 duration-200">
										<td className="py-3 px-4 flex items-center gap-3">
											<img src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded border bg-slate-100" />
											<div className="max-w-xs">
												<p className="font-semibold text-slate-800 line-clamp-1">{prod.name}</p>
												<p className="text-[10px] text-slate-400 uppercase tracking-wider">{prod.category}</p>
											</div>
										</td>
										<td className="py-3 px-4 font-bold text-slate-500">¥{prod.baseCostCny}</td>
										<td className="py-3 px-4 font-bold text-slate-500">৳{prod.baseCostBdt}</td>
										<td className="py-3 px-4 font-extrabold text-[#F16A38]">৳{prod.sellingPrice}</td>
										<td className="py-3 px-4 text-slate-600 font-semibold">{prod.markupPercent}%</td>
										<td className="py-3 px-4">
											<span className={`px-2 py-0.5 rounded text-xs font-semibold ${prod.stock < 20 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
												{prod.stock} items
											</span>
										</td>
										<td className="py-3 px-4 text-center">
											<button onClick={() => handleStatusToggle(prod.id)} className="focus:outline-none">
												<Badge className={prod.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}>
													{prod.isActive ? 'Active' : 'Hidden'}
												</Badge>
											</button>
										</td>
										<td className="py-3 px-4">
											<div className="flex items-center justify-center gap-1.5">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => {
														setSelectedProduct(prod);
														setEditStock(prod.stock);
														setEditPrice(prod.sellingPrice);
														setIsEditOpen(true);
													}}
													className="hover:text-indigo-600 text-slate-500"
												>
													<Edit size={14} />
												</Button>

												<Button
													size="sm"
													variant="ghost"
													onClick={() => {
														setSelectedProduct(prod);
														setMarkupPercent(prod.markupPercent);
														setIsMarkupOpen(true);
													}}
													className="hover:text-amber-600 text-slate-500"
												>
													<Coins size={14} />
												</Button>

												<a href={prod.sourceUrl} target="_blank" rel="noreferrer">
													<Button size="sm" variant="ghost" className="hover:text-[#F16A38] text-slate-500">
														<ExternalLink size={14} />
													</Button>
												</a>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Edit Stock & Price Modal */}
			{selectedProduct && (
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogContent className="max-w-md bg-white">
						<DialogHeader>
							<DialogTitle className="text-base font-bold">Manage Inventory & Price</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<p className="text-sm font-semibold text-slate-700">{selectedProduct.name}</p>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Warehouse Stock</label>
									<Input type="number" value={editStock} onChange={e => setEditStock(parseInt(e.target.value))} />
								</div>
								<div>
									<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Price (৳)</label>
									<Input type="number" value={editPrice} onChange={e => setEditPrice(parseInt(e.target.value))} />
								</div>
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
							<Button onClick={handleSaveProduct} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Save Inventory</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}

			{/* Markup Margins Calculation Modal */}
			{selectedProduct && (
				<Dialog open={isMarkupOpen} onOpenChange={setIsMarkupOpen}>
					<DialogContent className="max-w-md bg-white">
						<DialogHeader>
							<DialogTitle className="text-base font-bold">Auto-calculate pricing margin</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="bg-slate-50 p-3.5 border rounded-lg space-y-1.5 text-xs text-slate-600">
								<p>Sourced Cost: ¥{selectedProduct.baseCostCny} CNY</p>
								<p>BDT Equivalent (Exchange Rate ¥1 = ৳17.00): ৳{selectedProduct.baseCostBdt} BDT</p>
								<p className="font-bold text-[#F16A38]">Resulting Sell Price: ৳{Math.round(selectedProduct.baseCostBdt * (1 + markupPercent / 100))} BDT</p>
							</div>
							<div>
								<label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Markup Profit (%)</label>
								<Input type="number" value={markupPercent} onChange={e => setMarkupPercent(parseFloat(e.target.value))} />
							</div>
						</div>
						<DialogFooter className="pt-4">
							<Button variant="outline" onClick={() => setIsMarkupOpen(false)}>Cancel</Button>
							<Button onClick={handleSaveMarkup} className="bg-[#F16A38] text-white hover:bg-orange-600 font-semibold">Set Margin Markup</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
