import { useAuth } from '@/src/hooks/auth/use-auth';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        <Redirect href="/home" />;
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    );
}
