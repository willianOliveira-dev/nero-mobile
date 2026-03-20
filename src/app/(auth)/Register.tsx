import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import { Divider } from '@/src/components/gluestack/ui/divider';
import {
    FormControl,
    FormControlError,
    FormControlErrorText,
} from '@/src/components/gluestack/ui/form-control';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Image } from '@/src/components/gluestack/ui/image';
import {
    Input,
    InputField,
    InputSlot,
} from '@/src/components/gluestack/ui/input';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { imagesPath } from '@/src/constants/images';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { useRegisterForm } from '@/src/hooks/auth/use-register-form';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RegisterFormData } from '@/src/schemas/auth/auth.schema';

export default function RegisterScreen() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useRegisterForm();

    const { signUp, isSignUpLoading } = useAuth();

    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function onSubmit(data: RegisterFormData) {
        setServerError(null);
        const result = await signUp(data);
        if (result && !result.success && result.error) {
            setServerError(result.error);
            return;
        }
        router.push({ pathname: '/otp', params: { email: data.email } } as Parameters<typeof router.push>[0]);
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
                            Criar conta
                        </Text>
                        <Text className="text-white/80 text-md mt-3 text-center">
                            Preencha os dados para se cadastrar
                        </Text>
                    </LinearGradient>

                    <VStack className="px-6 -mt-20 pb-10">
                        <VStack className="bg-white rounded-2xl p-6 gap-4 shadow-md">
                            <Controller
                                control={control}
                                name="name"
                                render={({
                                    field: { onChange, value, onBlur },
                                }) => (
                                    <FormControl isInvalid={!!errors.name}>
                                        <Input
                                            className={`h-12 rounded-xl border bg-white px-3.5 ${errors.name ? 'border-red-400' : 'border-gray-100'}`}
                                        >
                                            <InputField
                                                className="flex-1 text-sm text-gray-900 font-fredoka-medium"
                                                placeholder="Nome completo"
                                                placeholderTextColor="#9ca3af"
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                autoCapitalize="words"
                                                autoComplete="name"
                                            />
                                        </Input>
                                        <FormControlError>
                                            <FormControlErrorText className="text-red-500 text-xs ml-1">
                                                {errors.name?.message}
                                            </FormControlErrorText>
                                        </FormControlError>
                                    </FormControl>
                                )}
                            />

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
                                                placeholder="Senha"
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
                                                placeholder="Confirmar senha"
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
                                <Text className="text-red-500 text-xs text-center -mt-2">
                                    {serverError}
                                </Text>
                            )}

                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSignUpLoading}
                                className="h-12 bg-primary rounded-xl active:opacity-90"
                            >
                                {isSignUpLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <ButtonText className="text-white text-sm font-fredoka-medium">
                                        Criar conta
                                    </ButtonText>
                                )}
                            </Button>

                            <HStack className="items-center justify-center gap-1.5">
                                <Text className="text-gray-400 text-xs font-fredoka-medium">
                                    Já possui uma conta?
                                </Text>
                                <Pressable
                                    className="active:opacity-70"
                                    onPress={() => router.replace('/login')}
                                >
                                    <Text className="text-blue-500 text-xs font-fredoka-semibold">
                                        Fazer login
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