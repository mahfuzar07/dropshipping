'use client';

import * as React from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
	PaginationEllipsis,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SmartPaginationProps = {
	table: any;
	pageSize?: number;
	sizeFixed?: boolean;
};

export function TablePagination({ table, pageSize, sizeFixed = false }: SmartPaginationProps) {
	const pagination = table.getState().pagination;
	const pageSizes = [5, 10, 20, 25, 50, 100];

	React.useEffect(() => {
		if (pageSize && pagination.pageSize !== pageSize) {
			table.setPageSize(pageSize);
		}
	}, [pageSize, pagination.pageSize, table]);

	// helper: smart ellipsis pages
	const getPageItems = (current: number, total: number) => {
		const items: (number | 'ellipsis')[] = [];

		const push = (p: number) => {
			if (p >= 0 && p < total) items.push(p);
		};

		push(0); // first page
		if (current > 2) items.push('ellipsis');

		push(current - 1);
		push(current);
		push(current + 1);

		if (current < total - 3) items.push('ellipsis');

		push(total - 1); // last page

		return Array.from(new Set(items));
	};

	return (
		<div className="flex items-center justify-end gap-5 py-3 border-t border-border/50">
			{/* page size selector */}
			{!sizeFixed && (
				<div className="flex items-center gap-2">
					<p className="text-dashboard-muted-foreground text-sm hidden md:block">Rows Per Page</p>

					<Select value={pagination.pageSize.toString()} onValueChange={(value) => table.setPageSize(Number(value))}>
						<SelectTrigger className="w-18 !h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent align="start">
							<SelectGroup>
								{pageSizes.map((size) => (
									<SelectItem key={size} value={size.toString()}>
										{size}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			)}

			{/* pagination */}
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => table.previousPage()}
							className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
						/>
					</PaginationItem>

					{getPageItems(pagination.pageIndex, table.getPageCount()).map((p, i) => (
						<PaginationItem key={i}>
							{p === 'ellipsis' ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink onClick={() => table.setPageIndex(p)} isActive={pagination.pageIndex === p}>
									{p + 1}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

					<PaginationItem>
						<PaginationNext onClick={() => table.nextPage()} className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''} />
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
