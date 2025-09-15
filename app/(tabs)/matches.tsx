import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useMatches } from '../../contexts/MatchesContext';
import { matchRequestService, matchService } from '../../services/supabase';

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

      {/* Match Requests Section */}
      {matchRequests.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Match Requests</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.requestsScroll}>
            {matchRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <Image 
                  source={{ uri: request.requester_profile_images[0] || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }} 
                  style={styles.requestImage} 
                />
                <Text style={styles.requestName}>{request.requester_name}</Text>
                <Text style={styles.requestRole}>{request.requester_job_title}</Text>
                <View style={styles.requestButtons}>
                  <TouchableOpacity 
                    style={styles.acceptButton}
                    onPress={() => handleAcceptMatch(request.id, request.requester_name)}
                  >
                    <Text style={styles.acceptButtonText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.rejectButton}
                    onPress={() => handleRejectMatch(request.id)}
                  >
                    <Text style={styles.rejectButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Actual Matches Section */}
      <ScrollView style={styles.matchesList} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Your Matches</Text>
        {actualMatches.length === 0 ? (
          <View style={styles.noMatchesContainer}>
            <Text style={styles.noMatchesText}>No matches yet!</Text>
            <Text style={styles.noMatchesSubtext}>Start swiping to find your perfect connections</Text>
          </View>
        ) : (
          actualMatches.map((match) => (
            <TouchableOpacity key={match.match_id} style={styles.matchCard}>
              <Image source={{ uri: match.other_user_profile_images[0] || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' }} style={styles.profileImage} />
              <View style={styles.matchInfo}>
                <Text style={styles.matchName}>{match.other_user_name}</Text>
                <Text style={styles.matchRole}>{match.other_user_job_title}</Text>
                <Text style={styles.lastMessageTime}>
                  Last message: {new Date(match.last_message_at).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity style={styles.chatButton}>
                <Text style={styles.chatIcon}>💬</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
    paddingHorizontal: 20,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
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
    color: '#6B7280',
    marginBottom: 8,
  },
  websiteLink: {
    fontSize: 14,
    fontFamily: 'MontserratSemiBold',
    color: '#3B82F6',
    marginBottom: 8,
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
  likeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FCD34D',
    justifyContent: 'center',
    alignItems: 'center',
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
