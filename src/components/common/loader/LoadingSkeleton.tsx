'use client';
import React from 'react';

interface LoadingSkeletonProps {
	count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 1 }) => {
	return (
		<div className="space-y-6">
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className="animate-pulse bg-gray-50 p-4 rounded-lg shadow-sm">
					<div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
					<div className="h-4 bg-gray-200 rounded w-full mb-2" />
					<div className="h-4 bg-gray-200 rounded w-5/6" />
				</div>
			))}
		</div>
	);
};

export default LoadingSkeleton;
