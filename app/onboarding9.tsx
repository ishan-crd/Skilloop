import * as Font from "expo-font";
import * as ImagePicker from 'expo-image-picker';
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

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  logoUri: string;
}

export default function Onboarding9() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    logoUri: ''
  });
  const { onboardingData, updateOnboardingData } = useOnboarding();
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

  const handleAddExperience = () => {
    setCurrentExperience({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      logoUri: ''
    });
    setShowAddForm(!showAddForm);
  };

  const handleEditExperience = (experience: WorkExperience) => {
    setCurrentExperience(experience);
    setShowAddForm(true);
  };

  const handleDeleteExperience = (id: string) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this work experience?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setWorkExperiences(prev => prev.filter(exp => exp.id !== id));
          }
        }
      ]
    );
  };

  const handleSaveExperience = () => {
    if (!currentExperience.company.trim()) {
      Alert.alert('Error', 'Please enter a company name');
      return;
    }
    if (!currentExperience.position.trim()) {
      Alert.alert('Error', 'Please enter a position');
      return;
    }
    if (!currentExperience.startDate.trim()) {
      Alert.alert('Error', 'Please enter a start date');
      return;
    }
    if (!currentExperience.isCurrent && !currentExperience.endDate.trim()) {
      Alert.alert('Error', 'Please enter an end date or mark as current position');
      return;
    }

    const experienceToSave = {
      ...currentExperience,
      id: currentExperience.id || Date.now().toString()
    };

    if (currentExperience.id) {
      setWorkExperiences(prev => 
        prev.map(exp => exp.id === currentExperience.id ? experienceToSave : exp)
      );
    } else {
      setWorkExperiences(prev => [...prev, experienceToSave]);
    }

    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setCurrentExperience({
      id: '',
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      logoUri: ''
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCurrentExperience(prev => ({
        ...prev,
        logoUri: result.assets[0].uri
      }));
    }
  };

  const handleContinue = () => {
    updateOnboardingData({ workExperiences });
    router.push("/onboarding8");
  };

  const handleSkip = () => {
    updateOnboardingData({ workExperiences: [] });
    router.push("/onboarding8");
  };

  if (!fontsLoaded) return null;

  if (showAddForm) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <View style={styles.progressBarContainer}>
              <View style={[styles.step, styles.activeStep]} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={[styles.step, styles.activeStep]} />
              <View style={[styles.step, styles.inactiveStep]} />
            </View>
            <Text style={styles.title}>Work Experience</Text>
          </View>

          <Text style={styles.subtitle}>Add your professional experience to highlight your career path.</Text>

          {/* Add Experience Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg., Apple Inc."
              value={currentExperience.company}
              onChangeText={(text) => setCurrentExperience(prev => ({ ...prev, company: text }))}
            />

            <Text style={styles.label}>Position/Job Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg., Software Engineer"
              value={currentExperience.position}
              onChangeText={(text) => setCurrentExperience(prev => ({ ...prev, position: text }))}
            />

            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YYYY"
              value={currentExperience.startDate}
              onChangeText={(text) => setCurrentExperience(prev => ({ ...prev, startDate: text }))}
            />

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setCurrentExperience(prev => ({ ...prev, isCurrent: !prev.isCurrent }))}
              >
                <View style={[styles.checkboxInner, currentExperience.isCurrent && styles.checkboxChecked]}>
                  {currentExperience.isCurrent && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>I currently work here</Text>
            </View>

            {!currentExperience.isCurrent && (
              <>
                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YYYY"
                  value={currentExperience.endDate}
                  onChangeText={(text) => setCurrentExperience(prev => ({ ...prev, endDate: text }))}
                />
              </>
            )}

            <Text style={styles.label}>Company Logo</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                {currentExperience.logoUri ? '✓ Logo Selected' : '+ Upload from device'}
              </Text>
            </TouchableOpacity>
            {currentExperience.logoUri && (
              <Image source={{ uri: currentExperience.logoUri }} style={styles.previewImage} />
            )}

            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveExperience}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressBarContainer}>
            <View style={[styles.step, styles.activeStep]} />
            <View style={[styles.step, styles.activeStep]} />
            <View style={[styles.step, styles.activeStep]} />
            <View style={[styles.step, styles.activeStep]} />
            <View style={[styles.step, styles.activeStep]} />
            <View style={[styles.step, styles.activeStep]} />
            <View style={[styles.step, styles.activeStep]} />
            <View style={[styles.step, styles.inactiveStep]} />
          </View>
          <Text style={styles.title}>Work Experience</Text>
        </View>

        <Text style={styles.subtitle}>Add your professional experience to highlight your career path.</Text>

        {/* Work Experience List */}
        {workExperiences.length > 0 && (
          <View style={styles.experienceList}>
            {workExperiences.map((experience) => (
              <View key={experience.id} style={styles.experienceCard}>
                <View style={styles.experienceLogo}>
                  {experience.logoUri ? (
                    <Image source={{ uri: experience.logoUri }} style={styles.logoImage} />
                  ) : (
                    <View style={styles.placeholderLogo}>
                      <Text style={styles.placeholderText}>
                        {experience.company.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.experienceInfo}>
                  <Text style={styles.experiencePosition}>{experience.position}</Text>
                  <Text style={styles.experienceCompany}>{experience.company} • {experience.startDate} - {experience.isCurrent ? 'Present' : experience.endDate}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteExperience(experience.id)}
                >
                  <Text style={styles.deleteIcon}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Experience Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddExperience}>
          <Text style={styles.addButtonText}>+ Add Experience</Text>
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: "#000",
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
  formContainer: {
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "MontserratBold",
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: "MontserratRegular",
    color: "#000",
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "dashed",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    color: "#000",
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    marginBottom: 16,
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 25,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    color: "#000",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#000",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 25,
    marginLeft: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    color: "#fff",
  },
  experienceList: {
    marginBottom: 20,
  },
  experienceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  experienceLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  placeholderLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 20,
    fontFamily: "MontserratBold",
    color: "#fff",
  },
  experienceInfo: {
    flex: 1,
  },
  experiencePosition: {
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    color: "#000",
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 14,
    fontFamily: "MontserratRegular",
    color: "#555",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    fontSize: 18,
    fontFamily: "MontserratBold",
    color: "#000",
  },
  addButton: {
    borderWidth: 2,
    borderColor: "#000",
    borderStyle: "dashed",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 30,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    color: "#000",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  skipButton: {
    paddingVertical: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    color: "#000",
  },
  continueButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: "center",
  },
  continueText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
    color: "#fff",
  },
});