import * as Font from 'expo-font';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
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

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  isCurrentUser: boolean;
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

// Sample chat data
const sampleMessages: Message[] = [
  {
    id: '1',
    text: 'Hey Dev, Sarah patel this side',
    senderId: 'sarah',
    timestamp: '10:30 AM',
    isCurrentUser: false,
  },
  {
    id: '2',
    text: 'I really liked your profile btw',
    senderId: 'sarah',
    timestamp: '10:31 AM',
    isCurrentUser: false,
  },
  {
    id: '3',
    text: 'I have one project for you let me know if you are intrested',
    senderId: 'sarah',
    timestamp: '10:32 AM',
    isCurrentUser: false,
  },
  {
    id: '4',
    text: 'Hey Sarah',
    senderId: 'current',
    timestamp: '10:35 AM',
    isCurrentUser: true,
  },
];

const sampleUser: ChatUser = {
  id: 'sarah',
  name: 'Sarah Patel',
  role: 'App developer',
  website: 'Website/Portfolio',
  profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
  socialProfiles: {
    linkedin: 'https://linkedin.com/in/sarahpatel',
    instagram: 'https://instagram.com/sarahpatel',
    github: 'https://github.com/sarahpatel',
    figma: 'https://figma.com/@sarahpatel',
  },
};

export default function ChatScreen() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<ChatUser | null>(null);
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);

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

  useEffect(() => {
    if (fontsLoaded) {
      // Load sample data for now
      setMessages(sampleMessages);
      setUser(sampleUser);
    }
  }, [fontsLoaded]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        senderId: 'current',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
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

  if (!fontsLoaded) return null;

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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
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
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
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
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
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
  },
  sendButtonText: {
    fontSize: 18,
  },
});
