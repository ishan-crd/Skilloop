import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const router = useRouter();

const { width } = Dimensions.get("window");

export default function SignIn() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [phone, setPhone] = useState("");

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

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.subtitle}>
        Sign in or create an account to continue
      </Text>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="+91"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push("/onboarding1")}
      >
        <Text style={styles.continueText}>Continue with Phone</Text>
      </TouchableOpacity>

      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={styles.or}>or continue with</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialRow}>
        <Image
          source={require("../assets/images/apple.png")}
          style={styles.socialIcon}
        />
        <Image
          source={require("../assets/images/google.png")}
          style={styles.socialIcon}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
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
  continueButton: {
    backgroundColor: "#F4C3AC",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 40,
  },
  continueText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#000",
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
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
  },
  socialIcon: {
    width: 50,
    height: 50,
  },
});
