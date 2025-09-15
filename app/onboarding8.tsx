import * as Font from 'expo-font';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import { supabase } from '../services/supabase';

export default function Onboarding8() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { onboardingData, clearOnboardingData } = useOnboarding();
  const { setUserData } = useAuth();

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

  const createUserProfile = async () => {
    if (isCreatingProfile) return;
    setIsCreatingProfile(true);
    
    try {
      const tempEmail = `user${Date.now()}@skilloop.local`;

      const { data: userId, error: profileError } = await supabase.rpc('create_user_profile', {
        user_email: tempEmail,
        user_name: onboardingData.name,
        user_age: parseInt(onboardingData.age) || 0,
        user_gender: onboardingData.gender,
        user_location: onboardingData.location,
        user_job_title: onboardingData.jobTitle,
        user_company: onboardingData.company,
        user_website: onboardingData.website,
        user_bio: onboardingData.bio,
        user_role: onboardingData.role,
        user_skills: onboardingData.skills,
        user_profile_images: onboardingData.profileImages,
        user_social_profiles: onboardingData.socialProfiles,
      });

      if (profileError) {
        console.error('Profile error:', profileError);
        Alert.alert('Error', 'Failed to create profile. Please try again.');
        return;
      }

      console.log('Profile created successfully');
      console.log('User ID:', userId);

      if (!userId) {
        Alert.alert('Error', 'Failed to get user ID. Please try again.');
        return;
      }

      const userData = {
        id: userId,
        email: tempEmail,
        name: onboardingData.name,
        age: parseInt(onboardingData.age) || 0,
        gender: onboardingData.gender,
        location: onboardingData.location,
        job_title: onboardingData.jobTitle,
        company: onboardingData.company,
        website: onboardingData.website,
        bio: onboardingData.bio,
        role: onboardingData.role,
        skills: onboardingData.skills,
        profile_images: onboardingData.profileImages,
        social_profiles: onboardingData.socialProfiles,
        certificates: onboardingData.certificates || [],
        onboarding_completed: true,
        is_active: true,
      };

      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('User data stored in AsyncStorage');

      setUserData(userData);
      console.log('User data set in AuthContext');

      clearOnboardingData();
      Alert.alert(
        'Success!',
        'Your profile has been created successfully!',
        [{ text: 'Get Started', onPress: () => router.push('/(tabs)/discover') }]
      );
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsCreatingProfile(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
          </View>
          <Text style={styles.title}>Complete Setup</Text>
        </View>

        {/* Content */}
        <View style={styles.mainContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.checkIcon}>✅</Text>
          </View>
          
          <Text style={styles.mainTitle}>You're All Set!</Text>
          <Text style={styles.subtitle}>
            Your profile has been created with all the information you provided. 
            You can now start discovering and connecting with other professionals.
          </Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>👤</Text>
              <Text style={styles.featureText}>Complete profile with photos</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💼</Text>
              <Text style={styles.featureText}>Professional business card</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={styles.featureText}>Certificates & achievements</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔍</Text>
              <Text style={styles.featureText}>Discover like-minded professionals</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.getStartedButton, isCreatingProfile && styles.disabledButton]}
            onPress={createUserProfile}
            disabled={isCreatingProfile}
          >
            <Text style={styles.getStartedText}>
              {isCreatingProfile ? 'Creating Profile...' : 'Get Started'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  title: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginLeft: 20,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkIcon: {
    fontSize: 60,
  },
  mainTitle: {
    fontSize: 32,
    fontFamily: 'MontserratBold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  featuresList: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
    flex: 1,
  },
  actionContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'MontserratSemiBold',
  },
  disabledButton: {
    opacity: 0.6,
  },
});
