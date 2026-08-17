'use client';

import { useMemo, useState } from 'react';
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

/**
 * Clean external/product-description HTML so imported HTML
 * doesn't break the responsive layout.
 */
function sanitizeDescription(html: string): string {
	if (!html) return '';

	return (
		html
			// Remove hidden tracking images
			.replace(/<img[^>]+style\s*=\s*["'][^"']*display\s*:\s*none[^"']*["'][^>]*>/gi, '')

			// Remove known tracking images
			.replace(/<img[^>]+src=["']https?:\/\/www\.o0b\.cn[^"']*["'][^>]*>/gi, '')

			// Remove scripts
			.replace(/<script[\s\S]*?<\/script>/gi, '')

			// Remove empty divs
			.replace(/<div[^>]*>\s*<\/div>/gi, '')

			// Remove fixed width/height from images
			.replace(/<img([^>]*?)\swidth\s*=\s*["'][^"']*["']([^>]*)>/gi, '<img$1$2>')
			.replace(/<img([^>]*?)\sheight\s*=\s*["'][^"']*["']([^>]*)>/gi, '<img$1$2>')

			// Remove inline width / min-width from images
			.replace(/<img([^>]*?)style\s*=\s*["']([^"']*)["']([^>]*)>/gi, (match, before, style, after) => {
				const cleanStyle = style
					.replace(/width\s*:\s*[^;]+;?/gi, '')
					.replace(/height\s*:\s*[^;]+;?/gi, '')
					.replace(/min-width\s*:\s*[^;]+;?/gi, '')
					.trim();

				return cleanStyle ? `<img${before}style="${cleanStyle}"${after}>` : `<img${before}${after}>`;
			})

			// Remove fixed width from tables
			.replace(/<table([^>]*?)style\s*=\s*["']([^"']*)["']([^>]*)>/gi, (match, before, style, after) => {
				const cleanStyle = style
					.replace(/width\s*:\s*[^;]+;?/gi, '')
					.replace(/min-width\s*:\s*[^;]+;?/gi, '')
					.trim();

				return cleanStyle ? `<table${before}style="${cleanStyle}"${after}>` : `<table${before}${after}>`;
			})
	);
}

export default function ProductTabs({ description, specifications, reviews }: ProductTabsProps) {
	const [activeTab, setActiveTab] = useState('description');

	const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;

	const cleanDescription = useMemo(() => sanitizeDescription(description ?? ''), [description]);

	return (
		<div className="w-full min-w-0">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full min-w-0">
				<TabsList className="mb-8 grid w-full grid-cols-2">
					<TabsTrigger value="description" className="text-base font-medium">
						Description
					</TabsTrigger>

					<TabsTrigger value="reviews" className="text-base font-medium">
						Reviews ({reviews.length})
					</TabsTrigger>
				</TabsList>

				{/* ================= DESCRIPTION ================= */}

				<TabsContent value="description" className="w-full min-w-0 space-y-6 overflow-visible">
					{cleanDescription ? (
						<div
							className="
								prose prose-gray
								w-full max-w-none min-w-0
								overflow-hidden

								[overflow-wrap:anywhere]
								[&_img]:!block
								[&_img]:!h-auto
								[&_img]:!w-full
								[&_img]:!max-w-full
								[&_img]:!min-w-0
								[&_img]:rounded-lg
								[&_img]:my-2

								[&_picture]:!block
								[&_picture]:!w-full
								[&_picture]:!max-w-full

								[&_video]:!block
								[&_video]:!h-auto
								[&_video]:!w-full
								[&_video]:!max-w-full

								[&_iframe]:!block
								[&_iframe]:!h-auto
								[&_iframe]:!w-full
								[&_iframe]:!max-w-full

								[&_table]:!max-w-full
								[&_table]:!w-full

								[&_pre]:max-w-full
								[&_pre]:overflow-x-auto
								[&_code]:break-words

								[&_p]:break-words
								[&_div]:max-w-full
							"
						>
							<div
								dangerouslySetInnerHTML={{
									__html: cleanDescription,
								}}
							/>
						</div>
					) : (
						<p className="text-muted-foreground">No description available.</p>
					)}

					{/* ================= SPECIFICATIONS ================= */}

					{Object.keys(specifications).length > 0 && (
						<div className="w-full min-w-0">
							<h3 className="mb-4 text-xl font-semibold">Specifications</h3>

							<div className="grid w-full grid-cols-1">
								{Object.entries(specifications).map(([key, value]) => (
									<div
										key={key}
										className="
												flex
												flex-col
												gap-1
												border-b
												border-border
												py-3
												sm:flex-row
												sm:items-start
												sm:justify-between
											"
									>
										<span className="shrink-0 font-medium text-foreground">{key}:</span>

										<span
											className="
													max-w-full
													break-words
													text-left
													text-muted-foreground
													sm:max-w-[60%]
													sm:text-right
												"
										>
											{value}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</TabsContent>

				{/* ================= REVIEWS ================= */}

				<TabsContent value="reviews" className="w-full min-w-0 space-y-6">
					{reviews.length > 0 ? (
						<>
							{/* Reviews Summary */}

							<div className="rounded-lg border bg-card p-6">
								<div className="mb-4 flex items-center gap-4">
									<div className="text-center">
										<div className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</div>

										<div className="mb-1 flex items-center justify-center">
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

							<div className="w-full min-w-0 space-y-6">
								{reviews.map((review) => (
									<div key={review.id} className="min-w-0 border-b border-border pb-6 last:border-b-0">
										<div className="flex min-w-0 items-start gap-4">
											<Avatar className="h-10 w-10 shrink-0">
												<AvatarImage src={review.avatar || '/placeholder.svg'} alt={review.author} />

												<AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
											</Avatar>

											<div className="min-w-0 flex-1 space-y-2">
												<div className="flex min-w-0 flex-wrap items-center gap-2">
													<h4 className="break-words font-semibold text-foreground">{review.author}</h4>

													{review.verified && (
														<Badge variant="secondary" className="shrink-0 text-xs">
															Verified Purchase
														</Badge>
													)}
												</div>

												<div className="flex flex-wrap items-center gap-2">
													<div className="flex shrink-0 items-center">
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
															/>
														))}
													</div>

													<span className="break-words text-sm text-muted-foreground">{review.date}</span>
												</div>

												<h5 className="break-words font-medium text-foreground">{review.title}</h5>

												<p className="break-words leading-relaxed text-muted-foreground">{review.content}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<div className="py-12 text-center text-muted-foreground">
							<p className="text-lg font-medium">No reviews yet</p>

							<p className="mt-1 text-sm">Be the first to review this product</p>
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
