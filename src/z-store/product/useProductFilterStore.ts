import { create } from 'zustand';

export interface MenuCategoryLite {
	id: number | string;
	name: string;
	slug?: string;
	subcategories?: any[];
	[key: string]: any;
}

interface FilterState {
	searchText: string;
	categoryPath: MenuCategoryLite[]; // breadcrumb chain: [Electronics, Phones, Smartphones]
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
	selectCategoryAtLevel: (category: MenuCategoryLite | null, level: number) => void;
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
	categoryPath: [],
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

	setSearchText: (searchText) =>
		set((state) => {
			// user typed something that no longer matches the deepest selected category → clear the path
			const deepest = state.categoryPath[state.categoryPath.length - 1];
			const stillMatches = deepest && deepest.name === searchText;
			return {
				searchText,
				categoryPath: stillMatches ? state.categoryPath : [],
			};
		}),

	// Selecting a category at a given depth:
	// - replaces the chain from that depth downward with the newly picked category
	// - clicking the already-selected item again deselects it (and everything below it)
	// - there's no separate "category" backend param — selecting a category
	//   IS just searching by that category's name (same as before).
	selectCategoryAtLevel: (category, level) =>
		set((state) => {
			const current = state.categoryPath[level];
			let nextPath: MenuCategoryLite[];

			if (!category || current?.id === category.id) {
				// deselect: drop this level and everything below it
				nextPath = state.categoryPath.slice(0, level);
			} else {
				// select: keep everything above this level, replace this level onward
				nextPath = [...state.categoryPath.slice(0, level), category];
			}

			const deepest = nextPath[nextPath.length - 1];
			return {
				categoryPath: nextPath,
				searchText: deepest ? deepest.name : '',
			};
		}),

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
			categoryPath: [],
			discountOnly: false,
			priceRange: [0, 1_000_000_000],
			selectedRatings: [],
			pagination: {
				...get().pagination,
				page_number: 1,
				hasMore: true,
			},
		}),
}));
