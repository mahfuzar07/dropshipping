'use client';

import { useRef, useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { X, ChevronUp, Search, Camera } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import { Input } from '@/components/ui/input';

export default function SearchDrawer() {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const [search, setSearch] = useState('');
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	// handle image upload
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const imageUrl = URL.createObjectURL(file);
		setImagePreview(imageUrl);
	};

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
									className="pl-9 pr-20 md:h-14 h-11 shadow-none border-none rounded-lg placeholder:text-sm bg-green-200/10"
									autoFocus
								/>

								{/* CAMERA ICON */}
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									aria-label="Search by image"
								>
									<Camera className="h-6 w-6 text-green-600" />
								</button>

								{/* CLEAR */}
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

								{/* HIDDEN FILE INPUT */}
								<input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
							</div>

							{/* CLOSE */}
							<button
								onClick={closeDrawer}
								className="md:h-10 md:w-10 w-8 h-8 flex items-center justify-center rounded-full transition bg-green-600 text-white cursor-pointer"
								aria-label="Close search"
							>
								<ChevronUp size={28} />
							</button>
						</div>
					</div>

					{/* CONTENT */}
					<div className="px-3 py-3 overflow-y-auto">
						<div className="mb-3">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">{search || imagePreview ? 'Search results' : 'Discover More'}</p>
						</div>

						{/* IMAGE PREVIEW */}
						{imagePreview && (
							<div className="mb-4">
								<p className="text-sm mb-2 text-muted-foreground">Image Search Preview:</p>
								<img src={imagePreview} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
							</div>
						)}

						{!search && !imagePreview && (
							<div className="flex flex-wrap gap-2 mb-6">
								{['Bags', 'Shoes', 'Beauty Product', 'Home & Appliances', 'Gadgets'].map((item) => (
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

						{(search || imagePreview) && (
							<div className="space-y-3">
								<p className="text-sm text-muted-foreground">
									{search && (
										<>
											Searching for: <span className="font-medium text-foreground">{search}</span>
										</>
									)}
									{imagePreview && <span className="text-foreground">Image based search active</span>}
								</p>
							</div>
						)}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
