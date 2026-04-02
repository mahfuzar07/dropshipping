'use client';

import { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Color {
	name: string;
	image: string;
}

interface ProductInfoProps {
	product: {
		id: number;
		name: string;
		price: number;
		description: string;
		inStock: boolean;
		stockCount: number;
		image: string;
		colors: Color[];
		sizes: string[];
		rating: number;
		reviewCount: number;
		selectedColorIndex: number;
		setSelectedColorIndex: (index: number) => void;
	};
}

const sizes = [
	{ size: 'S', price: 29568, stock: 12 },
	{ size: 'M', price: 29568, stock: 15 },
	{ size: 'L', price: 29568, stock: 0 },
];
export default function ProductInfo({ product }: ProductInfoProps) {
	const [qty, setQty] = useState<{ [key: string]: number }>({
		S: 0,
		M: 0,
		L: 0,
	});
	const [isFavorite, setIsFavorite] = useState(false);

	const updateQty = (key: string, type: 'inc' | 'dec', stock: number) => {
		setQty((prev) => {
			const current = prev[key];

			if (type === 'inc' && current < stock) {
				return { ...prev, [key]: current + 1 };
			}
			if (type === 'dec' && current > 0) {
				return { ...prev, [key]: current - 1 };
			}
			return prev;
		});
	};

	return (
		<div className="space-y-6">
			<h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

			{/* Rating */}

			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex items-center">
						{[...Array(5)].map((_, i) => (
							<Star key={i} className={`h-4 w-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
						))}
					</div>
					<span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
				</div>
				<div className="flex items-center gap-2 ">
					<Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
						<Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
					</Button>

					<Button variant="outline" size="icon">
						<Share2 className="h-5 w-5" />
					</Button>
				</div>
			</div>

			{/* Price */}
			<div className="text-3xl font-bold">${product.price}</div>

			{/* Description */}
			<p className="text-muted-foreground">{product.description}</p>

			{/* Stock */}
			<div className="flex items-center gap-2">
				<div className={`h-2 w-2 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
				<span className={`${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
					{product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
				</span>
			</div>

			{/* Color Selection */}
			<div>
				<h3 className="font-semibold mb-2">Select Color: {product.colors[product.selectedColorIndex]?.name}</h3>
				<div className="flex gap-3 items-center">
					{product.colors.map((color, index) => (
						<button
							key={color.name}
							onClick={() => product.setSelectedColorIndex(index)}
							className={`w-9 h-9 rounded-full border-2 ${product.selectedColorIndex === index ? 'border-black' : 'border-gray-300'}`}
							style={{
								backgroundImage: `url(${color.image})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						/>
					))}
				</div>
			</div>

			{/* Quantity */}
			<div className="w-full rounded-lg overflow-hidden border">
				{/* Header */}
				<div className="grid grid-cols-4 px-6 py-3 text-gray-600 font-medium border-b">
					<div>Size</div>
					<div>Price</div>
					<div>Stock</div>
					<div className="text-right">Quantity</div>
				</div>

				{/* Rows */}
				{sizes.map((item) => (
					<div key={item.size} className="grid grid-cols-4 px-6 py-4 items-center border-b last:border-none text-md">
						<div className="font-medium">{item.size}</div>

						<div>{item.price}</div>

						<div>{item.stock}</div>

						{/* Quantity */}
						<div className="flex justify-end items-center gap-3">
							<button
								onClick={() => updateQty(item.size, 'dec', item.stock)}
								className="w-6 h-6 flex items-center justify-center rounded-md border bg-white disabled:opacity-40"
								disabled={qty[item.size] === 0}
							>
								<Minus size={14} />
							</button>

							<span className="w-6 text-center">{qty[item.size]}</span>

							<button
								onClick={() => updateQty(item.size, 'inc', item.stock)}
								className={`w-6 h-6 flex items-center justify-center rounded-md border ${
									item.stock === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
								}`}
								disabled={item.stock === 0}
							>
								<Plus size={14} />
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
