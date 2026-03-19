import { useCreateAddress, useSetDefaultAddress } from '@/src/api/generated/addresses/addresses';
import { Box } from '@/src/components/gluestack/ui/box';
import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { FormControl, FormControlError, FormControlErrorText } from '@/src/components/gluestack/ui/form-control';
import { useRouter } from 'expo-router';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, ScrollView, TextInput, Switch } from 'react-native';
import { Controller as FormController } from 'react-hook-form';
import { AddressFormData } from '@/src/schemas/addresses/address.schema';
import { useAddressForm } from '@/src/hooks/addresses/use-address-form';
import { maskCep } from '@/src/utils/masks';

export default function NewAddressScreen() {
    const router = useRouter();
    const { goBack } = useSafeBack();
    const { mutateAsync: createAddress, isPending: isCreating } = useCreateAddress();
    const { mutateAsync: setDefaultAddress } = useSetDefaultAddress();

    const form = useAddressForm();
    const { control, handleSubmit } = form;

    const handleSave = async (data: AddressFormData) => {
        try {
            const createdAddress = await createAddress({
                data: {
                    label: data.label || null,
                    recipientName: data.recipientName,
                    zipCode: data.zipCode,
                    street: data.street,
                    complement: data.complement || null,
                    city: data.city,
                    state: data.state.toUpperCase(),
                    country: 'BR',
                },
            });
            if (data.isDefault && createdAddress?.id) {
                await setDefaultAddress({ id: createdAddress.id });
            }

            goBack();
        } catch (error) {
            console.error('Erro ao adicionar endereço:', error);
            form.setError('root', { message: 'Erro ao criar endereço. Tente novamente.' });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <VStack className="flex-1 px-6">
                <HStack className="items-center justify-between py-6">
                    <Pressable
                        onPress={() => goBack()}
                        className="w-10 h-10 items-center justify-center bg-[#f4f4f4] rounded-full"
                    >
                        <ChevronLeft size={20} color="#272727" />
                    </Pressable>
                    <Text className="text-xl font-fredoka-bold text-[#272727]">
                        Novo Endereço
                    </Text>
                    <Box className="w-10" />
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

                        <FormController
                            control={control}
                            name="isDefault"
                            render={({ field: { onChange, value } }) => (
                                <HStack className="items-center justify-between mt-4 p-4 border border-gray-200 rounded-lg">
                                    <Text className="text-base font-fredoka text-[#272727]">Definir como padrão?</Text>
                                    <Switch
                                        value={value ?? false}
                                        onValueChange={onChange}
                                        trackColor={{ false: '#d4d4d4', true: '#d70040' }}
                                        thumbColor="#ffffff"
                                    />
                                </HStack>
                            )}
                        />
                    </VStack>
                </ScrollView>

                <Box className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
                    <Button
                        size="xl"
                        className="bg-primary rounded-full items-center justify-center"
                        onPress={handleSubmit(handleSave)}
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <ButtonText className="font-fredoka-bold text-base text-white">Salvar Endereço</ButtonText>
                        )}
                    </Button>
                </Box>
            </VStack>
        </SafeAreaView>
    );
}
