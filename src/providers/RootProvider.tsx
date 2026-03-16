import {
    Fredoka_400Regular,
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { GluestackUIProvider } from '../components/gluestack/ui/gluestack-ui-provider';
import NeroSplashScreen from '../components/ui/NeroSplashScreen';
import '../global.css';
import { AuthProvider } from './AuthProvider';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
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
});

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
    const [fontsLoaded, fontsError] = useFonts({
        'Fredoka-Regular': Fredoka_400Regular,
        'Fredoka-Bold': Fredoka_700Bold,
        'Fredoka-Medium': Fredoka_500Medium,
        'Fredoka-SemiBold': Fredoka_600SemiBold,
        Oughter: require('../assets/fonts/Oughter.otf'),
    });

    const [showNeroSplash, setShowNeroSplash] = useState(true);

    useEffect(() => {
        if (fontsLoaded || fontsError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontsError]);

    if (!fontsLoaded && !fontsError) {
        return null;
    }

    if (showNeroSplash) {
        return <NeroSplashScreen onFinish={() => setShowNeroSplash(false)} />;
    }

    return (
        <GluestackUIProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>{children}</AuthProvider>
            </QueryClientProvider>
        </GluestackUIProvider>
    );
};
