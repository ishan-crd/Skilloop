import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import ProfileCard from '../../components/ProfileCard';
import { useAuth } from '../../contexts/AuthContext';
import { useMatches } from '../../contexts/MatchesContext';
import { matchRequestService, profileViewService, supabase } from '../../services/supabase';

// No fallback profiles - only show real users from database

export default function DiscoverScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addMatch } = useMatches();
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
    const loadProfiles = async () => {
      console.log('loadProfiles called - currentUser:', currentUser, 'fontsLoaded:', fontsLoaded);
      if (!currentUser || !fontsLoaded) return;

      try {
        console.log('Loading profiles for user:', currentUser.id);
        
        // Get only users who have completed onboarding
        const { data: allUsers, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('is_active', true)
          .eq('onboarding_completed', true)
          .neq('id', currentUser.id); // Exclude current user
        
        if (usersError) {
          console.error('Error getting users:', usersError);
          console.log('No users available due to error');
          setProfiles([]);
        } else {
          console.log('Users with completed onboarding loaded:', allUsers);
          
          // Get existing match requests to filter out already matched users
          // Check both sent and received match requests (including rejected ones)
          const { data: sentRequests, error: sentError } = await supabase
            .from('match_requests')
            .select('target_id, status')
            .eq('requester_id', currentUser.id);
          
          const { data: receivedRequests, error: receivedError } = await supabase
            .from('match_requests')
            .select('requester_id, status')
            .eq('target_id', currentUser.id);
          
          if (sentError || receivedError) {
            console.error('Error getting existing match requests:', sentError || receivedError);
          }
          
          // Get list of user IDs that already have match requests (sent or received)
          // Include all statuses - pending, accepted, and rejected users should not appear again
          const sentUserIds = new Set((sentRequests || []).map(req => req.target_id));
          const receivedUserIds = new Set((receivedRequests || []).map(req => req.requester_id));
          const matchedUserIds = new Set([...sentUserIds, ...receivedUserIds]);
          
          console.log('Filtering out users with existing match requests:', matchedUserIds.size);
          console.log('Sent requests:', sentRequests);
          console.log('Received requests:', receivedRequests);
          
          // Filter out users who already have match requests (any status)
          let filteredProfiles = (allUsers || []).filter(user => !matchedUserIds.has(user.id));
          
          console.log(`Found ${filteredProfiles.length} profiles to show (excluding ${matchedUserIds.size} already matched)`);
          
          // Transform database users to ProfileCard format
          const transformedProfiles = filteredProfiles.map(user => ({
            id: user.id,
            name: user.name,
            age: user.age,
            gender: user.gender,
            location: user.location,
            jobTitle: user.job_title || '',
            company: user.company || '',
            website: user.website,
            socialProfiles: user.social_profiles || {},
            profileImages: user.profile_images || [],
            bio: user.bio,
            skills: user.skills || [],
            role: user.role,
            certificates: user.certificates,
            workExperiences: user.work_experiences,
          }));
          
          console.log('Final filtered profiles (complete onboarding only):', transformedProfiles);
          setProfiles(transformedProfiles);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
        console.log('No profiles available due to exception');
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [currentUser, fontsLoaded]);

  const handleCross = async () => {
    if (isAnimating || !currentUser || profiles.length === 0) return;
    
    const targetUser = profiles[currentProfileIndex];
    
    // Record profile view for all profiles
    try {
      await profileViewService.recordProfileView(currentUser.id, targetUser.id);
    } catch (error) {
      console.error('Error recording profile view:', error);
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentProfileIndex(prev => (prev + 1) % profiles.length);
      setIsAnimating(false);
    }, 300);
  };

  const handleMatch = async () => {
    if (isAnimating || !currentUser || profiles.length === 0) return;
    
    const targetUser = profiles[currentProfileIndex];
    if (!targetUser) return;

    try {
      // Record profile view
      await profileViewService.recordProfileView(currentUser.id, targetUser.id);
      
      // Create match request in database
      const { error } = await matchRequestService.createMatchRequest(
        currentUser.id,
        targetUser.id
      );

      if (error) {
        Alert.alert('Error', 'Failed to send match request. Please try again.');
        console.error('Error creating match request:', error);
        return;
      }

      // Remove the matched user from profiles immediately
      setProfiles(prev => prev.filter(user => user.id !== targetUser.id));
      
      // Add to local matches for immediate UI feedback (already transformed)
      addMatch(targetUser);
      
      // Move to next profile or show empty state
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentProfileIndex(prev => {
          const newIndex = prev >= profiles.length - 1 ? 0 : prev + 1;
          return newIndex;
        });
        setIsAnimating(false);
      }, 300);

      Alert.alert(
        'Match Request Sent!',
        `Your match request has been sent to ${targetUser.name}. You'll be notified if they match back!`
      );
    } catch (error) {
      console.error('Error in handleMatch:', error);
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

  const currentProfile = profiles.length > 0 ? profiles[currentProfileIndex] : null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {currentProfile && currentProfile.id ? (
          <ProfileCard 
            user={currentProfile} 
            onCross={handleCross}
            onMatch={handleMatch}
            isAnimating={isAnimating}
          />
        ) : (
          <View style={styles.noMoreProfiles}>
            <Text style={styles.noMoreText}>No profiles left!</Text>
            <Text style={styles.noMoreSubtext}>You've seen all available profiles. Check back later for new connections!</Text>
          </View>
        )}
      </View>
      <CustomBottomNavbar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  noMoreProfiles: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noMoreText: {
    fontSize: 24,
    fontFamily: 'MontserratBold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  noMoreSubtext: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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
