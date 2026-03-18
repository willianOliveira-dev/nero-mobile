import { useCallback, useMemo, useState } from 'react';

import type { GetProductBySlug200 } from '@/src/api/generated/model/getProductBySlug200';
import type { GetProductBySlug200SimpleProduct } from '@/src/api/generated/model/getProductBySlug200SimpleProduct';
import type { GetProductBySlug200Skus } from '@/src/api/generated/model/getProductBySlug200Skus';

type SkuItem = NonNullable<GetProductBySlug200Skus>[number];

type PriceSource = {
    price: { cents: number; value: number; formatted: string };
    compareAtPrice: { cents: number; value: number; formatted: string } | null;
    discountPercent: number | null;
    stock: number;
    isOutOfStock: boolean;
};

function buildPriceFromSimpleProduct(
    sp: NonNullable<GetProductBySlug200SimpleProduct>,
): PriceSource {
    return {
        price: sp.price.current,
        compareAtPrice: sp.price.original,
        discountPercent: sp.price.discountPercent,
        stock: sp.stock,
        isOutOfStock: sp.stock <= 0,
    };
}

function buildPriceFromSku(sku: SkuItem): PriceSource {
    return {
        price: sku.price,
        compareAtPrice: sku.compareAtPrice,
        discountPercent: sku.discountPercent,
        stock: sku.stock,
        isOutOfStock: sku.stock <= 0,
    };
}

export function useProductVariants(product: GetProductBySlug200) {
    const initialSelections = useMemo(() => {
        const selections: Record<string, string> = {};
        if (product.hasVariations && product.variationTypes) {
            for (const vt of product.variationTypes) {
                const firstOption = vt.options[0];
                if (firstOption) {
                    selections[vt.id] = firstOption.id;
                }
            }
        }
        return selections;
    }, [product.hasVariations, product.variationTypes]);

    const [selectedOptions, setSelectedOptions] =
        useState<Record<string, string>>(initialSelections);

    const [quantity, setQuantity] = useState(1);

  
    const activeSku = useMemo<SkuItem | null>(() => {
        if (!product.hasVariations || !product.skus) return null;

        const selectedOptionIds = Object.values(selectedOptions);

        return (
            product.skus.find((sku) =>
                selectedOptionIds.every((id) => sku.optionIds.includes(id)),
            ) ?? null
        );
    }, [product.hasVariations, product.skus, selectedOptions]);

 
    const isOptionAvailable = useCallback(
        (variationTypeId: string, optionId: string): boolean => {
            if (!product.skus) return false;

            const candidateOptions = { ...selectedOptions, [variationTypeId]: optionId };
            const candidateIds = Object.values(candidateOptions);

            return product.skus.some(
                (sku) =>
                    sku.isActive &&
                    candidateIds.every((id) => sku.optionIds.includes(id)),
            );
        },
        [product.skus, selectedOptions],
    );

    const selectOption = useCallback(
        (variationTypeId: string, optionId: string) => {
            setSelectedOptions((prev) => ({
                ...prev,
                [variationTypeId]: optionId,
            }));
            setQuantity(1);
        },
        [],
    );


    const currentPrice = useMemo<PriceSource | null>(() => {
        if (product.hasVariations) {
            return activeSku ? buildPriceFromSku(activeSku) : null;
        }
        return product.simpleProduct
            ? buildPriceFromSimpleProduct(product.simpleProduct)
            : null;
    }, [product.hasVariations, product.simpleProduct, activeSku]);

    const maxStock = currentPrice?.stock ?? 0;
    const isOutOfStock = currentPrice?.isOutOfStock ?? true;
    const displayPrice = currentPrice?.price.formatted ?? '';
    const compareAtPrice = currentPrice?.compareAtPrice?.formatted ?? null;
    const discountPercent = currentPrice?.discountPercent ?? null;

 
    const maxQuantityPerSku = Number(product.cartRules?.maxQuantityPerSku) || Infinity;
    const effectiveMaxStock = Math.min(maxStock, maxQuantityPerSku);

    const incrementQuantity = useCallback(() => {
        setQuantity((prev) => {
            if (prev >= effectiveMaxStock) return prev;
            return prev + 1;
        });
    }, [effectiveMaxStock]);

    const decrementQuantity = useCallback(() => {
        setQuantity((prev) => {
            if (prev <= 1) return prev;
            return prev - 1;
        });
    }, []);

    return {
        selectedOptions,
        activeSku,
        selectOption,
        isOptionAvailable,
        currentPrice,
        quantity,
        incrementQuantity,
        decrementQuantity,
        maxStock: effectiveMaxStock,
        isOutOfStock,
        displayPrice,
        compareAtPrice,
        discountPercent,
    };
}
