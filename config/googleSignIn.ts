import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: '815594107067-your-web-client-id.apps.googleusercontent.com', // You'll need to get this from Google Console
    offlineAccess: true,
    hostedDomain: '',
    forceCodeForRefreshToken: true,
  });
};

export default GoogleSignin;
