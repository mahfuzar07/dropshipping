'use client';

import { Loader2 } from 'lucide-react';

export default function SubmitSkeleton() {
	return (
		<div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
			<div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-4 max-w-sm text-center animate-fade-in">
				<Loader2 className="h-10 w-10 text-dashboard-primary animate-spin" />
				<h2 className="text-lg font-semibold text-gray-900">Submitting your data...</h2>
				<p className="text-sm text-gray-500">Please wait a moment while we process your submission.</p>
			</div>
		</div>
	);
}
