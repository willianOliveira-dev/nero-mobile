import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
    useAddWishlistItem,
    useRemoveWishlistItem,
    getGetWishlistQueryKey,
} from '../../api/generated/wishlist/wishlist';

export function useToggleWishlist(productId: string, initialIsWishlisted: boolean) {
    const queryClient = useQueryClient();
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

    useEffect(() => {
        setIsWishlisted(initialIsWishlisted);
    }, [initialIsWishlisted]);

    const { mutate: addWishlist, isPending: isAdding } = useAddWishlistItem({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
            },
            onError: () => {
                setIsWishlisted(false);
            },
            meta: {
                successMessage: 'Produto adicionado aos favoritos!',
            }
        },
    });

    const { mutate: removeWishlist, isPending: isRemoving } = useRemoveWishlistItem({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
            },
            onError: () => {
                setIsWishlisted(true);
            },
            meta: {
                successMessage: 'Produto removido dos favoritos!',
            }
        },
    });

    const toggleWishlist = () => {
        const nextState = !isWishlisted;
        setIsWishlisted(nextState);

        if (nextState) {
            addWishlist({ productId });
        } else {
            removeWishlist({ productId });
        }
    };

    return {
        isWishlisted,
        toggleWishlist,
        isLoading: isAdding || isRemoving,
    };
}
