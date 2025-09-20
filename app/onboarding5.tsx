import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";

const SOCIAL_ICONS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: require("../assets/images/social/linkedin.png"),
  },
  {
    key: "figma",
    label: "Figma",
    icon: require("../assets/images/social/figma.png"),
  },
  {
    key: "upwork",
    label: "Upwork",
    icon: require("../assets/images/social/upwork.png"),
  },
  {
    key: "dribbble",
    label: "Dribbble",
    icon: require("../assets/images/social/dribbble.png"),
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: require("../assets/images/social/instagram.png"),
  },
];

export default function Onboarding5() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();
  const { onboardingData, updateOnboardingData } = useOnboarding();

  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    website: "",
    socialProfiles: {} as Record<string, string>,
  });

  const [activeSocials, setActiveSocials] = useState<string[]>([]);

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

  // Load existing data from onboarding context
  useEffect(() => {
    if (onboardingData.jobTitle || onboardingData.company || onboardingData.website || onboardingData.socialProfiles) {
      setForm({
        jobTitle: onboardingData.jobTitle || "",
        company: onboardingData.company || "",
        website: onboardingData.website || "",
        socialProfiles: onboardingData.socialProfiles || {},
      });
    }
  }, [onboardingData]);

  if (!fontsLoaded) return null;

  const toggleSocial = (key: string) => {
    setActiveSocials((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const updateSocialLink = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      socialProfiles: {
        ...prev.socialProfiles,
        [key]: value,
      },
    }));
  };

  const handleContinue = () => {
    // Validate required fields
    if (!form.jobTitle.trim()) {
      Alert.alert('Error', 'Please enter your job title');
      return;
    }
    if (!form.company.trim()) {
      Alert.alert('Error', 'Please enter your company or project name');
      return;
    }

    // Save to onboarding context
    updateOnboardingData({
      jobTitle: form.jobTitle.trim(),
      company: form.company.trim(),
      website: form.website.trim(),
      socialProfiles: form.socialProfiles,
    });

    router.push("/onboarding7");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
    >
      {/* Top bar */}
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
                i <= 4 ? styles.activeStep : styles.inactiveStep,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Your Business Card</Text>
      <Text style={styles.subtitle}>
        Your quick identity card — this is what others will see first.
      </Text>

      {/* Inputs */}
      <Text style={styles.label}>Job Title *</Text>
      <TextInput
        placeholder="App Developer/Editor"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={form.jobTitle}
        onChangeText={(val) => setForm({ ...form, jobTitle: val })}
      />

      <Text style={styles.label}>Current Company / Project *</Text>
      <TextInput
        placeholder="Currently at [Your Startup Name]"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={form.company}
        onChangeText={(val) => setForm({ ...form, company: val })}
      />

      <Text style={styles.label}>Portfolio / Website (optional)</Text>
      <TextInput
        placeholder="www.mywork.dev"
        placeholderTextColor="#aaa"
        style={styles.input}
        value={form.website}
        onChangeText={(val) => setForm({ ...form, website: val })}
      />
      <Text style={styles.hint}>Link to your portfolio or website</Text>

      {/* Social Icons */}
      <Text style={styles.label}>Social Profiles (Select all that Apply)</Text>
      <View style={styles.socialRow}>
        {SOCIAL_ICONS.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => toggleSocial(item.key)}
            style={[
              styles.socialIconWrapper,
              activeSocials.includes(item.key) && styles.socialActive,
            ]}
          >
            <Image source={item.icon} style={styles.socialIcon} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Social URL Inputs */}
      {activeSocials.map((key) => {
        const label = SOCIAL_ICONS.find((s) => s.key === key)?.label || key;
        return (
          <TextInput
            key={key}
            placeholder={`${label} url`}
            placeholderTextColor="#aaa"
            value={form.socialProfiles[key] || ""}
            onChangeText={(val) => updateSocialLink(key, val)}
            style={styles.socialInput}
          />
        );
      })}

      {/* Continue */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
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
  label: {
    fontSize: 14,
    fontFamily: "MontserratBold",
    marginBottom: 6,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    fontFamily: "MontserratRegular",
    marginBottom: 16,
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
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  socialIconWrapper: {
    padding: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  socialActive: {
    borderColor: "#000",
    backgroundColor: "#f0f0f0",
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  socialInput: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "MontserratRegular",
    marginBottom: 12,
  },
  continueButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  continueText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
