'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface ProductPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const MAX_VISIBLE = 5; // কতগুলো নাম্বার বাটন ঠিক পাশাপাশি দেখাবে (ellipsis ছাড়া)
const SKIP_COUNT = 5; // ellipsis-এ hover করে ক্লিক করলে কত পেজ skip হবে

type PageEntry = number | 'ellipsis-left' | 'ellipsis-right';

/**
 * Builds a compact page list, e.g.
 * 1 2 3 4 5 ... 100
 * 1 ... 8 9 10 11 12 ... 100
 * 1 ... 96 97 98 99 100
 *
 * "ellipsis-left" = window-এর আগে (পেছনের দিকে skip করবে)
 * "ellipsis-right" = window-এর পরে (সামনের দিকে skip করবে)
 */
function getPageNumbers(current: number, total: number): PageEntry[] {
	if (total <= MAX_VISIBLE + 2) {
		return Array.from({ length: total }, (_, i) => i + 1);
	}

	const pages: PageEntry[] = [];
	const half = Math.floor(MAX_VISIBLE / 2);

	let start = Math.max(1, current - half);
	let end = start + MAX_VISIBLE - 1;

	if (end >= total) {
		end = total - 1;
		start = end - MAX_VISIBLE + 1;
	}
	if (start <= 1) {
		start = 1;
		end = MAX_VISIBLE;
	}

	if (start > 1) pages.push(1);
	if (start > 2) pages.push('ellipsis-left');

	for (let i = start; i <= end; i++) pages.push(i);

	if (end < total - 1) pages.push('ellipsis-right');
	if (end < total) pages.push(total);

	return pages;
}

/**
 * Ellipsis বাটন — ডিফল্টে "..." দেখায়, hover করলে skip-arrow (>> বা <<) দেখায়।
 * ক্লিক করলে SKIP_COUNT পেজ এগিয়ে/পিছিয়ে যায়।
 */
function EllipsisButton({ direction, onSkip }: { direction: 'left' | 'right'; onSkip: () => void }) {
	const Icon = direction === 'left' ? ChevronsLeft : ChevronsRight;

	return (
		<Button
			variant="ghost"
			size="icon"
			className="group relative h-9 w-9 border-none shadow-none rounded-full"
			onClick={onSkip}
			aria-label={direction === 'left' ? `Skip back ${SKIP_COUNT} pages` : `Skip forward ${SKIP_COUNT} pages`}
		>
			<span className="select-none transition-opacity duration-150 group-hover:opacity-0">...</span>
			<Icon className="absolute h-4 w-4 opacity-0 transition-opacity duration-150 group-hover:opacity-100" />
		</Button>
	);
}

export default function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
	if (totalPages <= 1) return null;

	const pages = getPageNumbers(currentPage, totalPages);

	const skipBack = () => onPageChange(Math.max(1, currentPage - SKIP_COUNT));
	const skipForward = () => onPageChange(Math.min(totalPages, currentPage + SKIP_COUNT));

	return (
		<div className="flex items-center justify-center gap-1.5 md:mt-16 mt-10 mb-4 flex-wrap">
			<Button
				variant="ghost"
				size="icon"
				className="h-9 w-9 border-none shadow-none rounded-full"
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
				aria-label="Previous page"
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>

			{pages.map((p, i) => {
				if (p === 'ellipsis-left') return <EllipsisButton key={`ellipsis-left-${i}`} direction="left" onSkip={skipBack} />;
				if (p === 'ellipsis-right') return <EllipsisButton key={`ellipsis-right-${i}`} direction="right" onSkip={skipForward} />;

				const isActive = p === currentPage;

				return (
					<Button
						key={p}
						variant={isActive ? 'default' : 'ghost'}
						size="icon"
						className={`h-9 w-9 hover:bg-white/50 rounded-full ${isActive ? 'border hover:bg-primary shadow-sm' : 'border-none shadow-none'}`}
						onClick={() => onPageChange(p)}
						aria-current={isActive ? 'page' : undefined}
					>
						{p}
					</Button>
				);
			})}

			<Button
				variant="ghost"
				size="icon"
				className="h-9 w-9 border-none shadow-none rounded-full"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
				aria-label="Next page"
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
