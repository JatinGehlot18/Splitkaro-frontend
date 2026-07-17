import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { AppConfig } from '../config';

if (AppConfig.googleClientId) {
  GoogleSignin.configure({ webClientId: AppConfig.googleClientId });
}

/** Runs the native Google sign-in flow and returns the idToken for `authApi.loginWithGoogle`. */
export async function signInWithGoogle(): Promise<string> {
  if (!AppConfig.googleClientId) {
    throw new Error('Google sign-in is not configured for this environment.');
  }
  await GoogleSignin.hasPlayServices();
  const response = await GoogleSignin.signIn();
  const idToken = response.data?.idToken;
  if (!idToken) {
    throw new Error('Google sign-in did not return an ID token.');
  }
  return idToken;
}

/** True if the user backed out of the native sign-in sheet — not a real error. */
export function isGoogleSignInCancelled(error: unknown): boolean {
  return isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED;
}

/** Best-effort — clears the native Google session too, so the account picker reappears next sign-in. No-op if the user never signed in with Google. */
export async function signOutOfGoogle(): Promise<void> {
  try {
    await GoogleSignin.signOut();
  } catch {
    // ignore
  }
}
