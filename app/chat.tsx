import * as Font from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Message as DBMessage, messageService, realtimeService, userService } from '../services/supabase';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isCurrentUser: boolean;
  message_type?: string;
  read_at?: string;
  created_at: string;
}

interface ChatUser {
  id: string;
  name: string;
  role: string;
  website?: string;
  profileImage: string;
  socialProfiles: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    figma?: string;
  };
}

// Helper function to convert DB message to UI message
const convertDBMessageToUIMessage = (dbMessage: DBMessage, currentUserId: string): Message => {
  const isCurrentUser = dbMessage.sender_id === currentUserId;
  const timestamp = new Date(dbMessage.created_at).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return {
    id: dbMessage.id,
    text: dbMessage.message_text,
    senderId: dbMessage.sender_id,
    timestamp,
    isCurrentUser,
    message_type: dbMessage.message_type,
    read_at: dbMessage.read_at,
    created_at: dbMessage.created_at,
  };
};

export default function ChatScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<ChatUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Get matchId and otherUserId from params
  const matchId = params.matchId as string;
  const otherUserId = params.otherUserId as string;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        MontserratRegular: require('../assets/fonts/Montserrat-Regular.ttf'),
        MontserratBold: require('../assets/fonts/Montserrat-Bold.ttf'),
        MontserratSemiBold: require('../assets/fonts/Montserrat-SemiBold.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  // Load chat data from database
  useEffect(() => {
    const loadChatData = async () => {
      if (!fontsLoaded || !currentUser || !matchId || !otherUserId) return;
      
      try {
        setLoading(true);
        
        // Load other user's profile data
        const { data: userData, error: userError } = await userService.getUser(otherUserId);
        if (userError) {
          console.error('Error loading user data:', userError);
          return;
        }
        
        if (userData) {
          const chatUser: ChatUser = {
            id: userData.id,
            name: userData.name,
            role: userData.job_title || userData.role,
            website: userData.website,
            profileImage: userData.profile_images?.[0] || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            socialProfiles: userData.social_profiles || {},
          };
          setUser(chatUser);
        }
        
        // Load messages for this match
        const { data: messagesData, error: messagesError } = await messageService.getMatchMessages(matchId, currentUser.id);
        if (messagesError) {
          console.error('Error loading messages:', messagesError);
          return;
        }
        
        if (messagesData) {
          const uiMessages = messagesData.map((msg: DBMessage) => convertDBMessageToUIMessage(msg, currentUser.id));
          setMessages(uiMessages);
          
          // Mark messages as read
          await messageService.markAllMessagesAsRead(matchId, currentUser.id);
        }
        
      } catch (error) {
        console.error('Error loading chat data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChatData();
  }, [fontsLoaded, currentUser, matchId, otherUserId]);
  
  // Set up real-time messaging subscription
  useEffect(() => {
    if (!matchId || !currentUser) return;
    
    const subscription = realtimeService.subscribeToMessages(matchId, (payload) => {
      if (payload.eventType === 'INSERT' && payload.new) {
        const newMessage = convertDBMessageToUIMessage(payload.new, currentUser.id);
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          if (prev.some(msg => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
        
        // Scroll to bottom when new message arrives
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [matchId, currentUser]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !matchId || sendingMessage) return;
    
    try {
      setSendingMessage(true);
      
      // Send message to database
      const { data: messageId, error } = await messageService.sendMessage(
        matchId,
        currentUser.id,
        newMessage.trim()
      );
      
      if (error) {
        console.error('Error sending message:', error);
        Alert.alert('Error', 'Failed to send message. Please try again.');
        return;
      }
      
      // Create optimistic UI message
      const optimisticMessage: Message = {
        id: messageId || Date.now().toString(),
        text: newMessage.trim(),
        senderId: currentUser.id,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
        created_at: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
    ]}>
      {!message.isCurrentUser && (
        <Image 
          source={{ uri: user?.profileImage }} 
          style={styles.messageProfileImage} 
        />
      )}
      <View style={[
        styles.messageBubble,
        message.isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <Text style={[
          styles.messageText,
          message.isCurrentUser ? styles.currentUserText : styles.otherUserText
        ]}>
          {message.text}
        </Text>
      </View>
    </View>
  );

  if (!fontsLoaded || loading) return null;
  
  // Show error if no match data
  if (!currentUser || !matchId || !otherUserId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Unable to load chat</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>‹‹</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      {user && (
        <View style={styles.profileCardContainer}>
          <View style={styles.profileCard}>
            <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileRole}>{user.role}</Text>
              <TouchableOpacity style={styles.websiteLink}>
                <Text style={styles.websiteText}>{user.website}</Text>
              </TouchableOpacity>
              <View style={styles.socialIcons}>
                <View style={[styles.socialIcon, { backgroundColor: '#0077B5' }]}>
                  <Text style={styles.socialIconText}>in</Text>
                </View>
                <View style={[styles.socialIcon, { backgroundColor: '#E4405F' }]}>
                  <Text style={styles.socialIconText}>📷</Text>
                </View>
                <View style={[styles.socialIcon, { backgroundColor: '#333333' }]}>
                  <Text style={styles.socialIconText}>🐙</Text>
                </View>
                <View style={[styles.socialIcon, { backgroundColor: '#F24E1E' }]}>
                  <Text style={styles.socialIconText}>🎨</Text>
                </View>
              </View>
            </View>
            <View style={styles.arrowButton}>
              <Text style={styles.arrowIcon}>»</Text>
            </View>
          </View>
        </View>
      )}

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <View style={styles.inputIcons}>
              <TouchableOpacity style={styles.inputIcon}>
                <Text style={styles.inputIconText}>📎</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIcon}>
                <Text style={styles.inputIconText}>📅</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIcon}>
                <Text style={styles.inputIconText}>✏️</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.messageInput}
              placeholder="message..."
              placeholderTextColor="#9CA3AF"
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendMessage}
            >
              <Text style={styles.sendButtonText}>🎤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    fontFamily: 'MontserratBold',
  },
  profileCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'MontserratBold',
    color: '#000',
    marginBottom: 4,
  },
  profileRole: {
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
    textDecorationLine: 'underline',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  socialIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIconText: {
    fontSize: 12,
    fontFamily: 'MontserratBold',
    color: '#FFFFFF',
  },
  arrowButton: {
    padding: 8,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'MontserratBold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  currentUserMessage: {
    justifyContent: 'flex-end',
  },
  otherUserMessage: {
    justifyContent: 'flex-start',
  },
  messageProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  currentUserBubble: {
    backgroundColor: '#6B7280',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    lineHeight: 20,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: '#000000',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'android' ? 24 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  inputIconText: {
    fontSize: 14,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'MontserratRegular',
    color: '#000000',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonText: {
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'MontserratRegular',
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'MontserratSemiBold',
    color: '#3B82F6',
  },
});
