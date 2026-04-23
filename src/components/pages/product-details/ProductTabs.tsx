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

export default function ProductTabs({ description, specifications, reviews }: ProductTabsProps) {
	const [activeTab, setActiveTab] = useState('description');

	const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

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
					<div className="prose prose-gray max-w-none">
						<p className="text-muted-foreground leading-relaxed text-base">{description}</p>
					</div>

					<div>
						<h3 className="text-xl font-semibold mb-4">Specifications</h3>
						<div className="grid grid-cols-1 gap-4">
							{Object.entries(specifications).map(([key, value]) => (
								<div key={key} className="flex justify-between py-2 border-b border-border">
									<span className="font-medium text-foreground">{key}:</span>
									<span className="text-muted-foreground">{value}</span>
								</div>
							))}
						</div>
					</div>
				</TabsContent>

				<TabsContent value="reviews" className="space-y-6">
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
													<Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
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
				</TabsContent>
			</Tabs>
		</div>
	);
}
