import * as Font from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useOnboarding } from "../contexts/OnboardingContext";

export default function Onboarding3() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();
  const { onboardingData, updateOnboardingData } = useOnboarding();

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

  const pickImage = async (index: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Enable gallery access to upload photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      const updatedImages = [...images];
      updatedImages[index] = selectedImage;
      setImages(updatedImages);
      
      // Clear errors when user uploads an image
      if (errors.images) {
        setErrors(prev => ({ ...prev, images: '' }));
      }
    }
  };

  const validateImages = () => {
    const uploadedImages = images.filter(img => img !== null);
    
    if (uploadedImages.length !== 3) {
      setErrors({ images: 'Please upload exactly 3 images' });
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleContinue = () => {
    if (validateImages()) {
      const uploadedImages = images.filter(img => img !== null) as string[];
      updateOnboardingData({ profileImages: uploadedImages });
      router.push("/onboarding4");
    }
  };

  if (!fontsLoaded) return null;

  const prompts = ["Your face", "Flex ur skill", "Professional work"];

  return (
    <View style={styles.container}>
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
                i <= 2 ? styles.activeStep : styles.inactiveStep,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Profile Images</Text>
      <Text style={styles.subtitle}>
        Upload exactly 3 professional photos that represent you best
      </Text>

      {/* Image Uploads */}
      <View style={styles.imageGrid}>
        {images.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.imageBox,
              errors.images && styles.imageBoxError
            ]}
            onPress={() => pickImage(idx)}
          >
            {img ? (
              <Image source={{ uri: img }} style={styles.image} />
            ) : (
              <Text style={styles.imageText}>{prompts[idx]}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Error Message */}
      {errors.images && (
        <Text style={styles.errorText}>{errors.images}</Text>
      )}

      {/* Image Count */}
      <Text style={styles.imageCount}>
        {images.filter(img => img !== null).length}/3 images uploaded
      </Text>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() =>
            pickImage(images.findIndex((img) => img === null) || 0)
          }
        >
          <Text style={styles.uploadText}>+ Upload photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageBox: {
    width: "48%",
    height: 110,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#aaa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    marginBottom: 10,
  },
  imageBoxError: {
    borderColor: "#ff4444",
    borderStyle: "solid",
  },
  imageText: {
    textAlign: "center",
    fontSize: 12,
    color: "#888",
    fontFamily: "MontserratRegular",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadButton: {
    backgroundColor: "#eee",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 30,
  },
  uploadText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 14,
    color: "#444",
  },
  continueButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  continueText: {
    fontFamily: "MontserratSemiBold",
    fontSize: 14,
    color: "#fff",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    fontFamily: "MontserratRegular",
    textAlign: "center",
    marginBottom: 10,
  },
  imageCount: {
    color: "#666",
    fontSize: 14,
    fontFamily: "MontserratRegular",
    textAlign: "center",
    marginBottom: 20,
  },
});
