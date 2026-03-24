import {
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { StripeProvider } from '@stripe/stripe-react-native';
import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner-native';
import { GluestackUIProvider } from '../components/gluestack/ui/gluestack-ui-provider';
import NeroSplashScreen from '../components/ui/nero-splash-screen';
import '../global.css';
import { AuthProvider } from './auth-provider';

SplashScreen.preventAutoHideAsync();

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
    const [fontsLoaded, fontsError] = useFonts({
        'Fredoka-Regular': Fredoka_400Regular,
        'Fredoka-Bold': Fredoka_700Bold,
        'Fredoka-Medium': Fredoka_500Medium,
        'Fredoka-SemiBold': Fredoka_600SemiBold,
        Oughter: require('../assets/fonts/Oughter.otf'),
    });
    const [splashFinished, setSplashFinished] = useState(false);

    const [queryClient] = useState(
        () =>
            new QueryClient({
                mutationCache: new MutationCache({
                    onSuccess: (_data, _variables, _context, mutation) => {
                        queryClient.invalidateQueries();
                        if (mutation.meta?.successMessage) {
                            toast.success(mutation.meta.successMessage as string);
                        }
                    },
                    onError: (_error, _variables, _context, mutation) => {
                        if (mutation.meta?.hideErrorToast) return;
                        const errorMessage =
                            mutation.meta?.errorMessage as string | undefined;
                        toast.error(
                            errorMessage || 'Ocorreu um erro inesperado. Tente novamente.',
                        );
                    },
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5,
                        gcTime: 1000 * 60 * 10,
                        retry: 2,
                    },
                    mutations: {
                        retry: 1,
                    },
                },
            }),
    );

    useEffect(() => {
        if (fontsLoaded || fontsError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontsError]);

    if (!fontsLoaded && !fontsError) return null;

    if (!splashFinished) {
        return <NeroSplashScreen onFinish={() => setSplashFinished(true)} />;
    }

    return (
        <GluestackUIProvider>
            <StripeProvider
                publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
                merchantIdentifier="merchant.com.nero"
            >
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </QueryClientProvider>
            </StripeProvider>
        </GluestackUIProvider>
    );
};