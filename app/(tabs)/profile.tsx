import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import CustomizeCardModal from '../../components/CustomizeCardModal';
import EditCardModal from '../../components/EditCardModal';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

interface UserInfo {
  name: string;
  age: string;
  gender: string;
  location: string;
  jobTitle: string;
  company: string;
  website: string;
  bio: string;
  role: string;
  profileImages: string[];
}

interface CardCustomizations {
  cardBackgroundColor: string;
  textColor: string;
  nameColor: string;
  roleColor: string;
  websiteColor: string;
  socialIconBackground: string;
  socialIconTextColor: string;
}

export default function ProfileScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user: currentUser, loading: authLoading, signOut } = useAuth();
  
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
    gender: '',
    location: '',
    jobTitle: '',
    company: '',
    website: '',
    bio: '',
    role: '',
    profileImages: [],
  });

  const [cardCustomizations, setCardCustomizations] = useState<CardCustomizations>({
    cardBackgroundColor: '#FFFFFF',
    textColor: '#000000',
    nameColor: '#000000',
    roleColor: '#6B7280',
    websiteColor: '#3B82F6',
    socialIconBackground: '#E5E7EB',
    socialIconTextColor: '#000000',
  });

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        MontserratRegular: require('../../assets/fonts/Montserrat-Regular.ttf'),
        MontserratBold: require('../../assets/fonts/Montserrat-Bold.ttf'),
        MontserratSemiBold: require('../../assets/fonts/Montserrat-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  // Update userInfo when currentUser changes
  useEffect(() => {
    console.log('Profile page - currentUser changed:', currentUser);
    if (currentUser) {
      console.log('Setting user info from currentUser:', currentUser);
      setUserInfo({
        name: currentUser.name || '',
        age: currentUser.age?.toString() || '',
        gender: currentUser.gender || '',
        location: currentUser.location || '',
        jobTitle: currentUser.job_title || '',
        company: currentUser.company || '',
        website: currentUser.website || '',
        bio: currentUser.bio || '',
        role: currentUser.role || '',
        profileImages: currentUser.profile_images || [],
      });
    }
  }, [currentUser]);

  const handleCustomizeSave = (customizations: CardCustomizations) => {
    setCardCustomizations(customizations);
  };

  const handleEditSave = (userData: UserInfo) => {
    setUserInfo(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (!fontsLoaded || authLoading) return null;

  // Show login prompt if no user
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noUserContainer}>
          <Text style={styles.noUserText}>Please complete onboarding first</Text>
          <Text style={styles.noUserSubtext}>Go back to sign in or complete your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  const socialIcons = {
    linkedin: 'in',
    instagram: '📷',
    github: '🐙',
    figma: '🎨',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Business Card</Text>
          <Text style={styles.cardIcon}>💳</Text>
        </View>

        {/* Business Card */}
        <View style={[styles.businessCard, { backgroundColor: cardCustomizations.cardBackgroundColor }]}>
          <Image 
            source={{ 
              uri: (userInfo.profileImages && userInfo.profileImages.length > 0) 
                ? userInfo.profileImages[0] 
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
            }} 
            style={styles.profileImage} 
          />
          <View style={styles.cardInfo}>
            <Text style={[styles.userName, { color: cardCustomizations.nameColor }]}>{userInfo.name}</Text>
            <Text style={[styles.userRole, { color: cardCustomizations.roleColor }]}>{userInfo.jobTitle}</Text>
            {userInfo.website && (
              <TouchableOpacity style={styles.websiteLink}>
                <Text style={[styles.websiteText, { color: cardCustomizations.websiteColor }]}>Website/Portfolio</Text>
              </TouchableOpacity>
            )}
            <View style={styles.socialIcons}>
              <View style={[styles.socialIcon, { backgroundColor: cardCustomizations.socialIconBackground }]}>
                <Text style={[styles.socialIconText, { color: cardCustomizations.socialIconTextColor }]}>in</Text>
              </View>
              <View style={[styles.socialIcon, { backgroundColor: cardCustomizations.socialIconBackground }]}>
                <Text style={[styles.socialIconText, { color: cardCustomizations.socialIconTextColor }]}>📷</Text>
              </View>
              <View style={[styles.socialIcon, { backgroundColor: cardCustomizations.socialIconBackground }]}>
                <Text style={[styles.socialIconText, { color: cardCustomizations.socialIconTextColor }]}>🐙</Text>
              </View>
              <View style={[styles.socialIcon, { backgroundColor: cardCustomizations.socialIconBackground }]}>
                <Text style={[styles.socialIconText, { color: cardCustomizations.socialIconTextColor }]}>🎨</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.arrowButton}>
            <Text style={[styles.arrowIcon, { color: cardCustomizations.textColor }]}>></Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Add card to home screen</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setShowCustomizeModal(true)}
          >
            <Text style={styles.secondaryButtonText}>Customize your card</Text>
            <Text style={styles.pencilIcon}>✏️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.tertiaryButton}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.tertiaryButtonText}>Edit your card</Text>
            <Text style={styles.pencilIcon}>✏️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <CustomizeCardModal
          visible={showCustomizeModal}
          onClose={() => setShowCustomizeModal(false)}
          onSave={handleCustomizeSave}
          currentCustomizations={cardCustomizations}
        />
        
        <EditCardModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          currentUserInfo={userInfo}
        />
      </ScrollView>
      <CustomBottomNavbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginRight: 8,
  },
  cardIcon: {
    fontSize: 20,
  },
  businessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    marginBottom: 8,
  },
  websiteLink: {
    marginBottom: 12,
  },
  websiteText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  socialIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconText: {
    fontSize: 12,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  arrowButton: {
    padding: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'MontserratBold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    marginRight: 8,
  },
  tertiaryButton: {
    backgroundColor: '#FDF2F8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tertiaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    marginRight: 8,
  },
  pencilIcon: {
    fontSize: 12,
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    marginRight: 8,
  },
  logoutIcon: {
    fontSize: 12,
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noUserText: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  noUserSubtext: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});
