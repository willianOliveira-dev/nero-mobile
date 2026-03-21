import React, { useMemo } from 'react';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Text } from '@/src/components/gluestack/ui/text';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Box } from '@/src/components/gluestack/ui/box';
import { ChevronLeft, ChevronRight, Package, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react-native';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { useListOrders } from '@/src/api/generated/orders/orders';

function OrderStatusBadge({ status }: { status: string }) {
    let bg = 'bg-gray-100';
    let text = 'text-gray-600';
    let label = 'Desconhecido';
    let Icon = Clock;

    switch (status) {
        case 'pending':
            bg = 'bg-orange-100';
            text = 'text-orange-700';
            label = 'Pendente';
            break;
        case 'paid':
            bg = 'bg-green-100';
            text = 'text-green-700';
            label = 'Pago';
            Icon = CheckCircle2;
            break;
        case 'processing':
            bg = 'bg-blue-100';
            text = 'text-blue-700';
            label = 'Processando';
            Icon = Package;
            break;
        case 'shipped':
            bg = 'bg-purple-100';
            text = 'text-purple-700';
            label = 'Enviado';
            Icon = Truck;
            break;
        case 'delivered':
            bg = 'bg-green-100';
            text = 'text-green-700';
            label = 'Entregue';
            Icon = CheckCircle2;
            break;
        case 'cancelled':
            bg = 'bg-red-100';
            text = 'text-red-700';
            label = 'Cancelado';
            Icon = XCircle;
            break;
    }

    return (
        <HStack className={`${bg} px-2 py-1 rounded-full items-center gap-1`}>
            <Icon size={12} className={text} />
            <Text className={`text-[10px] font-fredoka-semibold uppercase ${text}`}>
                {label}
            </Text>
        </HStack>
    );
}

export default function OrdersListScreen() {
    const router = useRouter();
    
    const { data: ordersResponse, isPending, refetch, isRefetching } = useListOrders();

    const orders = useMemo(() => {
        if (!ordersResponse?.data) return [];
        return [...ordersResponse.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }, [ordersResponse]);

    const handlePressOrder = (id: string) => {
        router.push(`/orders/${id}` as Parameters<typeof router.push>[0]);
    };

    if (isPending) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#d70040" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <VStack className="flex-1 px-6">
                <HStack className="items-center justify-between py-6">
                    <Pressable
                        onPress={() => router.push('/profile')}
                        className="w-10 h-10 items-center justify-center bg-surface-muted rounded-full"
                    >
                        <ChevronLeft size={20} color="#272727" />
                    </Pressable>
                    <Text className="text-xl font-fredoka-bold text-[#272727]">
                        Meus Pedidos
                    </Text>
                    <Box className="w-10" />
                </HStack>

                {orders.length === 0 ? (
                    <VStack className="flex-1 items-center justify-center gap-4">
                        <Package size={64} color="#d1d5db" />
                        <Text className="text-lg font-fredoka-semibold text-text-muted text-center">
                            Você ainda não tem nenhum pedido.
                        </Text>
                    </VStack>
                ) : (
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefetching}
                                onRefresh={refetch}
                                colors={['#d70040']}
                                tintColor="#d70040"
                            />
                        }
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => handlePressOrder(item.id)}
                                className="bg-surface-muted rounded-2xl p-4 mb-4"
                            >
                                <HStack className="justify-between items-start mb-3">
                                    <VStack className="gap-1">
                                        <Text className="text-sm font-fredoka-semibold text-[#272727]">
                                            Pedido #{item.id.split('-')[0].toUpperCase()}
                                        </Text>
                                        <Text className="text-xs font-fredoka text-text-muted">
                                            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                                        </Text>
                                    </VStack>
                                    <OrderStatusBadge status={item.status} />
                                </HStack>

                                <Box className="border-t border-border my-2" />

                                <HStack className="justify-between items-center mt-2">
                                    <Text className="text-sm font-fredoka text-text-muted">
                                        {item.itemCount} {item.itemCount === 1 ? 'item' : 'itens'}
                                    </Text>
                                    <HStack className="items-center gap-2">
                                        <Text className="text-base font-fredoka-bold text-secondary">
                                            {item.total?.formatted}
                                        </Text>
                                        <ChevronRight size={16} color="#9ca3af" />
                                    </HStack>
                                </HStack>
                            </Pressable>
                        )}
                    />
                )}
            </VStack>
        </SafeAreaView>
    );
}
