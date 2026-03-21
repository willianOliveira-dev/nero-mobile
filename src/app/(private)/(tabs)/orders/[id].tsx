import { useGetOrder } from '@/src/api/generated/orders/orders';
import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Image } from '@/src/components/gluestack/ui/image';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Copy, CreditCard, MapPin } from 'lucide-react-native';

import React from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { imagesPath } from '@/src/constants/images';
import { OrderProductItem } from '@/src/components/ui/order-product-item';

function SectionHeader({ title }: { title: string }) {
    return (
        <Text className="text-base font-fredoka-semibold text-[#272727] mt-6 mb-3">
            {title}
        </Text>
    );
}

function SummaryRow({ label, value, bold }: { label: string; value?: string; bold?: boolean }) {
    return (
        <HStack className="justify-between items-center py-1.5">
            <Text className={`text-sm font-fredoka ${bold ? 'font-fredoka-bold text-[#272727]' : 'text-text-muted'}`}>
                {label}
            </Text>
            <Text className={`text-sm ${bold ? 'font-fredoka-bold text-secondary text-base' : 'font-fredoka text-[#272727]'}`}>
                {value || '-'}
            </Text>
        </HStack>
    );
}

export default function OrderDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter()
    const { goBack } = useSafeBack();

    const { data: orderResponse, isPending } = useGetOrder(id as string, {
        query: { enabled: !!id },
    });

    const order = orderResponse;


    const copyToClipboard = async (text: string) => {
        await Clipboard.setStringAsync(text);
    };

    if (isPending) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#d70040" />
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-lg font-fredoka text-text-muted">Pedido não encontrado.</Text>
                <Pressable onPress={() => goBack()} className="mt-4 p-2 bg-surface-muted rounded">
                    <Text className="text-sm font-fredoka-semibold text-[#272727]">Voltar</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    let statusColor = 'text-gray-600';
    let statusLabel = 'Desconhecido';

    switch (order.status) {
        case 'pending': 
            statusColor = 'text-orange-500';
            statusLabel = 'Pendente';
            break;
        case 'paid':
            statusColor = 'text-green-500';
            statusLabel = 'Pago';
            break;
        case 'processing': 
            statusColor = 'text-blue-500'; 
            statusLabel = 'Processando';
            break;
        case 'shipped': 
            statusColor = 'text-purple-500'; 
            statusLabel = 'Enviado';
            break;
        case 'delivered': 
            statusColor = 'text-green-500'; 
            statusLabel = 'Entregue';
            break;
        case 'cancelled': 
            statusColor = 'text-red-500'; 
            statusLabel = 'Cancelado';
            break;
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <VStack className="flex-1 px-6">
          
                <HStack className="items-center justify-between py-6">
                    <Pressable
                        onPress={() => router.push('/orders')}
                        className="w-10 h-10 items-center justify-center bg-surface-muted rounded-full"
                    >
                        <ChevronLeft size={20} color="#272727" />
                    </Pressable>
                    <Text className="text-xl font-fredoka-bold text-[#272727]">
                        Detalhes do Pedido
                    </Text>
                    <Box className="w-10" />
                </HStack>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              
                    <VStack className="bg-surface-muted rounded-2xl p-4 gap-2">
                        <HStack className="justify-between items-center">
                            <Text className="text-sm font-fredoka-semibold text-text-muted">
                                Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                            </Text>
                            <Text className={`text-sm font-fredoka-bold uppercase ${statusColor}`}>
                                {statusLabel}
                            </Text>
                        </HStack>
                        
                        <Pressable
                            onPress={() => copyToClipboard(order.id)}
                            className="flex-row items-center gap-2 mt-2 bg-white p-2 rounded-lg border border-border"
                        >
                            <Text className="text-xs font-fredoka text-text-muted flex-1" numberOfLines={1}>
                                {order.id}
                            </Text>
                            <Copy size={16} color="#9ca3af" />
                        </Pressable>
                    </VStack>

                   
                    <SectionHeader title="Itens" />
                    <VStack className="gap-3">
                        {order.items.map((item, index) => {
                            const variationText = Object.entries(item.product.optionLabels || {})
                                .map(([key, val]) => `${key}: ${val}`)
                                .join(' | ');

                            return (
                                <OrderProductItem
                                    key={item.id ?? index}
                                    productId={item.productId ?? item.id}
                                    productName={String(item.product.name ?? 'Produto')}
                                    productImage={String(item.product.imageUrl ?? '')}
                                    variant={variationText || null}
                                    price={`${item.quantity}x ${item.price.formatted}`}
                                    review={item.review}
                                    orderId={order.id}
                                />
                            );
                        })}
                    </VStack>

                  
                    <SectionHeader title="Entrega" />
                    {order.shippingAddress ? (
                        <HStack className="bg-surface-muted rounded-2xl p-4 gap-3 items-start">
                            <Box className="mt-1">
                                <MapPin size={20} color="#272727" />
                            </Box>
                            <VStack className="flex-1 gap-1">
                                <Text className="text-sm font-fredoka-semibold text-[#272727]">
                                    {order.shippingAddress.recipientName}
                                </Text>
                                <Text className="text-sm font-fredoka text-text-muted">
                                    {order.shippingAddress.street}
                                    {order.shippingAddress.complement ? ` - ${order.shippingAddress.complement}` : ''}
                                </Text>
                                <Text className="text-sm font-fredoka text-text-muted">
                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                                </Text>
                            </VStack>
                        </HStack>
                    ) : (
                        <HStack className="bg-surface-muted rounded-2xl p-4 gap-3 items-center">
                            <MapPin size={20} color="#9CA3AF" />
                            <Text className="text-sm font-fredoka text-text-muted">
                                Endereço removido
                            </Text>
                        </HStack>
                    )}

               
                    <SectionHeader title="Pagamento" />
                    {order.paymentMethod ? (
                        <HStack className="bg-surface-muted rounded-2xl p-4 gap-3 items-center">
                            <Box className="w-10 h-6 bg-white border border-border rounded items-center justify-center">
                                <CreditCard size={14} color="#272727" />
                            </Box>
                            <VStack className="flex-1">
                                <Text className="text-sm font-fredoka-semibold text-[#272727] capitalize">
                                    {order.paymentMethod.brand} terminando em {order.paymentMethod.last4}
                                </Text>
                            </VStack>
                        </HStack>
                    ) : (
                        <HStack className="bg-surface-muted rounded-2xl p-4 gap-3 items-center">
                            <Box className="w-10 h-6 bg-surface border border-border rounded items-center justify-center">
                                <CreditCard size={14} color="#9CA3AF" />
                            </Box>
                            <VStack className="flex-1">
                                <Text className="text-sm font-fredoka text-text-muted">
                                    Cartão removido
                                </Text>
                            </VStack>
                        </HStack>
                    )}

                
                    <SectionHeader title="Resumo" />
                    <VStack className="bg-surface-muted rounded-2xl p-4">
                        <SummaryRow label="Subtotal" value={order.amounts.subtotal.formatted} />
                        <SummaryRow label="Frete" value={order.amounts.shipping.formatted} />
                        {order.coupon && (
                            <SummaryRow 
                                label={`Cupom (${order.coupon.code})`} 
                                value={`-${order.amounts.discount.formatted}`} 
                            />
                        )}
                        <Box className="border-t border-border my-2" />
                        <SummaryRow label="Total" value={order.amounts.total.formatted} bold />
                    </VStack>
                </ScrollView>
            </VStack>
        </SafeAreaView>
    );
}
