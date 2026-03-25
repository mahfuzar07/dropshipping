'use client';

import { useEffect, useRef } from 'react';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { useCartStore } from '@/z-store/customers/useCartStore';

export default function CartDrawer() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const { items, removeFromCart, incrementQuantity, decrementQuantity, updateCartQuantity } = useCartStore();

	const handleClose = () => {
		closeDrawer();
	};
	const prevItemsLength = useRef(items.length);

	useEffect(() => {
		if (prevItemsLength.current === 1 && items.length === 0 && isDrawerOpen) {
			closeDrawer();
		}
		prevItemsLength.current = items.length;
	}, [items, isDrawerOpen, closeDrawer]);

	const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

	return (
		<Drawer open={isDrawerOpen} onOpenChange={handleClose} direction="right">
			<DrawerContent className="h-full w-[400px] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between border-b px-4 py-4">
					<DrawerTitle className="font-semibold flex items-center gap-2 font-serif text-lg text-foreground">
						<ShoppingCart className="w-6 h-6" />
						Shopping Cart
					</DrawerTitle>
					<Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0 hover:bg-gray-100">
						<X className="h-4 w-4" />
					</Button>
				</div>

				{/* Cart Items */}
				<div className="flex-1 overflow-y-auto pb-4 px-1">
					{items.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full text-center p-6">
							<div className="grayscale-[10%] relative h-[100px] aspect-square">
								<Image src="/assets/product/cart/empty-cart.png" alt="Empty Cart" fill className="invert-[65%]" />
							</div>

							<p className="mt-4 text-gray-400 font-medium">No products in the cart.</p>
							<Button className="mt-8 bg-twinkle-accent hover:bg-twinkle-accent/80 text-white">RETURN TO SHOP</Button>
						</div>
					) : (
						<div className="space-y-0.5 overflow-hidden">
							<AnimatePresence>
								{items.map((item, index) => (
									<motion.div
										key={item.id}
										layout
										initial={{ opacity: 0, x: 100 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
										transition={{ delay: index * 0.1, type: 'spring', stiffness: 600, damping: 50 }}
									>
										<Card className="overflow-hidden hover:bg-slate-50 transition-all duration-300 py-3 rounded border-none shadow-xs">
											<CardContent className="py-0 px-2">
												<div className="flex gap-3">
													{/* Product Image */}
													<div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
														<Image
															src={item.image || `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(item.name)}`}
															alt={item.name}
															fill
															className="object-contain p-1 transition-transform duration-300 hover:scale-105"
														/>
													</div>

													{/* Product Details */}
													<div className="flex-1 min-w-0">
														<div className="flex justify-between items-start mb-2">
															<div className="mt-1">
																<h3 className="font-semibold text-md text-foreground leading-tight">{item.name}</h3>
																<p className="text-muted-foreground text-xs mt-1 line-clamp-2">{item.description}</p>
															</div>
															<Button
																variant="ghost"
																size="sm"
																className="text-muted-foreground hover:text-destructive transition-colors"
																onClick={() => removeFromCart(item.id)}
															>
																<Trash2 className="w-4 h-4" />
															</Button>
														</div>

														{/* Price and Quantity Controls */}
														<div className="flex items-center justify-between mt-4">
															<div className="flex items-center gap-3">
																{/* Quantity Controls */}
																<div className="flex items-center border border-border rounded-lg">
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 p-0 hover:bg-secondary"
																		onClick={() => decrementQuantity(item.id)}
																		disabled={item.quantity <= 1}
																	>
																		<Minus className="w-3 h-3" />
																	</Button>
																	<Input
																		type="number"
																		value={item.quantity}
																		onChange={(e) => {
																			const value = parseInt(e.target.value, 10);
																			if (!isNaN(value) && value > 0) {
																				updateCartQuantity(item.id, value);
																			}
																		}}
																		className="w-16 h-6 text-center border-0 bg-transparent focus:ring-0 text-sm font-medium no-spinner"
																		min="1"
																	/>
																	<Button
																		variant="ghost"
																		size="sm"
																		className="h-6 w-6 p-0 hover:bg-secondary"
																		onClick={() => incrementQuantity(item.id)}
																	>
																		<Plus className="w-3 h-3" />
																	</Button>
																</div>
															</div>

															{/* Price */}
															<div className="text-right">
																<div className="font-medium text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</div>
																{item.quantity > 1 && <div className="text-xs text-muted-foreground">${item.price.toFixed(2)} each</div>}
															</div>
														</div>
													</div>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								))}
							</AnimatePresence>
						</div>
					)}
				</div>

				{/* Footer */}
				{items.length > 0 && (
					<div className="border-t px-6 py-3 space-y-4">
						<div className="flex justify-between items-center">
							<span className="text-foreground text-lg font-medium">Subtotal:</span>
							<span className="text-lg font-medium">৳{subtotal.toLocaleString()}.00</span>
						</div>

						<div className="space-y-3">
							<Button variant="outline" className="w-full bg-transparent" onClick={handleClose} asChild>
								<Link href="/cart">VIEW CART</Link>
							</Button>

							<Button
								asChild
								onClick={handleClose}
								className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 text-sm group"
							>
								<Link href="/checkout">
									Proceed to Checkout
									<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
								</Link>
							</Button>
						</div>
					</div>
				)}
			</DrawerContent>
		</Drawer>
	);
}
