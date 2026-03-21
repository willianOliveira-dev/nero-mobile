import { Redirect, Stack, usePathname } from 'expo-router';
import { useAuthStore } from '@/src/store/use-auth.store';

export default function AuthLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const pathname = usePathname();

    if (isAuthenticated) {
        const isAllowedAuthRoute = pathname.includes('/otp') || pathname.includes('/preferences')
        if (!isAllowedAuthRoute) {
            if (user && !user.emailVerified) {
                return <Redirect href={`/(auth)/otp?email=${user?.email}`} />;
            }
            return <Redirect href="/(private)/(tabs)/home" />;
        }
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="otp" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="reset-password" />
            <Stack.Screen name="preferences" />
        </Stack>
    );
}
