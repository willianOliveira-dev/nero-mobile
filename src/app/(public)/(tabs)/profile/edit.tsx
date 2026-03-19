import { useGetMe, useUpdateMe } from '@/src/api/generated/users/users';
import { Box } from '@/src/components/gluestack/ui/box';
import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { SafeAreaView } from '@/src/components/gluestack/ui/safe-area-view';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { FormControl, FormControlError, FormControlErrorText } from '@/src/components/gluestack/ui/form-control';
import { useSafeBack } from '@/src/hooks/use-safe-back';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { Controller as FormController } from 'react-hook-form';
import { ProfileFormData } from '@/src/schemas/users/profile.schema';
import { useProfileForm } from '@/src/hooks/users/use-profile-form';
import { maskPhone } from '@/src/utils/masks';

export default function EditProfileScreen() {
    const { goBack } = useSafeBack();
    const { data: me, isPending: isMePending, refetch } = useGetMe();
    const { mutateAsync: updateMe, isPending: isUpdating } = useUpdateMe();

    const form = useProfileForm();
    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        if (me) {
            reset({
                name: me.name || '',
                phone: me.phone || '',
                genderPreference: (me.genderPreference as ProfileFormData['genderPreference']) || 'unisex',
            });
        }
    }, [me, reset]);

    const handleSave = async (data: ProfileFormData) => {
        try {
            await updateMe({
                data: {
                    name: data.name,
                    phone: data.phone || null,
                    genderPreference: data.genderPreference,
                },
            });
            await refetch();
            goBack();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            form.setError('root', { message: 'Erro ao atualizar o perfil. Conexão falhou.' });
        }
    };

    if (isMePending) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color="#d70040" />
            </SafeAreaView>
        );
    }

    const genders: { label: string; value: ProfileFormData['genderPreference'] }[] = [
        { label: 'Todos', value: 'unisex' },
        { label: 'Masculino', value: 'men' },
        { label: 'Feminino', value: 'women' },
        { label: 'Infantil', value: 'kids' },
    ];

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
                        Editar Perfil
                    </Text>
                    <Box className="w-10" />
                </HStack>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <VStack className="flex-1 mt-4 gap-6">
                        
                        {form.formState.errors.root && (
                            <Text className="text-red-500 font-fredoka text-center">
                                {form.formState.errors.root.message}
                            </Text>
                        )}

                        <FormController
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">Nome da conta</Text>
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Seu nome completo"
                                            className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                            placeholderTextColor="#a3a3a3"
                                        />
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">
                                                {error.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />

                        <FormController
                            control={control}
                            name="phone"
                            render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">Telefone (opcional)</Text>
                                        <TextInput
                                            onBlur={onBlur}
                                            onChangeText={(text) => onChange(maskPhone(text))}
                                            value={maskPhone(value || '')}
                                            placeholder="Seu telefone"
                                            keyboardType="phone-pad"
                                            className="bg-[#f4f4f4] text-[#272727] font-fredoka text-base rounded-lg p-4"
                                            placeholderTextColor="#a3a3a3"
                                        />
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">
                                                {error.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />

                        <FormController
                            control={control}
                            name="genderPreference"
                            render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <FormControl isInvalid={!!error}>
                                    <VStack className="gap-2">
                                        <Text className="text-sm font-fredoka text-gray-500">Preferência de compras</Text>
                                        <HStack className="flex-wrap gap-2">
                                            {genders.map((g) => {
                                                const isSelected = value === g.value;
                                                return (
                                                    <Pressable
                                                        key={g.value}
                                                        onPress={() => onChange(g.value)}
                                                        className={`px-4 py-2 rounded-full border ${
                                                            isSelected
                                                                ? 'bg-primary border-primary'
                                                                : 'bg-transparent border-gray-300'
                                                        }`}
                                                    >
                                                        <Text
                                                            className={`text-sm font-fredoka ${
                                                                isSelected ? 'text-white' : 'text-gray-500'
                                                            }`}
                                                        >
                                                            {g.label}
                                                        </Text>
                                                    </Pressable>
                                                );
                                            })}
                                        </HStack>
                                    </VStack>
                                    {error?.message && (
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 font-fredoka text-xs mt-1">
                                                {error.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    )}
                                </FormControl>
                            )}
                        />
                    </VStack>
                </ScrollView>

                <Box className="pb-8">
                    <Button
                        size="xl"
                        className="bg-primary rounded-full"
                        onPress={handleSubmit(handleSave)}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator color="#fff" />
                        ) : ( 
                            <ButtonText className="font-fredoka-bold text-base text-white">Salvar Alterações</ButtonText>
                        )}
                    </Button>
                </Box>
            </VStack>
        </SafeAreaView>
    );
}
