import { GoogleSignin } from '@react-native-google-signin/google-signin';

export function configureGoogleSignIn() {
    GoogleSignin.configure({
        webClientId: '891201305783-4gf0qt8igrlmrnkpehk8184ep0aqs083.apps.googleusercontent.com',
    });
}

export async function googleSignIn() {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();
    return data?.idToken;
}