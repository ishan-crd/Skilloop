import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Onboarding2() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
  });

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

  const handleInputChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Back + Progress */}
      <View style={styles.topBar}>
        <Text style={styles.backArrow}>←</Text>
        <View style={styles.progressBarContainer}>
          {[...Array(7)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.step,
                i === 0 || i === 1 ? styles.activeStep : styles.inactiveStep,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Basic Information</Text>
      <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

      {/* Inputs */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          placeholder="Elon Musk"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={form.name}
          onChangeText={(val) => handleInputChange("name", val)}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          placeholder="21"
          placeholderTextColor="#ccc"
          style={styles.input}
          keyboardType="numeric"
          value={form.age}
          onChangeText={(val) => handleInputChange("age", val)}
        />

        <Text style={styles.label}>Gender</Text>
        <TextInput
          placeholder="Choose your gender"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={form.gender}
          onChangeText={(val) => handleInputChange("gender", val)}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          placeholder="Mars"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={form.location}
          onChangeText={(val) => handleInputChange("location", val)}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => router.push("/onboarding3")}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 25,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backArrow: {
    fontSize: 24,
    marginRight: 10,
  },
  progressBarContainer: {
    flexDirection: "row",
    gap: 6,
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
    fontSize: 22,
    fontFamily: "MontserratBold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "MontserratRegular",
    color: "#555",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    fontFamily: "MontserratBold",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  continueText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
