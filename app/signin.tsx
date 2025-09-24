import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { authService } from "../services/authService";
const router = useRouter();

const { width } = Dimensions.get("window");

export default function SignIn() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [phone, setPhone] = useState("+91 ");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
        MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
        MontserratBlack: require("../assets/fonts/Montserrat-Black.ttf"),
        MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
        MontserratLight: require("../assets/fonts/Montserrat-Light.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  const handlePhoneChange = (text: string) => {
    // Ensure +91 is always at the beginning
    if (!text.startsWith("+91 ")) {
      setPhone("+91 ");
    } else {
      setPhone(text);
    }
    setPhoneError("");
  };

  const validatePhone = () => {
    const phoneNumber = phone.replace("+91 ", "");
    if (phoneNumber.length < 10) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    if (!validatePhone()) return;

    setIsLoading(true);
    // Use the phone number as-is, let the authService handle formatting
    console.log('=== SEND OTP DEBUG ===');
    console.log('Sending OTP to:', phone);

    const result = await authService.sendOTP(phone);
    setIsLoading(false);

    console.log('Send OTP result:', result);

    if (result.success) {
      setIsOtpSent(true);
      setIsExistingUser(result.isExistingUser || false);
      
      if (result.isExistingUser) {
        Alert.alert('Welcome Back!', 'This phone number is already registered. Please enter the OTP to login.');
      } else {
        Alert.alert('OTP Sent!', 'This is a new number. Please enter the OTP to create your account.');
      }
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    console.log('=== OTP VERIFICATION DEBUG ===');
    console.log('Input OTP:', `"${otp}"`);
    console.log('OTP length:', otp.length);
    console.log('OTP type:', typeof otp);
    console.log('Is existing user:', isExistingUser);
    
    setIsLoading(true);
    const result = await authService.verifyOTP(otp);
    setIsLoading(false);

    console.log('OTP verification result:', result);
    console.log('Result success:', result.success);
    console.log('Result user:', result.user ? 'User exists' : 'No user');

    if (result.success && result.user) {
      // Store user data
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('currentUser', JSON.stringify(result.user));

      console.log('User onboarding status:', result.user.onboarding_completed);
      console.log('User name:', result.user.name);

      // Show success message
      if (isExistingUser) {
        Alert.alert('Login Successful!', 'Welcome back!');
      } else {
        Alert.alert('Account Created!', 'Your account has been created successfully!');
      }

      // Navigate based on onboarding status
      if (result.user.onboarding_completed) {
        console.log('User has completed onboarding, going to home page');
        router.replace('/(tabs)/discover');
      } else {
        console.log('User has not completed onboarding, going to onboarding page');
        router.replace('/onboarding1');
      }
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const result = await authService.signInWithGoogle();
    setIsLoading(false);

    if (result.success && result.user) {
      // Store user data
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('currentUser', JSON.stringify(result.user));

      if (result.user.onboarding_completed) {
        router.replace('/(tabs)/discover');
      } else {
        router.replace('/onboarding1');
      }
    } else {
      Alert.alert('Error', result.message);
    }
  };


  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>
          {isOtpSent 
            ? (isExistingUser 
                ? 'Welcome back! Enter the OTP to login' 
                : 'Enter the OTP to create your account')
            : 'Sign in or create an account to continue'
          }
        </Text>

        {!isOtpSent ? (
          <>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.input, phoneError ? styles.inputError : null]}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handlePhoneChange}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

            <TouchableOpacity
              style={[styles.continueButton, isLoading && styles.disabledButton]}
              onPress={handleSendOTP}
              disabled={isLoading}
            >
              <Text style={styles.continueText}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>

            <View style={styles.separator}>
              <View style={styles.line} />
              <Text style={styles.or}>or continue with</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, isLoading && styles.disabledButton]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <Image
                source={require("../assets/images/google.png")}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>

          </>
        ) : (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="123456"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
            <Text style={styles.phoneDisplay}>Sent to {phone}</Text>

            <TouchableOpacity
              style={[styles.continueButton, isLoading && styles.disabledButton]}
              onPress={handleVerifyOTP}
              disabled={isLoading}
            >
              <Text style={styles.continueText}>
                {isLoading 
                  ? 'Verifying...' 
                  : (isExistingUser ? 'Login' : 'Create Account')
                }
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => {
                setIsOtpSent(false);
                setOtp('');
                setIsExistingUser(false);
              }}
            >
              <Text style={styles.resendButtonText}>Change Phone Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 40,
    marginBottom: 30,
    alignSelf: "center",
  },
  subtitle: {
    fontFamily: "MontserratRegular",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  label: {
    fontFamily: "MontserratBold",
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    marginBottom: 20,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "MontserratRegular",
    marginTop: -15,
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: "#F4C3AC",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  continueText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#000",
  },
  disabledButton: {
    opacity: 0.6,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#000",
  },
  phoneDisplay: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    marginBottom: 20,
  },
  resendButton: {
    alignItems: "center",
    marginTop: 16,
  },
  resendButtonText: {
    fontSize: 14,
    fontFamily: "MontserratSemiBold",
    color: "#666",
  },
  separator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  or: {
    fontFamily: "MontserratRegular",
    fontSize: 14,
    marginHorizontal: 10,
    color: "#999",
  },
});
