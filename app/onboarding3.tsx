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

export default function Onboarding3() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);
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
    }
  };

  if (!fontsLoaded) return null;

  const prompts = ["Your face", "Flex ur skill", "Anything but professional"];

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
                i <= 2 ? styles.activeStep : styles.inactiveStep,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Profile Images</Text>
      <Text style={styles.subtitle}>
        Upload three professional photos that represent you best
      </Text>

      {/* Image Uploads */}
      <View style={styles.imageRow}>
        {images.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.imageBox}
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
          onPress={() => router.push("/onboarding4")}
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
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  imageBox: {
    width: 90,
    height: 110,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#aaa",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
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
});
