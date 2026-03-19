import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { Href } from 'expo-router';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { useStripe } from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
    ArrowLeft,
    ChevronRight,
    CreditCard,
    MapPin,
    ShoppingBag,
} from 'lucide-react-native';

import { useGetCart, getGetCartQueryKey } from '@/src/api/generated/cart/cart';
import { getListOrdersQueryKey } from '@/src/api/generated/orders/orders';
import { useGetDefaultAddress } from '@/src/api/generated/addresses/addresses';
import { useListPaymentMethods } from '@/src/api/generated/payment-methods/payment-methods';
import { useCreatePaymentIntent } from '@/src/api/generated/payments/payments';
import type { GetCart200ItemsItem } from '@/src/api/generated/model';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { Image } from '@/src/components/gluestack/ui/image';
import { CardBrandLogo, type CardBrand } from '@/src/components/ui/card-brand-logo';
import { useCartStore } from '@/src/store/use-cart-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function CheckoutItem({ item }: { item: GetCart200ItemsItem }) {
    return (
        <HStack className="bg-white rounded-2xl p-3 gap-3 border border-border mb-2">
            <Box className="w-16 h-16 rounded-xl overflow-hidden bg-surface-muted">
                {item.product?.imageUrl ? (
                    <Image
                        source={{ uri: item.product.imageUrl }}
                        alt={item.product?.name ?? 'Produto'}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <Box className="w-full h-full items-center justify-center">
                        <ShoppingBag size={20} color="#9CA3AF" />
                    </Box>
                )}
            </Box>
            <VStack className="flex-1 justify-between">
                <Text className="text-sm font-fredoka-medium text-secondary" numberOfLines={1}>
                    {item.product?.name ?? 'Produto'}
                </Text>
                <HStack className="items-center justify-between">
                    <Text className="text-xs font-fredoka text-text-muted">
                        Qtd: {item.quantity}
                    </Text>
                    <Text className="text-sm font-fredoka-semibold text-secondary">
                        {item.subtotal.formatted}
                    </Text>
                </HStack>
            </VStack>
        </HStack>
    );
}

function SectionHeader({
    title,
    onPress,
    actionLabel,
}: {
    title: string;
    onPress?: () => void;
    actionLabel?: string;
}) {
    return (
        <HStack className="items-center justify-between mb-3 mt-5">
            <Text className="text-base font-fredoka-semibold text-secondary">{title}</Text>
            {onPress && (
                <Pressable onPress={onPress} className="flex-row items-center gap-1">
                    <Text className="text-xs font-fredoka-semibold text-primary">
                        {actionLabel || 'Trocar'}
                    </Text>
                    <ChevronRight size={14} color="#d70040" />
                </Pressable>
            )}
        </HStack>
    );
}

function SummaryRow({
    label,
    value,
    bold = false,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    return (
        <HStack className="items-center justify-between py-1.5">
            <Text
                className={`text-sm ${bold ? 'font-fredoka-semibold' : 'font-fredoka'} text-text-muted`}
            >
                {label}
            </Text>
            <Text
                className={`text-sm ${bold ? 'font-fredoka-bold text-secondary' : 'font-fredoka-semibold text-secondary'}`}
            >
                {value}
            </Text>
        </HStack>
    );
}

export default function CheckoutScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { goBack } = useSafeBack();
    const queryClient = useQueryClient();
    const { confirmPayment } = useStripe();
    const params = useLocalSearchParams<{ addressId?: string }>();
    const setItemCount = useCartStore((s) => s.setItemCount);

    const { data: cart, isPending: isCartLoading } = useGetCart();
    const { data: defaultAddress, isPending: isAddressLoading } = useGetDefaultAddress();
    const { data: methods, isPending: isMethodsLoading } = useListPaymentMethods();
    const { mutateAsync: createPaymentIntent, isPending: isCreatingPayment } =
        useCreatePaymentIntent();

    const [isProcessing, setIsProcessing] = useState(false);

    const selectedAddress = useMemo(() => {
        if (params.addressId && defaultAddress) {
            return defaultAddress;
        }
        return defaultAddress;
    }, [params.addressId, defaultAddress]);

    const defaultCard = useMemo(() => {
        return methods?.find((m) => m.isDefault) || methods?.[0];
    }, [methods]);

    const isPending = isCartLoading || isAddressLoading || isMethodsLoading;

    const handleConfirmPayment = async () => {
        if (!selectedAddress) {
            Alert.alert('Atenção', 'Selecione um endereço de entrega.');
            return;
        }
        if (!defaultCard) {
            Alert.alert('Atenção', 'Adicione um cartão de pagamento.');
            return;
        }
        if (!cart || cart.items.length === 0) {
            Alert.alert('Atenção', 'Seu carrinho está vazio.');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await createPaymentIntent({
                data: {
                    shippingAddressId: params.addressId || selectedAddress.id,
                    paymentMethodId: defaultCard.id,
                    couponCode: cart.coupon?.code,
                },
            });

            const { error } = await confirmPayment(result.clientSecret);

            if (error) {
                Alert.alert('Erro no Pagamento', error.message);
                return;
            }

            queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
            queryClient.invalidateQueries({ queryKey: getListOrdersQueryKey() });
            setItemCount(0);

            Alert.alert(
                'Pedido Confirmado! 🎉',
                'Seu pagamento foi processado com sucesso.',
                [
                    {
                        text: 'Ver Pedidos',
                        onPress: () => router.replace('/profile'),
                    },
                    {
                        text: 'Continuar Comprando',
                        onPress: () => router.replace('/home'),
                    },
                ],
            );
        } catch {
            Alert.alert('Erro', 'Não foi possível processar o pagamento. Tente novamente.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (isPending) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#d70040" />
            </SafeAreaView>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <HStack className="items-center px-5 py-3">
                    <Pressable onPress={() => goBack()}>
                        <ArrowLeft size={22} color="#272727" />
                    </Pressable>
                </HStack>
                <VStack className="flex-1 items-center justify-center gap-4">
                    <ShoppingBag size={48} color="#9CA3AF" />
                    <Text className="text-base font-fredoka-semibold text-secondary">
                        Carrinho vazio
                    </Text>
                </VStack>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />
            <Box className='flex-1' style={{ paddingBottom: insets.bottom }}>
                <HStack className="items-center justify-between px-5 py-3">
                    <Pressable onPress={() => goBack()}>
                        <ArrowLeft size={22} color="#272727" />
                    </Pressable>
                    <Text className="text-lg font-fredoka-semibold text-secondary">Checkout</Text>
                    <Box className="w-6" />
                </HStack>

                <FlatList
                    data={cart.items}
                    renderItem={({ item }) => <CheckoutItem item={item} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 200 }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <Text className="text-sm font-fredoka text-text-muted mb-2">
                            {cart.totals.itemCount} {cart.totals.itemCount === 1 ? 'item' : 'itens'}
                        </Text>
                    }
                    ListFooterComponent={
                        <VStack>
                            <SectionHeader
                                title="Endereço de Entrega"
                                onPress={() => router.push('/checkout/address' as Href)}
                            />
                            {selectedAddress ? (
                                <Pressable
                                    onPress={() => router.push('/checkout/address' as Href)}
                                    className="bg-surface-muted rounded-2xl p-4"
                                >
                                    <HStack className="items-start gap-3">
                                        <Box className="w-10 h-10 rounded-full bg-primary-muted items-center justify-center">
                                            <MapPin size={18} color="#d70040" />
                                        </Box>
                                        <VStack className="flex-1 gap-0.5">
                                            <Text className="text-sm font-fredoka-semibold text-secondary">
                                                {selectedAddress.label || selectedAddress.recipientName}
                                            </Text>
                                            <Text
                                                className="text-xs font-fredoka text-text-muted"
                                                numberOfLines={2}
                                            >
                                                {selectedAddress.street}
                                                {selectedAddress.complement
                                                    ? `, ${selectedAddress.complement}`
                                                    : ''}
                                            </Text>
                                            <Text className="text-xs font-fredoka text-text-muted">
                                                {selectedAddress.city} - {selectedAddress.state}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                </Pressable>
                            ) : (
                                <Pressable
                                    onPress={() => router.push('/checkout/address' as Href)}
                                    className="bg-surface-muted rounded-2xl p-4 items-center"
                                >
                                    <Text className="text-sm font-fredoka-semibold text-primary">
                                        Selecionar Endereço
                                    </Text>
                                </Pressable>
                            )}

                            <SectionHeader
                                title="Forma de Pagamento"
                                onPress={() => router.push('/checkout/payment' as Href)}
                            />
                            {defaultCard ? (
                                <Pressable
                                    onPress={() => router.push('/checkout/payment' as Href)}
                                    className="bg-surface-muted rounded-2xl p-4"
                                >
                                    <HStack className="items-center gap-3">
                                        <CardBrandLogo
                                            brand={defaultCard.brand as CardBrand}
                                            size="md"
                                        />
                                        <VStack className="flex-1">
                                            <Text className="text-sm font-fredoka-semibold text-secondary">
                                                •••• {defaultCard.last4}
                                            </Text>
                                            <Text className="text-xs font-fredoka text-text-muted">
                                                Vence{' '}
                                                {String(defaultCard.expMonth).padStart(2, '0')}/
                                                {String(defaultCard.expYear).slice(-2)}
                                            </Text>
                                        </VStack>
                                        <ChevronRight size={18} color="#9CA3AF" />
                                    </HStack>
                                </Pressable>
                            ) : (
                                <Pressable
                                    onPress={() => router.push('/checkout/payment' as Href)}
                                    className="bg-surface-muted rounded-2xl p-4 flex-row items-center justify-center gap-2"
                                >
                                    <CreditCard size={18} color="#d70040" />
                                    <Text className="text-sm font-fredoka-semibold text-primary">
                                        Adicionar Cartão
                                    </Text>
                                </Pressable>
                            )}

                            <SectionHeader title="Resumo" />
                            <VStack className="bg-surface-muted rounded-2xl p-4">
                                <SummaryRow
                                    label="Subtotal"
                                    value={cart.totals.subtotal.formatted}
                                />
                                <SummaryRow
                                    label="Frete"
                                    value={cart.totals.shipping.formatted}
                                />
                                {cart.coupon && (
                                    <SummaryRow
                                        label={`Cupom (${cart.coupon.code})`}
                                        value={`-${cart.totals.discount.formatted}`}
                                    />
                                )}
                                <Box className="border-t border-border my-2" />
                                <SummaryRow
                                    label="Total"
                                    value={cart.totals.total.formatted}
                                    bold
                                />
                            </VStack>
                        </VStack>
                    }
                />

                <Box className="absolute bottom-0 left-0 right-0 bg-white border-t border-border px-5 pb-8 pt-4">
                    <HStack className="items-center justify-between mb-3">
                        <Text className="text-sm font-fredoka text-text-muted">Total</Text>
                        <Text className="text-xl font-fredoka-bold text-secondary">
                            {cart.totals.total.formatted}
                        </Text>
                    </HStack>
                    <Pressable
                        onPress={handleConfirmPayment}
                        disabled={isProcessing || isCreatingPayment}
                        className="bg-primary rounded-full py-4 items-center"
                    >
                        {isProcessing || isCreatingPayment ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-base font-fredoka-semibold text-white">
                                Confirmar Pedido
                            </Text>
                        )}
                    </Pressable>
                </Box>
            </Box>
        </SafeAreaView>
    );
}
