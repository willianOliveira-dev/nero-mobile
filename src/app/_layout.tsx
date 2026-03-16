import { Stack } from 'expo-router';
import React from 'react';
import { configureGoogleSignIn } from '../lib/google';
import { RootProvider } from '../providers/root-provider';

configureGoogleSignIn();

export default function RootLayout() {
    return (
        <RootProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(public)" />
            </Stack>
        </RootProvider>
    );
}
