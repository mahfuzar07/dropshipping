'use client';

import LoadingSkeleton from '@/components/common/loader/LoadingSkeleton';
import CustomerNavigation from '@/components/common/navigations/CustomerNavigation';
import { Suspense, useEffect } from 'react';
import UnauthenticatedSkeleton from '@/components/common/loader/UnauthenticatedSkeleton';

export default function CustomereLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="bg-slate-50 py-3">
			<div className="container mx-auto md:py-5 py-0">
				<div className="flex items-start gap-8">
					<Suspense fallback={<LoadingSkeleton />}>
						<CustomerNavigation />
					</Suspense>

					<div className="flex-1">{children}</div>
				</div>
			</div>
		</div>
	);
}
