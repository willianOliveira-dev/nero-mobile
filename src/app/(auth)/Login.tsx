import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Divider } from '@/components/ui/divider';
import { Pressable } from '@/components/ui/pressable';
import { useAuth } from '@/src/hooks/auth/useAuth';
import { useLoginForm } from '@/src/hooks/auth/useLoginForm';

export default function LoginScreen() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useLoginForm();

    const {
        signInEmail,
        signInSocial,
        isSignInEmailLoading,
        isSignInSocialLoading,
    } = useAuth();

    const [serverError, setServerError] = useState<string | null>(null);

    async function onSubmit(data: any) {
        const result = await signInEmail(data);

        if (!result.success && result.error) {
            setServerError(result.error);
            return;
        }

        // router.replace('/home');
    }

    async function handleGoogleLogin() {
        const result = await signInSocial('google');

        if (!result.success && result.error) {
            setServerError(result.error);
        }
    }

    return (
        <Box className="flex-1 bg-gray-200">
            <Box className="bg-red-600 pt-24 pb-32 items-center">
                <Text className="text-white text-4xl font-bold mb-4">nero</Text>

                <Text className="text-white text-2xl font-bold">Login com</Text>

                <Text className="text-white text-2xl font-bold mb-2">
                    sua conta
                </Text>

                <Text className="text-white/90 text-sm">
                    Entre com email e senha para logar
                </Text>
            </Box>

            <Box className="px-6 -mt-24">
                <Box className="bg-white p-6 rounded-2xl shadow-md">
                    <VStack className="space-y-5">
                        <Button
                            variant="outline"
                            onPress={handleGoogleLogin}
                            isDisabled={isSignInSocialLoading}
                            className="border border-gray-300 rounded-xl h-12"
                        >
                            <ButtonText className="text-gray-700 font-medium">
                                Continue com Google
                            </ButtonText>
                        </Button>

                        <HStack className="items-center">
                            <Divider className="flex-1 bg-gray-300" />

                            <Text className="mx-3 text-gray-500 text-sm">
                                ou login com
                            </Text>

                            <Divider className="flex-1 bg-gray-300" />
                        </HStack>

                        <Controller
                            control={control}
                            name="email"
                            render={({ field: { onChange, value } }) => (
                                <VStack className="space-y-1">
                                    <Input className="border border-gray-300 rounded-xl h-12 px-3">
                                        <InputField
                                            placeholder="seu@email.com"
                                            value={value}
                                            onChangeText={onChange}
                                            className="text-gray-900"
                                        />
                                    </Input>

                                    {errors.email && (
                                        <Text className="text-red-500 text-xs">
                                            {errors.email.message}
                                        </Text>
                                    )}
                                </VStack>
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value } }) => (
                                <VStack className="space-y-1">
                                    <Input className="border border-gray-300 rounded-xl h-12 px-3">
                                        <InputField
                                            placeholder="******"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                            className="text-gray-900"
                                        />
                                    </Input>

                                    {errors.password && (
                                        <Text className="text-red-500 text-xs">
                                            {errors.password.message}
                                        </Text>
                                    )}
                                </VStack>
                            )}
                        />

                        <Pressable
                            // onPress={() => router.push('/forgot-password')}
                            className="items-center"
                        >
                            <Text className="text-blue-500 text-sm">
                                Esqueceu a senha?
                            </Text>
                        </Pressable>

                        {serverError && (
                            <Text className="text-red-500 text-center text-sm">
                                {serverError}
                            </Text>
                        )}

                        <Button
                            onPress={handleSubmit(onSubmit)}
                            isDisabled={isSignInEmailLoading}
                            className="bg-red-600 rounded-xl h-12 items-center justify-center"
                        >
                            <ButtonText className="text-white font-semibold text-base">
                                Login
                            </ButtonText>
                        </Button>

                        <HStack className="justify-center">
                            <Text className="text-gray-600">
                                Não possui uma conta?
                            </Text>

                            <Pressable
                                className="ml-2"
                                // onPress={() => router.push('/register')}
                            >
                                <Text className="text-blue-500 font-semibold">
                                    Registre-se
                                </Text>
                            </Pressable>
                        </HStack>
                    </VStack>
                </Box>
            </Box>
        </Box>
    );
}
