'use client';

import { Star, Heart, Share2, Minus, Plus, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/lib/utils/formatCurrency';
import Image from 'next/image';

interface VariantOptionItem {
	id: string;
	value: string;
	image?: string;
}

interface VariantGroup {
	groupId: string;
	label: string;
	options: VariantOptionItem[];
	hasImages: boolean;
}

interface VariantOption {
	skuId: number;
	price: number;
	stock: number;
	selections: Record<string, string>;
	label: string;
}

interface ProductInfoProps {
	product: {
		id: string;
		name: string;
		price: number;
		currency: string;
		solded: string;
		rating: number;
		reviewCount: number;
		variantGroups: VariantGroup[];
		variantOptions: VariantOption[];
	};
	selectedQty: Record<number, number>;
	updateQty: (skuId: number, type: 'inc' | 'dec', stock: number) => void;
	onVariantImageSelect?: (image?: string) => void;
}

export default function ProductInfo({ product, selectedQty, updateQty, onVariantImageSelect }: ProductInfoProps) {
	const [isFavorite, setIsFavorite] = useState(false);

	const imageGroups = product.variantGroups.filter((g) => g.hasImages);
	const tableGroups = product.variantGroups.filter((g) => !g.hasImages);

	const [selections, setSelections] = useState<Record<string, string>>(() => {
		const init: Record<string, string> = {};
		product.variantGroups.forEach((g) => {
			if (g.options[0]) init[g.groupId] = g.options[0].id;
		});
		return init;
	});

	const selectedImageOption = useMemo(() => {
		for (const g of imageGroups) {
			const opt = g.options.find((o) => o.id === selections[g.groupId]);
			if (opt?.image) return opt;
		}
		return undefined;
	}, [selections, imageGroups]);

	const selectedLabel = imageGroups
		.map((g) => g.options.find((o) => o.id === selections[g.groupId])?.value)
		.filter(Boolean)
		.join(' ');

	const resolveVariant = (overrideGroupId?: string, overrideOptId?: string) => {
		return product.variantOptions.find((v) =>
			product.variantGroups.every((g) => {
				const wanted = String(g.groupId === overrideGroupId ? overrideOptId : selections[g.groupId]);
				return String(v.selections[g.groupId] || '') === wanted;
			}),
		);
	};

	const totalQty = Object.values(selectedQty).reduce((s, q) => s + q, 0);

	const selectedSummary = Object.entries(selectedQty)
		.filter(([, qty]) => qty > 0)
		.map(([skuId, qty]) => {
			const variant = product.variantOptions.find((v) => v.skuId === Number(skuId));
			return variant ? { variant, qty } : null;
		})
		.filter(Boolean) as { variant: VariantOption; qty: number }[];

	return (
		<div className="space-y-5">
			<h1 className="text-xl lg:text-2xl font-semibold font-hanken">{product.name}</h1>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{product.rating > 0 && (
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<Star key={i} className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
							))}
						</div>
					)}
					{product.reviewCount > 0 && <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>}
					<p className="text-muted-foreground border-l pl-2">{product.solded} sold</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
						<Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
					</Button>
					<Button variant="outline" size="icon">
						<Share2 className="h-5 w-5" />
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="text-3xl font-bold font-hanken text-orange-600">
					{getCurrencySymbol()}
					{product.price.toLocaleString()}
				</div>
				{totalQty > 0 && (
					<span className="bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 rounded-full">
						{totalQty} item{totalQty > 1 ? 's' : ''} selected
					</span>
				)}
			</div>

			{/* ===== Image-based groups (Color) ===== */}
			{imageGroups.map((group) => {
				const showInlineQty = tableGroups.length === 0;
				return (
					<div key={group.groupId}>
						<h3 className="font-semibold mb-3">
							{group.label} : <span className="text-orange-600 font-normal">{selectedLabel}</span>
						</h3>
						<div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2.5">
							{group.options.map((opt) => {
								const active = selections[group.groupId] === opt.id;
								return (
									<button
										key={opt.id}
										onClick={() => {
											setSelections((prev) => ({ ...prev, [group.groupId]: opt.id }));
											onVariantImageSelect?.(opt.image);
										}}
										className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
											active ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'
										}`}
										title={opt.value}
									>
										{opt.image ? (
											<Image src={opt.image} alt={opt.value} fill className="object-cover" sizes="80px" />
										) : (
											<span className="flex items-center justify-center h-full text-xs">{opt.value}</span>
										)}
										{active && (
											<span className="absolute top-0.5 right-0.5 bg-orange-500 rounded-full p-0.5">
												<Check size={10} className="text-white" />
											</span>
										)}
									</button>
								);
							})}
						</div>

						{showInlineQty &&
							(() => {
								const variant = resolveVariant(group.groupId, selections[group.groupId]);
								if (!variant) return null;
								const qty = selectedQty[variant.skuId] || 0;
								const stockNum = typeof variant.stock === 'number' ? variant.stock : Number(variant.stock) || 0;
								const outOfStock = stockNum <= 0;
								return (
									<div className="flex items-center justify-between mt-3 border rounded-lg px-4 py-3">
										<div className="text-sm">
											{getCurrencySymbol()}
											{variant.price} · stock {stockNum}
										</div>
										{qty === 0 ? (
											<button
												onClick={() => updateQty(variant.skuId, 'inc', stockNum)}
												disabled={outOfStock}
												className="px-3 py-1 rounded bg-orange-500 text-white text-xs font-medium disabled:opacity-40"
											>
												{outOfStock ? 'Sold out' : 'Add'}
											</button>
										) : (
											<div className="flex items-center gap-2">
												<button
													onClick={() => updateQty(variant.skuId, 'dec', stockNum)}
													className="w-6 h-6 flex items-center justify-center border rounded"
												>
													<Minus size={13} />
												</button>
												<span className="w-5 text-center font-medium text-orange-500">{qty}</span>
												<button
													onClick={() => updateQty(variant.skuId, 'inc', stockNum)}
													disabled={qty >= stockNum}
													className="w-6 h-6 flex items-center justify-center border rounded disabled:opacity-30"
												>
													<Plus size={13} />
												</button>
											</div>
										)}
									</div>
								);
							})()}
					</div>
				);
			})}

			{/* ===== Table-based groups (Size / Material...) ===== */}
			{tableGroups.map((group) => (
				<div key={group.groupId} className="w-full rounded-lg overflow-hidden border">
					<div className="grid grid-cols-3 px-4 py-2.5 text-gray-600 text-sm font-medium border-b bg-gray-50">
						<div>{group.label}</div>
						<div>Price</div>
						<div className="text-right">Quantity</div>
					</div>

					{group.options.map((opt) => {
						const variant = resolveVariant(group.groupId, opt.id);
						if (!variant) return null;

						const qty = selectedQty[variant.skuId] || 0;
						const stockNum = typeof variant.stock === 'number' ? variant.stock : Number(variant.stock) || 0;
						const outOfStock = stockNum <= 0;

						return (
							<div
								key={opt.id}
								className={`grid grid-cols-3 px-4 py-3 items-center border-b last:border-b-0 text-sm ${qty > 0 ? 'bg-orange-50' : ''}`}
							>
								<div className="font-medium flex items-center gap-1.5">
									{opt.value}
									{qty > 0 && <Check size={13} className="text-orange-400" />}
								</div>
								<div>
									{getCurrencySymbol()}
									{variant.price}
								</div>
								<div className="flex justify-end">
									{qty === 0 ? (
										<div className="flex flex-col items-end gap-0.5">
											<button
												onClick={() => updateQty(variant.skuId, 'inc', stockNum)}
												disabled={outOfStock}
												className="px-3 py-1 rounded bg-orange-500 text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
											>
												{outOfStock ? 'Sold out' : 'Add'}
											</button>
											{!outOfStock && <span className="text-[11px] text-gray-400">{stockNum}</span>}
										</div>
									) : (
										<div className="flex items-center gap-2">
											<button
												onClick={() => updateQty(variant.skuId, 'dec', stockNum)}
												className="w-6 h-6 flex items-center justify-center border rounded"
											>
												<Minus size={13} />
											</button>
											<span className="w-5 text-center font-medium text-orange-500">{qty}</span>
											<button
												onClick={() => updateQty(variant.skuId, 'inc', stockNum)}
												disabled={qty >= stockNum}
												className="w-6 h-6 flex items-center justify-center border rounded disabled:opacity-30"
											>
												<Plus size={13} />
											</button>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			))}

			{(product.variantGroups.length === 0 || product.variantOptions.length === 0) && (
				<div className="w-full rounded-lg overflow-hidden border p-4 bg-gray-50 flex items-center justify-between">
					<div className="text-sm font-medium">Quantity</div>
					<div className="flex items-center gap-2">
						{(() => {
							const qty = selectedQty[0] || 0;
							return qty === 0 ? (
								<button
									onClick={() => updateQty(0, 'inc', 9999)}
									className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
								>
									Add to Cart
								</button>
							) : (
								<div className="flex items-center gap-2 bg-white border rounded-lg p-1">
									<button
										onClick={() => updateQty(0, 'dec', 9999)}
										className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-slate-50"
									>
										<Minus size={14} />
									</button>
									<span className="w-6 text-center font-bold text-orange-500">{qty}</span>
									<button
										onClick={() => updateQty(0, 'inc', 9999)}
										className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-slate-50"
									>
										<Plus size={14} />
									</button>
								</div>
							);
						})()}
					</div>
				</div>
			)}

			{selectedSummary.length > 0 && (
				<div className="border rounded-lg p-3 space-y-2 bg-gray-50">
					<h4 className="text-sm font-semibold text-gray-700">Selected items</h4>
					{selectedSummary.map(({ variant, qty }) => (
						<div key={variant.skuId} className="flex items-center justify-between text-sm">
							<span>
								{variant.label} × {qty}
							</span>
							<span className="text-gray-600">
								{getCurrencySymbol()}
								{(variant.price * qty).toLocaleString()}
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
