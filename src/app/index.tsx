

import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore'; 

export default function Index() {
    const { isAuthenticated } = useAuthStore();

    if (isAuthenticated) {
        // return <Redirect href="/(public)/home" />;
    }

    return <Redirect href="/(auth)/Login" />;
}