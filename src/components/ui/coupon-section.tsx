import { useApplyCoupon, useRemoveCoupon, getGetCartQueryKey } from '@/src/api/generated/cart/cart';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import type { GetCart200Coupon } from '@/src/api/generated/model';
import { useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Tag, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, TextInput } from 'react-native';

const couponSchema = z.object({
    code: z.string().min(1, 'Insira um código').max(50),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponSectionProps {
    appliedCoupon: GetCart200Coupon;
}

export function CouponSection({ appliedCoupon }: CouponSectionProps) {
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const invalidateCart = () =>
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });

    const { mutate: applyCoupon, isPending: isApplying } = useApplyCoupon({
        mutation: {
            onSuccess: () => {
                setErrorMessage(null);
                reset();
                invalidateCart();
            },
            onError: () => {
                setErrorMessage('Cupom inválido ou expirado');
            },
        },
    });

    const { mutate: removeCoupon, isPending: isRemoving } = useRemoveCoupon({
        mutation: { onSuccess: invalidateCart },
    });

    const { control, handleSubmit, reset } = useForm<CouponFormData>({
        resolver: zodResolver(couponSchema),
        defaultValues: { code: '' },
    });

    const onSubmit = (data: CouponFormData) => {
        setErrorMessage(null);
        applyCoupon({ data: { code: data.code.trim().toUpperCase() } });
    };

    if (appliedCoupon) {
        return (
            <HStack className="bg-green-50 rounded-xl px-4 py-3 items-center justify-between border border-green-200">
                <HStack className="items-center gap-2">
                    <Tag size={16} color="#16A34A" />
                    <VStack>
                        <Text className="text-sm font-fredoka-semibold text-green-700">
                            {appliedCoupon.code}
                        </Text>
                        <Text className="text-xs font-fredoka text-green-600">
                            Cupom aplicado
                        </Text>
                    </VStack>
                </HStack>
                <Pressable
                    onPress={() => removeCoupon()}
                    disabled={isRemoving}
                    className="w-8 h-8 rounded-full bg-white items-center justify-center"
                    accessibilityLabel="Remover cupom"
                >
                    {isRemoving ? (
                        <ActivityIndicator size="small" color="#525252" />
                    ) : (
                        <X size={16} color="#6B7280" />
                    )}
                </Pressable>
            </HStack>
        );
    }

    return (
        <VStack className="gap-2">
            <HStack className="gap-2">
                <Controller
                    control={control}
                    name="code"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Box className="flex-1 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                            <TextInput
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                placeholder="Código de cupom"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="characters"
                                style={{
                                    fontSize: 14,
                                    color: '#171717',
                                    fontFamily: 'Fredoka_400Regular',
                                }}
                            />
                        </Box>
                    )}
                />
                <Pressable
                    onPress={handleSubmit(onSubmit)}
                    disabled={isApplying}
                    className="bg-primary rounded-xl px-5 items-center justify-center"
                >
                    {isApplying ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text className="text-sm font-fredoka-semibold text-white">
                            Aplicar
                        </Text>
                    )}
                </Pressable>
            </HStack>
            {errorMessage && (
                <Text className="text-xs font-fredoka text-red-500 px-1">
                    {errorMessage}
                </Text>
            )}
        </VStack>
    );
}
