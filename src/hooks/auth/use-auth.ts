import { authClient } from '@/src/lib/auth-client';
import { googleSignIn, googleSignOut } from '@/src/lib/google';
import type {
    LoginFormData,
    RegisterFormData,
} from '@/src/schemas/auth/auth.schema';
import { useAuthStore } from '@/src/store/use-auth.store';
import { useCartStore } from '@/src/store/use-cart-store';
import { useSearchStore } from '@/src/store/use-search-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';

type OAuthProvider = 'google';

export const useAuth = () => {
    const [isSignInEmailLoading, setIsSignInEmailLoading] = useState(false);
    const [isSignInSocialLoading, setIsSignInSocialLoading] = useState(false);
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);
    const [isSignOutLoading, setIsSignOutLoading] = useState(false);
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [isVerifyOtpLoading, setIsVerifyOtpLoading] = useState(false);
    const [isResendOtpLoading, setIsResendOtpLoading] = useState(false);

    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const setUser = useAuthStore((state) => state.setUser);
    const queryClient = useQueryClient();

    const signInEmail = useCallback(
        async (data: LoginFormData) => {
            setIsSignInEmailLoading(true);

            const { data: session, error } = await authClient.signIn.email({
                email: data.email,
                password: data.password,
            });

            setIsSignInEmailLoading(false);

            if (error) return { success: false, error: error.message };

            if (session?.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    emailVerified: session.user.emailVerified,
                });
            }

            return { success: true, data: session };
        },
        [setUser],
    );

    const signInSocial = useCallback(
        async (provider: OAuthProvider) => {
            setIsSignInSocialLoading(true);
            try {
                if (provider === 'google') {
                    const idToken = await googleSignIn();

                    if (!idToken) {
                        return { success: false, error: null };
                    }

                    const { data: session, error } =
                        await authClient.signIn.social({
                            provider: 'google',
                            idToken: {
                                token: idToken,
                            },
                        });

                    if (error) return { success: false, error: error.message };

                    if (session && 'user' in session && session.user) {
                        setUser({
                            id: session.user.id,
                            name: session.user.name,
                            email: session.user.email,
                            emailVerified: session.user.emailVerified,
                        });
                    }

                    return { success: true, data: session };
                }

                return { success: false, error: 'Provider não suportado' };
            } catch (error) {
                console.log('Erro ao autenticar com Google:', error);
                return {
                    success: false,
                    error: 'Erro ao autenticar com Google',
                };
            } finally {
                setIsSignInSocialLoading(false);
            }
        },
        [setUser],
    );

    const signUp = useCallback(
        async (data: RegisterFormData) => {
            setIsSignUpLoading(true);
            const { data: session, error } = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
            });

            setIsSignUpLoading(false);

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, data: session };
        },
        [],
    );

    const forgotPassword = useCallback(async (email: string) => {
        setIsForgotPasswordLoading(true);
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'forget-password',
            });

            if (error) return { success: false, error: error.message };
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Erro ao enviar código de recuperação.' };
        } finally {
            setIsForgotPasswordLoading(false);
        }
    }, []);

    const resetPassword = useCallback(async (email: string, otp: string, newPassword: string) => {
        setIsResetPasswordLoading(true);
        try {
            const { error } = await authClient.emailOtp.resetPassword({
                email,
                otp,
                password: newPassword,
            });

            if (error) return { success: false, error: error.message };
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Erro ao redefinir senha.' };
        } finally {
            setIsResetPasswordLoading(false);
        }
    }, []);

    const verifyOtp = useCallback(async (email: string, otp: string) => {
        setIsVerifyOtpLoading(true);
        try {
            const { error } = await authClient.emailOtp.verifyEmail({
                email,
                otp,
            });

            if (error) return { success: false, error: error.message };

            const { data: sessionData } = await authClient.getSession();
            if (sessionData?.user) {
                setUser({
                    id: sessionData.user.id,
                    name: sessionData.user.name,
                    email: sessionData.user.email,
                    emailVerified: sessionData.user.emailVerified,
                });
            }

            return { success: true };
        } catch (err) {
            return { success: false, error: 'Código inválido ou expirado.' };
        } finally {
            setIsVerifyOtpLoading(false);
        }
    }, [setUser]);

    const resendOtp = useCallback(async (email: string) => {
        setIsResendOtpLoading(true);
        try {
            const { error } = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'email-verification',
            });

            if (error) return { success: false, error: error.message };
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Erro ao reenviar código.' };
        } finally {
            setIsResendOtpLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        setIsSignOutLoading(true);
        try {
            await SecureStore.deleteItemAsync('nero_cookie');
            await SecureStore.deleteItemAsync('nero_session_data');

            await AsyncStorage.removeItem('auth-storage');
            await AsyncStorage.removeItem('cart-storage');

            useAuthStore.getState().logout();
            useCartStore.getState().setItemCount(0);
            useSearchStore.getState().clearFilters();

            queryClient.clear();

            try { await authClient.signOut(); } catch (e) { console.log('signOut server:', e); }
            
            try { await googleSignOut(); } catch (e) { console.log('googleSignOut:', e); }
        } catch (error) {
            console.log('Erro ao sair:', error);
        } finally {
            setIsSignOutLoading(false);
        }
    }, [queryClient]);

    const isLoading = useCallback(() => {
        return (
            isSignInEmailLoading ||
            isSignUpLoading ||
            isSignOutLoading ||
            isSignInSocialLoading ||
            isResetPasswordLoading ||
            isForgotPasswordLoading ||
            isVerifyOtpLoading ||
            isResendOtpLoading
        );
    }, [
        isSignInEmailLoading,
        isSignUpLoading,
        isSignOutLoading,
        isSignInSocialLoading,
        isResetPasswordLoading,
        isForgotPasswordLoading,
        isVerifyOtpLoading,
        isResendOtpLoading,
    ])();

    return {
        user,
        isAuthenticated,
        isLoading,
        isSignInEmailLoading,
        isSignInSocialLoading,
        isSignUpLoading,
        isSignOutLoading,
        isResetPasswordLoading,
        isForgotPasswordLoading,
        isVerifyOtpLoading,
        isResendOtpLoading,
        signInEmail,
        signInSocial,
        signUp,
        signOut,
        forgotPassword,
        resetPassword,
        verifyOtp,
        resendOtp,
    };
};
