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
        
        <View style={styles.statusIndicators}>
          <View style={[styles.indicator, styles.greenIndicator]} />
          <View style={[styles.indicator, styles.orangeIndicator]} />
        </View>
        
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

        {/* Basic Info Card */}
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

        {/* Role Card */}
        <View style={styles.roleCard}>
          <Text style={styles.roleTitle}>I am a {user.role || 'Professional'}</Text>
          <Text style={styles.roleDescription}>
            {(user.role || '') === 'Freelancer' && 'I provide services or work on projects'}
            {(user.role || '') === 'Founder' && 'I\'m building a startup or business'}
            {(user.role || '') === 'Student' && 'I\'m studying or learning new skills'}
          </Text>
        </View>

        {/* Bio Card */}
        {(user.bio && user.bio.trim()) && (
          <View style={styles.bioCard}>
            <Text style={styles.bioTitle}>About Me</Text>
            <Text style={styles.bioText}>{user.bio}</Text>
          </View>
        )}

        {/* Skills Card */}
        <View style={styles.skillsCard}>
          <Text style={styles.skillsTitle}>Skills & Expertise</Text>
          <View style={styles.skillsContainer}>
            {(user.skills || []).map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
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

        {/* Professional Info Card */}
        <View style={styles.professionalCard}>
          <Text style={styles.jobTitle}>{user.jobTitle || 'Professional'}</Text>
          <Text style={styles.company}>@{user.company || 'Company'}</Text>
          
          {(user.website && user.website.trim()) && (
            <TouchableOpacity style={styles.websiteLink}>
              <Text style={styles.websiteText}>Website/Portfolio</Text>
            </TouchableOpacity>
          )}

          <View style={styles.socialIconsContainer}>
            {Object.entries(user.socialProfiles || {}).map(([platform, url]) => (
              url && url.trim() && (
                <TouchableOpacity 
                  key={platform} 
                  style={[
                    styles.socialIcon,
                    platform === 'linkedin' && styles.linkedinIcon
                  ]}
                >
                  <Text style={[
                    styles.socialIconText,
                    platform === 'linkedin' && styles.linkedinText
                  ]}>
                    {socialIcons[platform as keyof typeof socialIcons] || '🔗'}
                  </Text>
                </TouchableOpacity>
              )
            ))}
            <View style={styles.briefcaseIcon}>
              <Text style={styles.briefcaseText}>💼</Text>
            </View>
          </View>
        </View>

        {/* Third Profile Picture */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: (user.profileImages && user.profileImages[2]) || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face' }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.crossButton} onPress={onCross}>
          <Text style={styles.crossIcon}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.matchButton} onPress={onMatch}>
          <Text style={styles.matchIcon}>🤝</Text>
        </TouchableOpacity>
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
    paddingTop: -20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingBottom: 150, // Space for action buttons above navbar
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
  },
  statusIndicators: {
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greenIndicator: {
    backgroundColor: '#10B981',
  },
  orangeIndicator: {
    backgroundColor: '#F59E0B',
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 20,
    color: '#000',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 28,
    fontFamily: 'MontserratBold',
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
  },
  basicInfoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#374151',
  },
  professionalCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
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
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 20,
    paddingTop: 10,
  },
  crossButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crossIcon: {
    fontSize: 24,
    color: '#000',
  },
  matchButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FCD34D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchIcon: {
    fontSize: 24,
  },
});

export default ProfileCard;