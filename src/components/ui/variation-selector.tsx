import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import type { GetProductBySlug200VariationTypes } from '@/src/api/generated/model/getProductBySlug200VariationTypes';
import { ChevronDown } from 'lucide-react-native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { SelectOptionSheet } from './select-option-sheet';

// Single variationType item extracted from the nullable array
type VariationTypeItem = NonNullable<GetProductBySlug200VariationTypes>[number];
type OptionItem = VariationTypeItem['options'][number];

const INLINE_THRESHOLD = 6;

interface VariationSelectorProps {
    variationType: VariationTypeItem;
    selectedOptionId: string | undefined;
    onSelect: (variationTypeId: string, optionId: string) => void;
    isOptionAvailable: (variationTypeId: string, optionId: string) => boolean;
}

export function VariationSelector({
    variationType,
    selectedOptionId,
    onSelect,
    isOptionAvailable,
}: VariationSelectorProps) {
    const [sheetVisible, setSheetVisible] = useState(false);
    const useInline = variationType.options.length <= INLINE_THRESHOLD;

    const selectedOption = variationType.options.find(
        (o) => o.id === selectedOptionId,
    );

    return (
        <VStack className="gap-3">
            <Text className="text-sm font-fredoka-semibold text-typography-900 uppercase tracking-widest">
                {variationType.name}
                {selectedOption && (
                    <Text className="text-sm font-fredoka text-secondary-muted normal-case tracking-normal">
                        {' '}— {selectedOption.value}
                    </Text>
                )}
            </Text>

            {useInline ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10 }}
                >
                    {variationType.options.map((option) => (
                        <InlineChip
                            key={option.id}
                            option={option}
                            isSelected={selectedOptionId === option.id}
                            isAvailable={isOptionAvailable(variationType.id, option.id)}
                            hasImage={variationType.hasImage}
                            onPress={() => onSelect(variationType.id, option.id)}
                        />
                    ))}
                </ScrollView>
            ) : (
                <>
                    <Pressable
                        onPress={() => setSheetVisible(true)}
                        className="flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    >
                        <Text className="text-sm font-fredoka-medium text-typography-900">
                            {selectedOption?.value ?? 'Selecione'}
                        </Text>
                        <ChevronDown size={18} color="#6B7280" />
                    </Pressable>

                    <SelectOptionSheet
                        visible={sheetVisible}
                        title={variationType.name}
                        options={variationType.options.map((o) => ({
                            id: o.id,
                            label: o.value,
                            imageUrl: o.imageUrl,
                            isAvailable: isOptionAvailable(variationType.id, o.id),
                        }))}
                        selectedId={selectedOptionId}
                        onSelect={(optionId) => {
                            onSelect(variationType.id, optionId);
                        }}
                        onClose={() => setSheetVisible(false)}
                    />
                </>
            )}
        </VStack>
    );
}

// ── Inline Chip ──────────────────────────────────────────────────────────

interface InlineChipProps {
    option: OptionItem;
    isSelected: boolean;
    isAvailable: boolean;
    hasImage: boolean;
    onPress: () => void;
}

function InlineChip({
    option,
    isSelected,
    isAvailable,
    hasImage,
    onPress,
}: InlineChipProps) {
    const showImage = hasImage && option.imageUrl;

    return (
        <Pressable
            onPress={onPress}
            disabled={!isAvailable}
            className={`relative items-center justify-center rounded-xl border-2 overflow-hidden ${
                isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 bg-white'
            } ${!isAvailable ? 'opacity-40' : ''}`}
            style={showImage ? { width: 56, height: 56 } : undefined}
        >
            {showImage ? (
                <Image
                    source={{ uri: option.imageUrl ?? undefined }}
                    style={{ width: 52, height: 52, borderRadius: 10 }}
                    contentFit="cover"
                    transition={200}
                />
            ) : (
                <Box className="px-4 py-2.5">
                    <Text className="text-sm font-fredoka-medium text-typography-900">
                        {option.value}
                    </Text>
                </Box>
            )}

            {/* Diagonal strikeout for unavailable options */}
            {!isAvailable && (
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: '140%',
                            height: 1.5,
                            backgroundColor: '#EF4444',
                            transform: [{ rotate: '-45deg' }],
                        }}
                    />
                </View>
            )}
        </Pressable>
    );
}
