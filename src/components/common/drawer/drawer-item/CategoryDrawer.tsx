'use client';
import { useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { CategoriesResponse, normalizeCategories } from '../../header/HeaderBottom';
import { MenuCategory } from '../../header/CategoryMenu';
import { useProductFilterStore, type MenuCategoryLite } from '@/z-store/product/useProductFilterStore';

/* ─────────────────────────────────────────────
   Drawer
───────────────────────────────────────────── */
export interface DrawerProps<T = unknown> {
	open: boolean;
	drawerData?: T;
}

export default function CategoryDrawer({ open }: DrawerProps) {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const router = useRouter();

	const { categoryPath, selectCategoryAtLevel } = useProductFilterStore();

	const { data, isLoading } = useAppData<CategoriesResponse, 'single'>({
		key: [QueriesKey.CATEGORIES],
		api: apiEndpoint.products.CATEGORIES(),
		auth: true,
		responseType: 'single',

		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add address');
		},
	});

	const categories = Array.isArray(data) ? data : (data?.categories ?? []);
	const normalizedCategories = normalizeCategories(categories ?? []);

	// ---- level-based drill down (same pattern as ProductFilterSidebar) ----
	const level = categoryPath.length;
	const deepest = categoryPath[level - 1] as MenuCategory | undefined;
	const itemsAtLevel: MenuCategory[] = level === 0 ? normalizedCategories : (deepest?.subcategories ?? []);

	const handleGoBack = () => {
		if (level === 0) return;
		if (level === 1) {
			selectCategoryAtLevel(null, 0);
		} else {
			const parent = categoryPath[level - 2] as MenuCategoryLite;
			selectCategoryAtLevel(parent, level - 2);
		}
	};

	// clicking a category: apply it as the search filter immediately,
	// and if it has children, drill into them within the drawer
	const handleItemClick = (item: MenuCategory) => {
		selectCategoryAtLevel(item, level);
		router.push(`/product-list?search=${encodeURIComponent(item.name)}`);
		closeDrawer();
	};

	return (
		<Drawer open={isDrawerOpen} onOpenChange={closeDrawer} direction="left">
			<DrawerContent className="h-full md:w-[450px] !w-[320px] flex flex-col border-none rounded-tr-2xl">
				{/* Close button */}
				<button
					onClick={closeDrawer}
					className="absolute right-3 top-4 z-50 w-8 h-8 rounded-full bg-primary/50 border border-border/50 flex items-center justify-center transition-colors shadow-md"
				>
					<ChevronLeft size={17} className="text-slate-100" />
				</button>

				<div className="w-full overflow-x-hidden flex flex-col h-full rounded-tr-2xl">
					{/* ── Header ── */}
					<div className="relative px-3 py-5 shrink-0 border-b border-border/50 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
						<div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 pointer-events-none" />
						<div className="absolute -bottom-4 right-10 w-14 h-14 rounded-full bg-primary/5 pointer-events-none" />

						<div className="flex items-center gap-3 relative z-10">
							<div>
								<h2 className="text-lg font-semibold tracking-tight leading-tight text-foreground font-fredoka">Categories</h2>
							</div>
						</div>
					</div>

					{/* ── Back / breadcrumb ── */}
					{level > 0 && (
						<button
							type="button"
							onClick={handleGoBack}
							className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary px-3 pt-3 shrink-0"
						>
							<ChevronLeft className="w-4 h-4" />
							<span className="truncate font-medium">{deepest?.name}</span>
						</button>
					)}

					{/* ── Category list (single level, drill-down) ── */}
					<div className="flex-1 overflow-y-auto px-1.5 py-3 space-y-0.5 font-fredoka">
						{itemsAtLevel.map((category) => {
							const hasChildren = !!category.subcategories?.length;

							return (
								<button
									key={category.id}
									onClick={() => handleItemClick(category)}
									className="relative w-full flex items-center gap-3 rounded-xl transition-all duration-200 overflow-hidden text-foreground hover:bg-muted/60 px-2 py-2 text-left"
								>
									{/* Icon — root only */}
									{level === 0 && category.icon && (
										<div className="relative w-8 h-8 rounded-lg shrink-0 bg-muted flex items-center justify-center">
											<Image src={category.icon} alt={category.name} fill className="object-contain p-1.5" />
										</div>
									)}

									<span className="flex-1 text-sm leading-snug truncate">{category.name}</span>

									{hasChildren && <ChevronRight size={14} className="text-muted-foreground shrink-0" />}
								</button>
							);
						})}

						{itemsAtLevel.length === 0 && <p className="text-xs text-gray-400 px-3">No subcategories</p>}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
