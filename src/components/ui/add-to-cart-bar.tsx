import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Box } from '@/src/components/gluestack/ui/box';
import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AddToCartBarProps {
    isOutOfStock: boolean;
    totalValue: number;
    quantity: number;
    hasVariations: boolean;
    allVariationsSelected: boolean;
    onAddToCart: () => void;
}

export function AddToCartBar({
    isOutOfStock,
    totalValue,
    quantity,
    hasVariations,
    allVariationsSelected,
    onAddToCart,
}: AddToCartBarProps) {
    const insets = useSafeAreaInsets();

    const isDisabled = isOutOfStock || (hasVariations && !allVariationsSelected);

    const label = isOutOfStock
        ? 'Esgotado'
        : hasVariations && !allVariationsSelected
          ? 'Selecione as opções'
          : 'Adicionar ao Carrinho';

    const total = totalValue * quantity;
    const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(total);

    return (
        <Box
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5"
            style={{ paddingBottom: insets.bottom + 12, paddingTop: 12 }}
        >
            <HStack className="items-center justify-between">
                {!isDisabled && (
                    <Text className="text-lg font-fredoka-bold text-typography-900">
                        {formattedTotal}
                    </Text>
                )}

                <Pressable
                    onPress={onAddToCart}
                    disabled={isDisabled}
                    className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-full ${
                        isDisabled ? 'bg-gray-200' : 'bg-primary'
                    } ${!isDisabled ? '' : ''} ${isDisabled ? '' : 'ml-4'}`}
                    style={isDisabled ? { marginLeft: 0 } : undefined}
                >
                    {!isDisabled && <ShoppingCart size={18} color="#ffffff" />}
                    <Text
                        className={`text-sm font-fredoka-semibold ${
                            isDisabled ? 'text-gray-400' : 'text-white'
                        }`}
                    >
                        {label}
                    </Text>
                </Pressable>
            </HStack>
        </Box>
    );
}
