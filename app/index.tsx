import * as Font from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
const router = useRouter();
const { width } = Dimensions.get("window");

const avatarData = [
  {
    src: require("../assets/images/avatars/Ellipse1.png"), //Hat Man Moustache
    size: 130,
    top: 21,
    left: 224,
  },
  {
    src: require("../assets/images/avatars/Ellipse2.png"), //Bald black guy
    size: 86,
    top: 154,
    left: width / 2 - 180,
  },
  {
    src: require("../assets/images/avatars/Ellipse3.png"), //Paris hat, brown girl
    size: 130,
    top: 180,
    left: width - 200,
  },
  {
    src: require("../assets/images/avatars/Ellipse4.png"), //winter cap girl specs
    size: 130,
    top: 295,
    left: 65,
  },
  {
    src: require("../assets/images/avatars/Ellipse5.png"), //Punjabi
    size: 82,
    top: 353,
    left: width / 2 + 50,
  },
  {
    src: require("../assets/images/avatars/Ellipse6.png"), //white bald guy
    size: 75,
    top: 105,
    left: width - 270,
  },
];

const FloatingAvatar = ({ source, size, top, left }: any) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-10, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    position: "absolute",
    top,
    left,
    width: size,
    height: size,
  }));

  return <Animated.Image source={source} style={animatedStyle} />;
};

export default function HomeScreen() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

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

      {/* Avatar Bubbles */}
      <View style={styles.avatarWrapper}>
        {avatarData.map((avatar, index) => (
          <FloatingAvatar
            key={index}
            source={avatar.src}
            size={avatar.size}
            top={avatar.top}
            left={avatar.left}
          />
        ))}
      </View>

      {/* Description Text */}
      <View style={styles.textBlock}>
        <Text style={[styles.desc, styles.connect]}>
          Connect <Text style={styles.regular}>with professionals.</Text>
        </Text>
        <Text style={[styles.desc, styles.collaborate]}>
          Collaborate <Text style={styles.regular}>on projects.</Text>
        </Text>
        <Text style={[styles.desc, styles.create]}>
          Create <Text style={styles.regular}>new opportunities.</Text>
        </Text>
      </View>

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.getStarted}
          onPress={() => router.push("/signin")}
        >
          <Text style={styles.getStartedText}>Get Started →</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/images/google.png")}
          style={styles.authIcon}
        />
        <Image
          source={require("../assets/images/apple.png")}
          style={styles.authIcon}
        />
      </View>

      {/* Sign In Text */}
      <Text style={styles.signInText}>
        Already have an account?{" "}
        <Text style={styles.signInLink} onPress={() => Linking.openURL("#")}>
          Sign in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    width: 170,
    height: 55,
    marginBottom: 30,
    position: "absolute",
    left: 30,
    top: 50,
  },
  avatarWrapper: {
    width: "100%",
    height: 400,
    position: "relative",
    marginBottom: 40,
  },
  textBlock: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  desc: {
    fontFamily: "MontserratRegular",
    fontSize: 23,
    textAlign: "left",
    marginBottom: 8,
    color: "#000",
  },
  regular: {
    fontFamily: "MontserratRegular",
    color: "#000",
  },
  connect: {
    color: "#9ED0C0",
    fontFamily: "MontserratBold",
  },
  collaborate: {
    color: "#E7AA74",
    fontFamily: "MontserratBold",
  },
  create: {
    color: "#000",
    fontFamily: "MontserratBold",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  getStarted: {
    backgroundColor: "#000",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  getStartedText: {
    color: "#fff",
    fontFamily: "MontserratSemiBold",
    fontSize: 16,
  },
  authIcon: {
    width: 30,
    height: 30,
  },
  signInText: {
    fontFamily: "MontserratRegular",
    fontSize: 17.21,
    color: "#000",
  },
  signInLink: {
    color: "#E7AA74",
  },
});
