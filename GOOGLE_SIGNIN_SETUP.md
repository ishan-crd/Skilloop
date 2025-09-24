# 🔐 Google Sign-In Setup Guide

## 📋 **Current Status**
✅ **Real Google Sign-In is implemented using Expo Auth Session with React Component**

The app now uses real Google OAuth authentication with a proper React component that:
- Opens actual Google Sign-In popup
- Gets real user email and name from Google
- Redirects users to onboarding after authentication
- Works with Expo managed workflow
- Uses React hooks properly in a component

## 🚀 **How It Works Now**

### Current Implementation:
1. **User taps "Continue with Google"**
2. **Google OAuth popup opens** (real Google authentication)
3. **User signs in with their actual Google account**
4. **App gets real email and name from Google**
5. **Redirects to onboarding** for profile completion

### Architecture:
- **`GoogleSignIn` component**: Handles Google OAuth using React hooks
- **`authService.createGoogleUser()`**: Creates/authenticates users with real Google data
- **Sign-in page**: Uses the GoogleSignIn component

### Benefits:
- ✅ Real Google authentication
- ✅ Users sign in with their actual Google accounts
- ✅ No native module linking issues
- ✅ Works with Expo managed workflow
- ✅ Proper React hooks usage
- ✅ Users still go through onboarding

## 🔧 **Setup Required**

### Step 1: Get Google OAuth Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - For development: `http://localhost:19006`
   - For production: Your production domain
7. Copy the **Client ID**

### Step 2: Update Configuration
Replace the placeholder in `config/googleOAuth.ts`:

```typescript
export const GOOGLE_OAUTH_CONFIG = {
  clientId: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com',
  scopes: ['openid', 'profile', 'email'],
  redirectUri: 'skilloop://auth',
};
```

## ✅ **Testing**

1. **Update the Google OAuth Client ID** in `config/googleOAuth.ts`
2. Run your app: `npm start`
3. Go to the sign-in page
4. Tap "Continue with Google"
5. **Google Sign-In popup will open**
6. Sign in with your real Google account
7. You'll be redirected to onboarding

## 🎯 **What Happens Next**

After successful Google authentication:
- User's real email and name are saved
- User is redirected to onboarding
- User completes their profile
- User accesses the main app

## 🐛 **Troubleshooting**

### Common Issues:
1. **"Invalid client"**: Check if Client ID is correct in `config/googleOAuth.ts`
2. **"Redirect URI mismatch"**: Add your redirect URI to Google Console
3. **"Access denied"**: Check OAuth consent screen configuration

### Debug Steps:
1. Check console logs for detailed error messages
2. Verify the Client ID matches your Google Console configuration
3. Ensure redirect URIs are properly configured

## 📁 **File Structure**

- `components/GoogleSignIn.tsx` - React component for Google OAuth
- `config/googleOAuth.ts` - Google OAuth configuration
- `services/authService.ts` - Backend authentication logic
- `app/signin.tsx` - Sign-in page using GoogleSignIn component
