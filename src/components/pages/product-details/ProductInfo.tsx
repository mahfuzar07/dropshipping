'use client';

import { Star, Heart, Share2, Minus, Plus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
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

const VISIBLE_ROWS = 5; // rows shown collapsed
const ROW_HEIGHT = 65; // approx px height of one row (used to cap scroll container)
const MAX_SCROLL_ROWS = 10; // rows visible after expanding; beyond this it scrolls

export default function ProductInfo({ product, selectedQty, updateQty, onVariantImageSelect }: ProductInfoProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [activeSkuId, setActiveSkuId] = useState<number | null>(null);
	const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

	const markImageLoaded = (skuId: number) => {
		setLoadedImages((prev) => (prev[skuId] ? prev : { ...prev, [skuId]: true }));
	};

	// the group that carries images (e.g. "Color") — used for the thumbnail column
	const imageGroup = product.variantGroups.find((g) => g.hasImages);

	// first column header: the image group's label if present, otherwise the first group's label, otherwise "Variant"
	const firstColumnLabel = imageGroup?.label || product.variantGroups[0]?.label || 'Variant';

	const getRowImage = (variant: VariantOption) => {
		if (!imageGroup) return undefined;
		const optId = variant.selections[imageGroup.groupId];
		return imageGroup.options.find((o) => o.id === optId)?.image;
	};

	const totalQty = Object.values(selectedQty).reduce((s, q) => s + q, 0);

	const rows = product.variantOptions;

	// The top-level product.price can be stale/inconsistent with actual SKU prices
	// (seen in real data: item.price = 52.36 while all skus.sku[].price = 68-69).
	// Always derive the displayed price from the variant rows when they exist,
	// so the number shown up top always matches what's in the table below.
	const variantPrices = rows.map((v) => v.price).filter((p) => typeof p === 'number' && !Number.isNaN(p));
	const minPrice = variantPrices.length ? Math.min(...variantPrices) : product.price;
	const maxPrice = variantPrices.length ? Math.max(...variantPrices) : product.price;
	const hasPriceRange = minPrice !== maxPrice;

	const hasMore = rows.length > VISIBLE_ROWS;
	const visibleRows = isExpanded ? rows : rows.slice(0, VISIBLE_ROWS);
	const needsScroll = isExpanded && rows.length > MAX_SCROLL_ROWS;

	const selectedSummary = Object.entries(selectedQty)
		.filter(([, qty]) => qty > 0)
		.map(([skuId, qty]) => {
			const variant = product.variantOptions.find((v) => v.skuId === Number(skuId));
			return variant ? { variant, qty } : null;
		})
		.filter(Boolean) as { variant: VariantOption; qty: number }[];

	const handleRowImageClick = (variant: VariantOption) => {
		setActiveSkuId(variant.skuId);
		onVariantImageSelect?.(getRowImage(variant));
	};

	return (
		<div className="space-y-5">
			<h1 className="text-xl lg:text-2xl font-semibold font-hanken">{product.name}</h1>

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{product.rating > 0 && (
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
							))}
						</div>
					)}
					<span className="text-sm text-muted-foreground">
						({product.reviewCount || 0} review{product.reviewCount === 1 ? '' : 's'})
					</span>
					<p className="text-muted-foreground border-l pl-2">{product.solded ?? 0} sold</p>
				</div>
				<div className="flex gap-2">
					<Button type="button" variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} aria-label="Add to favorites">
						<Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
					</Button>
					<Button type="button" variant="outline" size="icon" aria-label="Share product">
						<Share2 className="h-5 w-5" />
					</Button>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="text-3xl font-bold font-hanken text-orange-600">
					{hasPriceRange ? (
						<>
							{getCurrencySymbol()}
							{minPrice.toLocaleString()} - {getCurrencySymbol()}
							{maxPrice.toLocaleString()}
						</>
					) : (
						<>
							{getCurrencySymbol()}
							{minPrice.toLocaleString()}
						</>
					)}
				</div>
				{totalQty > 0 && (
					<span className="bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 rounded-full">
						{totalQty} item{totalQty > 1 ? 's' : ''} selected
					</span>
				)}
			</div>

			{/* ===== Single combined variant table: image + attribute + price + stock + qty ===== */}
			{rows.length > 0 ? (
				<div className="w-full rounded-lg overflow-hidden border">
					<div className="grid grid-cols-[2.2fr_0.9fr_0.7fr_1.4fr] px-4 py-2.5 text-gray-600 text-sm font-medium border-b bg-gray-50">
						<div>{firstColumnLabel}</div>
						<div>Price</div>
						<div>Stock</div>
						<div className="text-right">Quantity</div>
					</div>

					<div className={needsScroll ? 'overflow-y-auto' : ''} style={needsScroll ? { maxHeight: ROW_HEIGHT * MAX_SCROLL_ROWS } : undefined}>
						{visibleRows.map((variant) => {
							const image = getRowImage(variant);
							const qty = selectedQty[variant.skuId] || 0;
							const stockNum = typeof variant.stock === 'number' ? variant.stock : Number(variant.stock) || 0;
							const outOfStock = stockNum <= 0;
							const active = activeSkuId === variant.skuId;

							return (
								<div
									key={variant.skuId}
									className={`grid grid-cols-[2.2fr_0.9fr_0.7fr_1.4fr] px-4 py-3 items-center border-b last:border-b-0 text-sm ${qty > 0 ? 'bg-orange-50' : ''}`}
								>
									<div className="flex items-center gap-2.5 min-w-0">
										{image && (
											<button
												type="button"
												onClick={() => handleRowImageClick(variant)}
												aria-label={`View ${variant.label} image`}
												className={`relative w-10 h-10 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
													active ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'
												}`}
											>
												{!loadedImages[variant.skuId] && <span className="absolute inset-0 bg-gray-200 animate-pulse" />}
												<Image
													src={image}
													alt={variant.label}
													fill
													className={`object-cover transition-opacity duration-300 p-0.5 ${loadedImages[variant.skuId] ? 'opacity-100' : 'opacity-0'}`}
													sizes="40px"
													onLoad={() => markImageLoaded(variant.skuId)}
												/>
											</button>
										)}
										<span className="font-medium truncate" title={variant.label}>
											{variant.label}
										</span>
									</div>
									<div className="font-play font-semibold">
										{getCurrencySymbol()}
										{variant.price}
									</div>
									<div className="text-gray-500">{stockNum}</div>
									<div className="flex justify-end">
										{qty === 0 ? (
											<button
												type="button"
												onClick={() => updateQty(variant.skuId, 'inc', stockNum)}
												disabled={outOfStock}
												className="px-3 py-1 rounded bg-orange-500 text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
											>
												{outOfStock ? 'Sold out' : 'Add'}
											</button>
										) : (
											<div className="flex items-center gap-2">
												<button
													type="button"
													onClick={() => updateQty(variant.skuId, 'dec', stockNum)}
													aria-label="Decrease quantity"
													className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50"
												>
													<Minus size={13} />
												</button>
												<span className="w-5 text-center font-medium text-orange-500">{qty}</span>
												<button
													type="button"
													onClick={() => updateQty(variant.skuId, 'inc', stockNum)}
													disabled={qty >= stockNum}
													aria-label="Increase quantity"
													className="w-6 h-6 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
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

					{hasMore && (
						<button
							type="button"
							onClick={() => setIsExpanded((prev) => !prev)}
							className="w-full flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-orange-600 hover:bg-orange-50 border-t transition-colors"
						>
							{isExpanded ? 'Show Less' : 'Show More'}
							<ChevronDown size={15} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
						</button>
					)}
				</div>
			) : (
				<div className="w-full rounded-lg overflow-hidden border p-4 bg-gray-50 flex items-center justify-between">
					<div className="text-sm font-medium">Quantity</div>
					<div className="flex items-center gap-2">
						{(() => {
							const qty = selectedQty[0] || 0;
							return qty === 0 ? (
								<button
									type="button"
									onClick={() => updateQty(0, 'inc', 9999)}
									className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
								>
									Add to Cart
								</button>
							) : (
								<div className="flex items-center gap-2 bg-white border rounded-lg p-1">
									<button
										type="button"
										onClick={() => updateQty(0, 'dec', 9999)}
										aria-label="Decrease quantity"
										className="w-8 h-8 flex items-center justify-center border rounded-md hover:bg-slate-50"
									>
										<Minus size={14} />
									</button>
									<span className="w-6 text-center font-bold text-orange-500">{qty}</span>
									<button
										type="button"
										onClick={() => updateQty(0, 'inc', 9999)}
										aria-label="Increase quantity"
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
