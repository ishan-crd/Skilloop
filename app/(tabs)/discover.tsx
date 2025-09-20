import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import ProfileCard from '../../components/ProfileCard';
import { useAuth } from '../../contexts/AuthContext';
import { useMatches } from '../../contexts/MatchesContext';
import { matchRequestService, supabase, User } from '../../services/supabase';

// Fallback profiles in case database is empty
const fallbackProfiles = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'Female',
    location: 'San Francisco',
    job_title: 'Product Manager',
    company: 'TechCorp',
    website: 'https://sarahjohnson.com',
    bio: 'Experienced product manager with a passion for building user-centric products. I love working with cross-functional teams to deliver exceptional experiences.',
    role: 'Founder',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Leadership'],
    profile_images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
    ],
    social_profiles: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      twitter: 'https://twitter.com/sarahjohnson'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Alex Chen',
    age: 25,
    gender: 'Male',
    location: 'New York',
    job_title: 'Software Engineer',
    company: 'StartupXYZ',
    website: 'https://alexchen.dev',
    bio: 'Full-stack developer passionate about building scalable applications. I enjoy working with modern technologies and solving complex problems.',
    role: 'Freelancer',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
    profile_images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
    ],
    social_profiles: {
      linkedin: 'https://linkedin.com/in/alexchen',
      github: 'https://github.com/alexchen'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Maria Rodriguez',
    age: 22,
    gender: 'Female',
    location: 'Los Angeles',
    job_title: 'Design Student',
    company: 'UCLA',
    website: 'https://mariarodriguez.design',
    bio: 'Design student with a passion for creating beautiful and functional interfaces. I love learning about new design trends and user experience principles.',
    role: 'Student',
    skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Research'],
    profile_images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face'
    ],
    social_profiles: {
      linkedin: 'https://linkedin.com/in/mariarodriguez',
      behance: 'https://behance.net/mariarodriguez'
    }
  }
];

export default function DiscoverScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [profiles, setProfiles] = useState<User[]>([]);
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
        
        // Get all users first (simple approach)
        const { data: allUsers, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('is_active', true)
          .neq('id', currentUser.id); // Exclude current user
        
        if (usersError) {
          console.error('Error getting users:', usersError);
          console.log('Using fallback profiles due to error');
          setProfiles(fallbackProfiles);
        } else {
          console.log('All users loaded:', allUsers);
          
          // Filter based on role (simple filtering)
          let filteredProfiles = allUsers || [];
          
          if (currentUser.role === 'Freelancer') {
            filteredProfiles = filteredProfiles.filter(user => user.role === 'Founder');
          } else if (currentUser.role === 'Founder') {
            filteredProfiles = filteredProfiles.filter(user => ['Student', 'Freelancer'].includes(user.role));
          } else if (currentUser.role === 'Company') {
            filteredProfiles = filteredProfiles.filter(user => ['Founder', 'Student', 'Freelancer'].includes(user.role));
          } else if (currentUser.role === 'Student') {
            filteredProfiles = filteredProfiles.filter(user => ['Founder', 'Freelancer', 'Company'].includes(user.role));
          }
          
          // If no profiles found, use fallback profiles
          if (filteredProfiles.length === 0) {
            console.log('No profiles found, using fallback profiles');
            filteredProfiles = fallbackProfiles;
          }
          
          console.log('Filtered profiles:', filteredProfiles);
          setProfiles(filteredProfiles);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
        console.log('Using fallback profiles due to exception');
        setProfiles(fallbackProfiles);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [currentUser, fontsLoaded]);

  const handleCross = () => {
    if (isAnimating || !currentUser || profiles.length === 0) return;
    
    const targetUser = profiles[currentProfileIndex];
    const isFallbackProfile = targetUser && targetUser.id.startsWith('550e8400');
    
    if (isFallbackProfile) {
      // For fallback profiles, just move to next profile without any database calls
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentProfileIndex(prev => (prev + 1) % profiles.length);
        setIsAnimating(false);
      }, 300);
      return;
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

    // Check if this is a fallback profile (starts with '550e8400')
    const isFallbackProfile = targetUser.id.startsWith('550e8400');
    
    if (isFallbackProfile) {
      // For fallback profiles, just show a message and move to next profile
      Alert.alert(
        'Demo Mode', 
        'This is a demo profile. In the real app, you would be able to match with real users!',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentProfileIndex(prev => (prev + 1) % profiles.length);
                setIsAnimating(false);
              }, 300);
            }
          }
        ]
      );
      return;
    }

    try {
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

      // Add to local matches for immediate UI feedback
      addMatch(targetUser);
      
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentProfileIndex(prev => (prev + 1) % profiles.length);
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
            <Text style={styles.noMoreText}>No more profiles to show!</Text>
            <Text style={styles.noMoreSubtext}>Check back later for new connections</Text>
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
