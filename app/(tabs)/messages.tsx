import * as Font from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { matchService } from '../../services/supabase';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  profileImage: string;
  timestamp?: string;
  otherUserId?: string; // Add other user's ID for navigation
}

// No sample conversations - only show real conversations from database

export default function MessagesScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleConversationPress = (conversation: Conversation) => {
    // Navigate to chat with the conversation data
    router.push({
      pathname: '/chat',
      params: {
        matchId: conversation.id,
        otherUserId: conversation.otherUserId, // Use the correct other user's ID
      },
    });
  };

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
    const loadConversations = async () => {
      if (!fontsLoaded || !currentUser) return;

      try {
        // Load real conversations from database
        const { data: matchesData, error } = await matchService.getUserMatches(currentUser.id);
        
        if (error) {
          console.error('Error loading conversations:', error);
          setConversations([]);
        } else {
          // Transform matches to conversation format
          const conversationsList = (matchesData || []).map(match => ({
            id: match.match_id,
            name: match.other_user_name,
            lastMessage: 'Start a conversation...', // Default message since we don't have last message yet
            profileImage: match.other_user_profile_images?.[0] || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            timestamp: match.last_message_at,
            otherUserId: match.other_user_id, // Add other user's ID
          }));
          
          setConversations(conversationsList);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [fontsLoaded, currentUser]);

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.titleEmoji}>💬</Text>
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {conversations.length > 0 ? (
          conversations.map((conversation) => (
            <TouchableOpacity 
              key={conversation.id} 
              style={styles.conversationCard}
              onPress={() => handleConversationPress(conversation)}
            >
              <Image source={{ uri: conversation.profileImage }} style={styles.profileImage} />
              <View style={styles.conversationInfo}>
                <Text style={styles.conversationName}>{conversation.name}</Text>
                <Text style={styles.lastMessage}>{conversation.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No messages yet</Text>
            <Text style={styles.emptyStateSubtext}>Start matching with people on the Discover page to begin conversations!</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginRight: 8,
  },
  titleEmoji: {
    fontSize: 24,
  },
  messageIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIcon: {
    fontSize: 18,
    color: '#6B7280',
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginRight: 8,
  },
  chevron: {
    fontSize: 12,
    color: '#000',
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationName: {
    fontSize: 16,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
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
  noConversationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  noConversationsText: {
    fontSize: 20,
    fontFamily: 'MontserratBold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  noConversationsSubtext: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
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
});
