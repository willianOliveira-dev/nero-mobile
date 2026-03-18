import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '../gluestack/ui/box';
import { HStack } from '../gluestack/ui/hstack';
import { VStack } from '../gluestack/ui/vstack';
import { SkeletonBox } from './skeleton-box';

function ProductCardSkeleton() {
    return (
        <VStack className="w-40 rounded-xl overflow-hidden border border-gray-100">
            <SkeletonBox width={160} height={224} borderRadius={0} />
            <VStack className="p-2 gap-2">
                <SkeletonBox width={120} height={14} borderRadius={4} />
                <SkeletonBox width={80} height={12} borderRadius={4} />
                <SkeletonBox width={100} height={20} borderRadius={4} />
            </VStack>
        </VStack>
    );
}

function SectionSkeleton() {
    return (
        <VStack className="gap-4 mb-6">
            <SkeletonBox width={140} height={18} borderRadius={4} />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginHorizontal: -24 }}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            >
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
            </ScrollView>
        </VStack>
    );
}

export function HomeSkeleton() {
    return (
        <VStack className="flex-1 px-6 pt-4 pb-24">
            {/* Header skeleton */}
            <HStack className="items-center justify-between mb-4">
                <SkeletonBox width={48} height={48} borderRadius={24} />
                <SkeletonBox width={100} height={36} borderRadius={18} />
                <SkeletonBox width={40} height={40} borderRadius={20} />
            </HStack>

            {/* Search bar skeleton */}
            <Box className="mb-6">
                <SkeletonBox width="100%" height={44} borderRadius={22} />
            </Box>

            {/* Categories skeleton */}
            <VStack className="gap-4 mb-6">
                <SkeletonBox width={100} height={18} borderRadius={4} />
                <HStack className="justify-between items-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <VStack key={i} className="items-center gap-2">
                            <SkeletonBox width={52} height={52} borderRadius={26} />
                            <SkeletonBox width={48} height={12} borderRadius={4} />
                        </VStack>
                    ))}
                </HStack>
            </VStack>

            {/* Sections skeleton */}
            <SectionSkeleton />
            <SectionSkeleton />
        </VStack>
    );
}
