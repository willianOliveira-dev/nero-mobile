import { useRemoveCartItem, useUpdateCartItem } from '@/src/api/generated/cart/cart';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Image } from '@/src/components/gluestack/ui/image';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import type { GetCart200ItemsItem } from '@/src/api/generated/model';
import { useQueryClient } from '@tanstack/react-query';
import { getGetCartQueryKey } from '@/src/api/generated/cart/cart';
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native';

interface CartItemProps {
    item: GetCart200ItemsItem;
}

export function CartItem({ item }: CartItemProps) {
    const queryClient = useQueryClient();

    const invalidateCart = () =>
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });

    const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartItem({
        mutation: { onSuccess: invalidateCart },
    });

    const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem({
        mutation: { onSuccess: invalidateCart },
    });

    const variantLabels = item.sku?.optionLabels
        ? Object.entries(item.sku.optionLabels)
              .map(([key, val]) => `${key}: ${val}`)
              .join(' · ')
        : null;

    const isPending = isUpdating || isRemoving;

    return (
        <HStack
            className="bg-white rounded-2xl p-3 gap-3 border border-gray-100"
            style={{ opacity: isPending ? 0.6 : 1 }}
        >
            <Box className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50">
                {item.product?.imageUrl ? (
                    <Image
                        source={{ uri: item.product.imageUrl }}
                        alt={item.product?.name ?? 'Produto'}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <Box className="w-full h-full items-center justify-center">
                        <ShoppingBag size={24} color="#9CA3AF" />
                    </Box>
                )}
            </Box>

            <VStack className="flex-1 justify-between py-0.5">
                <VStack className="gap-1">
                    <Text
                        className="text-sm font-fredoka-medium text-typography-900"
                        numberOfLines={2}
                    >
                        {item.product?.name ?? 'Produto'}
                    </Text>

                    {variantLabels && (
                        <Text className="text-xs font-fredoka text-gray-500">
                            {variantLabels}
                        </Text>
                    )}
                </VStack>

                <HStack className="items-center justify-between">
                    <Text className="text-base font-fredoka-semibold text-typography-900">
                        {item.subtotal.formatted}
                    </Text>

                    <HStack className="items-center gap-1.5 bg-gray-50 rounded-full px-1.5 py-1">
                        {isPending ? (
                            <Box className="w-20 items-center">
                                <ActivityIndicator size="small" color="#272727" />
                            </Box>
                        ) : (
                            <>
                                {item.quantity <= 1 ? (
                                    <Pressable
                                        onPress={() => removeItem({ itemId: item.id })}
                                        className="w-7 h-7 rounded-full bg-red-50 items-center justify-center"
                                        accessibilityLabel="Remover item"
                                    >
                                        <Trash2 size={14} color="#EF4444" />
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={() =>
                                            updateQuantity({
                                                itemId: item.id,
                                                data: { quantity: item.quantity - 1 },
                                            })
                                        }
                                        className="w-7 h-7 rounded-full bg-white items-center justify-center border border-gray-200"
                                        accessibilityLabel="Diminuir quantidade"
                                    >
                                        <Minus size={14} color="#525252" />
                                    </Pressable>
                                )}

                                <Text className="text-sm font-fredoka-semibold text-typography-900 min-w-[20px] text-center">
                                    {item.quantity}
                                </Text>

                                <Pressable
                                    onPress={() =>
                                        updateQuantity({
                                            itemId: item.id,
                                            data: { quantity: item.quantity + 1 },
                                        })
                                    }
                                    className="w-7 h-7 rounded-full bg-primary items-center justify-center"
                                    accessibilityLabel="Aumentar quantidade"
                                >
                                    <Plus size={14} color="#fff" />
                                </Pressable>
                            </>
                        )}
                    </HStack>
                </HStack>
            </VStack>
        </HStack>
    );
}
