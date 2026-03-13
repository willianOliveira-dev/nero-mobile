import { useAuthStore } from '@/src/store/useAuthStore';
import { authClient } from '@/src/lib/auth-client';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import type {
    LoginFormData,
    RegisterFormData,
} from '@/src/schemas/auth/auth.schema';

type OAuthProvider = 'google' | 'github';

export const useAuth = () => {
    const router = useRouter();
    const [isSignInEmailLoading, setIsSignInEmailLoading] = useState(false);
    const [isSignInSocialLoading, setIsSignInSocialLoading] = useState(false);
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);
    const [isSignOutLoading, setIsSignOutLoading] = useState(false);
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false);

    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);

    const signInEmail = useCallback(async (data: LoginFormData) => {
        setIsSignInEmailLoading(true);

        const { data: session, error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: '/home',
        });

        setIsSignInEmailLoading(false);

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        if (session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
            });
        }

        return {
            success: true,
            data: session,
        };
    }, []);

    const signInSocial = useCallback(async (provider: OAuthProvider) => {
        setIsSignInSocialLoading(true);

        const { data: session, error } = await authClient.signIn.social({
            provider,
            callbackURL: '/home',
        });

        setIsSignInSocialLoading(false);

        if (error) {
            return {
                success: false,
                error: error.message,
            };
        }

        if ('user' in session && session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
            });
        }

        return {
            success: true,
            data: session,
        };
    }, []);

    const signUp = useCallback(
        async (data: RegisterFormData) => {
            setIsSignUpLoading(true);
            const { data: session, error } = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                callbackURL: '/home',
            });

            if (error) {
                setIsSignUpLoading(false);
                return {
                    success: false,
                    error: error.message,
                };
            }
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                });
            }

            setIsSignUpLoading(false);

            return {
                success: true,
                data: session,
            };
        },
        [setUser],
    );

    const signOut = useCallback(async () => {
        setIsSignOutLoading(true);
        try {
            await authClient.signOut();
            setUser(null);
            //   router.replace("/login")
        } catch (error) {
            console.error('Erro ao sair:', error);
        } finally {
            setIsSignOutLoading(false);
        }
    }, [setUser, router]);

    const isLoading = useCallback(() => {
        return (
            isSignInEmailLoading ||
            isSignUpLoading ||
            isSignOutLoading ||
            isSignInSocialLoading ||
            isResetPasswordLoading
        );
    }, [
        isSignInEmailLoading,
        isSignUpLoading,
        isSignOutLoading,
        isSignInSocialLoading,
        isResetPasswordLoading,
    ])();

    return {
        user,
        isLoading,
        isSignInEmailLoading,
        isSignUpLoading,
        isSignInSocialLoading,
        isSignOutLoading,
        isResetPasswordLoading,
        signInEmail,
        signInSocial,
        signUp,
        signOut,
    };
};
