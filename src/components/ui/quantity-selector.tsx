import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Minus, Plus } from 'lucide-react-native';
import React from 'react';

interface QuantitySelectorProps {
    quantity: number;
    maxStock: number;
    onIncrement: () => void;
    onDecrement: () => void;
}

export function QuantitySelector({
    quantity,
    maxStock,
    onIncrement,
    onDecrement,
}: QuantitySelectorProps) {
    const showLowStockWarning = maxStock > 0 && maxStock <= 10;

    return (
        <VStack className="gap-3">
            <Text className="text-sm font-fredoka-semibold text-typography-900 uppercase tracking-widest">
                Quantidade
            </Text>

            <HStack className="items-center gap-4">
                <Pressable
                    onPress={onDecrement}
                    disabled={quantity <= 1}
                    className={`w-10 h-10 rounded-full items-center justify-center border border-gray-200 ${
                        quantity <= 1 ? 'opacity-30' : ''
                    }`}
                >
                    <Minus size={18} color="#272727" />
                </Pressable>

                <Text className="text-lg font-fredoka-semibold text-typography-900 w-8 text-center">
                    {quantity}
                </Text>

                <Pressable
                    onPress={onIncrement}
                    disabled={quantity >= maxStock}
                    className={`w-10 h-10 rounded-full items-center justify-center border border-gray-200 ${
                        quantity >= maxStock ? 'opacity-30' : ''
                    }`}
                >
                    <Plus size={18} color="#272727" />
                </Pressable>
            </HStack>

            {showLowStockWarning && (
                <Text className="text-xs font-fredoka-medium text-warning">
                    Apenas {maxStock} em estoque
                </Text>
            )}
        </VStack>
    );
}
