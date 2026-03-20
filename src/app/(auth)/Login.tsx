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
import { iconsPath } from '@/src/constants/icons';
import { imagesPath } from '@/src/constants/images';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { useLoginForm } from '@/src/hooks/auth/use-login-form';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuthStore } from '@/src/store/use-auth.store';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (isAuthenticated) {
            if (user && !user.emailVerified) {
                router.push({ pathname: '/(auth)/otp', params: { email: user.email } } as Parameters<typeof router.push>[0]);
            } else {
                router.push('/(public)/(tabs)/home');
            }
        }
    }, [isAuthenticated, user]);

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
    const [showPassword, setShowPassword] = useState(false);

    async function onSubmit(data: { email: string; password: string }) {
        setServerError(null);
        const result = await signInEmail(data);
        if (result && !result.success && result.error) {
            setServerError(result.error);
            return;
        }
        if (result && result.success && result.data && 'user' in result.data && result.data.user) {
            if (!result.data.user.emailVerified) {
                router.replace({ pathname: '/(auth)/otp', params: { email: result.data.user.email } } as Parameters<typeof router.replace>[0]);
            } else {
                router.replace('/(public)/(tabs)/home');
            }
        } else {
            router.replace('/(public)/(tabs)/home'); // Fallback if type casting is weird
        }
    }

    async function handleGoogleLogin() {
        setServerError(null);
        const result = await signInSocial('google');
        if (result && !result.success && result.error) {
            setServerError(result.error);
            return;
        }
        if (result && result.success && result.data && 'user' in result.data && result.data.user) {
            if (!result.data.user.emailVerified) {
                router.replace({ pathname: '/(auth)/otp', params: { email: result.data.user.email } } as Parameters<typeof router.replace>[0]);
            } else {
                router.replace('/(public)/(tabs)/home');
            }
        } else {
            router.replace('/(public)/(tabs)/home');
        }
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
                            Login com sua conta
                        </Text>
                        <Text className="text-white/80 text-md mt-3 text-center">
                            Entre com email e senha para logar
                        </Text>
                    </LinearGradient>

                    <VStack className="px-6 -mt-20 pb-10">
                        <VStack className="bg-white rounded-2xl p-6 gap-6 shadow-md">
                            <Pressable
                                onPress={handleGoogleLogin}
                                disabled={isSignInSocialLoading}
                                className="flex-row items-center justify-center h-12 border border-gray-100 rounded-xl gap-2 active:opacity-75"
                            >
                                {isSignInSocialLoading ? (
                                    <ActivityIndicator
                                        color="#fff"
                                    />
                                ) : (
                                    <HStack className="items-center gap-2">
                                        <Image
                                            source={iconsPath.google}
                                            className="w-5 h-5"
                                            resizeMode="contain"
                                            alt="Google"
                                        />
                                        <Text className="text-gray-900 text-sm font-fredoka-semibold">
                                            Continue com Google
                                        </Text>
                                    </HStack>
                                )}
                            </Pressable>

                            <HStack className="items-center gap-4">
                                <Divider className="flex-1 bg-gray-100" />
                                <Text className="text-xs text-gray-400">
                                    ou login com
                                </Text>
                                <Divider className="flex-1 bg-gray-100" />
                            </HStack>

                            <VStack className="gap-4">
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
                                        <FormControl
                                            isInvalid={!!errors.password}
                                        >
                                            <Input
                                                className={`h-12 rounded-xl border bg-white px-3.5 ${errors.password ? 'border-red-400' : 'border-gray-100'}`}
                                            >
                                                <InputField
                                                    className="flex-1 text-sm text-gray-900 font-fredoka-medium"
                                                    placeholder="••••••••"
                                                    placeholderTextColor="#9ca3af"
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    secureTextEntry={
                                                        !showPassword
                                                    }
                                                    autoComplete="password"
                                                />
                                                <InputSlot
                                                    onPress={() =>
                                                        setShowPassword(
                                                            (p) => !p,
                                                        )
                                                    }
                                                    className="pr-3"
                                                >
                                                    {showPassword ? (
                                                        <Eye
                                                            size={16}
                                                            color="#9ca3af"
                                                        />
                                                    ) : (
                                                        <EyeOff
                                                            size={16}
                                                            color="#9ca3af"
                                                        />
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

                                <Pressable
                                    className="self-end active:opacity-70"
                                    onPress={() =>
                                        router.replace('/forgot-password')
                                    }
                                >
                                    <Text className="text-blue-500 text-xs font-fredoka-semibold">
                                        Esqueceu a senha?
                                    </Text>
                                </Pressable>
                            </VStack>

                            {serverError && (
                                <Text className="text-red-500 text-xs text-center -mt-2">
                                    {serverError}
                                </Text>
                            )}

                            <Button
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSignInEmailLoading}
                                className="h-12 bg-primary rounded-xl active:opacity-90"
                            >
                                {isSignInEmailLoading ? (
                                     <ActivityIndicator
                                        color="#fff"
                                    />
                                ) : (
                                    <ButtonText className="text-white text-sm font-fredoka-medium">
                                        Login
                                    </ButtonText>
                                )}
                            </Button>

                            <HStack className="items-center justify-center gap-1.5">
                                <Text className="text-gray-400 text-xs font-fredoka-medium">
                                    Não possui uma conta?
                                </Text>
                                <Pressable
                                    className="active:opacity-70"
                                    onPress={() => router.replace('/register')}
                                >
                                    <Text className="text-blue-500 text-xs font-fredoka-semibold">
                                        Registre-se
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
