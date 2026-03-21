import { Stack } from 'expo-router';
import React from 'react';
import { configureGoogleSignIn } from '../lib/google';
import { RootProvider } from '../providers/root-provider';
import { Toaster } from 'sonner-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

configureGoogleSignIn();

export default function RootLayout() {
    return (
         <GestureHandlerRootView style={{ flex: 1 }}>
            <RootProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(private)" />
                </Stack>
            </RootProvider>
            <Toaster position="top-center" richColors />
        </GestureHandlerRootView>
    );
}