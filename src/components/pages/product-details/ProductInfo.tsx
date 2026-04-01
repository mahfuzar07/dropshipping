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

export default function ProductInfo({ product }: ProductInfoProps) {
	// ✅ States
	const [quantity, setQuantity] = useState(1);
	const [isFavorite, setIsFavorite] = useState(false);

	// ✅ Handlers
	const increaseQuantity = () => {
		if (quantity < product.stockCount) {
			setQuantity((prev) => prev + 1);
		}
	};

	const decreaseQuantity = () => {
		if (quantity > 1) {
			setQuantity((prev) => prev - 1);
		}
	};

	const handleAddToCart = () => {
		console.log('Added to cart:', {
			productId: product.id,
			quantity,
			color: product.colors[product.selectedColorIndex]?.name,
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
			<div className="flex items-center gap-4">
				<span>Quantity:</span>
				<div className="flex items-center border rounded-lg">
					<Button variant="ghost" size="icon" onClick={decreaseQuantity}>
						<Minus className="h-4 w-4" />
					</Button>

					<span className="px-4">{quantity}</span>

					<Button variant="ghost" size="icon" onClick={increaseQuantity} disabled={quantity >= product.stockCount}>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
