import { Box } from '@/src/components/gluestack/ui/box';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, type ViewToken } from 'react-native';
import { imagesPath } from '@/src/constants/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 420;

interface ProductImageGalleryProps {
    images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList<string>>(null);

    const onViewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: ViewToken<string>[] }) => {
            if (viewableItems.length > 0 && viewableItems[0].index !== null) {
                setActiveIndex(viewableItems[0].index);
            }
        },
        [],
    );

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    if (images.length === 0) {
        return (
            <Box
                className="w-full bg-gray-100 items-center justify-center"
                style={{ height: IMAGE_HEIGHT }}
            />
        );
    }

    return (
        <Box className="w-full relative">
            <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${item}-${index}`}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => (
                    <Box style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}>
                        <Image
                            source={item ? { uri: item } : imagesPath.neroPlaceholder}
                            style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                            contentFit="cover"
                            transition={200}
                        />
                    </Box>
                )}
            />

            {images.length > 1 && (
                <Box className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-1.5">
                    {images.map((_, index) => (
                        <Box
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                                index === activeIndex
                                    ? 'bg-primary'
                                    : 'bg-white/60'
                            }`}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}
