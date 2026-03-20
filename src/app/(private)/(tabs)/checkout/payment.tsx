import { useSafeBack } from '@/src/hooks/use-safe-back';
import { useStripe } from '@stripe/stripe-react-native';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CreditCard, Plus, Trash2 } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar } from 'react-native';

import type { ListPaymentMethods200Item } from '@/src/api/generated/model';
import {
    getListPaymentMethodsQueryKey,
    useCreateSetupIntent,
    useDeletePaymentMethod,
    useListPaymentMethods,
    useSetDefaultPaymentMethod,
} from '@/src/api/generated/payment-methods/payment-methods';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { CardBrandLogo, type CardBrand } from '@/src/components/ui/card-brand-logo';
import { PaymentCard } from '@/src/components/ui/payment-card';
import { cn } from '@gluestack-ui/utils/nativewind-utils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function PaymentMethodItem({
    method,
    onSetDefault,
    onDelete,
    isSettingDefault,
    isDeleting,
}: {
    method: ListPaymentMethods200Item;
    onSetDefault: () => void;
    onDelete: () => void;
    isSettingDefault: boolean;
    isDeleting: boolean;
}) {
    const expiry = `${String(method.expMonth).padStart(2, '0')}/${String(method.expYear).slice(-2)}`;
    const insets = useSafeAreaInsets();

    return (
        <Box className={cn("bg-white rounded-2xl p-4 mb-3 border border-border", `pb-${insets.bottom}`)}>
            <HStack className="items-center gap-3">
                <CardBrandLogo brand={method.brand as CardBrand} size="md" />

                <VStack className="flex-1">
                    <HStack className="items-center gap-2">
                        <Text className="text-sm font-fredoka-semibold text-secondary">
                            •••• {method.last4}
                        </Text>
                        {method.isDefault && (
                            <Box className="bg-primary-muted rounded-full px-2 py-0.5">
                                <Text className="text-2xs font-fredoka-bold text-primary">
                                    Padrão
                                </Text>
                            </Box>
                        )}
                    </HStack>
                    <Text className="text-xs font-fredoka text-text-muted">
                        Vence em {expiry}
                    </Text>
                </VStack>

                <HStack className="gap-2">
                    {!method.isDefault && (
                        <Pressable
                            onPress={onSetDefault}
                            disabled={isSettingDefault}
                            className="px-3 py-2 bg-surface-muted rounded-xl"
                        >
                            {isSettingDefault ? (
                                <ActivityIndicator size="small" color="#d70040" />
                            ) : (
                                <Text className="text-2xs font-fredoka-semibold text-primary">
                                    Definir padrão
                                </Text>
                            )}
                        </Pressable>
                    )}
                    <Pressable
                        onPress={onDelete}
                        disabled={isDeleting}
                        className="p-2 bg-error-light rounded-xl"
                    >
                        {isDeleting ? (
                            <ActivityIndicator size="small" color="#dc2626" />
                        ) : (
                            <Trash2 size={16} color="#dc2626" />
                        )}
                    </Pressable>
                </HStack>
            </HStack>
        </Box>
    );
}

export default function CheckoutPaymentScreen() {
  const insets = useSafeAreaInsets();
    const { goBack } = useSafeBack();
    const queryClient = useQueryClient();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const { data: methods, isPending } = useListPaymentMethods();
    const { mutateAsync: createSetupIntent, isPending: isCreatingSetup } = useCreateSetupIntent();
    const { mutateAsync: setDefault, isPending: isSettingDefault } = useSetDefaultPaymentMethod();
    const { mutateAsync: deleteMethod, isPending: isDeleting } = useDeletePaymentMethod();

    const handleAddCard = async () => {
        try {
            const setup = await createSetupIntent();

            const { error: initError } = await initPaymentSheet({
                setupIntentClientSecret: setup.clientSecret,
                customerEphemeralKeySecret: setup.ephemeralKey,
                customerId: setup.customerId,
                merchantDisplayName: 'Nero',
                style: 'alwaysLight',
            });

            if (initError) {
                Alert.alert('Erro', initError.message);
                return;
            }

            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                if (presentError.code !== 'Canceled') {
                    Alert.alert('Erro', presentError.message);
                }
                return;
            }

            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: getListPaymentMethodsQueryKey(),
                });
            }, 2000);

            Alert.alert('Sucesso', 'Cartão adicionado com sucesso!');
        } catch {
            Alert.alert('Erro', 'Não foi possível adicionar o cartão. Tente novamente.');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await setDefault({ id });
            queryClient.invalidateQueries({
                queryKey: getListPaymentMethodsQueryKey(),
            });
        } catch {
            Alert.alert('Erro', 'Não foi possível definir como padrão.');
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Remover Cartão',
            'Tem certeza que deseja remover este cartão?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Remover',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMethod({ id });
                            queryClient.invalidateQueries({
                                queryKey: getListPaymentMethodsQueryKey(),
                            });
                        } catch {
                            Alert.alert('Erro', 'Não foi possível remover o cartão.');
                        }
                    },
                },
            ],
        );
    };

    const defaultCard = methods?.find((m) => m.isDefault);

    const renderItem = ({ item }: { item: ListPaymentMethods200Item }) => (
        <PaymentMethodItem
            method={item}
            onSetDefault={() => handleSetDefault(item.id)}
            onDelete={() => handleDelete(item.id)}
            isSettingDefault={isSettingDefault}
            isDeleting={isDeleting}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-white"  >
            <StatusBar barStyle="dark-content" />
                <Box className='flex-1' style={{paddingBottom: insets.bottom}}>
                    <HStack className="items-center justify-between px-5 py-3"  >
                        <Pressable onPress={() => goBack()}>
                            <ArrowLeft size={22} color="#272727" />
                        </Pressable>
                        <Text className="text-lg font-fredoka-semibold text-secondary">
                            Formas de Pagamento
                        </Text>
                        <Box className="w-6" />
                    </HStack>

                    {isPending ? (
                        <Box className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color="#d70040" />
                        </Box>
                    ) : (
                        <FlatList
                            data={methods}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={
                                defaultCard ? (
                                    <Box className="items-center mb-5">
                                        <PaymentCard
                                            brand={defaultCard.brand as CardBrand}
                                            last4={defaultCard.last4}
                                            expMonth={defaultCard.expMonth}
                                            expYear={defaultCard.expYear}
                                            cardholderName={defaultCard.cardholderName}
                                            isDefault
                                        />
                                    </Box>
                                ) : null
                            }
                            ListEmptyComponent={
                                <VStack className="items-center justify-center py-16 gap-4">
                                    <Box className="w-20 h-20 rounded-full bg-surface-muted items-center justify-center">
                                        <CreditCard size={36} color="#9CA3AF" />
                                    </Box>
                                    <Text className="text-base font-fredoka-semibold text-secondary">
                                        Nenhum cartão cadastrado
                                    </Text>
                                    <Text className="text-sm font-fredoka text-text-muted text-center px-8">
                                        Adicione um cartão para facilitar suas compras
                                    </Text>
                                </VStack>
                            }
                        />
                    )}

                    <Box className="absolute bottom-8 left-5 right-5">
                        <Pressable
                            onPress={handleAddCard}
                            disabled={isCreatingSetup}
                            className="bg-primary rounded-full py-4 flex-row items-center justify-center gap-2"
                        >
                            {isCreatingSetup ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Plus size={20} color="#fff" />
                                    <Text className="text-base font-fredoka-semibold text-white">
                                        Adicionar Cartão
                                    </Text>
                                </>
                            )}
                        </Pressable>
                    </Box>
            </Box>
        </SafeAreaView>
    );
}
