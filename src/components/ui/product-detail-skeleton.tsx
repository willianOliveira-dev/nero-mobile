import React from 'react';
import { Box } from '../gluestack/ui/box';
import { HStack } from '../gluestack/ui/hstack';
import { SafeAreaView } from '../gluestack/ui/safe-area-view';
import { VStack } from '../gluestack/ui/vstack';
import { SkeletonBox } from './skeleton-box';

export function ProductDetailSkeleton() {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <SkeletonBox width="100%" height={400} borderRadius={0} />

            <VStack className="px-5 py-7 gap-7">
                <SkeletonBox width={80} height={14} borderRadius={4} />

                <VStack className="gap-2">
                    <SkeletonBox width="90%" height={22} borderRadius={4} />
                    <SkeletonBox width="60%" height={22} borderRadius={4} />
                </VStack>

                <HStack className="items-center gap-2">
                    <SkeletonBox width={80} height={16} borderRadius={4} />
                    <SkeletonBox width={60} height={16} borderRadius={4} />
                </HStack>

                <SkeletonBox width={140} height={28} borderRadius={4} />

                <VStack className="gap-4">
                    <SkeletonBox width={70} height={14} borderRadius={4} />
                    <HStack className="gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <SkeletonBox
                                key={i}
                                width={56}
                                height={56}
                                borderRadius={28}
                            />
                        ))}
                    </HStack>
                </VStack>

                <VStack className="gap-4">
                    <SkeletonBox width={70} height={14} borderRadius={4} />
                    <HStack className="gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <SkeletonBox
                                key={i}
                                width={48}
                                height={36}
                                borderRadius={8}
                            />
                        ))}
                    </HStack>
                </VStack>

                <HStack className="items-center gap-4">
                    <SkeletonBox width={90} height={14} borderRadius={4} />
                    <SkeletonBox width={120} height={40} borderRadius={8} />
                </HStack>

                <VStack className="gap-2">
                    <SkeletonBox width={90} height={14} borderRadius={4} />
                    <SkeletonBox width="100%" height={14} borderRadius={4} />
                    <SkeletonBox width="100%" height={14} borderRadius={4} />
                    <SkeletonBox width="70%" height={14} borderRadius={4} />
                </VStack>
            </VStack>

            <Box className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-white border-t border-gray-100">
                <SkeletonBox width="100%" height={52} borderRadius={26} />
            </Box>
        </SafeAreaView>
    );
}
