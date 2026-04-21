'use client';

import { useState, useEffect } from 'react';
import { Star, Heart, Share2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

		selectedColorIndex: number;
		setSelectedColorIndex: (index: number) => void;
	};
	qty: Record<string, number>;
	setQty: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export default function ProductInfo({ product, qty, setQty }: ProductInfoProps) {
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	// const [qty, setQty] = useState<Record<string, number>>({});
	const [isFavorite, setIsFavorite] = useState(false);

	const selectedVariant = product.variants[product.selectedColorIndex];

	/* 🔥 reset size when color changes */
	useEffect(() => {
		setSelectedSize(null);
		setQty({});
	}, [product.selectedColorIndex]);

	const updateQty = (size: string, type: 'inc' | 'dec', stock: number) => {
		setQty((prev) => {
			const current = prev[size] || 0;

			if (type === 'inc' && current < stock) {
				return { ...prev, [size]: current + 1 };
			}
			if (type === 'dec' && current > 0) {
				return { ...prev, [size]: current - 1 };
			}
			return prev;
		});
	};

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

			{/* 🔥 Dynamic Price */}
			<div className="text-4xl font-bold">
				{product.currency}
				{selectedSize ? selectedVariant?.sizes.find((s) => s.size_name === selectedSize)?.price : product.price}
			</div>
			<div className="font-semibold text-foreground">
				Overseas price : {selectedSize ? selectedVariant?.sizes.find((s) => s.size_name === selectedSize)?.price : product.overseas}
			</div>

			{/* Color */}
			<div>
				<h3 className="font-semibold mb-2">Color: {selectedVariant?.color_name}</h3>

				<div className="flex gap-3">
					{product.colors.map((color, index) => (
						<button
							key={color.name}
							onClick={() => product.setSelectedColorIndex(index)}
							className={`w-9 h-9 rounded-full border-2 ${product.selectedColorIndex === index ? 'border-black' : 'border-gray-300'}`}
							style={{
								backgroundImage: `url(${color.image})`,
								backgroundSize: 'cover',
							}}
						/>
					))}
				</div>
			</div>

			{/* 🔥 Dynamic Size Table */}
			<div className="w-full rounded-lg overflow-hidden border">
				<div className="grid grid-cols-4 px-6 py-3 text-gray-600 font-medium border-b">
					<div>Size</div>
					<div>Price</div>
					<div>Stock</div>
					<div className="text-right">Qty</div>
				</div>

				{selectedVariant?.sizes?.map((item) => {
					const stock = Number(item.stock || 10);

					return (
						<div
							key={item.size_name}
							className={`grid grid-cols-4 px-6 py-3 items-center border-b ${selectedSize === item.size_name ? 'bg-gray-50' : ''}`}
						>
							<div className="font-medium cursor-pointer" onClick={() => setSelectedSize(item.size_name)}>
								{item.size_name}
							</div>

							<div>{item.price}</div>

							<div>{stock}</div>

							<div className="flex justify-end items-center gap-3">
								<button onClick={() => updateQty(item.size_name, 'dec', stock)} className="w-6 h-6 flex items-center justify-center border rounded">
									<Minus size={14} />
								</button>

								<span className="w-6 text-center">{qty[item.size_name] || 0}</span>

								<button onClick={() => updateQty(item.size_name, 'inc', stock)} className="w-6 h-6 flex items-center justify-center border rounded">
									<Plus size={14} />
								</button>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
