import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { Check, X } from 'lucide-react-native';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, ScrollView } from 'react-native';
import { imagesPath } from '@/src/constants/images';

export interface SheetOptionItem {
    id: string;
    label: string;
    imageUrl?: string | null;
    isAvailable: boolean;
}

interface SelectOptionSheetProps {
    visible: boolean;
    title: string;
    options: SheetOptionItem[];
    selectedId: string | undefined;
    onSelect: (optionId: string) => void;
    onClose: () => void;
}

export function SelectOptionSheet({
    visible,
    title,
    options,
    selectedId,
    onSelect,
    onClose,
}: SelectOptionSheetProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Box className="flex-1 justify-end">
                <Pressable
                    onPress={onClose}
                    className="absolute inset-0 bg-black/50"
                />

                <Box className="bg-white rounded-t-3xl w-full max-h-3/4 overflow-hidden shadow-lg">
                    <Box className="w-full items-center pt-4 pb-1">
                        <Box className="w-12 h-1.5 rounded-full bg-gray-200" />
                    </Box>

                    <HStack className="items-center justify-between px-8 py-4">
                        <Text className="text-2xl font-fredoka-bold text-typography-900">
                            {title}
                        </Text>
                        <Pressable
                            onPress={onClose}
                            className="p-2 rounded-full bg-gray-50"
                        >
                            <X size={20} color="#272727" />
                        </Pressable>
                    </HStack>

                    <ScrollView
                        className="px-6"
                        showsVerticalScrollIndicator
                        contentContainerStyle={{
                            paddingBottom: 40,
                            gap: 12,
                        }}
                        style={{ flexGrow: 0 }}
                        bounces
                    >
                        {options.map((option) => {
                            const isActive = selectedId === option.id;
                            const isDisabled = !option.isAvailable;

                            return (
                                <Pressable
                                    key={option.id}
                                    onPress={() => {
                                        if (!isDisabled) {
                                            onSelect(option.id);
                                            onClose();
                                        }
                                    }}
                                    disabled={isDisabled}
                                    className={isDisabled ? 'opacity-40' : ''}
                                >
                                    <HStack
                                        className={`h-16 rounded-2xl items-center justify-between px-6 ${
                                            isActive
                                                ? 'bg-primary'
                                                : 'bg-gray-50'
                                        }`}
                                    >
                                        <HStack className="items-center gap-4">
                                            {option.imageUrl && (
                                                <Image
                                                    source={option.imageUrl ? { uri: option.imageUrl } : imagesPath.neroPlaceholder}
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 8,
                                                    }}
                                                    contentFit="cover"
                                                    transition={200}
                                                />
                                            )}
                                            <Text
                                                className={`text-base font-fredoka-semibold ${
                                                    isActive
                                                        ? 'text-white'
                                                        : 'text-typography-900'
                                                }`}
                                            >
                                                {option.label}
                                            </Text>
                                            {isDisabled && (
                                                <Text className="text-xs font-fredoka text-gray-400">
                                                    Indisponível
                                                </Text>
                                            )}
                                        </HStack>

                                        {isActive && (
                                            <Check size={20} color="#ffffff" />
                                        )}
                                    </HStack>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </Box>
            </Box>
        </Modal>
    );
}
