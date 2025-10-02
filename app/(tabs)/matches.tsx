import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { matchRequestService } from '../../services/supabase';

// No sample matches - only show real matches from database

export default function MatchesScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [matchRequests, setMatchRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

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
          console.log('Match requests loaded:', requestsData);
          setMatchRequests(requestsData || []);
        }

        // Log the results for debugging
        console.log(`Loaded ${requestsData?.length || 0} match requests`);
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
      console.log('Accepting match request:', requestId, 'for user:', currentUser.id);
      const { data, error } = await matchRequestService.acceptMatchRequest(requestId, currentUser.id);
      
      if (error) {
        console.error('Error accepting match:', error);
        Alert.alert('Error', `Failed to accept match: ${error.message}`);
        return;
      }

      console.log('Match accepted successfully:', data);
      Alert.alert('Match Accepted!', `You've matched with ${requesterName}! You can now start chatting.`);
      
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
      console.log('Rejecting match request:', requestId, 'for user:', currentUser.id);
      const { data, error } = await matchRequestService.rejectMatchRequest(requestId, currentUser.id);
      
      if (error) {
        console.error('Error rejecting match:', error);
        Alert.alert('Error', `Failed to reject match: ${error.message}`);
        return;
      }

      console.log('Match rejected successfully:', data);
      
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

      {/* Main Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Match Requests */}
        {matchRequests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Match Requests</Text>
            {matchRequests.map((request) => (
              <View key={request.id} style={styles.matchCard}>
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={() => handleRejectMatch(request.id)}
                >
                  <Text style={styles.rejectIcon}>✕</Text>
                </TouchableOpacity>
                
                <Image 
                  source={{ 
                    uri: request.requester_profile_images?.[0] || 
                         request.requester_profile_image || 
                         'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' 
                  }} 
                  style={styles.profileImage}
                  onError={() => console.log('Match request image failed to load for:', request.requester_name)}
                />
                
                <View style={styles.matchInfo}>
                  <Text style={styles.matchName}>{request.requester_name}</Text>
                  <Text style={styles.matchRole}>{request.requester_job_title || 'Professional'}</Text>
                  
                  <TouchableOpacity style={styles.websiteLink}>
                    <Text style={styles.websiteText}>Website/Portfolio</Text>
                  </TouchableOpacity>
                  
                  <View style={styles.socialIcons}>
                    <View style={[styles.socialIcon, styles.linkedinIcon]}>
                      <Text style={[styles.socialIconText, styles.linkedinText]}>in</Text>
                    </View>
                    <View style={styles.socialIcon}>
                      <Text style={styles.socialIconText}>📷</Text>
                    </View>
                    <View style={styles.socialIcon}>
                      <Text style={styles.socialIconText}>X</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.likeButton}
                  onPress={() => handleAcceptMatch(request.id, request.requester_name)}
                >
                  <Text style={styles.likeIcon}>👍</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}


        {/* Empty State */}
        {matchRequests.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No match requests yet</Text>
            <Text style={styles.emptyStateSubtext}>Start swiping on the Discover page to find your professional connections!</Text>
          </View>
        )}

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingState}>
            <Text style={styles.loadingText}>Loading matches...</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Navbar - Fixed at bottom */}
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
    paddingBottom: 100, // Add bottom padding for navbar
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
  rejectButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rejectIcon: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
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
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
  chatIcon: {
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  matchCompany: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'MontserratRegular',
  },
});
