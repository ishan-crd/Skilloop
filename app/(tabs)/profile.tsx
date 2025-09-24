import * as Font from 'expo-font';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import CustomizeCardModal from '../../components/CustomizeCardModal';
import EditCardModal from '../../components/EditCardModal';
import HubPage from '../../components/HubPage';
import { useAuth } from '../../contexts/AuthContext';

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
  const [showBusinessCard, setShowBusinessCard] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const { user: currentUser, loading: authLoading, signOut } = useAuth();
  
  const flipAnimation = useRef(new Animated.Value(0)).current;
  
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

  const handleCardFlip = () => {
    const toValue = isFlipped ? 0 : 1;
    setIsFlipped(!isFlipped);
    
    Animated.timing(flipAnimation, {
      toValue,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

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

  const handleMyCardPress = () => {
    setShowBusinessCard(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HubPage onMyCardPress={handleMyCardPress} />
      
      {/* Business Card Modal */}
      <Modal
        visible={showBusinessCard}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBusinessCard(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Business Card</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowBusinessCard(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Flippable Business Card */}
            <View style={styles.cardContainer}>
              <TouchableOpacity onPress={handleCardFlip} activeOpacity={0.9}>
                {/* Front of Card */}
                <Animated.View 
                  style={[
                    styles.businessCard, 
                    { 
                      backgroundColor: cardCustomizations.cardBackgroundColor,
                      transform: [{ rotateY: frontInterpolate }]
                    }
                  ]}
                >
                  <Image 
                    source={{ 
                      uri: (userInfo.profileImages && userInfo.profileImages.length > 0) 
                        ? userInfo.profileImages[0] 
                        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                    }} 
                    style={styles.profileImage} 
                  />
                  <View style={styles.cardInfo}>
                    <Text style={[styles.userName, { color: cardCustomizations.nameColor }]}>{userInfo.name || 'Erik Tyler'}</Text>
                    <Text style={[styles.userRole, { color: cardCustomizations.roleColor }]}>{userInfo.jobTitle || 'App developer'}</Text>
                    <TouchableOpacity style={styles.websiteLink}>
                      <Text style={[styles.websiteText, { color: cardCustomizations.websiteColor }]}>Website/Portfolio</Text>
                    </TouchableOpacity>
                    <View style={styles.socialIcons}>
                      <View style={[styles.socialIcon, { backgroundColor: '#0077B5' }]}>
                        <Text style={[styles.socialIconText, { color: '#FFFFFF' }]}>in</Text>
                      </View>
                      <View style={[styles.socialIcon, { backgroundColor: '#E4405F' }]}>
                        <Text style={[styles.socialIconText, { color: '#FFFFFF' }]}>📷</Text>
                      </View>
                      <View style={[styles.socialIcon, { backgroundColor: '#333333' }]}>
                        <Text style={[styles.socialIconText, { color: '#FFFFFF' }]}>🐙</Text>
                      </View>
                      <View style={[styles.socialIcon, { backgroundColor: '#F24E1E' }]}>
                        <Text style={[styles.socialIconText, { color: '#FFFFFF' }]}>🎨</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.arrowButton}>
                    <Text style={[styles.arrowIcon, { color: cardCustomizations.textColor }]}>«</Text>
                  </View>
                </Animated.View>

                {/* Back of Card with QR Code */}
                <Animated.View 
                  style={[
                    styles.businessCard, 
                    styles.cardBack,
                    { 
                      backgroundColor: cardCustomizations.cardBackgroundColor,
                      transform: [{ rotateY: backInterpolate }]
                    }
                  ]}
                >
                  <View style={styles.qrSection}>
                    <View style={styles.qrCode}>
                      <Text style={styles.qrText}>QR CODE</Text>
                      <View style={styles.qrPattern}>
                        <View style={styles.qrRow}>
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                        </View>
                        <View style={styles.qrRow}>
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                        </View>
                        <View style={styles.qrRow}>
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                        </View>
                        <View style={styles.qrRow}>
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                        </View>
                        <View style={styles.qrRow}>
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                          <View style={[styles.qrSquare, styles.qrWhite]} />
                          <View style={[styles.qrSquare, styles.qrBlack]} />
                        </View>
                      </View>
                    </View>
                    <View style={styles.qrInfo}>
                      <Text style={[styles.userName, { color: cardCustomizations.nameColor }]}>{userInfo.name || 'Erik Tyler'}</Text>
                      <View style={styles.qrActions}>
                        <TouchableOpacity style={styles.shareButton}>
                          <Text style={styles.shareButtonText}>Share</Text>
                          <Text style={styles.shareIcon}>↗</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.downloadButton}>
                          <Text style={styles.downloadIcon}>↓</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={styles.arrowButton}>
                    <Text style={[styles.arrowIcon, { color: cardCustomizations.textColor }]}>«</Text>
                  </View>
                </Animated.View>
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
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

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
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    height: 120,
  },
  businessCard: {
    position: 'absolute',
    width: '100%',
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backfaceVisibility: 'hidden',
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
    fontFamily: 'MontserratRegular',
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
    width: 32,
    height: 32,
    borderRadius: 8,
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
    borderColor: '#E5E7EB',
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
    borderColor: '#F3E8FF',
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
  // QR Code Styles
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  qrCode: {
    alignItems: 'center',
    marginRight: 16,
  },
  qrText: {
    fontSize: 8,
    fontFamily: 'MontserratBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  qrPattern: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
  },
  qrRow: {
    flexDirection: 'row',
    height: 12,
  },
  qrSquare: {
    width: 12,
    height: 12,
  },
  qrBlack: {
    backgroundColor: '#000000',
  },
  qrWhite: {
    backgroundColor: '#FFFFFF',
  },
  qrInfo: {
    flex: 1,
  },
  qrActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#000000',
    marginRight: 4,
  },
  shareIcon: {
    fontSize: 10,
    color: '#000000',
  },
  downloadButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downloadIcon: {
    fontSize: 14,
    color: '#000000',
  },
  qrDescription: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 60,
    fontSize: 10,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'MontserratBold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
