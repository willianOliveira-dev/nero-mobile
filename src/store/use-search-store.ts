import type { SearchProductsParams } from '@/src/api/generated/model';
import { create } from 'zustand';

interface SearchState {
    filters: SearchProductsParams;
    setFilters: (filters: Partial<SearchProductsParams>) => void;
    clearFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
    filters: {
        limit: 20,
    },
    setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
    clearFilters: () =>
        set({
            filters: {
                limit: 20,
            },
        }),
}));
