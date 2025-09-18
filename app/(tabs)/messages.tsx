import * as Font from 'expo-font';
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
}

// No mock data - using real database data only

export default function MessagesScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
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
    const loadConversations = async () => {
      if (!currentUser || !fontsLoaded) return;

      try {
        // Get user's matches (conversations)
        const { data: matchesData, error: matchesError } = await matchService.getUserMatches(currentUser.id);
        if (matchesError) {
          console.error('Error getting matches:', matchesError);
          setConversations([]);
        } else {
          // Convert matches to conversation format
          const conversationList: Conversation[] = (matchesData || []).map((match: any) => ({
            id: match.match_id,
            name: match.other_user_name,
            lastMessage: match.last_message || 'No messages yet',
            profileImage: match.other_user_profile_images?.[0] || 'https://via.placeholder.com/100',
            timestamp: match.last_message_at,
          }));
          setConversations(conversationList);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [currentUser, fontsLoaded]);

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
          <Text style={styles.title}>Message</Text>
          <Text style={styles.messageIcon}>💬</Text>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Message</Text>
        <Text style={styles.chevron}>▼</Text>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {conversations.length === 0 ? (
          <View style={styles.noConversationsContainer}>
            <Text style={styles.noConversationsText}>No conversations yet!</Text>
            <Text style={styles.noConversationsSubtext}>Start matching with people to begin chatting</Text>
          </View>
        ) : (
          conversations.map((conversation) => (
            <TouchableOpacity key={conversation.id} style={styles.conversationCard}>
              <Image source={{ uri: conversation.profileImage }} style={styles.profileImage} />
              <View style={styles.conversationInfo}>
                <Text style={styles.conversationName}>{conversation.name}</Text>
                <Text style={styles.lastMessage}>{conversation.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          ))
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginRight: 8,
  },
  messageIcon: {
    fontSize: 20,
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
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#000',
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
});
