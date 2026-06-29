'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export interface Review {
	id: string;
	author: string;
	avatar?: string;
	rating: number;
	verified: boolean;
	date: string;
	title: string;
	content: string;
}

export interface ProductTabsProps {
	description: string;
	specifications: { [key: string]: string };
	reviews: Review[];
}

// Strip tracking pixels and hidden elements from HTML
function sanitizeDescription(html: string): string {
	return (
		html
			// remove <img> tags with display:none (tracking pixels)
			.replace(/<img[^>]+style\s*=\s*["'][^"']*display\s*:\s*none[^"']*["'][^>]*>/gi, '')
			// remove empty divs like <div id="offer-template-0"></div>
			.replace(/<div[^>]*>\s*<\/div>/gi, '')
			// remove tracking script src domains
			.replace(/<img[^>]+src=["']https?:\/\/www\.o0b\.cn[^"']*["'][^>]*>/gi, '')
	);
}

export default function ProductTabs({ description, specifications, reviews }: ProductTabsProps) {
	const [activeTab, setActiveTab] = useState('description');

	const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

	const cleanDescription = sanitizeDescription(description ?? '');

	return (
		<div className="w-full">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-2 mb-8">
					<TabsTrigger value="description" className="text-base font-medium">
						Description
					</TabsTrigger>
					<TabsTrigger value="reviews" className="text-base font-medium">
						Reviews ({reviews.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="description" className="space-y-6">
					{/* HTML Description */}
					{cleanDescription ? (
						<div
							className="prose prose-gray max-w-none [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2"
							dangerouslySetInnerHTML={{ __html: cleanDescription }}
						/>
					) : (
						<p className="text-muted-foreground">No description available.</p>
					)}

					{/* Specifications */}
					{Object.keys(specifications).length > 0 && (
						<div>
							<h3 className="text-xl font-semibold mb-4">Specifications</h3>
							<div className="grid grid-cols-1 gap-0">
								{Object.entries(specifications).map(([key, value]) => (
									<div key={key} className="flex justify-between py-2 border-b border-border">
										<span className="font-medium text-foreground">{key}:</span>
										<span className="text-muted-foreground text-right max-w-[60%]">{value}</span>
									</div>
								))}
							</div>
						</div>
					)}
				</TabsContent>

				<TabsContent value="reviews" className="space-y-6">
					{reviews.length > 0 ? (
						<>
							{/* Reviews Summary */}
							<div className="bg-card p-6 rounded-lg border">
								<div className="flex items-center gap-4 mb-4">
									<div className="text-center">
										<div className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
										<div className="flex items-center justify-center mb-1">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`h-4 w-4 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
												/>
											))}
										</div>
										<div className="text-sm text-muted-foreground">Based on {reviews.length} reviews</div>
									</div>
								</div>
							</div>

							{/* Individual Reviews */}
							<div className="space-y-6">
								{reviews.map((review) => (
									<div key={review.id} className="border-b border-border pb-6 last:border-b-0">
										<div className="flex items-start gap-4">
											<Avatar className="h-10 w-10">
												<AvatarImage src={review.avatar || '/placeholder.svg'} alt={review.author} />
												<AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
											</Avatar>

											<div className="flex-1 space-y-2">
												<div className="flex items-center gap-2">
													<h4 className="font-semibold text-foreground">{review.author}</h4>
													{review.verified && (
														<Badge variant="secondary" className="text-xs">
															Verified Purchase
														</Badge>
													)}
												</div>

												<div className="flex items-center gap-2">
													<div className="flex items-center">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
															/>
														))}
													</div>
													<span className="text-sm text-muted-foreground">{review.date}</span>
												</div>

												<h5 className="font-medium text-foreground">{review.title}</h5>
												<p className="text-muted-foreground leading-relaxed">{review.content}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<div className="text-center py-12 text-muted-foreground">
							<p className="text-lg font-medium">No reviews yet</p>
							<p className="text-sm mt-1">Be the first to review this product</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
