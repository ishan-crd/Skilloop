import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface HubPageProps {
  onMyCardPress: () => void;
  onSettingsPress?: () => void;
  onLogoutPress?: () => void;
  onMyProfilePress?: () => void;
}

const HubPage: React.FC<HubPageProps> = ({ onMyCardPress, onSettingsPress, onLogoutPress, onMyProfilePress }) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const featureCards = [
    {
      id: 'task-management',
      title: 'Task Management',
      currentUsers: 200,
      targetUsers: 1000,
      description: '800 more to go to unlock Task Management 🌱'
    },
    {
      id: 'payment',
      title: 'Payment',
      currentUsers: 200,
      targetUsers: 2000,
      description: '1800 more to go to unlock Payment 🌱'
    },
    {
      id: 'skill-clash',
      title: 'Skill Clash',
      currentUsers: 200,
      targetUsers: 5000,
      description: '4800 more to go to unlock Skill Clash 🌱'
    },
    {
      id: 'courses',
      title: 'Courses',
      currentUsers: 200,
      targetUsers: 10000,
      description: '9800 more to go to unlock Courses 🌱'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      currentUsers: 200,
      targetUsers: 5000,
      description: '4800 more to go to unlock Analytics 🌱'
    }
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <View style={styles.container}>
      {showDropdown && (
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setShowDropdown(false)}
          activeOpacity={1}
        />
      )}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        // Android-specific optimizations
        removeClippedSubviews={Platform.OS === 'android'}
        scrollEventThrottle={16}
      >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowDropdown(!showDropdown)}
          activeOpacity={0.7}
        >
          <View style={styles.hamburgerContainer}>
            <View style={styles.hamburgerDot} />
            <View style={styles.hamburgerDot} />
            <View style={styles.hamburgerDot} />
          </View>
        </TouchableOpacity>
        
        {/* Dropdown Menu */}
        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setShowDropdown(false);
                onLogoutPress?.();
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image 
            source={{ 
              uri: (user?.profile_images && user.profile_images.length > 0) 
                ? user.profile_images[0] 
                : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
            }} 
            style={styles.profileImage} 
          />
          <Text style={styles.userName}>{user?.name || 'Erik Tyler'}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.myProfileButton}
              onPress={onMyProfilePress}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.myCardButton} onPress={onMyCardPress}>
              <Text style={styles.buttonText}>My Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Feature Cards - Grid Layout */}
      <View style={styles.featureCardsContainer}>
        {/* 2x2 Grid */}
        <View style={styles.gridContainer}>
          {/* Task Management */}
          <TouchableOpacity 
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={() => console.log('Task Management pressed')}
          >
            <View style={styles.lockIconContainer}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            
            <Text style={styles.featureTitle}>{featureCards[0].title}</Text>
            
            <TouchableOpacity style={styles.shareButtonBelow}>
              <Text style={styles.shareButtonText}>Share</Text>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getProgressPercentage(featureCards[0].currentUsers, featureCards[0].targetUsers)}%` }
                  ]} 
                />
              </View>
            </View>
            
            <Text style={styles.userCount}>
              {featureCards[0].currentUsers}/{featureCards[0].targetUsers} users
            </Text>
            
            <Text style={styles.unlockMessage}>{featureCards[0].description}</Text>
          </TouchableOpacity>

          {/* Payment */}
          <TouchableOpacity 
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={() => console.log('Payment pressed')}
          >
            <View style={styles.lockIconContainer}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            
            <Text style={styles.featureTitle}>{featureCards[1].title}</Text>
            
            <TouchableOpacity style={styles.shareButtonBelow}>
              <Text style={styles.shareButtonText}>Share</Text>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getProgressPercentage(featureCards[1].currentUsers, featureCards[1].targetUsers)}%` }
                  ]} 
                />
              </View>
            </View>
            
            <Text style={styles.userCount}>
              {featureCards[1].currentUsers}/{featureCards[1].targetUsers} users
            </Text>
            
            <Text style={styles.unlockMessage}>{featureCards[1].description}</Text>
          </TouchableOpacity>

          {/* Skill Clash */}
          <TouchableOpacity 
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={() => console.log('Skill Clash pressed')}
          >
            <View style={styles.lockIconContainer}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            
            <Text style={styles.featureTitle}>{featureCards[2].title}</Text>
            
            <TouchableOpacity style={styles.shareButtonBelow}>
              <Text style={styles.shareButtonText}>Share</Text>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getProgressPercentage(featureCards[2].currentUsers, featureCards[2].targetUsers)}%` }
                  ]} 
                />
              </View>
            </View>
            
            <Text style={styles.userCount}>
              {featureCards[2].currentUsers}/{featureCards[2].targetUsers} users
            </Text>
            
            <Text style={styles.unlockMessage}>{featureCards[2].description}</Text>
          </TouchableOpacity>

          {/* Courses */}
          <TouchableOpacity 
            style={styles.gridCard}
            activeOpacity={0.7}
            onPress={() => console.log('Courses pressed')}
          >
            <View style={styles.lockIconContainer}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            
            <Text style={styles.featureTitle}>{featureCards[3].title}</Text>
            
            <TouchableOpacity style={styles.shareButtonBelow}>
              <Text style={styles.shareButtonText}>Share</Text>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${getProgressPercentage(featureCards[3].currentUsers, featureCards[3].targetUsers)}%` }
                  ]} 
                />
              </View>
            </View>
            
            <Text style={styles.userCount}>
              {featureCards[3].currentUsers}/{featureCards[3].targetUsers} users
            </Text>
            
            <Text style={styles.unlockMessage}>{featureCards[3].description}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Rectangle - Analytics */}
        <TouchableOpacity 
          style={styles.bottomRectangleCard}
          activeOpacity={0.7}
          onPress={() => console.log('Analytics pressed')}
        >
          <View style={styles.lockIconContainer}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
          
          <Text style={styles.featureTitle}>{featureCards[4].title}</Text>
          
          <TouchableOpacity style={styles.shareButtonBelow}>
            <Text style={styles.shareButtonText}>Share</Text>
            <Text style={styles.shareIcon}>↗</Text>
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage(featureCards[4].currentUsers, featureCards[4].targetUsers)}%` }
                ]} 
              />
            </View>
          </View>
          
          <Text style={styles.userCount}>
            {featureCards[4].currentUsers}/{featureCards[4].targetUsers} users
          </Text>
          
          <Text style={styles.unlockMessage}>{featureCards[4].description}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000000',
    margin: Platform.OS === 'android' ? 16 : 20, // Reduced margin for Android
    padding: Platform.OS === 'android' ? 16 : 20, // Reduced padding for Android
    position: 'relative',
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 4,
  },
  hamburgerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  hamburgerDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#000000',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 20,
    minWidth: 120,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#000000',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  settingsIcon: {
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000000',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Platform.OS === 'android' ? 8 : 12, // Reduced gap for Android
    justifyContent: 'center',
  },
  myProfileButton: {
    backgroundColor: '#9ED0C0',
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20, // Reduced padding for Android
    paddingVertical: Platform.OS === 'android' ? 8 : 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000000',
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      minHeight: 44, // Minimum touch target size
      elevation: 1,
    }),
  },
  myCardButton: {
    backgroundColor: '#E7AA74',
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20, // Reduced padding for Android
    paddingVertical: Platform.OS === 'android' ? 8 : 10,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000000',
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      minHeight: 44, // Minimum touch target size
      elevation: 1,
    }),
  },
  buttonText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#000000',
  },
  featureCardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomRectangleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000000',
    padding: Platform.OS === 'android' ? 16 : 20, // Reduced padding for Android
    marginBottom: 16,
    position: 'relative',
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      flex: 1,
    }),
  },
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#000000',
    padding: Platform.OS === 'android' ? 12 : 16, // Reduced padding for Android
    width: '48%',
    aspectRatio: 1,
    marginBottom: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }),
  },
  lockIconContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  lockIcon: {
    fontSize: 20,
  },
  featureTitle: {
    fontSize: Platform.OS === 'android' ? 12 : 14, // Smaller font for Android
    fontFamily: 'MontserratBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      includeFontPadding: false,
      textAlignVertical: 'center',
    }),
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shareButtonBelow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 40,
    paddingHorizontal: Platform.OS === 'android' ? 6 : 8, // Reduced padding for Android
    paddingVertical: Platform.OS === 'android' ? 3 : 4,
    marginTop: 4,
    marginBottom: 8,
    alignSelf: 'center',
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      minHeight: 32, // Minimum touch target size
      elevation: 1,
    }),
  },
  shareButtonText: {
    fontSize: 10,
    fontFamily: 'MontserratSemiBold',
    color: '#000000',
    marginRight: 2,
  },
  shareIcon: {
    fontSize: 8,
    color: '#000000',
  },
  progressContainer: {
    marginTop: 12,
    marginBottom: 8,
    width: '100%',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E5E5',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  userCount: {
    fontSize: Platform.OS === 'android' ? 10 : 12, // Smaller font for Android
    fontFamily: 'MontserratSemiBold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 6,
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      includeFontPadding: false,
    }),
  },
  unlockMessage: {
    fontSize: Platform.OS === 'android' ? 9 : 10, // Smaller font for Android
    fontFamily: 'MontserratRegular',
    color: '#666666',
    textAlign: 'center',
    lineHeight: Platform.OS === 'android' ? 11 : 12,
    // Android-specific optimizations
    ...(Platform.OS === 'android' && {
      includeFontPadding: false,
    }),
  },
});

export default HubPage;
