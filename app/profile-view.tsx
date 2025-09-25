import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomBottomNavbar from '../components/CustomBottomNavbar';
import ProfileCard from '../components/ProfileCard';
import ProfileEditModal from '../components/ProfileEditModal';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/supabase';

interface UserInfo {
  name: string;
  age: string;
  gender: string;
  location: string;
  jobTitle: string;
  company: string;
  website: string;
  socialProfiles: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    figma?: string;
  };
  bio: string;
  skills: string[];
  role: string;
  certificates: any[];
  workExperiences: any[];
}

export default function ProfileViewScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState<'basic' | 'images' | 'experience' | 'skills' | 'social'>('basic');
  const { user: currentUser } = useAuth();
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

  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser || !fontsLoaded) return;

      try {
        setLoading(true);
        const { data: userData, error } = await userService.getUser(currentUser.id);
        
        if (error) {
          console.error('Error loading user data:', error);
          Alert.alert('Error', 'Failed to load profile data');
          return;
        }

        if (userData) {
          const transformedUserInfo: UserInfo = {
            name: userData.name || '',
            age: userData.age?.toString() || '',
            gender: userData.gender || '',
            location: userData.location || '',
            jobTitle: userData.job_title || '',
            company: userData.company || '',
            website: userData.website || '',
            socialProfiles: userData.social_profiles || {},
            bio: userData.bio || '',
            skills: userData.skills || [],
            role: userData.role || '',
            certificates: userData.certificates || [],
            workExperiences: userData.work_experiences || [],
          };
          setUserInfo(transformedUserInfo);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, fontsLoaded]);

  if (!fontsLoaded || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile data</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Transform user data to ProfileCard format
  const profileCardUser = {
    id: currentUser?.id || '',
    name: userInfo.name,
    age: parseInt(userInfo.age) || 25,
    gender: userInfo.gender,
    location: userInfo.location,
    jobTitle: userInfo.jobTitle,
    company: userInfo.company,
    website: userInfo.website,
    socialProfiles: userInfo.socialProfiles,
    profileImages: currentUser?.profile_images || [],
    bio: userInfo.bio,
    skills: userInfo.skills,
    role: userInfo.role,
    certificates: userInfo.certificates,
    workExperiences: userInfo.workExperiences,
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'What would you like to edit?',
      [
        { text: 'Basic Info', onPress: () => { setEditType('basic'); setShowEditModal(true); } },
        { text: 'Profile Images', onPress: () => { setEditType('images'); setShowEditModal(true); } },
        { text: 'Work Experience', onPress: () => { setEditType('experience'); setShowEditModal(true); } },
        { text: 'Skills & Bio', onPress: () => { setEditType('skills'); setShowEditModal(true); } },
        { text: 'Social Profiles', onPress: () => { setEditType('social'); setShowEditModal(true); } },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleEditOption = (type: 'basic' | 'images' | 'experience' | 'skills' | 'social') => {
    setEditType(type);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData: any) => {
    try {
      console.log('Saving profile data:', updatedData);
      
      // Convert the updated data back to database format
      const dbData = {
        name: updatedData.name,
        age: parseInt(updatedData.age) || 25,
        gender: updatedData.gender,
        location: updatedData.location,
        bio: updatedData.bio,
        skills: updatedData.skills || [],
        work_experiences: updatedData.workExperiences || [],
        certificates: updatedData.certificates || [],
        social_profiles: updatedData.socialProfiles || {},
        profile_images: updatedData.profileImages || [],
      };

      console.log('Database update data:', dbData);

      const { error } = await userService.updateUser(currentUser?.id || '', dbData);
      
      if (error) {
        console.error('Database error updating user:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        Alert.alert('Error', `Failed to update profile: ${error.message || 'Unknown error'}`);
        return;
      }

      // Update local state
      setUserInfo(updatedData);
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Unexpected error updating user:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
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
        
        <Text style={styles.title}>My Profile</Text>
        
        <TouchableOpacity 
          style={styles.editButton}
          onPress={handleEditProfile}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCardContainer}>
          <ProfileCard
            user={profileCardUser}
            onCross={() => {}} // Disabled for own profile
            onMatch={() => {}} // Disabled for own profile
          />
        </View>

        {/* Edit Options */}
        <View style={styles.editOptionsContainer}>
          <Text style={styles.editOptionsTitle}>Edit Your Profile</Text>
          
          <TouchableOpacity style={styles.editOption} onPress={() => setShowBasicInfoModal(true)}>
            <Text style={styles.editOptionIcon}>👤</Text>
            <View style={styles.editOptionContent}>
              <Text style={styles.editOptionTitle}>Basic Information</Text>
              <Text style={styles.editOptionSubtitle}>Name, age, location, bio</Text>
            </View>
            <Text style={styles.editOptionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editOption} onPress={() => handleEditOption('images')}>
            <Text style={styles.editOptionIcon}>📷</Text>
            <View style={styles.editOptionContent}>
              <Text style={styles.editOptionTitle}>Profile Images</Text>
              <Text style={styles.editOptionSubtitle}>Add or change your photos</Text>
            </View>
            <Text style={styles.editOptionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editOption} onPress={() => handleEditOption('experience')}>
            <Text style={styles.editOptionIcon}>💼</Text>
            <View style={styles.editOptionContent}>
              <Text style={styles.editOptionTitle}>Work Experience</Text>
              <Text style={styles.editOptionSubtitle}>Your professional background</Text>
            </View>
            <Text style={styles.editOptionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editOption} onPress={() => handleEditOption('skills')}>
            <Text style={styles.editOptionIcon}>🎯</Text>
            <View style={styles.editOptionContent}>
              <Text style={styles.editOptionTitle}>Skills & Certificates</Text>
              <Text style={styles.editOptionSubtitle}>Your expertise and achievements</Text>
            </View>
            <Text style={styles.editOptionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editOption} onPress={() => handleEditOption('social')}>
            <Text style={styles.editOptionIcon}>🔗</Text>
            <View style={styles.editOptionContent}>
              <Text style={styles.editOptionTitle}>Social Profiles</Text>
              <Text style={styles.editOptionSubtitle}>LinkedIn, GitHub, portfolio links</Text>
            </View>
            <Text style={styles.editOptionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modals */}

      <CustomBottomNavbar />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveEdit}
        currentData={userInfo}
        editType={editType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'MontserratBold',
  },
  title: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  editButton: {
    padding: 8,
  },
  editIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCardContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  editOptionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  editOptionsTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 20,
  },
  editOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  editOptionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  editOptionContent: {
    flex: 1,
  },
  editOptionTitle: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  editOptionSubtitle: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  editOptionArrow: {
    fontSize: 20,
    color: '#9CA3AF',
    fontFamily: 'MontserratBold',
  },
});
