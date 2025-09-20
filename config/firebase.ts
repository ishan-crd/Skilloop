import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  ConfirmationResult,
  getAuth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber
} from 'firebase/auth';

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCX1FrTfyhnWFl1p4Iy_Xhj8yWX7qAzW1s",
  authDomain: "skilloop-a368d.firebaseapp.com",
  projectId: "skilloop-a368d",
  storageBucket: "skilloop-a368d.firebasestorage.app",
  messagingSenderId: "815594107067",
  appId: "1:815594107067:web:abd56a20add75447b3399e",
  measurementId: "G-TR6SQKQM42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Create reCAPTCHA verifier (for web)
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const getRecaptchaVerifier = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: (response: any) => {
        console.log('reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        recaptchaVerifier = null; // Reset for retry
      }
    });
  }
  return recaptchaVerifier;
};

export const resetRecaptchaVerifier = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
};

export {
  PhoneAuthProvider, RecaptchaVerifier, signInWithCredential,
  signInWithPhoneNumber, type ConfirmationResult
};

