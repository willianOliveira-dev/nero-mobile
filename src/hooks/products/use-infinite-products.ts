import { useInfiniteQuery } from '@tanstack/react-query';
import {
    searchProducts,
    getSearchProductsQueryKey,
} from '@/src/api/generated/products/products';
import type { SearchProductsParams } from '@/src/api/generated/model';

export function useInfiniteProducts(
    params?: Omit<SearchProductsParams, 'cursor'>,
) {
    return useInfiniteQuery({
        queryKey: [...getSearchProductsQueryKey(params), 'infinite'],
        queryFn: ({ pageParam, signal }) =>
            searchProducts(
                { ...params, cursor: pageParam as string | undefined },
                undefined,
                signal,
            ),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) =>
            lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
    });
}
