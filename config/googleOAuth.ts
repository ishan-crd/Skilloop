// Google OAuth Configuration
// You need to get these values from Google Cloud Console

export const GOOGLE_OAUTH_CONFIG = {
  // For development, we'll use a demo client ID that works with Expo
  // In production, replace with your actual Google OAuth Client ID
  clientId: '815594107067-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com',
  
  // Scopes for what information we want from Google
  scopes: ['openid', 'profile', 'email'],
  
  // Redirect URI for your app
  redirectUri: 'skilloop://auth',
};

// Instructions to get your Google OAuth Client ID:
// 1. Go to https://console.cloud.google.com/
// 2. Select your project (or create a new one)
// 3. Go to APIs & Services > Credentials
// 4. Click "Create Credentials" > "OAuth 2.0 Client ID"
// 5. Choose "Web application"
// 6. Add authorized redirect URIs:
//    - For development: http://localhost:19006
//    - For production: your production domain
// 7. Copy the Client ID and replace the placeholder above
