'use client';

import { customerNavigaLink } from '@/lib/constants/data';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CustomerNavigation() {
	const pathname = usePathname();

	return (
		<aside className="w-80 space-y-6 hidden md:block">
			<div className="bg-white py-6">
				<h3 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2 px-6">My Account</h3>

				{/* Categories */}
				<div className="mt-1 bg-white px-2 space-y-1">
					{customerNavigaLink.map(({ title, icon: Icon, url }) => {
						const isActive = pathname === url;

						return (
							<Link
								key={url}
								href={url}
								className={`flex items-center justify-between gap-3 px-4 py-2.5 text-md rounded group transition-all
									${isActive ? 'bg-orange-50 text-orange-400' : 'text-gray-700 hover:bg-slate-50'}`}
							>
								<div className="flex items-center gap-3">
									<Icon className={`text-md ${isActive ? 'text-orange-400' : 'text-gray-600'}`} />
									<span>{title}</span>
								</div>
								<ChevronRight
									className={`text-sm transition-colors
										${isActive ? 'text-orange-400' : 'text-slate-300'}`}
								/>
							</Link>
						);
					})}
				</div>
			</div>
		</aside>
	);
}
