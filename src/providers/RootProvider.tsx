import '../global.css';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AuthProvider } from './AuthProvider';

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
    return (
        <QueryClientProvider client={queryClient}>
            <GluestackUIProvider mode="light">
                <AuthProvider>{children}</AuthProvider>
            </GluestackUIProvider>
        </QueryClientProvider>
    );
};
