import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../hooks/auth/use-auth';
import { useAuthStore } from '../store/use-auth.store';

export default function Index() {
    const { isAuthenticated } = useAuth();
    const user = useAuthStore((state) => state.user);

    if (isAuthenticated) {
        if (user && !user.emailVerified) {
            return <Redirect href={`/(auth)/otp?email=${user.email}`} />;
        }
        return <Redirect href="/(private)/(tabs)/home" />;
    }

    return <Redirect href="/(auth)/login" />;
}
