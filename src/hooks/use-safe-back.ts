import { useRouter } from 'expo-router';

export function useSafeBack() {
    const router = useRouter();

    const goBack = (fallbackRoute: string = '/') => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace(fallbackRoute as any);
        }
    };

    return { goBack };
}
