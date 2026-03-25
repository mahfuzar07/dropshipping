// CategoryTreeItem.tsx
'use client';

import { ChevronDown, ChevronRight, PencilLine, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useLayoutStore } from '@/z-store/global/useLayoutStore';
import getFullImageUrl from '@/lib/utils/getFullImageUrl';
import { cn } from '@/lib/utils/utils';

interface CategoryNode {
	id: number;
	name: string;
	slug?: string;
	status: 'ACTIVE' | 'INACTIVE';
	parentId?: number | null;
	children: CategoryNode[];
	icon?: string;
}

interface CategoryTreeItemProps {
	category: CategoryNode;
	level: number;
	expandedIds: Set<number>;
	onToggleExpand: (id: number) => void;
	onDelete: (id: number, hasChildren: boolean) => void;
	isMutating?: boolean;
}

export default function CategoryTreeItem({ category, level, expandedIds, onToggleExpand, onDelete, isMutating }: CategoryTreeItemProps) {
	const { openDrawer } = useLayoutStore();
	const children = category.children || [];
	const hasChildren = children.length > 0;
	const isExpanded = expandedIds.has(category.id);

	const statusStyles =
		category.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200';

	const handleEdit = () => {
		openDrawer({
			drawerType: 'add-category',
			drawerData: {
				id: category.id,
				name: category.name,
				parentId: category.parentId,
				icon: category.icon,
				status: category.status,
			},
		});
	};

	return (
		<div className="relative group">
			{/* Connector line – vertical + horizontal stub */}
			{level > 0 && (
				<>
					<div
						className="absolute top-1/2 -translate-y-1/2 h-px bg-gray-200/70"
						style={{
							left: `${(level - 1) * 20 - 10}px`,
							width: '14px',
						}}
					/>
				</>
			)}

			<div
				className={cn(
					'flex items-center gap-2 py-2.5 rounded-xl transition-all duration-200',
					'hover:bg-dashboard-background',
					'',
					level === 0 ? 'bg-white/50 dark:bg-gray-900/30' : '',
				)}
				style={{ paddingLeft: `${5 + level * 20}px` }}
			>
				{/* Expand / collapse chevron */}
				{hasChildren ? (
					<button
						onClick={() => onToggleExpand(category.id)}
						className={cn('p-0.5 rounded transition-colors cursor-pointer', 'hover:bg-gray-200/60 dark:hover:bg-gray-700/50', 'text-gray-500 dark:text-gray-400')}
					>
						{isExpanded ? <ChevronDown size={18} className="transition-transform" /> : <ChevronRight size={18} className="transition-transform" />}
					</button>
				) : (
					<span className="w-6" />
				)}

				{/* Icon + Name */}
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<div className="relative shrink-0 h-11 w-11 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow border border-gray-200/50 dark:border-gray-700/50">
						<Image
							src={getFullImageUrl(category.icon) || 'https://via.placeholder.com/150?text=Icon'}
							alt={category.name}
							fill
							className="object-contain p-1.5"
							unoptimized
						/>
					</div>

					<div className="min-w-0">
						<div className="font-medium text-[12px] md:text-base text-gray-900 dark:text-gray-100 truncate">{category.name}</div>
						{category.slug && <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate">{category.slug}</div>}
					</div>
				</div>

				{/* Status badge + Actions */}
				<div className="flex items-center gap-3">
					<span className={cn('px-2.5 py-1 text-[10px] md:text-xs font-medium rounded-full border', statusStyles)}>
						{category.status.toLowerCase()}
					</span>

					<div className="flex items-center gap-1.5 transition-opacity duration-150">
						<Button
							onClick={handleEdit}
							className="text-dashboard-primary bg-dashboard-primary/10 hover:bg-dashboard-primary hover:text-white"
							size="sm"
						>
							<PencilLine size={12} />
						</Button>

						<Button
							onClick={() => onDelete(category.id, hasChildren)}
							disabled={hasChildren || isMutating}
							size="sm"
							className="bg-red-100 text-red-500 hover:bg-red-600 hover:text-white disabled:opacity-50 !disabled:cursor-not-allowed"
						>
							<Trash2 size={12} />
						</Button>
					</div>
				</div>
			</div>

			{/* Children – slightly indented & animated */}
			{hasChildren && isExpanded && (
				<div className="mt-1 mb-1 transition-all duration-300 ease-in-out">
					{children.map((child) => (
						<CategoryTreeItem
							key={child.id}
							category={child}
							level={level + 1}
							expandedIds={expandedIds}
							onToggleExpand={onToggleExpand}
							onDelete={onDelete}
							isMutating={isMutating}
						/>
					))}
				</div>
			)}
		</div>
	);
}
