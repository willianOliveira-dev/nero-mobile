import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { emailOTPClient } from 'better-auth/client/plugins';
import * as SecureStore from 'expo-secure-store';
import { env } from '../config/env';

export const authClient = createAuthClient({
    baseURL: env.EXPO_PUBLIC_BETTER_AUTH_URL,
    plugins: [
        expoClient({
            scheme: 'nero',
            storagePrefix: 'nero',
            storage: SecureStore,
        }),
        emailOTPClient(),
    ],
});
