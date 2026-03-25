'use client';

import { useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { X, ChevronUp, Search } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { Input } from '@/components/ui/input';

export default function SearchDrawer() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const [search, setSearch] = useState('');

	return (
		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="top">
			<DrawerContent className="w-full !rounded-b-none">
				<div className="max-w-7xl mx-auto w-full">
					{/* HEADER */}
					<div className="sticky bg-white top-0 z-10">
						<div className="flex items-center md:gap-5 px-3 py-3 gap-3">
							{/* SEARCH INPUT */}
							<div className="relative flex-1 bg-slate-50 rounded">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

								<Input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search for products, brands, categories..."
									className="pl-9 pr-10 md:h-14 h-11 shadow-none border-none rounded-lg placeholder:text-sm"
									autoFocus
								/>

								{/* CLEAR — only when typing */}
								{search && (
									<button
										type="button"
										onClick={() => setSearch('')}
										className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
										aria-label="Clear search"
									>
										<X className="h-4 w-4" />
									</button>
								)}
							</div>

							{/* CLOSE */}
							<button
								onClick={closeDrawer}
								className="md:h-10 md:w-10 w-8 h-8 flex items-center justify-center rounded-full transition bg-twinkle-accent text-white cursor-pointer"
								aria-label="Close search"
							>
								<ChevronUp size={28} />
							</button>
						</div>
					</div>

					{/* CONTENT */}
					<div className="px-3 py-3 overflow-y-auto">
						<div className="mb-3">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">{search ? 'Search results' : 'Popular searches'}</p>
						</div>

						{!search && (
							<div className="flex flex-wrap gap-2 mb-6">
								{['Baby Care', 'Diapers', 'Milk Powder', 'Toys', 'Wipes'].map((item) => (
									<button
										key={item}
										onClick={() => setSearch(item)}
										className="px-3 py-1.5 rounded-full bg-white text-sm border hover:bg-muted transition"
									>
										{item}
									</button>
								))}
							</div>
						)}

						{search && (
							<div className="space-y-3">
								{/* future: map real results here */}
								<p className="text-sm text-muted-foreground">
									Searching for: <span className="font-medium text-foreground">{search}</span>
								</p>
							</div>
						)}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
