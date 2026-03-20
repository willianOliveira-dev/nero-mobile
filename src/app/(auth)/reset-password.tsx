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
    InputSlot,
} from '@/src/components/gluestack/ui/input';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { imagesPath } from '@/src/constants/images';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { useResetPasswordForm } from '@/src/hooks/auth/use-reset-password-form';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ResetPasswordFormData } from '@/src/schemas/auth/auth.schema';

export default function ResetPasswordScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email: string }>();
    const email = params.email ?? '';

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useResetPasswordForm();

    const { resetPassword, isResetPasswordLoading } = useAuth();

    const [serverError, setServerError] = useState<string | null>(null);
    const [otpCode, setOtpCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function onSubmit(data: ResetPasswordFormData) {
        setServerError(null);
        if (!otpCode || otpCode.length < 6) {
            setServerError('Digite o código de 6 dígitos.');
            return;
        }
        if (!email) {
            setServerError('E-mail não encontrado. Tente novamente.');
            return;
        }
        const result = await resetPassword(email, otpCode, data.password);
        if (!result.success) {
            setServerError(result.error ?? 'Erro ao redefinir senha.');
            return;
        }
        router.replace('/login');
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
                            Nova senha
                        </Text>
                        <Text className="text-white/80 text-md mt-3 text-center">
                            Digite o código e sua nova senha
                        </Text>
                    </LinearGradient>

                    <VStack className="px-6 -mt-20 pb-10">
                        <VStack className="bg-white rounded-2xl p-6 gap-4 shadow-md">
                            {/* OTP Code Input */}
                            <FormControl isInvalid={!!serverError && otpCode.length < 6}>
                                <Input
                                    className={`h-12 rounded-xl border bg-white px-3.5 ${serverError && otpCode.length < 6 ? 'border-red-400' : 'border-gray-100'}`}
                                >
                                    <InputField
                                        className="flex-1 text-sm text-gray-900 font-fredoka-medium tracking-widest text-center"
                                        placeholder="Código de 6 dígitos"
                                        placeholderTextColor="#9ca3af"
                                        value={otpCode}
                                        onChangeText={(text) => setOtpCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </Input>
                            </FormControl>

                            {/* Password */}
                            <Controller
                                control={control}
                                name="password"
                                render={({
                                    field: { onChange, value, onBlur },
                                }) => (
                                    <FormControl isInvalid={!!errors.password}>
                                        <Input
                                            className={`h-12 rounded-xl border bg-white px-3.5 ${errors.password ? 'border-red-400' : 'border-gray-100'}`}
                                        >
                                            <InputField
                                                className="flex-1 text-sm text-gray-900 font-fredoka-medium"
                                                placeholder="Nova senha"
                                                placeholderTextColor="#9ca3af"
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showPassword}
                                                autoComplete="new-password"
                                            />
                                            <InputSlot
                                                onPress={() => setShowPassword((p) => !p)}
                                                className="pr-3"
                                            >
                                                {showPassword ? (
                                                    <Eye size={16} color="#9ca3af" />
                                                ) : (
                                                    <EyeOff size={16} color="#9ca3af" />
                                                )}
                                            </InputSlot>
                                        </Input>
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 text-xs ml-1">
                                                {errors.password?.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    </FormControl>
                                )}
                            />

                            {/* Confirm Password */}
                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({
                                    field: { onChange, value, onBlur },
                                }) => (
                                    <FormControl isInvalid={!!errors.confirmPassword}>
                                        <Input
                                            className={`h-12 rounded-xl border bg-white px-3.5 ${errors.confirmPassword ? 'border-red-400' : 'border-gray-100'}`}
                                        >
                                            <InputField
                                                className="flex-1 text-sm text-gray-900 font-fredoka-medium"
                                                placeholder="Confirmar nova senha"
                                                placeholderTextColor="#9ca3af"
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showConfirmPassword}
                                                autoComplete="new-password"
                                            />
                                            <InputSlot
                                                onPress={() => setShowConfirmPassword((p) => !p)}
                                                className="pr-3"
                                            >
                                                {showConfirmPassword ? (
                                                    <Eye size={16} color="#9ca3af" />
                                                ) : (
                                                    <EyeOff size={16} color="#9ca3af" />
                                                )}
                                            </InputSlot>
                                        </Input>
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 text-xs ml-1">
                                                {errors.confirmPassword?.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    </FormControl>
                                )}
                            />

                            {serverError && (
                                <Text className="text-red-500 text-xs text-center">
                                    {serverError}
                                </Text>
                            )}

                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isResetPasswordLoading}
                                className="h-12 bg-primary rounded-xl active:opacity-90"
                            >
                                {isResetPasswordLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <ButtonText className="text-white text-sm font-fredoka-medium">
                                        Redefinir senha
                                    </ButtonText>
                                )}
                            </Button>

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
