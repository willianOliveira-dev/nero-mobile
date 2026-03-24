import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn() {
    GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
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

export async function googleSignOut() {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
    } catch (error) {
        console.log('Erro ao deslogar do Google:', error);
    }
}
