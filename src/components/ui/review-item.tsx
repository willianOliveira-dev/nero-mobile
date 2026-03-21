import type { ListReviews200ItemsItem } from '@/src/api/generated/model/listReviews200ItemsItem';
import { useToggleReviewLike } from '@/src/api/generated/reviews/reviews';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { imagesPath } from '@/src/constants/images';
import { Image } from 'expo-image';
import { CheckCircle2, Play, Star, ThumbsUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { MediaViewerModal } from './media-viewer-modal';

interface ReviewItemProps {
    review: ListReviews200ItemsItem;
}

export function ReviewItem({ review }: ReviewItemProps) {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(0);

    const [likedByMe, setLikedByMe] = useState(review.likes.likedByMe);
    const [likeCount, setLikeCount] = useState(review.likes.count);
    const { mutate: toggleLike } = useToggleReviewLike();

    const formattedDate = new Date(review.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });

    const mediaItems = review.media ?? [];

    const openViewer = (index: number) => {
        setViewerIndex(index);
        setViewerOpen(true);
    };

    const handleToggleLike = () => {
        const wasLiked = likedByMe;
        setLikedByMe(!wasLiked);
        setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

        toggleLike(
            { id: review.id },
            {
                onError: () => {
                    setLikedByMe(wasLiked);
                    setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
                },
            },
        );
    };

    return (
        <>
            <VStack className="gap-2">
                <HStack className="items-center justify-between">
                    <HStack className="items-center gap-3">

                        <Box className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                            {review.user?.avatar ? (
                                <Image
                                    source={review.user.avatar}
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                    contentFit="cover"
                                    transition={200}
                                />
                            ) : (
                                <Image
                                    source={imagesPath.avatarPlaceholder}
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                    contentFit="cover"
                                    transition={200}
                                />
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

                {mediaItems.length > 0 && (
                    <HStack className="gap-2 mt-1 px-1">
                        {mediaItems.map((media, index) => (
                            <Pressable
                                key={index}
                                onPress={() => openViewer(index)}
                                className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200"
                            >
                                <Image
                                    source={{ uri: media.thumbnail || media.url }}
                                    style={{ width: 64, height: 64 }}
                                    contentFit="cover"
                                    transition={200}
                                />
                                {media.type === 'video' && (
                                    <Box className="absolute inset-0 items-center justify-center">
                                        <Box className="w-7 h-7 rounded-full bg-black/50 items-center justify-center">
                                            <Play size={12} color="#fff" fill="#fff" />
                                        </Box>
                                    </Box>
                                )}
                            </Pressable>
                        ))}
                    </HStack>
                )}

                <HStack className="items-center px-1 mt-1">
                    <Pressable
                        onPress={handleToggleLike}
                        hitSlop={8}
                        className="flex-row items-center gap-1.5 py-1 px-2 rounded-full"
                        style={likedByMe ? { backgroundColor: '#fce4ec' } : undefined}
                    >
                        <ThumbsUp
                            size={14}
                            color={likedByMe ? '#d70040' : '#9ca3af'}
                            fill={likedByMe ? '#d70040' : 'transparent'}
                        />
                        {likeCount > 0 && (
                            <Text
                                className="text-xs font-fredoka-medium"
                                style={{ color: likedByMe ? '#d70040' : '#9ca3af' }}
                            >
                                {likeCount}
                            </Text>
                        )}
                    </Pressable>
                </HStack>
            </VStack>

            {mediaItems.length > 0 && (
                <MediaViewerModal
                    isOpen={viewerOpen}
                    onClose={() => setViewerOpen(false)}
                    media={mediaItems}
                    initialIndex={viewerIndex}
                />
            )}
        </>
    );
}
