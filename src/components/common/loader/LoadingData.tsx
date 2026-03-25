'use client';

import { Loader2 } from 'lucide-react';

interface LoadingDataProps {
	message?: string;
}

export default function LoadingData({ message = 'Loading data...' }: LoadingDataProps) {
	return (
		<div className="md:h-[calc(100vh-12rem)] h-[calc(100vh-9rem)] w-full bg-white/80 flex items-center justify-center z-50">
			<div className="rounded-md p-6 flex flex-col items-center gap-4 max-w-sm text-center animate-fade-in">
				<Loader2 className="h-10 w-10 text-dashboard-primary animate-spin" />
				<h2 className="md:text-lg text-md font-semibold text-gray-900">{message}</h2>
				<p className="text-sm text-gray-500">Please wait a moment while we process your submission.</p>
			</div>
		</div>
	);
}
