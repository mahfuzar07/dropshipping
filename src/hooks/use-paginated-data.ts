'use client';
import { useState, useCallback, useMemo } from 'react';
import { useAppData, type UseAppDataOptions } from './use-appdata';
import { AxiosError } from 'axios';

interface PaginatedResponse<T> {
	results: T[];
	total_pages: number;
	page_number: number;
	page_size: number;
	total_count?: number;
}

interface UsePaginatedDataOptions<T> extends Omit<UseAppDataOptions<PaginatedResponse<T>, 'single'>, 'responseType' | 'key'> {
	baseKey: string;
	initialPage?: number;
	pageSize?: number;
}

interface UsePaginatedDataResult<T> {
	data: T[];
	currentPage: number;
	totalPages: number;
	totalCount?: number;
	isLoading: boolean;
	isFetching: boolean;
	error: AxiosError | null;
	nextPage: () => void;
	prevPage: () => void;
	goToPage: (page: number) => void;
	refetch: () => Promise<void>;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

export function usePaginatedData<T>({
	baseKey,
	api,
	initialPage = 1,
	pageSize = 10,
	...options
}: UsePaginatedDataOptions<T>): UsePaginatedDataResult<T> {
	const [currentPage, setCurrentPage] = useState(initialPage);

	const queryKey = useMemo(() => [baseKey, currentPage, pageSize], [baseKey, currentPage, pageSize]);

	const paginatedApi = useMemo(() => {
		const separator = api.includes('?') ? '&' : '?';
		return `${api}${separator}page=${currentPage}&page_size=${pageSize}`;
	}, [api, currentPage, pageSize]);

	const { data, isLoading, isFetching, error, refetch } = useAppData<PaginatedResponse<T>, 'single'>({
		...options,
		key: queryKey,
		api: paginatedApi,
		responseType: 'single',
	});

	const totalPages = data?.total_pages ?? 1;
	const hasNextPage = currentPage < totalPages;
	const hasPrevPage = currentPage > 1;

	const nextPage = useCallback(() => {
		if (hasNextPage) setCurrentPage((p) => p + 1);
	}, [hasNextPage]);

	const prevPage = useCallback(() => {
		if (hasPrevPage) setCurrentPage((p) => p - 1);
	}, [hasPrevPage]);

	const goToPage = useCallback(
		(page: number) => {
			if (page >= 1 && page <= totalPages) setCurrentPage(page);
		},
		[totalPages],
	);

	return {
		data: data?.results ?? [],
		currentPage,
		totalPages,
		totalCount: data?.total_count,
		isLoading,
		isFetching,
		error,
		nextPage,
		prevPage,
		goToPage,
		refetch: async () => {
			await refetch();
		},
		hasNextPage,
		hasPrevPage,
	};
}
