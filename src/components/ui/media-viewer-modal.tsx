import React, { useState } from 'react';
import { Dimensions, FlatList, Modal, StatusBar, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type MediaItem = {
    url: string;
    type: 'image' | 'video';
    thumbnail?: string | null;
};

type MediaViewerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    media: MediaItem[];
    initialIndex?: number;
};

function VideoPlayer({ uri }: { uri: string }) {
    const player = useVideoPlayer(uri, (p) => {
        p.loop = false;
    });

    return (
        <Box
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
            className="items-center justify-center bg-black"
        >
            <VideoView
                player={player}
                style={styles.video}
                contentFit="contain"
                nativeControls
            />
        </Box>
    );
}

export function MediaViewerModal({
    isOpen,
    onClose,
    media,
    initialIndex = 0,
}: MediaViewerModalProps) {
    const [activeIndex, setActiveIndex] = useState(initialIndex);

    const renderItem = ({ item }: { item: MediaItem }) => {
        if (item.type === 'video') {
            return <VideoPlayer uri={item.url} />;
        }

        return (
            <Box
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
                className="items-center justify-center bg-black"
            >
                <Image
                    source={{ uri: item.url }}
                    style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.75 }}
                    contentFit="contain"
                    transition={200}
                />
            </Box>
        );
    };

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <StatusBar barStyle="light-content" />
            <Box className="flex-1 bg-black">
                <Pressable
                    onPress={onClose}
                    className="absolute top-14 right-5 z-10 w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                >
                    <X size={20} color="#ffffff" />
                </Pressable>

                {media.length > 1 && (
                    <Box className="absolute top-14 left-5 z-10 px-3 py-1.5 rounded-full bg-white/20">
                        <Text className="text-xs font-fredoka-semibold text-white">
                            {activeIndex + 1} / {media.length}
                        </Text>
                    </Box>
                )}
                <FlatList
                    data={media}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => String(index)}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    initialScrollIndex={initialIndex}
                    getItemLayout={(_, index) => ({
                        length: SCREEN_WIDTH,
                        offset: SCREEN_WIDTH * index,
                        index,
                    })}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(
                            e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
                        );
                        setActiveIndex(index);
                    }}
                />
                {media.length > 1 && (
                    <HStack className="absolute bottom-12 self-center gap-2">
                        {media.map((_, index) => (
                            <Box
                                key={index}
                                className={`w-2 h-2 rounded-full ${
                                    index === activeIndex ? 'bg-white' : 'bg-white/40'
                                }`}
                            />
                        ))}
                    </HStack>
                )}
            </Box>
        </Modal>
    );
}

const styles = StyleSheet.create({
    video: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.75,
    },
});
