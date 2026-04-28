'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { useState } from 'react';

interface Variant {
	price: string;
	stock: string;
	quantity: number;
	size_name: string;
}

interface Product {
	_id: string;
	moq: string | null;
	url: string;
	sold: string;
	image: string;
	is_ad: boolean;
	price: { unit: string; amount: string; currency: string; overseas: string };
	title: string;
	rating: string;
	offer_id: string;
	promotion: string | null;
	seller_icon: string | null;
	product_name: string;
}

interface CartItem {
	id: number;
	product: Product;
	quantity: Record<string, number>;
	variant: Variant[];
	total_price: number;
	added_at: string;
}

interface CartItemProps {
	item: CartItem;
	onRemove?: (itemId: number) => void;
	onUpdateQuantity?: (itemId: number, newQuantity: number) => void;
}

export function CartItemComponent({ item, onRemove, onUpdateQuantity }: CartItemProps) {
	const { id, product, variant, total_price } = item;
	const [isRemoving, setIsRemoving] = useState(false);
	const [isSaved, setIsSaved] = useState(false);

	const currentVariant = variant[0];
	const totalQuantity = Object.values(item.quantity).reduce((a, b) => a + b, 0);
	const priceAmount = parseFloat(product.price.amount);
	const unitPrice = (total_price / totalQuantity).toFixed(2);

	const handleRemoveItem = async () => {
		setIsRemoving(true);
		try {
			onRemove?.(id);
		} finally {
			setIsRemoving(false);
		}
	};

	const handleQuantityChange = (newQuantity: number) => {
		const validQuantity = Math.max(1, newQuantity);
		onUpdateQuantity?.(id, validQuantity);
	};

	const handleSaveForLater = () => {
		setIsSaved(!isSaved);
	};

	return (
		<Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/40 py-4 bg-gradient-to-br from-white to-slate-50">
			<CardContent className="py-0 px-4 md:px-6">
				<div className="flex gap-4 md:gap-6">
					{/* Product Image */}
					<div className="relative w-20 h-20 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-sm">
						<Image
							src={product.image || `/placeholder.svg?height=128&width=128`}
							alt={product.product_name}
							fill
							className="object-contain p-2 md:p-3 transition-transform duration-300 hover:scale-110"
						/>
					</div>

					{/* Product Details */}
					<div className="flex-1 min-w-0">
						<div className="flex justify-between items-start gap-3">
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="font-serif font-semibold text-sm md:text-lg text-foreground leading-tight truncate">{product.product_name}</h3>
									{product.rating && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">★ {product.rating}</span>}
								</div>
								<p className="text-muted-foreground text-xs md:text-sm line-clamp-2">{product.title}</p>
								{product.sold && <p className="text-xs text-green-600 font-medium mt-1">{product.sold}</p>}
								{currentVariant && (
									<p className="text-xs text-muted-foreground mt-1">
										Size: <span className="font-medium">{currentVariant.size_name}</span>
									</p>
								)}
							</div>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
								onClick={handleRemoveItem}
								disabled={isRemoving}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>

						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-4 pt-4 border-t border-border/30">
							{/* Quantity Controls */}
							<div className="flex items-center gap-2 md:gap-3">
								<span className="text-xs text-muted-foreground font-medium">Qty:</span>
								<div className="flex items-center border border-border rounded-lg bg-background">
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 hover:bg-secondary"
										onClick={() => handleQuantityChange(totalQuantity - 1)}
										disabled={totalQuantity <= 1}
									>
										<Minus className="w-3 h-3" />
									</Button>
									<Input
										type="number"
										value={totalQuantity}
										onChange={(e) => {
											const value = parseInt(e.target.value) || 1;
											handleQuantityChange(Math.max(1, value));
										}}
										className="w-12 h-8 text-center border-0 bg-transparent focus:ring-0 text-sm font-semibold no-spinner"
										min="1"
									/>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 hover:bg-secondary"
										onClick={() => handleQuantityChange(totalQuantity + 1)}
									>
										<Plus className="w-3 h-3" />
									</Button>
								</div>

								<Button
									variant="ghost"
									size="sm"
									className={`text-xs md:text-sm transition-colors  ${isSaved ? 'text-orange-300 hover:text-orange-300' : 'text-muted-foreground hover:text-orange-300'}`}
									onClick={handleSaveForLater}
								>
									<Heart className={`w-4 h-4 mr-1 ${isSaved ? 'fill-current' : ''}`} />
								</Button>
							</div>

							{/* Price Section */}
							<div className="text-right">
								<div className="font-bold text-lg md:text-xl text-primary">
									{product.price.currency}
									{total_price.toFixed(2)}
								</div>
								<div className="text-xs text-muted-foreground">
									{product.price.currency}
									{unitPrice} each
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
