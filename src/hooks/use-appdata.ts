'use client';

import { useCallback, useMemo, useRef } from 'react';
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

export type MutationVariables<T> = {
	method: Method;
	id?: string | number;
	payload?: Partial<T> | FormData;
	action?: string;
};

export interface MutateOptions<T> {
	payload?: Partial<T> | FormData;
	action?: string;
	id?: string | number;
}

export interface UseAppDataOptions<T, TResponse extends ResponseType> {
	key: string | QueryKey;
	api: string;
	routeParams?: Record<string, string | number>;
	queryParams?: Record<string, string | number | boolean | undefined>;
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
	onSuccess?: (data: TResponse extends 'array' ? T[] : T | undefined, method: Method) => void;
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

	create: (options: MutateOptions<T>) => Promise<T | undefined>;
	update: (options: MutateOptions<T>) => Promise<T | undefined>;
	remove: (options: { id: string | number }) => Promise<void>;
	refetch: () => Promise<TResponse extends 'array' ? T[] : T | undefined>;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const normalizeKey = (key: string | QueryKey): QueryKey => (Array.isArray(key) ? key : [key]);

const replaceRouteParams = (url: string, params?: Record<string, string | number>) => {
	if (!params) return url;

	let result = url;

	for (const [key, value] of Object.entries(params)) {
		const placeholder = `{${key}}`;

		if (!result.includes(placeholder)) {
			console.warn(`⚠️ Missing placeholder in URL: ${placeholder}`);
			continue;
		}

		result = result.replaceAll(placeholder, String(value));
	}

	const unmatched = result.match(/{\w+}/g);
	if (unmatched) {
		console.warn(`⚠️ Unresolved route params:`, unmatched);
	}

	return result;
};

type RecordItem = Record<string, unknown>;

const getId = (item: unknown, field: IdField): string | null => {
	const val = (item as RecordItem)?.[field];
	return val !== undefined && val !== null ? String(val) : null;
};

const insertAtPosition = <T>(items: T[], item: T, position: Position): T[] => {
	if (position === 'prepend') return [item, ...items];
	if (position === 'append') return [...items, item];
	const copy = [...items];
	copy.splice(position, 0, item);
	return copy;
};

const buildUrl = ({
	path,
	routeParams,
	queryParams,
	id,
	action,
}: {
	path: string;
	routeParams?: Record<string, string | number>;
	queryParams?: Record<string, string | number | boolean | undefined>;
	id?: string | number;
	action?: string;
}) => {
	let url = replaceRouteParams(path, routeParams).replace(/\/$/, '');

	if (id !== undefined) url += `/${id}`;
	if (action) url += `/${action}`;

	// url += '/';

	if (queryParams) {
		const params = new URLSearchParams();

		Object.entries(queryParams).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				params.append(key, String(value));
			}
		});

		const query = params.toString();

		if (query) {
			url += `?${query}`;
		}
	}

	return url;
};

const createTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

function shallowEqual(a?: Record<string, string | number>, b?: Record<string, string | number>) {
	if (a === b) return true;
	if (!a || !b) return false;

	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	if (aKeys.length !== bKeys.length) return false;

	for (const key of aKeys) {
		if (a[key] !== b[key]) return false;
	}

	return true;
}

// ──────────────────────────────────────────────
// Main Hook
// ──────────────────────────────────────────────
export function useAppData<T, TResponse extends ResponseType = 'array'>(options: UseAppDataOptions<T, TResponse>): UseAppDataResult<T, TResponse> {
	const {
		key,
		api: path,
		routeParams,
		queryParams,
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

	const headersRef = useRef(extraHeaders);
	if (!shallowEqual(headersRef.current, extraHeaders)) {
		headersRef.current = extraHeaders;
	}
	const stableHeaders = headersRef.current ?? {};

	const stableParamsRef = useRef(routeParams);
	if (!shallowEqual(stableParamsRef.current, routeParams)) {
		stableParamsRef.current = routeParams;
	}
	const stableRouteParams = stableParamsRef.current;

	const stableQueryParamsRef = useRef(queryParams);
	if (!shallowEqual(stableQueryParamsRef.current as any, queryParams as any)) {
		stableQueryParamsRef.current = queryParams;
	}
	const stableQueryParams = stableQueryParamsRef.current;

	const refs = useRef({ onSuccess, onError, serverRevalidate, invalidateKeys });
	refs.current = { onSuccess, onError, serverRevalidate, invalidateKeys };

	// FIX 1: Race condition guard — track pending mutations
	const pendingMutations = useRef(0);

	// ──────────────────────────────
	// FETCH
	// ──────────────────────────────

	// FIX 2: Accept signal from React Query for abort on unmount/re-run
	const fetchData = useCallback(
		async ({ signal }: { signal?: AbortSignal } = {}) => {
			const url = buildUrl({ path, routeParams: stableRouteParams, queryParams: stableQueryParams });
			const { data } = await axiosInstance.get(url, { headers: stableHeaders, signal });
			return data;
		},
		[path, stableRouteParams, stableQueryParams, stableHeaders, axiosInstance],
	);

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

	// ──────────────────────────────
	// MUTATION
	// ──────────────────────────────
	const mutation = useMutation({
		mutationFn: async ({ method, id, payload, action }: MutationVariables<T>) => {
			// FIX 1: Increment before request, decrement after
			pendingMutations.current += 1;

			try {
				const url = buildUrl({
					path,
					routeParams: stableRouteParams,
					id,
					action,
				});

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

				await refs.current.serverRevalidate?.();

				return data;
			} finally {
				pendingMutations.current -= 1;
			}
		},

		onMutate: async ({ method, id, payload }) => {
			await queryClient.cancelQueries({ queryKey });

			const previous = queryClient.getQueryData(queryKey);

			const shouldOptimistic = typeof optimistic === 'function' ? optimistic(method) : optimistic;

			const skipOptimistic = !shouldOptimistic || payload instanceof FormData;

			if (skipOptimistic) {
				return { previous };
			}

			queryClient.setQueryData(queryKey, (old: unknown) => {
				if (responseType === 'array') {
					const items = (old as T[]) ?? [];

					if (method === 'POST') {
						const temp = {
							[idField]: createTempId(),
							...payload,
						} as T;
						return insertAtPosition(items, temp, position);
					}

					if (method === 'PATCH' && id !== undefined) {
						return items.map((item) => (getId(item, idField) === String(id) ? { ...item, ...payload } : item));
					}

					if (method === 'DELETE' && id !== undefined) {
						return items.filter((item) => getId(item, idField) !== String(id));
					}
				}

				if (responseType === 'single' && method === 'PATCH') {
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
			refs.current.onError?.(error, variables.method);
		},

		onSuccess: async (data, { method, id }) => {
			if (method !== 'DELETE') {
				queryClient.setQueryData(queryKey, (old: unknown) => {
					if (responseType === 'array') {
						let items = (old as T[]) ?? [];

						if (method === 'POST') {
							items = items.filter((item) => !getId(item, idField)?.startsWith('temp-'));
							return insertAtPosition(items, data as T, position);
						}

						if (method === 'PATCH') {
							const serverId = getId(data, idField) ?? String(id);
							return items.map((item) => (getId(item, idField) === serverId ? (data as T) : item));
						}
					}

					if (responseType === 'single') {
						return data;
					}

					return old;
				});
			}

			// FIX 1: Only invalidate after ALL pending mutations are done
			if (pendingMutations.current === 0) {
				const keys = [queryKey, ...refs.current.invalidateKeys.map(normalizeKey)];
				await Promise.allSettled(keys.map((k) => queryClient.invalidateQueries({ queryKey: k })));
			}

			refs.current.onSuccess?.(data as TResponse extends 'array' ? T[] : T | undefined, method);
		},
	});

	// ──────────────────────────────
	// RETURN
	// ──────────────────────────────
	const typedData = query.data as TResponse extends 'array' ? T[] | undefined : T | undefined;

	return useMemo(
		() => ({
			data: typedData,
			isLoading: query.isLoading,
			isFetching: query.isFetching,
			isMutating: mutation.isPending,
			isError: query.isError,
			isSuccess: query.isSuccess,
			error: query.error as AxiosError | null,

			create: ({ payload, action, id } = {}) => mutation.mutateAsync({ method: 'POST', payload, action, id }),

			update: ({ id, payload, action } = {}) => mutation.mutateAsync({ method: 'PATCH', id, payload, action }),

			remove: ({ id }) =>
				mutation
					.mutateAsync({
						method: 'DELETE',
						id,
					})
					.then(() => void 0),

			refetch: async () => {
				const res = await query.refetch();
				return res.data as TResponse extends 'array' ? T[] : T | undefined;
			},
		}),
		[
			typedData,
			query.isLoading,
			query.isFetching,
			query.isError,
			query.isSuccess,
			query.error,
			query.refetch,
			mutation.isPending,
			mutation.mutateAsync,
		],
	);
}
