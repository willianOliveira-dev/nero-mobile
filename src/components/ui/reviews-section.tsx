import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import type { GetProductBySlug200Rating } from '@/src/api/generated/model/getProductBySlug200Rating';
import type { ListReviews200ItemsItem } from '@/src/api/generated/model/listReviews200ItemsItem';
import { Star } from 'lucide-react-native';
import React from 'react';

import { ReviewItem } from './review-item';

interface ReviewsSectionProps {
    rating: GetProductBySlug200Rating;
    reviews: ListReviews200ItemsItem[];
}

export function ReviewsSection({ rating, reviews }: ReviewsSectionProps) {
    return (
        <VStack className="gap-4">
            <Text className="text-sm font-fredoka-semibold text-typography-900 uppercase tracking-widest">
                Avaliações
            </Text>

            {/* Summary */}
            <HStack className="items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
                <Text className="text-3xl font-fredoka-bold text-typography-900">
                    {rating.average.toFixed(1)}
                </Text>

                <VStack className="gap-0.5">
                    <HStack className="items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                color={
                                    i < Math.round(rating.average)
                                        ? '#FBBF24'
                                        : '#D1D5DB'
                                }
                                fill={
                                    i < Math.round(rating.average)
                                        ? '#FBBF24'
                                        : 'transparent'
                                }
                            />
                        ))}
                    </HStack>
                    <Text className="text-xs font-fredoka text-secondary-muted">
                        {rating.count} avaliações · {rating.sold} vendidos
                    </Text>
                </VStack>
            </HStack>

            {/* Reviews list */}
            {reviews.length > 0 ? (
                <VStack className="gap-5">
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))}
                </VStack>
            ) : (
                <Box className="py-6 items-center">
                    <Text className="text-sm font-fredoka text-secondary-muted">
                        Ainda não há avaliações para este produto.
                    </Text>
                </Box>
            )}
        </VStack>
    );
}
