import {
    useListAddresses,
    useSetDefaultAddress,
} from '@/src/api/generated/addresses/addresses';
import { AddressCard } from '@/src/components/ui/AddressCard';
import { Box } from '@/src/components/gluestack/ui/box';
import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, FlatList } from 'react-native';

export default function AddressListScreen() {
    const router = useRouter();

    const {
        data: addresses,
        isPending,
        refetch,
        isRefetching,
    } = useListAddresses();
    
    const { mutateAsync: setDefaultAddress, isPending: isSettingDefault } = useSetDefaultAddress();

    const sortedAddresses = addresses
        ? [...addresses].sort((a, b) => (a.isDefault ? -1 : b.isDefault ? 1 : 0))
        : [];

    const handleSetDefault = async (id: string) => {
        try {
            await setDefaultAddress({ id });
            await refetch();
        } catch (error) {
            console.error('Erro ao definir endereço padrão:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o endereço padrão.');
        }
    };

    const handleEdit = (id: string) => {
        router.push({
            pathname: '/address/edit',
            params: { id },
        });
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
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center bg-[#f4f4f4] rounded-full"
                    >
                        <ChevronLeft size={20} color="#272727" />
                    </Pressable>
                    <Text className="text-xl font-fredoka-bold text-[#272727]">
                        Meus Endereços
                    </Text>
                    <Box className="w-10" />
                </HStack>

         
                <FlatList
                    data={sortedAddresses}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
                    refreshing={isRefetching || isSettingDefault}
                    onRefresh={refetch}
                    renderItem={({ item }) => (
                        <AddressCard
                            address={item}
                            onEdit={() => handleEdit(item.id)}
                            onSetDefault={() => handleSetDefault(item.id)}
                        />
                    )}
                    ListEmptyComponent={
                        <VStack className="items-center mt-10">
                            <Text className="text-base font-fredoka text-gray-500 text-center">
                                Você ainda não tem endereços cadastrados.
                            </Text>
                        </VStack>
                    }
                />

           
                <Box className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
                    <Button
                        size="xl"
                        className="bg-primary rounded-full items-center justify-center flex-row"
                        onPress={() => router.push('/address/new')}
                    >
                        <Plus size={20} color="#fff" />
                        <Box className="w-2" />
                        <ButtonText className="font-fredoka-bold text-base text-white">
                            Adicionar Endereço
                        </ButtonText>
                    </Button>
                </Box>
            </VStack>
        </SafeAreaView>
    );
}
