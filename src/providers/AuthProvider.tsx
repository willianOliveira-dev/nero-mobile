import React, { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authClient } from '../lib/auth-client';
import { ActivityIndicator, View } from 'react-native';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const setUser = useAuthStore((state) => state.setUser);

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (session?.user) {
            setUser({
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
            });
        } else if (!isPending) {
            setUser(null);
        }
    }, [session, setUser, isPending]);

    if (isPending) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return <>{children}</>;
};
