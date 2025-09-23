import React from 'react';
import { Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    age: number;
    gender: string;
    location: string;
    jobTitle: string;
    company: string;
    website?: string;
    socialProfiles: Record<string, string>;
    profileImages: string[];
    bio?: string;
    skills: string[];
    role: string;
    certificates?: Array<{
      id: string;
      title: string;
      organization: string;
      issueDate: string;
      imageUri: string;
      url: string;
    }>;
    workExperiences?: Array<{
      id: string;
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
      logo?: string;
    }>;
  };
  onCross?: () => void;
  onMatch?: () => void;
  isAnimating?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onCross, onMatch, isAnimating = false }) => {
  // Safety check - return null if user is undefined
  if (!user) {
    return null;
  }

  const socialIcons = {
    linkedin: 'in',
    instagram: '📷',
    upwork: 'Up',
    twitter: 'X',
    figma: '🎨',
  };

  const animatedValue = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (isAnimating) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isAnimating, animatedValue]);

  return (
    <Animated.View style={[styles.container, { opacity: animatedValue, transform: [{ scale: animatedValue }] }]}>
      {/* Top Bar - Fixed */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        
        <Image 
          source={require('../assets/images/skillooplogo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Name and Verification */}
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{user.name || 'Unknown User'}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>

        {/* First Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image
            source={require('../assets/profile/demo1.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        {/* Basic Info Card - Black bordered box with shadow */}
        <View style={styles.basicInfoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>{user.age || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>👤</Text>
            <Text style={styles.infoText}>{user.gender || 'N/A'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <Text style={styles.infoText}>{user.location || 'N/A'}</Text>
          </View>
        </View>

        {/* Professional Info Card - Role (Apple dev) bar */}
        <View style={styles.professionalCard}>
          <Text style={styles.jobTitle}>{user.jobTitle || 'App developer'}</Text>
          <Text style={styles.company}>{user.company || 'Apple inc'}</Text>
          
          <TouchableOpacity style={styles.websiteLink}>
            <Text style={styles.websiteText}>Website/Portfolio</Text>
          </TouchableOpacity>

          <View style={styles.socialIconsContainer}>
            <TouchableOpacity style={[styles.socialIcon, styles.linkedinIcon]}>
              <Text style={[styles.socialIconText, styles.linkedinText]}>in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Text style={styles.socialIconText}>📷</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Text style={styles.socialIconText}>Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Text style={styles.socialIconText}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Text style={styles.socialIconText}>🎨</Text>
            </TouchableOpacity>
            <View style={styles.briefcaseIcon}>
              <Text style={styles.briefcaseText}>💼</Text>
            </View>
          </View>
        </View>

        {/* Second Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: (user.profileImages && user.profileImages[1]) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face' }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        {/* Work Experience Section */}
        {((user.workExperiences && user.workExperiences.length > 0) || (user as any).work_experiences) && (
          <View style={styles.experienceCard}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {((user.workExperiences || (user as any).work_experiences) || []).slice(0, 2).map((exp: any, index: number) => (
              <View key={exp.id || index} style={styles.experienceItem}>
                <View style={styles.experienceIcon}>
                  <Text style={styles.experienceEmoji}>💼</Text>
                </View>
                <View style={styles.experienceInfo}>
                  <Text style={styles.experiencePosition}>{exp.position}</Text>
                  <Text style={styles.experienceCompany}>{exp.company}</Text>
                  <Text style={styles.experienceDuration}>
                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Third Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: (user.profileImages && user.profileImages[2]) || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face' }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>

        {/* Certificates Section */}
        {((user.certificates && user.certificates.length > 0) || (user as any).certificates) && (
          <View style={styles.certificatesCard}>
            <Text style={styles.sectionTitle}>Certificates</Text>
            {((user.certificates || (user as any).certificates) || []).slice(0, 2).map((cert: any, index: number) => (
              <View key={cert.id || index} style={styles.certificateItem}>
                <View style={styles.certificateIcon}>
                  <Text style={styles.certificateEmoji}>🏆</Text>
                </View>
                <View style={styles.certificateInfo}>
                  <Text style={styles.certificateTitle}>{cert.title}</Text>
                  <Text style={styles.certificateOrg}>{cert.organization}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Purple Background with Action Buttons */}
      <View style={styles.bottomSection}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.crossButton} onPress={onCross}>
            <Text style={styles.crossIcon}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.matchButton} onPress={onMatch}>
            <Text style={styles.matchIcon}>🤝</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 0,
    paddingBottom: 5,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 120, // Space for floating action buttons
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 28,
    color: '#000',
    fontWeight: '900',
  },
  logo: {
    width: 40,
    height: 40,
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: '900',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 20,
  },
  userName: {
    fontSize: 28,
    fontFamily: 'MontserratRegular',
    color: '#000',
    marginRight: 10,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'MontserratBold',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: '95%',
    height: 300,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000000',
  },
  basicInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    width: '95%',
  },
  roleCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  roleTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#1E40AF',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    lineHeight: 20,
  },
  bioCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bioTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#374151',
    lineHeight: 20,
  },
  skillsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  skillsTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoIcon: {
    fontSize: 12,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
  },
  professionalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    width: '95%',
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#000',
    marginBottom: 4,
  },
  company: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    marginBottom: 12,
  },
  websiteLink: {
    marginBottom: 16,
  },
  websiteText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#3B82F6',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  linkedinIcon: {
    backgroundColor: '#0077B5',
  },
  linkedinText: {
    color: '#FFFFFF',
  },
  briefcaseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  briefcaseText: {
    fontSize: 16,
  },
  bottomSection: {
    backgroundColor: 'transparent',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  crossButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crossIcon: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  matchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchIcon: {
    fontSize: 24,
  },
  // Certificate and Experience Styles
  certificatesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    width: '95%',
  },
  experienceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    width: '95%',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 12,
  },
  certificateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  certificateIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificateEmoji: {
    fontSize: 16,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateTitle: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#000',
    marginBottom: 2,
  },
  certificateOrg: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  experienceEmoji: {
    fontSize: 16,
  },
  experienceInfo: {
    flex: 1,
  },
  experiencePosition: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#000',
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 11,
    fontFamily: 'MontserratRegular',
    color: '#9CA3AF',
  },
});

export default ProfileCard;