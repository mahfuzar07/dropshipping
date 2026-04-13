'use client';

import { useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, QueryKey } from '@tanstack/react-query';
import { api, authApi } from '@/lib/axiosInstance';
import { AxiosError } from 'axios';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export type Method = 'POST' | 'PATCH' | 'DELETE';
export type ResponseType = 'array' | 'single';
export type IdField = 'id' | '_id' | 'uuid';
export type Position = 'append' | 'prepend' | number;

export interface UseAppDataOptions<T, TResponse extends ResponseType> {
	key: string | QueryKey;
	api: string;
	auth?: boolean;
	initialData?: TResponse extends 'array' ? T[] : T;
	enabled?: boolean;
	staleTime?: number;
	gcTime?: number;
	extraHeaders?: Record<string, string>;
	refetchOnMount?: boolean;
	clientOnly?: boolean;
	invalidateKeys?: (string | QueryKey)[];
	responseType: TResponse;
	idField?: IdField;
	position?: Position;
	optimistic?: boolean | ((method: Method) => boolean);
	onSuccess?: (data: TResponse extends 'array' ? T[] : T, method: Method) => void;
	onError?: (error: AxiosError, method?: Method) => void;
	serverRevalidate?: () => Promise<void>;
}

export interface UseAppDataResult<T, TResponse extends ResponseType> {
	data: TResponse extends 'array' ? T[] | undefined : T | undefined;
	isLoading: boolean;
	isFetching: boolean;
	isMutating: boolean;
	isError: boolean;
	isSuccess: boolean;
	error: AxiosError | null;
	create: (payload: Partial<T> | FormData) => Promise<T | undefined>;
	update: (id?: string | number, payload?: Partial<T> | FormData) => Promise<T | undefined>;
	remove: (id: string | number) => Promise<void>;
	refetch: () => Promise<TResponse extends 'array' ? T[] : T | undefined>;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const normalizeKey = (key: string | QueryKey): QueryKey => (Array.isArray(key) ? key : [key]);

// ──────────────────────────────────────────────
// Main Hook
// ──────────────────────────────────────────────
export function useAppData<T, TResponse extends ResponseType = 'array'>(options: UseAppDataOptions<T, TResponse>): UseAppDataResult<T, TResponse> {
	const {
		key,
		api: path,
		auth = false,
		initialData,
		enabled = true,
		staleTime = 5 * 60 * 1000,
		gcTime = 30 * 60 * 1000,
		extraHeaders,
		refetchOnMount = false,
		clientOnly = false,
		invalidateKeys = [],
		responseType,
		idField = 'id',
		position = 'append',
		optimistic = true,
		onSuccess,
		onError,
		serverRevalidate,
	} = options;

	const queryClient = useQueryClient();
	const axiosInstance = auth ? authApi : api;
	const queryKey = useMemo(() => normalizeKey(key), [key]);

	const stableHeaders = useMemo(() => extraHeaders ?? {}, [extraHeaders ? JSON.stringify(extraHeaders) : null]);

	// Fetcher
	const fetchData = useCallback(async () => {
		const { data } = await axiosInstance.get(path, { headers: stableHeaders });
		return data as TResponse extends 'array' ? T[] : T;
	}, [path, stableHeaders, axiosInstance]);

	const query = useQuery({
		queryKey,
		queryFn: fetchData,
		initialData,
		staleTime,
		gcTime,
		refetchOnWindowFocus: false,
		refetchOnMount,
		retry: 1,
		enabled: clientOnly ? enabled && typeof window !== 'undefined' : enabled,
	});

	// Mutation
	const mutation = useMutation({
		mutationFn: async ({
			method,
			id,
			payload,
			action,
		}: {
			method: Method;
			id?: string | number;
			payload?: Partial<T> | FormData;
			action?: string;
		}) => {
			let url = path.replace(/\/$/, '');

			if (id !== undefined) url += `/${id}`;
			if (action) url += `/${action}`;

			url += '/';

			const isFormData = payload instanceof FormData;

			const { data } = await axiosInstance.request<T>({
				method,
				url,
				data: payload ?? {},
				headers: {
					...stableHeaders,
					...(isFormData ? {} : { 'Content-Type': 'application/json' }),
				},
			});

			return data;
		},

		onMutate: async ({ method, id, payload }) => {
			await queryClient.cancelQueries({ queryKey });
			const previous = queryClient.getQueryData(queryKey);

			const shouldOptimistic = typeof optimistic === 'function' ? optimistic(method) : !!optimistic;
			if (!shouldOptimistic) return { previous };

			if (payload instanceof FormData) {
				console.warn(`[useAppData] Optimistic skipped for FormData in ${method} → ${path}`);
				return { previous };
			}

			queryClient.setQueryData(queryKey, (old: unknown) => {
				if (responseType === 'array') {
					const items = (old as T[] | undefined) ?? [];
					if (method === 'POST') {
						const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
						const newItem = { [idField]: tempId, ...payload } as T;
						if (typeof position === 'number') {
							const copy = [...items];
							copy.splice(position, 0, newItem);
							return copy;
						}
						return position === 'prepend' ? [newItem, ...items] : [...items, newItem];
					}
					if (method === 'PATCH' && id !== undefined) {
						return items.map((item) => (String((item as any)[idField]) === String(id) ? { ...item, ...payload } : item));
					}
					if (method === 'DELETE' && id !== undefined) {
						return items.filter((item) => String((item as any)[idField]) !== String(id));
					}
				} else if (responseType === 'single' && method === 'PATCH') {
					return old ? { ...(old as T), ...payload } : old;
				}
				return old;
			});

			return { previous };
		},

		onError: (err, variables, context) => {
			if (context?.previous !== undefined) {
				queryClient.setQueryData(queryKey, context.previous);
			}
			const error = err instanceof AxiosError ? err : new AxiosError(String(err));
			onError?.(error, variables.method);
		},

		onSuccess: async (serverData, { method, id }) => {
			if (serverData && method !== 'DELETE') {
				queryClient.setQueryData(queryKey, (old: unknown) => {
					if (responseType === 'array') {
						let items = (old as T[] | undefined) ?? [];

						if (method === 'POST') {
							items = items.filter((item) => !String((item as any)[idField]).startsWith('temp-'));
							if (typeof position === 'number') {
								const copy = [...items];
								copy.splice(position, 0, serverData as T);
								return copy;
							}
							return position === 'prepend' ? [serverData as T, ...items] : [...items, serverData as T];
						}

						if (method === 'PATCH') {
							return items.map((item) => (String((item as any)[idField]) === String((serverData as any)[idField] ?? id) ? (serverData as T) : item));
						}
					} else if (responseType === 'single') {
						return serverData as T;
					}

					return old;
				});
			}

			// Background revalidation
			const keys = [queryKey, ...invalidateKeys.map(normalizeKey)];
			await Promise.allSettled([...keys.map((k) => queryClient.invalidateQueries({ queryKey: k })), serverRevalidate?.()]);

			if (serverData && method !== 'DELETE') {
				onSuccess?.(serverData as any, method);
			}
		},
	});

	// ──────────────────────────────────────────────
	// Type-safe data for conditional TResponse
	// ──────────────────────────────────────────────
	const typedData = useMemo(() => {
		if (responseType === 'array') {
			return query.data as T[] | undefined;
		} else {
			return query.data as T | undefined;
		}
	}, [query.data, responseType]) as TResponse extends 'array' ? T[] | undefined : T | undefined;

	return useMemo(
		() => ({
			data: typedData,
			isLoading: query.isLoading,
			isFetching: query.isFetching,
			isMutating: mutation.isPending,
			isError: query.isError,
			isSuccess: query.isSuccess,
			error: query.error as AxiosError | null,

			create: (payload) => mutation.mutateAsync({ method: 'POST', payload }),
			update: (id, payload) => mutation.mutateAsync({ method: 'PATCH', id, payload }),
			remove: (id) => mutation.mutateAsync({ method: 'DELETE', id }).then(() => void 0),

			refetch: async () => {
				const { data } = await query.refetch();
				return data as TResponse extends 'array' ? T[] : T | undefined;
			},
		}),
		[typedData, query.isLoading, query.isFetching, query.isError, query.isSuccess, query.error, mutation.isPending, mutation.mutateAsync],
	);
}
