import { create } from 'zustand';

interface FilterState {
	searchText: string;
	selectedCategories: number[];
	discountOnly: boolean;
	priceRange: [number, number];
	selectedRatings: number[];
	sortBy: string;
	viewMode: 'grid' | 'list';
	showFilters: boolean;
	pagination: {
		count?: number | null;
		page_number?: number;
		page_size?: number;
		total_pages?: number | null;
		hasMore?: boolean;
	};
	setSearchText: (searchText: string) => void;
	toggleCategory: (categoryId: number | string) => void;
	setCategory: (categoryId: number | null) => void;
	toggleDiscount: () => void;
	setPriceRange: (priceRange: [number, number]) => void;
	toggleRating: (rating: number) => void;
	setSortBy: (sortBy: string) => void;
	setViewMode: (viewMode: 'grid' | 'list') => void;
	toggleFilters: () => void;
	setPage: (page: number) => void;
	setPaginationData: (data: { count: number; page_number: number; page_size: number; total_pages: number; hasMore?: boolean }) => void;
	loadMoreProducts: () => void;
	resetPagination: () => void;
	clearAllFilters: () => void;
}

export const useProductFilterStore = create<FilterState>((set, get) => ({
	searchText: '',
	selectedCategories: [],
	discountOnly: false,
	priceRange: [0, 1000000000],
	selectedRatings: [],
	sortBy: 'newest',
	viewMode: 'grid',
	showFilters: true,
	pagination: {
		count: null,
		page_number: 1,
		page_size: 20,
		total_pages: null,
		hasMore: true,
	},

	setSearchText: (searchText) => set({ searchText }),

	toggleCategory: (categoryId) =>
		set((state) => {
			const id = typeof categoryId === 'string' ? Number(categoryId) : categoryId;
			return {
				selectedCategories: state.selectedCategories.includes(id) ? [] : [id],
			};
		}),

	setCategory: (categoryId) => set({ selectedCategories: categoryId === null ? [] : [categoryId] }),

	toggleDiscount: () => set((state) => ({ discountOnly: !state.discountOnly })),

	setPriceRange: (priceRange) => set({ priceRange }),

	toggleRating: (rating) =>
		set((state) => ({
			selectedRatings: state.selectedRatings.includes(rating)
				? state.selectedRatings.filter((r) => r !== rating)
				: [...state.selectedRatings, rating],
		})),

	setSortBy: (sortBy) => set({ sortBy }),

	setViewMode: (viewMode) => set({ viewMode }),

	toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),

	setPage: (page) =>
		set((state) => ({
			pagination: { ...state.pagination, page_number: page },
		})),

	setPaginationData: (data) =>
		set((state) => ({
			pagination: {
				...data,
				hasMore: data.hasMore ?? data.page_number < data.total_pages,
			},
		})),

	loadMoreProducts: () =>
		set((state) => {
			if (state.pagination.page_number && state.pagination.hasMore) {
				return {
					pagination: {
						...state.pagination,
						page_number: state.pagination.page_number + 1,
					},
				};
			}
			return state;
		}),

	resetPagination: () =>
		set((state) => ({
			pagination: {
				...state.pagination,
				page_number: 1,
				hasMore: true,
			},
		})),

	clearAllFilters: () =>
		set({
			searchText: '',
			selectedCategories: [],
			discountOnly: false,
			priceRange: [0, 0],
			selectedRatings: [],
			pagination: {
				...get().pagination,
				page_number: 1,
				hasMore: true,
			},
		}),
}));
