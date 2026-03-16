import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { env } from '../config/env';

export function configureGoogleSignIn() {
    GoogleSignin.configure({
        webClientId: env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });
}

export async function googleSignIn() {
    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();

    if (!response.data?.idToken) {
        return null;
    }

    return response.data.idToken;
}
