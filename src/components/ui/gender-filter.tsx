import { ChevronDown, Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { Box } from '../gluestack/ui/box';
import { HStack } from '../gluestack/ui/hstack';
import { Text } from '../gluestack/ui/text';
import { VStack } from '../gluestack/ui/vstack';

interface Option<T extends string> {
    label: string;
    value: T;
}

interface GenderFilterProps<T extends string> {
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
}

export function GenderFilter<T extends string>({
    options,
    value,
    onChange,
}: GenderFilterProps<T>) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedLabel =
        options.find((o) => o.value === value)?.label ?? 'Todos';

    const handleSelect = (optionValue: T) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <>
            <Pressable
                onPress={() => setIsOpen(true)}
                className="flex-row items-center bg-background-100 rounded-full px-4 py-2 gap-1.5"
            >
                <Text className="text-xs font-fredoka-semibold text-typography-900">
                    {selectedLabel}
                </Text>
                <ChevronDown size={14} color="#525252" />
            </Pressable>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={styles.backdrop}
                    onPress={() => setIsOpen(false)}
                >
                    <Pressable
                        style={styles.sheet}
                        onPress={(e) => e.stopPropagation()}
                    >
                        <VStack className="py-2">
                            <Box className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />
                            <Text className="text-base font-fredoka-semibold text-typography-900 px-5 mb-3">
                                Filtrar por gênero
                            </Text>
                            {options.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <Pressable
                                        key={opt.value}
                                        onPress={() =>
                                            handleSelect(opt.value)
                                        }
                                        style={({ pressed }) => [
                                            styles.option,
                                            pressed && styles.optionPressed,
                                        ]}
                                    >
                                        <HStack className="items-center justify-between px-5 py-3.5">
                                            <Text
                                                className={`text-sm font-fredoka ${
                                                    isSelected
                                                        ? 'text-primary font-fredoka-semibold'
                                                        : 'text-typography-800'
                                                }`}
                                            >
                                                {opt.label}
                                            </Text>
                                            {isSelected && (
                                                <Check
                                                    size={18}
                                                    color="#272727"
                                                />
                                            )}
                                        </HStack>
                                    </Pressable>
                                );
                            })}
                        </VStack>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 32,
    },
    option: {},
    optionPressed: {
        backgroundColor: '#F3F4F6',
    },
});
