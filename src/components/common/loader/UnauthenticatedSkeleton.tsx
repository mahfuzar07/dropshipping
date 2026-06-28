'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UnauthenticatedSkeleton() {
	const { openModal } = useLayoutStore();
	const router = useRouter();
	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md text-center space-y-6">
				{/* Icon */}
				<div className="flex justify-center">
					<div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
						<Lock className="h-6 w-6 text-gray-500" />
					</div>
				</div>

				{/* Text */}
				<div className="space-y-2">
					<h1 className="text-xl font-semibold text-gray-900">Authentication Required</h1>
					<p className="text-sm text-gray-500">You need to log in to access this page. Please authenticate to continue.</p>
				</div>

				{/* Skeleton content */}
				<div className="space-y-3 pt-4 animate-pulse">
					<Skeleton className="h-10 w-full rounded-lg bg-gray-200" />
					<Skeleton className="h-4 w-3/4 mx-auto bg-gray-200" />
					<Skeleton className="h-4 w-2/3 mx-auto bg-gray-200" />
				</div>

				{/* Hint text */}
				<p className="text-xs text-gray-400 pt-2 mb-8">This area is protected for security reasons</p>

				<div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
					<Button onClick={() => openModal({ modalType: 'login-modal' })} className="bg-slate-700 text-sm text-white py-2 px-8 rounded-md w-full sm:w-auto">
						Login with Phone
					</Button>
					<Button onClick={() => router.push('/admin/login')} variant="outline" className="text-sm py-2 px-8 rounded-md w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50">
						Login with Email
					</Button>
				</div>
			</div>
		</div>
	);
}
