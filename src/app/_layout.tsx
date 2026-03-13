import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../providers/AuthProvider';
import { RootProvider } from '../providers/RootProvider';

export default function RootLayout() {
    return (
        <RootProvider>
            <AuthProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(public)" />
                    <Stack.Screen name="(protected)" />
                </Stack>
            </AuthProvider>
        </RootProvider>
    );
}
