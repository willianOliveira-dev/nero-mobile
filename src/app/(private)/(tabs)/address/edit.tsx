import {
    useDeleteAddress,
    useListAddresses,
    useUpdateAddress,
    getListAddressesQueryKey
} from '@/src/api/generated/addresses/addresses';
import { useQueryClient } from '@tanstack/react-query';
import { Box } from '@/src/components/gluestack/ui/box';
import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { FormControl, FormControlError, FormControlErrorText } from '@/src/components/gluestack/ui/form-control';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { ConfirmModal } from '@/src/components/ui/confirm-modal';

import { Controller as FormController } from 'react-hook-form';
import { AddressFormData } from '@/src/schemas/addresses/address.schema';
import { useAddressForm } from '@/src/hooks/addresses/use-address-form';
import { maskCep } from '@/src/utils/masks';
import { extractApiError } from '@/src/utils/error-handler';

export default function EditAddressScreen() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: addresses, isPending: isFetching } = useListAddresses();
    const { mutateAsync: updateAddress, isPending: isUpdating } = useUpdateAddress({
        mutation: {
            meta: {
                successMessage: 'Endereço atualizado com sucesso!'
            }
        }
    });
    const { mutateAsync: deleteAddress, isPending: isDeleting } = useDeleteAddress({
        mutation: {
            meta: {
                successMessage: 'Endereço removido com sucesso!'
            }
        }
    });

    const form = useAddressForm();
    const { control, handleSubmit, reset } = form;

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (addresses && id) {
            const addressToEdit = addresses.find((a) => a.id === id);
            if (addressToEdit) {
                reset({
                    label: addressToEdit.label || '',
                    recipientName: addressToEdit.recipientName || '',
                    street: addressToEdit.street || '',
                    city: addressToEdit.city || '',
                    state: addressToEdit.state || '',
                    zipCode: addressToEdit.zipCode || '',
                    complement: addressToEdit.complement || '',
                    isDefault: false,
                });
            }
        }
    }, [addresses, id, reset]);

    const handleSave = async (data: AddressFormData) => {
        try {
            if (!id) return;
            
            await updateAddress({
                id,
                data: {
                    label: data.label || null,
                    recipientName: data.recipientName,
                    street: data.street,
                    city: data.city,
                    state: data.state.toUpperCase(),
                    zipCode: data.zipCode,
                    complement: data.complement || null,
                    country: 'BR',
                },
            });

            await queryClient.invalidateQueries({ queryKey: getListAddressesQueryKey() });

            router.push('/address')
        } catch (error) {
            console.log('Erro ao atualizar endereço:', error);
            const errorMessage = extractApiError(error, 'Erro ao atualizar o endereço. Tente novamente.');
            form.setError('root', { message: errorMessage });
        }
    };

    const handleDelete = () => {
        if (!id) return;
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!id) return;
        try {
            await deleteAddress({ id });
            await queryClient.invalidateQueries({ queryKey: getListAddressesQueryKey() });
            setShowDeleteModal(false);

            router.push('/address')
        } catch (error) {
            console.log('Erro ao excluir:', error);
            const errorMessage = extractApiError(error, 'Erro ao excluir endereço.');

            setShowDeleteModal(false);
        }
    };

    if (isFetching) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#8e6cef" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <VStack className="flex-1 px-6">
                <HStack className="items-center justify-between py-6">
                    <Pressable
                        onPress={() => router.push('/address')}
                        className="w-10 h-10 items-center justify-center bg-[#f4f4f4] rounded-full"
                    >
                        <ChevronLeft size={20} color="#272727" />
                    </Pressable>
                    <Text className="text-xl font-fredoka-bold text-[#272727]">
                        Editar Endereço
                    </Text>
                    <Pressable
                        onPress={handleDelete}
                        disabled={isDeleting}
                        className="w-10 h-10 items-center justify-center bg-red-50 rounded-full"
                    >
                        {isDeleting ? (
                            <ActivityIndicator size="small" color="#fa3636" />
                        ) : (
                            <Trash2 size={20} color="#fa3636" />
                        )}
                    </Pressable>
                </HStack>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <VStack className="mt-4 gap-4">
                        
                        {form.formState.errors.root && (
                            <Text className="text-red-500 font-fredoka text-center mb-4">
                                {form.formState.errors.root.message}
                            </Text>
                        )}

                        <FormController
                            control={control}
                            name="label"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">Etiqueta (Ex: Casa, Trabalho)</Text>
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value || ''}
                                            placeholder="Minha Casa"
                                            className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                            placeholderTextColor="#a3a3a3"
                                        />
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">{error.message}</FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />

                        <FormController
                            control={control}
                            name="recipientName"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">Nome do Destinatário *</Text>
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="João da Silva"
                                            className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                            placeholderTextColor="#a3a3a3"
                                        />
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">{error.message}</FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />

                        <FormController
                            control={control}
                            name="zipCode"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">CEP * (Preenche os dados)</Text>
                                        <TextInput
                                            keyboardType="numeric"
                                            onBlur={onBlur}
                                            onChangeText={(text) => onChange(maskCep(text))}
                                            value={maskCep(value)}
                                            placeholder="00000-000"
                                            className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                            placeholderTextColor="#a3a3a3"
                                        />
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">{error.message}</FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />

                        <FormController
                            control={control}
                            name="street"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">Endereço (Rua, Número) *</Text>
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Rua das Flores, 123"
                                            className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                            placeholderTextColor="#a3a3a3"
                                        />
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">{error.message}</FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />

                        <FormController
                            control={control}
                            name="complement"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">Complemento</Text>
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value || ''}
                                            placeholder="Apto 101, Bloco B"
                                            className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                            placeholderTextColor="#a3a3a3"
                                        />
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">{error.message}</FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />
                        
                        <HStack className="gap-4">
                            <Box className="flex-1">
                                <FormController
                                    control={control}
                                    name="city"
                                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                        <FormControl isInvalid={!!error}>
                                            <VStack className="gap-2">
                                                <Text className="text-sm font-fredoka text-gray-500">Cidade *</Text>
                                                <TextInput
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    placeholder="São Paulo"
                                                    className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                                    placeholderTextColor="#a3a3a3"
                                                />
                                            </VStack>
                                            {error?.message && (
                                                <FormControlError>
                                                    <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">{error.message}</FormControlErrorText>
                                                </FormControlError>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box className="flex-1">
                                <FormController
                                    control={control}
                                    name="state"
                                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                        <FormControl isInvalid={!!error}>
                                            <VStack className="gap-2">
                                                <Text className="text-sm font-fredoka text-gray-500">Estado *</Text>
                                                <TextInput
                                                    onBlur={onBlur}
                                                    onChangeText={(t) => onChange(t.toUpperCase())}
                                                    value={value}
                                                    placeholder="SP"
                                                    maxLength={2}
                                                    autoCapitalize="characters"
                                                    className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                                    placeholderTextColor="#a3a3a3"
                                                />
                                            </VStack>
                                            {error?.message && (
                                                <FormControlError>
                                                    <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">{error.message}</FormControlErrorText>
                                                </FormControlError>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Box>
                        </HStack>
                    </VStack>
                </ScrollView>

       
                <Box className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
                    <Button
                        size="xl"
                        className="bg-primary rounded-full items-center justify-center"
                        onPress={handleSubmit(handleSave)}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ButtonText className="font-fredoka-bold text-base text-white">Atualizar Endereço</ButtonText>
                        )}
                    </Button>
                </Box>
            </VStack>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Excluir Endereço"
                message="Tem certeza que deseja excluir este endereço?"
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                confirmVariant="danger"
                isLoading={isDeleting}
            />
        </SafeAreaView>
    );
}
