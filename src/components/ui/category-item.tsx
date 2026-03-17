import { cn } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { Box } from '../gluestack/ui/box';
import { Image } from '../gluestack/ui/image';
import { Pressable } from '../gluestack/ui/pressable';
import { Text } from '../gluestack/ui/text';
import { VStack } from '../gluestack/ui/vstack';

export interface CategoryItemProps {
    label: string;
    imageUri: string;
    isActive?: boolean;
    onPress?: () => void;
}

export function CategoryItem({
    label,
    imageUri,
    isActive = false,
    onPress,
}: CategoryItemProps) {
    return (
        <Pressable onPress={onPress}>
            <VStack className="items-center gap-1.5">
                <Box
                    className={cn(
                        'w-14 h-14 rounded-full overflow-hidden border-2',
                        isActive ? 'border-primary' : 'border-transparent',
                    )}
                >
                    <Image
                        source={{ uri: imageUri }}
                        alt={label}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </Box>

                <Text
                    className={cn(
                        'text-xs font-circular',
                        isActive ? 'text-primary' : 'text-text',
                    )}
                >
                    {label}
                </Text>
            </VStack>
        </Pressable>
    );
}
