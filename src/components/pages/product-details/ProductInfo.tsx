// 'use client';

// import { useState, useEffect } from 'react';
// import { Star, Heart, Share2, Minus, Plus } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { getCurrencySymbol } from '@/lib/utils/formatCurrency';

// interface Color {
// 	name: string;
// 	image: string;
// }

// interface VariantSize {
// 	size_name: string;
// 	price: string;
// 	stock: string;
// }

// interface Variant {
// 	color_name: string;
// 	image: string;
// 	sizes: VariantSize[];
// }

// interface ProductInfoProps {
// 	product: {
// 		id: string;
// 		name: string;
// 		price: number;
// 		overseas: string;
// 		currency: string;
// 		solded: string;
// 		description: string;
// 		inStock: boolean;
// 		stockCount: number | null;
// 		image: string;

// 		colors: Color[];
// 		variants: Variant[];

// 		rating: number;
// 		reviewCount: number;

// 		selectedColorIndex: number;
// 		setSelectedColorIndex: (index: number) => void;
// 	};
// 	qty: Record<string, number>;
// 	setQty: React.Dispatch<React.SetStateAction<Record<string, number>>>;
// }

// export default function ProductInfo({ product, qty, setQty }: ProductInfoProps) {
// 	const [selectedSize, setSelectedSize] = useState<string | null>(null);
// 	// const [qty, setQty] = useState<Record<string, number>>({});
// 	const [isFavorite, setIsFavorite] = useState(false);

// 	const selectedVariant = product.variants[product.selectedColorIndex];

// 	/* 🔥 reset size when color changes */
// 	useEffect(() => {
// 		setSelectedSize(null);
// 		setQty({});
// 	}, [product.selectedColorIndex]);

// 	const updateQty = (size: string, type: 'inc' | 'dec', stock: number) => {
// 		setQty((prev) => {
// 			const current = prev[size] || 0;

// 			if (type === 'inc' && current < stock) {
// 				return { ...prev, [size]: current + 1 };
// 			}
// 			if (type === 'dec' && current > 0) {
// 				return { ...prev, [size]: current - 1 };
// 			}
// 			return prev;
// 		});
// 	};

// 	return (
// 		<div className="space-y-5">
// 			<h1 className="text-3xl lg:text-2xl font-semibold font-hanken">{product.name}</h1>

// 			{/* Rating */}
// 			<div className="flex items-center justify-between">
// 				<div className="flex items-center gap-2">
// 					<div className="flex items-center gap-2">
// 						<div className="flex items-center">
// 							{[...Array(5)].map((_, i) => (
// 								<Star key={i} className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
// 							))}
// 						</div>
// 						<span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
// 					</div>
// 					<p className="text-muted-foreground border-l pl-2">{product.solded}</p>
// 				</div>

// 				<div className="flex gap-2">
// 					<Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
// 						<Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
// 					</Button>

// 					<Button variant="outline" size="icon">
// 						<Share2 className="h-5 w-5" />
// 					</Button>
// 				</div>
// 			</div>

// 			{/* 🔥 Dynamic Price */}
// 			<div className="text-4xl font-bold font-hanken">
// 				{getCurrencySymbol()}
// 				{selectedSize ? selectedVariant?.sizes.find((s) => s.size_name === selectedSize)?.price : product.price}
// 			</div>

// 			{/* Color */}
// 			<div>
// 				<h3 className="font-semibold mb-2">Color: {selectedVariant?.color_name}</h3>

// 				<div className="flex gap-3">
// 					{product.colors.map((color, index) => (
// 						<button
// 							key={color.name}
// 							onClick={() => product.setSelectedColorIndex(index)}
// 							className={`w-9 h-9 rounded-full border-2 ${product.selectedColorIndex === index ? 'border-black' : 'border-gray-300'}`}
// 							style={{
// 								backgroundImage: `url(${color.image})`,
// 								backgroundSize: 'cover',
// 							}}
// 						/>
// 					))}
// 				</div>
// 			</div>

// 			{/* 🔥 Dynamic Size Table */}
// 			<div className="w-full rounded-lg overflow-hidden border">
// 				<div className="grid grid-cols-4 px-6 py-3 text-gray-600 font-medium border-b">
// 					<div>Size</div>
// 					<div>Price</div>
// 					<div>Stock</div>
// 					<div className="text-right">Qty</div>
// 				</div>

// 				{selectedVariant?.sizes?.map((item) => {
// 					const stock = Number(item.stock || 10);

// 					return (
// 						<div
// 							key={item.size_name}
// 							className={`grid grid-cols-4 px-6 py-3 items-center border-b ${selectedSize === item.size_name ? 'bg-gray-50' : ''}`}
// 						>
// 							<div className="font-medium cursor-pointer" onClick={() => setSelectedSize(item.size_name)}>
// 								{item.size_name}
// 							</div>

// 							<div>{item.price}</div>

// 							<div>{stock}</div>

// 							<div className="flex justify-end items-center gap-3">
// 								<button onClick={() => updateQty(item.size_name, 'dec', stock)} className="w-6 h-6 flex items-center justify-center border rounded">
// 									<Minus size={14} />
// 								</button>

// 								<span className="w-6 text-center">{qty[item.size_name] || 0}</span>

// 								<button onClick={() => updateQty(item.size_name, 'inc', stock)} className="w-6 h-6 flex items-center justify-center border rounded">
// 									<Plus size={14} />
// 								</button>
// 							</div>
// 						</div>
// 					);
// 				})}
// 			</div>
// 		</div>
// 	);
// }

'use client';

import { Star, Heart, Share2, Minus, Plus, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getCurrencySymbol } from '@/lib/utils/formatCurrency';

interface Color {
	name: string;
	image: string;
}

interface VariantSize {
	size_name: string;
	price: string;
	stock: string;
}

interface Variant {
	color_name: string;
	image: string;
	sizes: VariantSize[];
	weightKg?: number;
}

interface ProductInfoProps {
	product: {
		id: string;
		name: string;
		price: number;
		overseas: string;
		currency: string;
		solded: string;
		description: string;
		inStock: boolean;
		stockCount: number | null;
		image: string;
		colors: Color[];
		variants: Variant[];
		rating: number;
		reviewCount: number;
	};
	// key = colorIndex, value = { [size_name]: qty }
	selectedColorQty: Record<number, Record<string, number>>;
	updateColorQty: (colorIndex: number, size: string, type: 'inc' | 'dec', stock: number) => void;
}

export default function ProductInfo({ product, selectedColorQty, updateColorQty }: ProductInfoProps) {
	const [isFavorite, setIsFavorite] = useState(false);
	// which color panel is expanded
	const [expandedColor, setExpandedColor] = useState<number>(0);

	// colors that have at least one qty > 0
	const selectedColorIndexes = Object.keys(selectedColorQty)
		.map(Number)
		.filter((i) => Object.values(selectedColorQty[i] || {}).some((q) => q > 0));

	const totalQty = Object.values(selectedColorQty).reduce((sum, sizeMap) => {
		return sum + Object.values(sizeMap).reduce((s, q) => s + q, 0);
	}, 0);

	return (
		<div className="space-y-5">
			<h1 className="text-3xl lg:text-2xl font-semibold font-hanken">{product.name}</h1>

			{/* Rating */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						<div className="flex items-center">
							{[...Array(5)].map((_, i) => (
								<Star key={i} className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
							))}
						</div>
						<span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
					</div>
					<p className="text-muted-foreground border-l pl-2">{product.solded}</p>
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

			{/* Price + total qty badge */}
			<div className="flex items-center gap-3">
				<div className="text-4xl font-bold font-hanken">
					{getCurrencySymbol()}
					{product.price}
				</div>
				{totalQty > 0 && (
					<span className="bg-orange-100 text-orange-600 text-sm font-medium px-3 py-1 rounded-full">
						{totalQty} item{totalQty > 1 ? 's' : ''} selected
					</span>
				)}
			</div>

			{/* Color tabs — click to expand that color's size table */}
			<div>
				<h3 className="font-semibold mb-3">Colors</h3>
				<div className="flex gap-3 flex-wrap">
					{product.colors.map((color, index) => {
						const hasQty = selectedColorIndexes.includes(index);
						const colorTotalQty = Object.values(selectedColorQty[index] || {}).reduce((s, q) => s + q, 0);

						return (
							<button
								key={color.name}
								onClick={() => setExpandedColor(expandedColor === index ? -1 : index)}
								className={`relative w-10 h-10 rounded-full border-2 transition-all ${
									expandedColor === index ? 'border-black scale-110' : hasQty ? 'border-orange-400' : 'border-gray-300'
								}`}
								style={{
									backgroundImage: `url(${color.image})`,
									backgroundSize: 'cover',
								}}
								title={color.name}
							>
								{/* qty badge on color swatch */}
								{colorTotalQty > 0 && (
									<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
										{colorTotalQty}
									</span>
								)}
							</button>
						);
					})}
				</div>

				{/* Color name label */}
				{expandedColor >= 0 && (
					<p className="text-sm text-gray-500 mt-2">
						Viewing: <span className="font-medium text-gray-800">{product.variants[expandedColor]?.color_name}</span>
					</p>
				)}
			</div>

			{/* Size table — shows for the expanded color */}
			{expandedColor >= 0 && product.variants[expandedColor] && (
				<div className="w-full rounded-lg overflow-hidden border">
					<div className="grid grid-cols-4 px-6 py-3 text-gray-600 font-medium border-b bg-gray-50">
						<div>Size</div>
						<div>Price</div>
						<div>Stock</div>
						<div className="text-right">Qty</div>
					</div>

					{product.variants[expandedColor].sizes.map((item) => {
						const stock = Number(item.stock || 0);
						const currentQty = selectedColorQty[expandedColor]?.[item.size_name] || 0;

						return (
							<div
								key={item.size_name}
								className={`grid grid-cols-4 px-6 py-3 items-center border-b transition-colors ${currentQty > 0 ? 'bg-orange-50' : ''}`}
							>
								<div className="font-medium flex items-center gap-1.5">
									{item.size_name}
									{currentQty > 0 && <Check size={13} className="text-orange-400" />}
								</div>

								<div>{item.price}</div>

								<div className={stock === 0 ? 'text-red-400' : ''}>{stock}</div>

								<div className="flex justify-end items-center gap-3">
									<button
										onClick={() => updateColorQty(expandedColor, item.size_name, 'dec', stock)}
										disabled={currentQty === 0}
										className="w-6 h-6 flex items-center justify-center border rounded disabled:opacity-30"
									>
										<Minus size={14} />
									</button>

									<span className={`w-6 text-center font-medium ${currentQty > 0 ? 'text-orange-500' : ''}`}>{currentQty}</span>

									<button
										onClick={() => updateColorQty(expandedColor, item.size_name, 'inc', stock)}
										disabled={currentQty >= stock}
										className="w-6 h-6 flex items-center justify-center border rounded disabled:opacity-30"
									>
										<Plus size={14} />
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Summary of all selected variants */}
			{selectedColorIndexes.length > 0 && (
				<div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 space-y-1.5">
					<p className="text-sm font-semibold text-orange-700">Selected summary</p>
					{selectedColorIndexes.map((colorIndex) => {
						const variant = product.variants[colorIndex];
						const sizeMap = selectedColorQty[colorIndex];

						return Object.entries(sizeMap).map(
							([sizeName, qty]) =>
								qty > 0 && (
									<div key={`${colorIndex}-${sizeName}`} className="flex justify-between text-sm text-orange-600">
										<span>
											{variant.color_name} / {sizeName}
										</span>
										<span className="font-medium">× {qty}</span>
									</div>
								),
						);
					})}
				</div>
			)}
		</div>
	);
}
