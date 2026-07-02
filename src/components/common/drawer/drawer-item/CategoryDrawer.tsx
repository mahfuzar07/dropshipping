'use client';
import { useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { useAppData } from '@/hooks/use-appdata';
import { QueriesKey } from '@/lib/constants/queriesKey';
import { apiEndpoint } from '@/lib/constants/apiEndpoint';
import { toast } from 'sonner';
import { CategoriesResponse, normalizeCategories } from '../../header/HeaderBottom';
import { MenuCategory } from '../../header/CategoryMenu';

/* ─────────────────────────────────────────────
   CategoryItem — recursive
───────────────────────────────────────────── */
interface CategoryItemProps {
	category: MenuCategory;
	openKeys: string[];
	toggleOpen: (key: string) => void;
	depth?: number;
}

function CategoryItem({ category, openKeys, toggleOpen, depth = 0 }: CategoryItemProps) {
	const pathname = usePathname();
	const hasChildren = !!category.subcategories?.length;
	const itemKey = `${depth}-${category.id}`;
	const isOpen = openKeys.includes(itemKey);

	const isActive =
		pathname === `/category/${category.slug}` || (hasChildren && category.subcategories!.some((s) => pathname === `/category/${s.slug}`));

	const isSubActive = depth > 0 && pathname === `/category/${category.slug}`;

	/* ── Shared row wrapper for parent (hasChildren) ── */
	const ParentRow = (
		<div
			className={[
				'relative w-full flex items-center rounded-xl transition-all duration-200 overflow-hidden',
				depth === 0 ? '' : 'pl-2',
				isActive ? 'bg-twinkle-gold/12 text-twinkle-gold font-semibold' : 'text-foreground hover:bg-muted/60',
			].join(' ')}
		>
			{/* Left accent bar */}
			{isActive && depth === 0 && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-twinkle-gold" />}

			{/* Link part */}
			<Link href={`/category/${category.slug}`} className="flex flex-1 items-center gap-3 pl-2 pr-1 py-2 min-w-0">
				{/* Icon — root only */}
				{depth === 0 && category.icon && (
					<div
						className={['relative w-8 h-8 rounded-lg shrink-0 flex items-center justify-center', isActive ? 'bg-twinkle-gold/20' : 'bg-muted'].join(
							' ',
						)}
					>
						<Image src={category.icon} alt={category.name} fill className="object-contain p-1.5" />
					</div>
				)}
				<span className="flex-1 text-left text-sm leading-snug truncate">{category.name}</span>
			</Link>

			{/* Chevron toggle */}
			<button
				onClick={() => toggleOpen(itemKey)}
				className="p-2 mr-1.5 rounded-lg shrink-0 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
				aria-label={isOpen ? 'Collapse' : 'Expand'}
			>
				<ChevronRight
					size={14}
					className={[
						'transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
						isOpen ? 'rotate-90' : 'rotate-0',
						isActive ? 'text-twinkle-gold' : 'text-muted-foreground',
					].join(' ')}
				/>
			</button>
		</div>
	);

	/* ── Leaf row ── */
	const LeafRow = (
		<Link
			href={`/category/${category.slug}`}
			className={[
				'relative w-full flex items-center gap-3 rounded-xl transition-all duration-200 overflow-hidden',
				depth === 0 ? 'pl-2 pr-2 py-2' : 'pl-3 pr-3 py-2',
				isActive || isSubActive ? 'bg-twinkle-gold/12 text-twinkle-gold font-semibold' : 'text-foreground hover:bg-muted/60',
			].join(' ')}
		>
			{/* Left accent bar */}
			{(isActive || isSubActive) && depth === 0 && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-twinkle-gold" />}

			{/* Sub-item active dot */}
			{isSubActive && depth > 0 && <span className="w-1.5 h-1.5 rounded-full bg-twinkle-gold shrink-0" />}

			{/* Icon — root only */}
			{depth === 0 && category.icon && (
				<div className={['relative w-8 h-8 rounded-lg shrink-0', isActive ? 'bg-twinkle-gold/20' : 'bg-muted'].join(' ')}>
					<Image src={category.icon} alt={category.name} fill className="object-contain p-1.5" />
				</div>
			)}

			<span className={['flex-1 text-sm leading-snug', depth > 0 ? 'text-[13px]' : ''].join(' ')}>{category.name}</span>

			{/* Active chevron for leaf at depth 0 */}
			{isActive && depth === 0 && <ChevronRight size={13} className="text-twinkle-gold shrink-0" />}
		</Link>
	);

	return (
		<div>
			{hasChildren ? ParentRow : LeafRow}

			{/* ── Children collapse ── */}
			{hasChildren && (
				<div
					className="overflow-hidden transition-all duration-300 ease-in-out"
					style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr' }}
				>
					<div className="min-h-0">
						<div className="border-l-2 border-twinkle-gold/20 ml-[20px] mt-0.5 mb-1 pl-1 space-y-0.5">
							{category.subcategories!.map((sub) => (
								<CategoryItem key={sub.id} category={sub} openKeys={openKeys} toggleOpen={toggleOpen} depth={depth + 1} />
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

/* ─────────────────────────────────────────────
   Drawer
───────────────────────────────────────────── */
export interface DrawerProps<T = unknown> {
	open: boolean;
	drawerData?: T;
}

export default function CategoryDrawer({ open }: DrawerProps) {
	const { isDrawerOpen, closeDrawer } = useLayoutStore();
	const [openKeys, setOpenKeys] = useState<string[]>([]);

	const toggleOpen = (key: string) => {
		setOpenKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
	};

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
						{/* Decorative circles */}
						<div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 pointer-events-none" />
						<div className="absolute -bottom-4 right-10 w-14 h-14 rounded-full bg-primary/5 pointer-events-none" />

						<div className="flex items-center gap-3 relative z-10">
							<div>
								<h2 className="text-lg font-semibold tracking-tight leading-tight text-foreground font-fredoka">Categories</h2>
							</div>
						</div>
					</div>

					{/* ── Category list ── */}
					<div className="flex-1 overflow-y-auto px-1.5 py-3 space-y-0.5 font-fredoka">
						{normalizedCategories.map((cat) => (
							<CategoryItem key={cat.id} category={cat} openKeys={openKeys} toggleOpen={toggleOpen} depth={0} />
						))}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
