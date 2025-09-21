import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomBottomNavbar from '../../components/CustomBottomNavbar';
import { useAuth } from '../../contexts/AuthContext';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  profileImage: string;
  timestamp?: string;
}

// Sample messages matching the UI design
const sampleConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Patel',
    lastMessage: 'hey the deadline is 6th march',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Andrew',
    lastMessage: "What's the update?",
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Sam Kontas',
    lastMessage: 'Hey I have one work for you',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Ayush Jha',
    lastMessage: 'Hello',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'Rupali',
    lastMessage: 'I have some work for you',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
];

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
      if (!fontsLoaded) return;

      try {
        // Use sample data for now
        setConversations(sampleConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [fontsLoaded]);

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
        <Text style={styles.title}>Message</Text>
        <View style={styles.messageIconContainer}>
          <Text style={styles.messageIcon}>💬</Text>
        </View>
      </View>

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {conversations.map((conversation) => (
          <TouchableOpacity key={conversation.id} style={styles.conversationCard}>
            <Image source={{ uri: conversation.profileImage }} style={styles.profileImage} />
            <View style={styles.conversationInfo}>
              <Text style={styles.conversationName}>{conversation.name}</Text>
              <Text style={styles.lastMessage}>{conversation.lastMessage}</Text>
            </View>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'MontserratBold',
    color: '#000',
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
});
