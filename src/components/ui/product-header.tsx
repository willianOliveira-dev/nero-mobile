import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import type { GetProductBySlug200Brand } from '@/src/api/generated/model/getProductBySlug200Brand';
import type { GetProductBySlug200Rating } from '@/src/api/generated/model/getProductBySlug200Rating';
import { Star } from 'lucide-react-native';
import React from 'react';

interface ProductHeaderProps {
    name: string;
    brand: GetProductBySlug200Brand;
    rating: GetProductBySlug200Rating;
    displayPrice: string;
    compareAtPrice: string | null;
    discountPercent: number | null;
    hasPriceVariation: boolean;
    priceRange: string | null;
    hasSelectedSku: boolean;
}

export function ProductHeader({
    name,
    brand,
    rating,
    displayPrice,
    compareAtPrice,
    discountPercent,
    hasPriceVariation,
    priceRange,
    hasSelectedSku,
}: ProductHeaderProps) {
    const showPriceRange = hasPriceVariation && !hasSelectedSku;

    return (
        <VStack className="gap-3">
            {brand && (
                <Text className="text-xs font-fredoka-medium text-secondary-muted uppercase tracking-widest">
                    {brand.name}
                </Text>
            )}

            <Text className="text-xl font-fredoka-bold text-typography-900">
                {name}
            </Text>

            {rating.count > 0 && (
                <HStack className="items-center gap-1.5">
                    <HStack className="items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                color={i < Math.round(rating.average) ? '#FBBF24' : '#D1D5DB'}
                                fill={i < Math.round(rating.average) ? '#FBBF24' : 'transparent'}
                            />
                        ))}
                    </HStack>
                    <Text className="text-xs font-fredoka text-typography-600">
                        {rating.average.toFixed(1)}
                    </Text>
                    <Text className="text-xs font-fredoka text-gray-400">
                        ({rating.count} avaliações)
                    </Text>
                    {rating.sold > 0 && (
                        <Text className="text-xs font-fredoka text-gray-400">
                            · {rating.sold} vendidos
                        </Text>
                    )}
                </HStack>
            )}

            <HStack className="items-center gap-2">
                {showPriceRange && priceRange ? (
                    <Text className="text-2xl font-fredoka-bold text-typography-900">
                        {priceRange}
                    </Text>
                ) : (
                    <>
                        {compareAtPrice && (
                            <Text className="text-sm font-fredoka text-gray-400 line-through">
                                {compareAtPrice}
                            </Text>
                        )}
                        <Text className="text-2xl font-fredoka-bold text-typography-900">
                            {displayPrice}
                        </Text>
                        {discountPercent !== null && discountPercent > 0 && (
                            <Box className="bg-success px-2 py-0.5 rounded-md">
                                <Text className="text-xs font-fredoka-semibold text-white">
                                    -{discountPercent}%
                                </Text>
                            </Box>
                        )}
                    </>
                )}
            </HStack>
        </VStack>
    );
}
