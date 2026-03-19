import React from 'react';
import { ActivityIndicator, FlatList, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { ArrowLeft, Check, MapPin, Plus } from 'lucide-react-native';

import { useListAddresses } from '@/src/api/generated/addresses/addresses';
import type { ListAddresses200Item } from '@/src/api/generated/model';

import { Box } from '@/src/components/gluestack/ui/box';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function AddressItem({
    address,
    isSelected,
    onSelect,
}: {
    address: ListAddresses200Item;
    isSelected: boolean;
    onSelect: () => void;
}) {
    return (
        <Pressable
            onPress={onSelect}
            className={`rounded-2xl p-4 mb-3 border ${
                isSelected ? 'border-primary bg-primary-muted' : 'border-border bg-white'
            }`}
        >
            <HStack className="items-start gap-3">
                <Box
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                        isSelected ? 'bg-primary' : 'bg-surface-muted'
                    }`}
                >
                    <MapPin size={18} color={isSelected ? '#FFFFFF' : '#9CA3AF'} />
                </Box>

                <VStack className="flex-1 gap-1">
                    <HStack className="items-center gap-2">
                        <Text className="text-sm font-fredoka-semibold text-secondary">
                            {address.label || address.recipientName}
                        </Text>
                        {address.isDefault && (
                            <Box className="bg-primary-muted rounded-full px-2 py-0.5">
                                <Text className="text-2xs font-fredoka-bold text-primary">
                                    Padrão
                                </Text>
                            </Box>
                        )}
                    </HStack>
                    <Text className="text-xs font-fredoka text-text-muted" numberOfLines={2}>
                        {address.street}
                        {address.complement ? `, ${address.complement}` : ''}
                    </Text>
                    <Text className="text-xs font-fredoka text-text-muted">
                        {address.city} - {address.state}, {address.zipCode}
                    </Text>
                </VStack>

                {isSelected && (
                    <Box className="w-6 h-6 rounded-full bg-primary items-center justify-center">
                        <Check size={14} color="#FFFFFF" />
                    </Box>
                )}
            </HStack>
        </Pressable>
    );
}

export default function CheckoutAddressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { goBack } = useSafeBack();

    const { data: addresses, isPending } = useListAddresses();

    const [selectedId, setSelectedId] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedId) {
            const defaultAddr = addresses.find((a) => a.isDefault);
            setSelectedId(defaultAddr?.id || addresses[0].id);
        }
    }, [addresses, selectedId]);

    const handleSelect = (address: ListAddresses200Item) => {
        setSelectedId(address.id);
    };

    const handleConfirm = () => {
        if (selectedId) {
            router.navigate({
                pathname: '/checkout' as any,
                params: { addressId: selectedId },
            });
        }
    };

    const renderItem = ({ item }: { item: ListAddresses200Item }) => (
        <AddressItem
            address={item}
            isSelected={item.id === selectedId}
            onSelect={() => handleSelect(item)}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />
            <Box className='flex-1' style={{paddingBottom: insets.bottom}}>
                <HStack className="items-center justify-between px-5 py-3">
                    <Pressable onPress={() => goBack()}>
                        <ArrowLeft size={22} color="#272727" />
                    </Pressable>
                    <Text className="text-lg font-fredoka-semibold text-secondary">
                        Escolha o Endereço
                    </Text>
                    <Box className="w-6" />
                </HStack>

                {isPending ? (
                    <Box className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#d70040" />
                    </Box>
                ) : (
                    <FlatList
                        data={addresses}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <VStack className="items-center justify-center py-16 gap-4">
                                <Box className="w-20 h-20 rounded-full bg-surface-muted items-center justify-center">
                                    <MapPin size={36} color="#9CA3AF" />
                                </Box>
                                <Text className="text-base font-fredoka-semibold text-secondary">
                                    Nenhum endereço cadastrado
                                </Text>
                                <Text className="text-sm font-fredoka text-text-muted text-center px-8">
                                    Adicione um endereço para continuar
                                </Text>
                            </VStack>
                        }
                    />
                )}

                <VStack className="absolute bottom-8 left-5 right-5 gap-3">
                    <Pressable
                        onPress={() => router.push('/address/new')}
                        className="border border-primary rounded-full py-3.5 flex-row items-center justify-center gap-2"
                    >
                        <Plus size={18} color="#d70040" />
                        <Text className="text-sm font-fredoka-semibold text-primary">
                            Adicionar Endereço
                        </Text>
                    </Pressable>

                    {selectedId && (
                        <Pressable
                            onPress={handleConfirm}
                            className="bg-primary rounded-full py-4 items-center"
                        >
                            <Text className="text-base font-fredoka-semibold text-white">
                                Usar este Endereço
                            </Text>
                        </Pressable>
                    )}
                </VStack>
            </Box>
        </SafeAreaView>
    );
}
