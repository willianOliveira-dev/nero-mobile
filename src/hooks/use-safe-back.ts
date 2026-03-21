import { Href, useNavigation, useRouter } from 'expo-router';

export function useSafeBack() {
    const router = useRouter();
    const navigation = useNavigation();

    const goBack = (fallbackRoute: string = '/') => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.replace(fallbackRoute as Href);
        }
    };

    return { goBack };
}
