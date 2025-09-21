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

interface Certificate {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  imageUri: string;
  url: string;
}

export default function Onboarding7() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<Certificate>({
    id: '',
    title: '',
    organization: '',
    issueDate: '',
    imageUri: '',
    url: ''
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

  const handleAddCertificate = () => {
    setCurrentCertificate({
      id: '',
      title: '',
      organization: '',
      issueDate: '',
      imageUri: '',
      url: ''
    });
    setShowAddForm(true);
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setCurrentCertificate(certificate);
    setShowAddForm(true);
  };

  const handleDeleteCertificate = (id: string) => {
    Alert.alert(
      'Delete Certificate',
      'Are you sure you want to delete this certificate?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setCertificates(prev => prev.filter(cert => cert.id !== id));
          }
        }
      ]
    );
  };

  const handleSaveCertificate = () => {
    if (!currentCertificate.title.trim()) {
      Alert.alert('Error', 'Please enter a certificate title');
      return;
    }
    if (!currentCertificate.organization.trim()) {
      Alert.alert('Error', 'Please enter the issuing organization');
      return;
    }
    if (!currentCertificate.issueDate.trim()) {
      Alert.alert('Error', 'Please enter the issuing date');
      return;
    }

    const certificateToSave = {
      ...currentCertificate,
      id: currentCertificate.id || Date.now().toString()
    };

    if (currentCertificate.id) {
      setCertificates(prev => 
        prev.map(cert => cert.id === currentCertificate.id ? certificateToSave : cert)
      );
    } else {
      setCertificates(prev => [...prev, certificateToSave]);
    }

    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setCurrentCertificate({
      id: '',
      title: '',
      organization: '',
      issueDate: '',
      imageUri: '',
      url: ''
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
      setCurrentCertificate(prev => ({
        ...prev,
        imageUri: result.assets[0].uri
      }));
    }
  };

  const handleContinue = () => {
    updateOnboardingData({ certificates });
    router.push("/onboarding9");
  };

  const handleSkip = () => {
    updateOnboardingData({ certificates: [] });
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
              {[...Array(7)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.step,
                    i <= 6 ? styles.activeStep : styles.inactiveStep,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Certificates</Text>
          <Text style={styles.subtitle}>Add your certificates and certifications to showcase your skills.</Text>

          {/* Add Certificate Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Certificate Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg., AWS Certified Developer"
              value={currentCertificate.title}
              onChangeText={(text) => setCurrentCertificate(prev => ({ ...prev, title: text }))}
            />

            <Text style={styles.label}>Issuing Organization</Text>
            <TextInput
              style={styles.input}
              placeholder="Eg., Amazon Web Services"
              value={currentCertificate.organization}
              onChangeText={(text) => setCurrentCertificate(prev => ({ ...prev, organization: text }))}
            />

            <Text style={styles.label}>Issuing Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YYYY"
              value={currentCertificate.issueDate}
              onChangeText={(text) => setCurrentCertificate(prev => ({ ...prev, issueDate: text }))}
            />

            <Text style={styles.label}>Certificate Image</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Text style={styles.uploadButtonText}>
                {currentCertificate.imageUri ? '✓ Image Selected' : '+ Upload from device'}
              </Text>
            </TouchableOpacity>
            {currentCertificate.imageUri && (
              <Image source={{ uri: currentCertificate.imageUri }} style={styles.previewImage} />
            )}

            <Text style={styles.label}>Certificate URL</Text>
            <TextInput
              style={styles.input}
              placeholder="www.url.com"
              value={currentCertificate.url}
              onChangeText={(text) => setCurrentCertificate(prev => ({ ...prev, url: text }))}
            />
            <Text style={styles.hint}>to cross verify certificate</Text>

            <View style={styles.formButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveCertificate}>
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
            {[...Array(7)].map((_, i) => (
              <View
                key={i}
                style={[
                  styles.step,
                  i <= 6 ? styles.activeStep : styles.inactiveStep,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Certificates</Text>
        <Text style={styles.subtitle}>Add your certificates and certifications to showcase your skills.</Text>

        {/* Certificates List */}
        {certificates.length > 0 && (
          <View style={styles.certificatesList}>
            {certificates.map((certificate) => (
              <View key={certificate.id} style={styles.certificateCard}>
                <View style={styles.certificateLogo}>
                  {certificate.imageUri ? (
                    <Image source={{ uri: certificate.imageUri }} style={styles.logoImage} />
                  ) : (
                    <View style={styles.placeholderLogo}>
                      <Text style={styles.placeholderText}>
                        {certificate.organization.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.certificateInfo}>
                  <Text style={styles.certificateTitle}>{certificate.title}</Text>
                  <Text style={styles.certificateOrg}>{certificate.organization} • {certificate.issueDate}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteCertificate(certificate.id)}
                >
                  <Text style={styles.deleteIcon}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Certificate Button */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddCertificate}>
          <Text style={styles.addButtonText}>+ Add Certificate</Text>
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
  certificatesList: {
    marginBottom: 20,
  },
  certificateCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  certificateLogo: {
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
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 16,
    fontFamily: "MontserratSemiBold",
    color: "#000",
    marginBottom: 4,
  },
  certificateOrg: {
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