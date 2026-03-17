import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '../hooks/auth/use-auth';

export default function Index() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Redirect href="/(public)/(tabs)/home" />;
    }

    return <Redirect href="/(auth)/login" />;
}
