import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { authClient } from '../lib/auth-client';
import { useAuthStore } from '../store/use-auth.store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const setUser = useAuthStore((state) => state.setUser);

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                emailVerified: session.user.emailVerified,
            });
        } else if (!isPending) {
            setUser(null);
        }
    }, [session, setUser, isPending]);

    if (isPending) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    return <>{children}</>;
};
