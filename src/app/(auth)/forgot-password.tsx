import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
} from '@/src/components/gluestack/ui/form-control';
import { Image } from '@/src/components/gluestack/ui/image';
import {
    Input,
    InputField,
} from '@/src/components/gluestack/ui/input';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { imagesPath } from '@/src/constants/images';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { useForgotPasswordForm } from '@/src/hooks/auth/use-forgot-password-form';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MailCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ForgotPasswordFormData } from '@/src/schemas/auth/auth.schema';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForgotPasswordForm();

    const { forgotPassword, isForgotPasswordLoading } = useAuth();

    const [serverError, setServerError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    async function onSubmit(data: ForgotPasswordFormData) {
        setServerError(null);
        const result = await forgotPassword(data.email);
        if (!result.success) {
            setServerError(result.error ?? 'Erro ao enviar código.');
            return;
        }
        setEmailSent(true);
    }

    function handleGoToReset() {
        const email = getValues('email');
        router.push({ pathname: '/reset-password', params: { email } } as Parameters<typeof router.push>[0]);
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="flex-grow"
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <LinearGradient
                        colors={['#d70040', '#A2002A']}
                        className="pt-24 pb-36 items-center px-6"
                    >
                        <Image
                            source={imagesPath.logoLight}
                            className="w-36 h-10 mb-6"
                            resizeMode="contain"
                            alt="Nero logo"
                        />
                        <Text className="text-white text-3xl font-fredoka-bold text-center">
                            Esqueceu a senha?
                        </Text>
                        <Text className="text-white/80 text-md mt-3 text-center">
                            Enviaremos um código para seu e-mail
                        </Text>
                    </LinearGradient>

                    <VStack className="px-6 -mt-20 pb-10">
                        <VStack className="bg-white rounded-2xl p-6 gap-6 shadow-md">
                            {emailSent ? (
                                <VStack className="items-center gap-4 py-4">
                                    <VStack className="w-16 h-16 rounded-full bg-success-light items-center justify-center">
                                        <MailCheck size={28} color="#16a34a" />
                                    </VStack>
                                    <Text className="text-gray-900 text-lg font-fredoka-bold text-center">
                                        Código enviado!
                                    </Text>
                                    <Text className="text-gray-400 text-sm font-fredoka-medium text-center">
                                        Verifique sua caixa de entrada e use o código para redefinir sua senha.
                                    </Text>
                                    <Button
                                        onPress={handleGoToReset}
                                        className="h-12 bg-primary rounded-xl active:opacity-90 w-full mt-2"
                                    >
                                        <ButtonText className="text-white text-sm font-fredoka-medium">
                                            Inserir código
                                        </ButtonText>
                                    </Button>
                                </VStack>
                            ) : (
                                <>
                                    <Controller
                                        control={control}
                                        name="email"
                                        render={({
                                            field: { onChange, value, onBlur },
                                        }) => (
                                            <FormControl isInvalid={!!errors.email}>
                                                <Input
                                                    className={`h-12 rounded-xl border bg-white px-3.5 ${errors.email ? 'border-red-400' : 'border-gray-100'}`}
                                                >
                                                    <InputField
                                                        className="flex-1 text-sm text-gray-900 font-fredoka-medium"
                                                        placeholder="seu@email.com"
                                                        placeholderTextColor="#9ca3af"
                                                        value={value}
                                                        onChangeText={onChange}
                                                        onBlur={onBlur}
                                                        autoCapitalize="none"
                                                        keyboardType="email-address"
                                                        autoComplete="email"
                                                    />
                                                </Input>
                                                <FormControlError>
                                                    <FormControlErrorText className="text-red-500 text-xs ml-1">
                                                        {errors.email?.message}
                                                    </FormControlErrorText>
                                                </FormControlError>
                                            </FormControl>
                                        )}
                                    />

                                    {serverError && (
                                        <Text className="text-red-500 text-xs text-center -mt-2">
                                            {serverError}
                                        </Text>
                                    )}

                                    <Button
                                        onPress={handleSubmit(onSubmit)}
                                        disabled={isForgotPasswordLoading}
                                        className="h-12 bg-primary rounded-xl active:opacity-90"
                                    >
                                        {isForgotPasswordLoading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <ButtonText className="text-white text-sm font-fredoka-medium">
                                                Enviar código
                                            </ButtonText>
                                        )}
                                    </Button>
                                </>
                            )}

                            <HStack className="items-center justify-center gap-1.5">
                                <Pressable
                                    className="active:opacity-70"
                                    onPress={() => router.replace('/login')}
                                >
                                    <Text className="text-blue-500 text-xs font-fredoka-semibold">
                                        Voltar ao login
                                    </Text>
                                </Pressable>
                            </HStack>
                        </VStack>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}