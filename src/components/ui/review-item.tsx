import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import type { ListReviews200ItemsItem } from '@/src/api/generated/model/listReviews200ItemsItem';
import { Star, CheckCircle2 } from 'lucide-react-native';
import { Image } from 'expo-image';
import React from 'react';

interface ReviewItemProps {
    review: ListReviews200ItemsItem;
}

export function ReviewItem({ review }: ReviewItemProps) {
    const formattedDate = new Date(review.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    return (
        <VStack className="gap-2">
            <HStack className="items-center justify-between">
                <HStack className="items-center gap-3">
                    {/* Avatar with fallback */}
                    <Box className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                        {review.user?.avatar ? (
                            <Image
                                source={{ uri: review.user.avatar }}
                                style={{ width: 40, height: 40, borderRadius: 20 }}
                                contentFit="cover"
                                transition={200}
                            />
                        ) : (
                            <Box className="w-full h-full items-center justify-center">
                                <Text className="text-sm font-fredoka-semibold text-gray-400">
                                    {review.user?.name?.charAt(0).toUpperCase() ?? '?'}
                                </Text>
                            </Box>
                        )}
                    </Box>

                    <VStack className="gap-0.5">
                        <HStack className="items-center gap-1.5">
                            <Text className="text-xs font-fredoka-bold text-typography-900">
                                {review.user?.name ?? 'Anônimo'}
                            </Text>
                            {review.isVerified && (
                                <CheckCircle2 size={12} color="#10b981" />
                            )}
                        </HStack>
                        <Text className="text-2xs font-fredoka text-secondary-muted">
                            {formattedDate}
                        </Text>
                    </VStack>
                </HStack>

                <HStack className="items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={12}
                            color={i < review.rating ? '#F5A623' : '#D1D1D1'}
                            fill={i < review.rating ? '#F5A623' : 'transparent'}
                        />
                    ))}
                </HStack>
            </HStack>

            <VStack className="gap-1 px-1">
                {review.title && (
                    <Text className="text-sm font-fredoka-bold text-typography-900">
                        {review.title}
                    </Text>
                )}
                {review.comment && (
                    <Text className="text-xs font-fredoka text-secondary-muted leading-relaxed">
                        {review.comment}
                    </Text>
                )}
            </VStack>
        </VStack>
    );
}
