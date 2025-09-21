import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";

export default function Onboarding2() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const [form, setForm] = useState({
    name: onboardingData.name,
    age: onboardingData.age,
    gender: onboardingData.gender,
    location: onboardingData.location,
  });

  const [errors, setErrors] = useState({
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
    // Clear error when user starts typing
    if (errors[key as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      age: "",
      gender: "",
      location: "",
    };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!form.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(form.age)) || Number(form.age) < 1 || Number(form.age) > 120) {
      newErrors.age = "Please enter a valid age";
    }
    if (!form.gender) {
      newErrors.gender = "Please select your gender";
    }
    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleContinue = () => {
    if (validateForm()) {
      updateOnboardingData({
        name: form.name,
        age: form.age,
        gender: form.gender,
        location: form.location,
      });
      router.push("/onboarding3");
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back + Progress */}
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
            style={[styles.input, errors.name ? styles.inputError : null]}
            value={form.name}
            onChangeText={(val) => handleInputChange("name", val)}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <Text style={styles.label}>Age</Text>
          <TextInput
            placeholder="21"
            placeholderTextColor="#ccc"
            style={[styles.input, errors.age ? styles.inputError : null]}
            keyboardType="numeric"
            value={form.age}
            onChangeText={(val) => handleInputChange("age", val)}
          />
          {errors.age ? <Text style={styles.errorText}>{errors.age}</Text> : null}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.dropdownContainer}>
            {["Male", "Female", "Other"].map((genderOption) => (
              <TouchableOpacity
                key={genderOption}
                style={[
                  styles.genderOption,
                  form.gender === genderOption && styles.genderOptionSelected,
                  errors.gender && !form.gender && styles.genderOptionError,
                ]}
                onPress={() => handleInputChange("gender", genderOption)}
              >
                <Text style={[
                  styles.genderOptionText,
                  form.gender === genderOption && styles.genderOptionTextSelected,
                ]}>
                  {genderOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

          <Text style={styles.label}>Location</Text>
          <TextInput
            placeholder="Mars"
            placeholderTextColor="#ccc"
            style={[styles.input, errors.location ? styles.inputError : null]}
            value={form.location}
            onChangeText={(val) => handleInputChange("location", val)}
          />
          {errors.location ? <Text style={styles.errorText}>{errors.location}</Text> : null}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 25,
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
  dropdownContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  genderOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  genderOptionSelected: {
    borderColor: "#000",
    backgroundColor: "#000",
  },
  genderOptionText: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
    color: "#555",
  },
  genderOptionTextSelected: {
    color: "#fff",
    fontFamily: "MontserratSemiBold",
  },
  genderOptionError: {
    borderColor: "#EF4444",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontFamily: "MontserratRegular",
    marginTop: -10,
    marginBottom: 10,
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
