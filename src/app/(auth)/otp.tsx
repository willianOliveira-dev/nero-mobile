import { Button, ButtonText } from '@/src/components/gluestack/ui/button';
import { Pressable } from '@/src/components/gluestack/ui/pressable';
import { Text } from '@/src/components/gluestack/ui/text';
import { VStack } from '@/src/components/gluestack/ui/vstack';
import { HStack } from '@/src/components/gluestack/ui/hstack';
import { Image } from '@/src/components/gluestack/ui/image';
import { imagesPath } from '@/src/constants/images';
import { useAuth } from '@/src/hooks/auth/use-auth';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/src/store/use-auth.store';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN = 60;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INPUT_SIZE = Math.min(44, (SCREEN_WIDTH - 48 - 48 - (OTP_LENGTH - 1) * 8) / OTP_LENGTH);

export default function OtpScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ email: string }>();
    const email = params.email ?? '';

    const { 
        verifyOtp, 
        resendOtp, 
        signOut,
        isVerifyOtpLoading, 
        isResendOtpLoading,
        isSignOutLoading 
    } = useAuth();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [serverError, setServerError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(RESEND_COUNTDOWN);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    
    const user = useAuthStore((state) => state.user);
    useEffect(() => {
        if (user?.emailVerified) {
            router.replace('/(private)/(tabs)/home');
        }
    }, [user?.emailVerified]);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChangeText = useCallback((text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text.slice(-1);
        setOtp(newOtp);

        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [otp]);

    const handleKeyPress = useCallback((key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
        }
    }, [otp]);

    async function handleVerify() {
        setServerError(null);
        const code = otp.join('');
        if (code.length < OTP_LENGTH) {
            setServerError('Digite o código completo.');
            return;
        }
        const result = await verifyOtp(email, code);
        if (!result.success) {
            setServerError(result.error ?? 'Código inválido ou expirado.');
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
            return;
        }
        router.replace('/preferences');
    }

    async function handleResend() {
        setServerError(null);
        const result = await resendOtp(email);
        if (!result.success) {
            setServerError(result.error ?? 'Erro ao reenviar código.');
            return;
        }
        setCountdown(RESEND_COUNTDOWN);
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
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
                            Verificar e-mail
                        </Text>
                        <Text className="text-white/80 text-md mt-3 text-center">
                            Enviamos um código para{'\n'}
                            <Text className="text-white font-fredoka-semibold">{email}</Text>
                        </Text>
                    </LinearGradient>

                    <VStack className="px-6 -mt-20 pb-10">
                        <VStack className="bg-white rounded-2xl p-6 gap-6 shadow-md items-center">
                            <HStack className="gap-2 justify-center flex-wrap">
                                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => {
                                            inputRefs.current[index] = ref;
                                        }}
                                        value={otp[index]}
                                        onChangeText={(text) => handleChangeText(text, index)}
                                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        textContentType="oneTimeCode"
                                        style={{
                                            width: INPUT_SIZE,
                                            height: INPUT_SIZE + 8,
                                            borderRadius: 12,
                                            borderWidth: 1.5,
                                            borderColor: serverError ? '#ef4444' : otp[index] ? '#d70040' : '#e5e7eb',
                                            backgroundColor: otp[index] ? '#fce4ec' : '#ffffff',
                                            textAlign: 'center',
                                            fontSize: 20,
                                            fontFamily: 'Fredoka-SemiBold',
                                            color: '#272727',
                                        }}
                                    />
                                ))}
                            </HStack>

                            {serverError && (
                                <Text className="text-red-500 text-xs text-center font-fredoka-medium">
                                    {serverError}
                                </Text>
                            )}

                            <Button
                                onPress={handleVerify}
                                disabled={isVerifyOtpLoading}
                                className="h-12 bg-primary rounded-xl active:opacity-90 w-full"
                            >
                                {isVerifyOtpLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <ButtonText className="text-white text-sm font-fredoka-medium">
                                        Verificar
                                    </ButtonText>
                                )}
                            </Button>

                            <HStack className="items-center justify-center gap-1.5">
                                <Text className="text-gray-400 text-xs font-fredoka-medium">
                                    Não recebeu o código?
                                </Text>
                                {countdown > 0 ? (
                                    <Text className="text-gray-400 text-xs font-fredoka-semibold">
                                        Reenviar em {countdown}s
                                    </Text>
                                ) : (
                                    <Pressable
                                        className="active:opacity-70"
                                        onPress={handleResend}
                                        disabled={isResendOtpLoading}
                                    >
                                        {isResendOtpLoading ? (
                                            <ActivityIndicator size="small" color="#d70040" />
                                        ) : (
                                            <Text className="text-blue-500 text-xs font-fredoka-semibold">
                                                Reenviar código
                                            </Text>
                                        )}
                                    </Pressable>
                                )}
                            </HStack>

                            <HStack className="items-center justify-center mt-2">
                                <Pressable
                                    className="active:opacity-70 p-2"
                                    onPress={async () => {
                                        await signOut();
                                        router.replace('/(auth)/login');
                                    }}
                                    disabled={isSignOutLoading}
                                >
                                    {isSignOutLoading ? (
                                        <ActivityIndicator size="small" color="#9ca3af" />
                                    ) : (
                                        <Text className="text-gray-500 text-xs font-fredoka-semibold underline">
                                            Trocar de email ou Sair
                                        </Text>
                                    )}
                                </Pressable>
                            </HStack>
                        </VStack>
                    </VStack>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
