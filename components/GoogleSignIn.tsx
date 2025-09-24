import { makeRedirectUri } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { GOOGLE_OAUTH_CONFIG } from '../config/googleOAuth';

interface GoogleSignInProps {
  onSignIn: (email: string, name: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
}

export default function GoogleSignIn({ onSignIn, onError, disabled, style, textStyle }: GoogleSignInProps) {
  const redirectUri = makeRedirectUri({
    scheme: 'skilloop',
    path: 'auth'
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_OAUTH_CONFIG.clientId,
    scopes: GOOGLE_OAUTH_CONFIG.scopes,
    redirectUri,
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      onError('Google Sign-In failed');
    }
  }, [response]);

  const handleGoogleResponse = async (response: any) => {
    try {
      // Get user info from Google
      const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.authentication?.accessToken}`);
      const userInfo = await userInfoResponse.json();
      
      const email = userInfo.email;
      const name = userInfo.name || 'Google User';

      onSignIn(email, name);
    } catch (error) {
      console.error('Error getting user info from Google:', error);
      onError('Failed to get user information from Google');
    }
  };

  const handlePress = () => {
    if (disabled) return;
    
    // For development, simulate Google authentication
    // In production, you would use: promptAsync();
    const mockEmail = `user${Date.now()}@gmail.com`;
    const mockName = 'Google User';
    
    console.log('[GoogleSignIn] Simulating Google authentication');
    onSignIn(mockEmail, mockName);
  };

  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabled]}
      onPress={handlePress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>Continue with Google</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
  },
});
