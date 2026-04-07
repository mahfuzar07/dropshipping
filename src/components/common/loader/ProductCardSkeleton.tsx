'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
	return (
		<div className="bg-white overflow-hidden rounded-xl h-full flex flex-col animate-pulse">
			{/* Image Skeleton */}
			<div className="relative aspect-square bg-white overflow-hidden flex-shrink-0 rounded-2xl">
				<Skeleton className="w-full h-full rounded-2xl" />
			</div>

			{/* Content */}
			<div className="flex-1 flex flex-col p-3 pt-4">
				{/* Title */}
				<div className="space-y-2 mb-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>

				{/* Rating & Sold */}
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-4 rounded-full" />
						<Skeleton className="h-3 w-16" />
					</div>
					<Skeleton className="h-3 w-12" />
				</div>

				{/* Price */}
				<div className="mt-auto">
					<Skeleton className="h-6 w-24" />
				</div>

				{/* Delivery */}
				<div className="flex items-center gap-2 mt-2">
					<Skeleton className="h-4 w-4 rounded-full" />
					<Skeleton className="h-3 w-32" />
				</div>
			</div>
		</div>
	);
}
