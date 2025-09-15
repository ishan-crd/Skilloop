import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";

const { width } = Dimensions.get("window");

const roles = [
  {
    title: "Freelancer",
    description: "I provide services or work on projects",
    emoji: "🧑‍💻",
  },
  {
    title: "Founder",
    description: "I'm building a startup or business",
    emoji: "💼",
  },
  {
    title: "Student",
    description: "I'm studying or learning new skills",
    emoji: "🎓",
  },
  {
    title: "Company",
    description: "I represent a company or organization",
    emoji: "🏢",
  },
];

export default function Onboarding1() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const { updateOnboardingData } = useOnboarding();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        MontserratRegular: require("../assets/fonts/Montserrat-Regular.ttf"),
        MontserratBold: require("../assets/fonts/Montserrat-Bold.ttf"),
        MontserratSemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Back Button + Progress Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.step,
                i === 0 ? styles.activeStep : styles.inactiveStep,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>I am a…</Text>
      <Text style={styles.subtitle}>select what describes you</Text>

      {/* Role Options */}
      {roles.map((role) => (
        <TouchableOpacity
          key={role.title}
          style={[
            styles.option,
            selectedRole === role.title && styles.optionSelected,
          ]}
          onPress={() => setSelectedRole(role.title)}
        >
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>{role.title}</Text>
            <Text style={styles.optionDescription}>{role.description}</Text>
          </View>
          <Text style={styles.emoji}>{role.emoji}</Text>
        </TouchableOpacity>
      ))}

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          if (selectedRole) {
            updateOnboardingData({ role: selectedRole });
            router.push("/onboarding2");
          }
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 25,
    paddingTop: 60,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 10,
    padding: 8,
  },
  progressBarContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    flex: 1,
  },
  step: {
    height: 6,
    borderRadius: 3,
    flex: 1,
  },
  activeStep: {
    backgroundColor: "#000",
  },
  inactiveStep: {
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontFamily: "MontserratBold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "MontserratRegular",
    marginBottom: 30,
    color: "#555",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  optionSelected: {
    borderColor: "#000",
    backgroundColor: "#f9f9f9",
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: "MontserratBold",
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
    color: "#555",
  },
  emoji: {
    fontSize: 32,
    marginLeft: 10,
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
  },
});
