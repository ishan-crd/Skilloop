import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomBottomNavbar from '../components/CustomBottomNavbar';

export default function SettingsScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        MontserratRegular: require('../assets/fonts/Montserrat-Regular.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
        MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const settingsItems = [
    { id: 'profile', title: 'Profile Settings', icon: '👨‍💼' },
    { id: 'account', title: 'Account Settings', icon: '🧾' },
    { id: 'preferences', title: 'App Preferences', icon: '📱' },
    { id: 'notifications', title: 'Notifications', icon: '🔔' },
    { id: 'privacy', title: 'Privacy & Security', icon: '🔒✏️' },
    { id: 'payments', title: 'Payments & Wallet', icon: '💳' },
    { id: 'tasks', title: 'Task & Project Settings', icon: '🔨🔧' },
    { id: 'support', title: 'Support & Legal', icon: '📄' },
    { id: 'about', title: 'About', icon: '👥' },
  ];

  const handleSettingPress = (settingId: string) => {
    console.log('Setting pressed:', settingId);
    // Add navigation logic for each setting
    switch (settingId) {
      case 'profile':
        // Navigate to profile settings
        break;
      case 'account':
        // Navigate to account settings
        break;
      case 'preferences':
        // Navigate to app preferences
        break;
      case 'notifications':
        // Navigate to notifications
        break;
      case 'privacy':
        // Navigate to privacy & security
        break;
      case 'payments':
        // Navigate to payments & wallet
        break;
      case 'tasks':
        // Navigate to task & project settings
        break;
      case 'support':
        // Navigate to support & legal
        break;
      case 'about':
        // Navigate to about
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>«</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </View>
      </View>

      {/* Settings List */}
      <View style={styles.settingsContainer}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={() => handleSettingPress(item.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.settingText}>{item.title}</Text>
            <Text style={styles.settingIcon}>{item.icon}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <CustomBottomNavbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'MontserratBold',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginRight: 8,
  },
  settingsIcon: {
    fontSize: 20,
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#000',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginLeft: 12,
  },
});
