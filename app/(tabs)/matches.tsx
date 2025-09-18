import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { useMatches } from '../../contexts/MatchesContext';
import { matchRequestService, matchService } from '../../services/supabase';

// Sample matches data to display
const sampleMatches = [
  {
    id: '1',
    name: 'Sarah Patel',
    role: 'Startup 1 founder',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    website: 'https://sarahpatel.com',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/sarahpatel',
      instagram: 'https://instagram.com/sarahpatel',
      twitter: 'https://twitter.com/sarahpatel'
    }
  },
  {
    id: '2',
    name: 'Sam Mathews',
    role: 'Founder@AngelFundCorp',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    website: 'https://sammathews.com',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/sammathews',
      instagram: 'https://instagram.com/sammathews',
      twitter: 'https://twitter.com/sammathews'
    }
  },
  {
    id: '3',
    name: 'Rajnish',
    role: 'App developer',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    website: 'https://rajnish.dev',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/rajnish',
      instagram: 'https://instagram.com/rajnish'
    }
  }
];

export default function MatchesScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [matchRequests, setMatchRequests] = useState<any[]>([]);
  const [actualMatches, setActualMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { matches } = useMatches();
  const { user: currentUser, loading: authLoading } = useAuth();

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

  useEffect(() => {
    const loadMatches = async () => {
      if (!currentUser || !fontsLoaded) return;

      try {
        // Get match requests (people who want to match with you)
        const { data: requestsData, error: requestsError } = await matchRequestService.getMatchRequests(currentUser.id);
        if (requestsError) {
          console.error('Error getting match requests:', requestsError);
        } else {
          setMatchRequests(requestsData || []);
        }

        // Get actual matches (people you've matched with)
        const { data: matchesData, error: matchesError } = await matchService.getUserMatches(currentUser.id);
        if (matchesError) {
          console.error('Error getting matches:', matchesError);
        } else {
          setActualMatches(matchesData || []);
        }
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [currentUser, fontsLoaded]);

  const handleAcceptMatch = async (requestId: string, requesterName: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await matchRequestService.acceptMatchRequest(requestId, currentUser.id);
      if (error) {
        Alert.alert('Error', 'Failed to accept match. Please try again.');
        return;
      }

      Alert.alert('Match Accepted!', `You've matched with ${requesterName}! You can now start chatting.`);
      
      // Refresh matches
      const { data: matchesData } = await matchService.getUserMatches(currentUser.id);
      setActualMatches(matchesData || []);
      
      // Remove from match requests
      setMatchRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error accepting match:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRejectMatch = async (requestId: string) => {
    if (!currentUser) return;
    
    try {
      const { error } = await matchRequestService.rejectMatchRequest(requestId, currentUser.id);
      if (error) {
        Alert.alert('Error', 'Failed to reject match. Please try again.');
        return;
      }

      // Remove from match requests
      setMatchRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting match:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  if (!fontsLoaded || authLoading || loading) return null;

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
    twitter: 'X',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Matches</Text>
          <Text style={styles.emoji}>🤝</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Matches List */}
      <ScrollView style={styles.matchesList} showsVerticalScrollIndicator={false}>
        {sampleMatches.map((match) => (
          <View key={match.id} style={styles.matchCard}>
            <Image source={{ uri: match.profileImage }} style={styles.profileImage} />
            <View style={styles.matchInfo}>
              <Text style={styles.matchName}>{match.name}</Text>
              <Text style={styles.matchRole}>{match.role}</Text>
              <TouchableOpacity style={styles.websiteLink}>
                <Text style={styles.websiteText}>Website/Portfolio</Text>
              </TouchableOpacity>
              <View style={styles.socialIcons}>
                {match.socialProfiles.linkedin && (
                  <TouchableOpacity style={[styles.socialIcon, styles.linkedinIcon]}>
                    <Text style={[styles.socialIconText, styles.linkedinText]}>in</Text>
                  </TouchableOpacity>
                )}
                {match.socialProfiles.instagram && (
                  <TouchableOpacity style={styles.socialIcon}>
                    <Text style={styles.socialIconText}>📷</Text>
                  </TouchableOpacity>
                )}
                {match.socialProfiles.twitter && (
                  <TouchableOpacity style={styles.socialIcon}>
                    <Text style={styles.socialIconText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.likeButton}>
              <Text style={styles.likeIcon}>👍</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginRight: 8,
  },
  emoji: {
    fontSize: 20,
  },
  filterButton: {
    padding: 8,
  },
  filterIcon: {
    fontSize: 20,
    color: '#000',
  },
  matchesList: {
    flex: 1,
    paddingTop: 20,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#000000',
  },
  matchInfo: {
    flex: 1,
  },
  matchName: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 4,
  },
  matchRole: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#000',
    marginBottom: 8,
  },
  websiteLink: {
    marginBottom: 8,
  },
  websiteText: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#3B82F6',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconText: {
    fontSize: 10,
    fontFamily: 'MontserratBold',
    color: '#000',
  },
  linkedinIcon: {
    backgroundColor: '#0077B5',
  },
  linkedinText: {
    color: '#FFFFFF',
  },
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  likeIcon: {
    fontSize: 18,
  },
  noMatchesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  noMatchesText: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  noMatchesSubtext: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  requestsScroll: {
    paddingLeft: 20,
  },
  requestCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  requestImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  requestName: {
    fontSize: 14,
    fontFamily: 'MontserratBold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  requestRole: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  requestButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'MontserratBold',
  },
  rejectButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'MontserratBold',
  },
  lastMessageTime: {
    fontSize: 12,
    fontFamily: 'MontserratRegular',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatIcon: {
    fontSize: 18,
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
