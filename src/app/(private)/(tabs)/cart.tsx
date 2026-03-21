import { useGetCart, useClearCart, getGetCartQueryKey } from '@/src/api/generated/cart/cart';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { CartItem } from '@/src/components/ui/cart-item';
import { CouponSection } from '@/src/components/ui/coupon-section';
import { SkeletonBox } from '@/src/components/ui/skeleton-box';
import { useCartStore } from '@/src/store/use-cart-store';
import type { GetCart200ItemsItem } from '@/src/api/generated/model';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { FlatList, StatusBar, RefreshControl } from 'react-native';

function CartSkeleton() {
    return (
        <VStack className="px-5 py-4 gap-4">
            {[1, 2, 3].map((i) => (
                <HStack key={i} className="gap-3">
                    <SkeletonBox width={96} height={96} borderRadius={16} />
                    <VStack className="flex-1 justify-between py-1">
                        <VStack className="gap-2">
                            <SkeletonBox width="80%" height={14} borderRadius={4} />
                            <SkeletonBox width="50%" height={12} borderRadius={4} />
                        </VStack>
                        <HStack className="items-center justify-between">
                            <SkeletonBox width={70} height={18} borderRadius={4} />
                            <SkeletonBox width={90} height={28} borderRadius={14} />
                        </HStack>
                    </VStack>
                </HStack>
            ))}
            <SkeletonBox width="100%" height={48} borderRadius={12} />
            <VStack className="gap-3 mt-2">
                <SkeletonBox width="100%" height={16} borderRadius={4} />
                <SkeletonBox width="100%" height={16} borderRadius={4} />
                <SkeletonBox width="100%" height={20} borderRadius={4} />
            </VStack>
        </VStack>
    );
}

function EmptyCart() {
    const router = useRouter();
    return (
        <VStack className="flex-1 items-center justify-center px-10 gap-5">
            <Box className="w-24 h-24 rounded-full bg-gray-100 items-center justify-center">
                <ShoppingBag size={40} color="#9CA3AF" />
            </Box>
            <VStack className="items-center gap-2">
                <Text className="text-lg font-fredoka-semibold text-typography-900">
                    Seu carrinho está vazio
                </Text>
                <Text className="text-sm font-fredoka text-gray-500 text-center">
                    Explore nossa loja e encontre produtos incríveis para adicionar ao seu carrinho!
                </Text>
            </VStack>
            <Pressable
                onPress={() => router.push('/home')}
                className="bg-primary rounded-full px-8 py-3.5 mt-2"
            >
                <Text className="text-sm font-fredoka-semibold text-white">
                    Explorar Produtos
                </Text>
            </Pressable>
        </VStack>
    );
}

export default function CartScreen() {
    const router = useRouter();
    const { goBack } = useSafeBack();
    const queryClient = useQueryClient();
    const setItemCount = useCartStore((s) => s.setItemCount);

    const { data: cart, isPending, refetch, isRefetching } = useGetCart();

    const { mutate: clearCart, isPending: isClearing } = useClearCart({
        mutation: {
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() }),
            meta: {
                successMessage: 'Seu carrinho foi esvaziado!',
            }
        },
    });

    useEffect(() => {
        if (cart) {
            setItemCount(cart.totals.itemCount);
        }
    }, [cart, setItemCount]);

    if (isPending) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <StatusBar barStyle="dark-content" />
                <HStack className="items-center justify-between px-5 py-3">
                    <Pressable onPress={() => goBack()}>
                        <ArrowLeft size={22} color="#272727" />
                    </Pressable>
                    <Text className="text-lg font-fredoka-semibold text-typography-900">
                        Carrinho
                    </Text>
                    <Box className="w-6" />
                </HStack>
                <CartSkeleton />
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: GetCart200ItemsItem }) => (
        <Box className="px-5 mb-3">
            <CartItem item={item} />
        </Box>
    );

    const discountCents = cart ? cart.totals.subtotal.cents + cart.totals.shipping.cents - cart.totals.total.cents : 0;
    const discountFormatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discountCents / 100);

    const ListFooter = cart ? (
        <VStack className="px-5 gap-4 pb-36">
            <CouponSection appliedCoupon={cart.coupon} />

            <VStack className="bg-gray-50 rounded-2xl px-5 py-4 gap-3 border border-gray-100">
                <HStack className="items-center justify-between">
                    <Text className="text-sm font-fredoka text-gray-500">Subtotal</Text>
                    <Text className="text-sm font-fredoka-medium text-typography-800">
                        {cart.totals.subtotal.formatted}
                    </Text>
                </HStack>
                <HStack className="items-center justify-between">
                    <Text className="text-sm font-fredoka text-gray-500">Frete</Text>
                    <Text className="text-sm font-fredoka-medium text-typography-800">
                        {cart.totals.shipping.cents === 0
                            ? 'Grátis'
                            : cart.totals.shipping.formatted}
                    </Text>
                </HStack>
                {cart.coupon && discountCents > 0 && (
                    <HStack className="items-center justify-between">
                        <Text className="text-sm font-fredoka text-green-600">Desconto ({cart.coupon.code})</Text>
                        <Text className="text-sm font-fredoka-medium text-green-600">
                            - {discountFormatted}
                        </Text>
                    </HStack>
                )}
                {cart.totals.tax.cents > 0 && (
                    <HStack className="items-center justify-between">
                        <Text className="text-sm font-fredoka text-gray-500">Impostos</Text>
                        <Text className="text-sm font-fredoka-medium text-typography-800">
                            {cart.totals.tax.formatted}
                        </Text>
                    </HStack>
                )}
                <Box className="h-px bg-gray-200 my-1" />
                <HStack className="items-center justify-between">
                    <Text className="text-base font-fredoka-semibold text-typography-900">
                        Total
                    </Text>
                    <Text className="text-xl font-fredoka-bold text-typography-900">
                        {cart.totals.total.formatted}
                    </Text>
                </HStack>
            </VStack>

            <Pressable
                className="bg-primary rounded-full py-4 items-center"
                onPress={() => router.push('/checkout' as Href)}
            >
                <Text className="text-base font-fredoka-semibold text-white">
                    Finalizar Compra
                </Text>
            </Pressable>
        </VStack>
    ) : null;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />

            <HStack className="items-center justify-between px-5 py-3">
                <Pressable onPress={() => router.back()}>
                    <ArrowLeft size={22} color="#272727" />
                </Pressable>
                <Text className="text-lg font-fredoka-semibold text-typography-900">
                    Carrinho ({cart?.totals?.itemCount ?? 0})
                </Text>
                <Pressable
                    onPress={() => clearCart()}
                    disabled={isClearing || !cart || cart.items.length === 0}
                    accessibilityLabel="Limpar carrinho"
                >
                    <Trash2 size={20} color={isClearing ? '#D1D5DB' : '#EF4444'} />
                </Pressable>
            </HStack>

            <FlatList
                data={cart?.items ?? []}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={<EmptyCart />}
                ListFooterComponent={cart && cart.items.length > 0 ? ListFooter : null}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 8, flexGrow: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                        colors={['#d70040']}
                        tintColor="#d70040"
                    />
                }
            />
        </SafeAreaView>
    );
}
