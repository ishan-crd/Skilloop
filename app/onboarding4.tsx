import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const DEFAULT_SKILLS = [
  "Editor",
  "Developer",
  "Designer",
  "business growth",
  "videography",
  "Marketing",
  "Writing",
  "UX Design",
  "Motion Graphics",
  "React",
  "UI/UX",
  "Strategy",
  "Consulting",
  "Content",
  "Analytics",
  "AI Prompting",
  "Scripting",
  "Photography",
  "Copywriting",
  "Leadership",
  "Startup",
  "Business",
  "Engineering",
  "Frontend",
  "Backend",
  "Cloud",
  "Figma",
  "Branding",
  "Email Marketing",
  "SEO",
  "Public Speaking",
  "Fundraising",
  "Operations",
  "Data Science",
  "Machine Learning",
  "Cybersecurity",
  "Finance",
  "Law",
  "HR",
  "Recruiting",
  "Sales",
  "Affiliate Marketing",
  "Translation",
  "Blockchain",
  "AR/VR",
  "Product Design",
  "Animation",
  "Sound Design",
  "Game Dev",
  "Research",
];

export default function Onboarding4() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState({
    skills: "",
    bio: "",
  });
  const router = useRouter();

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

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills([...skills, skill]);
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: "" }));
      }
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const validateForm = () => {
    const newErrors = {
      skills: "",
      bio: "",
    };

    if (skills.length === 0) {
      newErrors.skills = "Please select at least one skill";
    }

    const wordCount = bio.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (!bio.trim()) {
      newErrors.bio = "Bio is required";
    } else if (wordCount < 10) {
      newErrors.bio = "Bio must be at least 10 words";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleContinue = () => {
    if (validateForm()) {
      router.push("/onboarding5");
    }
  };

  const filteredSkills = DEFAULT_SKILLS.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

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
                i <= 3 ? styles.activeStep : styles.inactiveStep,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Misc</Text>
      <Text style={styles.subtitle}>Add your skills and bio</Text>

      {/* Skill input */}
      <Text style={styles.label}>Search your skill</Text>
      <TextInput
        placeholder="Eg., Editor , developer...."
        placeholderTextColor="#aaa"
        style={styles.input}
        value={search}
        onChangeText={setSearch}
      />

      {/* Selected Skills */}
      {skills.length > 0 && (
        <View style={styles.selectedSkillsContainer}>
          <Text style={styles.selectedSkillsTitle}>Selected Skills:</Text>
          <View style={styles.selectedSkills}>
            {skills.map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={styles.selectedSkillTag}
                onPress={() => removeSkill(skill)}
              >
                <Text style={styles.selectedSkillText}>
                  {getSkillEmoji(skill)} {skill} ✕
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Default skill tags */}
      <View style={styles.skillTags}>
        {filteredSkills.slice(0, 8).map((skill, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.skillTag,
              skills.includes(skill) && styles.selectedTag,
            ]}
            onPress={() => addSkill(skill)}
          >
            <Text style={styles.skillText}>
              {getSkillEmoji(skill)} {skill}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.skills ? <Text style={styles.errorText}>{errors.skills}</Text> : null}

      {/* Bio input */}
      <Text style={[styles.label, { marginTop: 20 }]}>Add short bio (minimum 10 words)</Text>
      <TextInput
        multiline
        placeholder="Type here..."
        placeholderTextColor="#aaa"
        value={bio}
        onChangeText={(text) => {
          setBio(text);
          if (errors.bio) {
            setErrors(prev => ({ ...prev, bio: "" }));
          }
        }}
        style={[styles.bioInput, errors.bio ? styles.inputError : null]}
      />
      {errors.bio ? <Text style={styles.errorText}>{errors.bio}</Text> : null}

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

// Add emoji mapping (basic)
const getSkillEmoji = (skill: string) => {
  if (skill.toLowerCase().includes("edit")) return "🎬";
  if (skill.toLowerCase().includes("develop")) return "👨‍💻";
  if (skill.toLowerCase().includes("design")) return "✏️";
  if (skill.toLowerCase().includes("growth")) return "📈";
  if (skill.toLowerCase().includes("video")) return "🎥";
  return "💡";
};

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
  skillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillTag: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  selectedTag: {
    backgroundColor: "#d6e4ff",
  },
  skillText: {
    fontFamily: "MontserratRegular",
    fontSize: 14,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 15,
    fontFamily: "MontserratRegular",
    textAlignVertical: "top",
    height: 120,
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
  },
  continueText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#fff",
  },
  selectedSkillsContainer: {
    marginBottom: 16,
  },
  selectedSkillsTitle: {
    fontSize: 14,
    fontFamily: "MontserratBold",
    marginBottom: 8,
    color: "#000",
  },
  selectedSkills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  selectedSkillTag: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  selectedSkillText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 12,
    color: "#fff",
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
});
