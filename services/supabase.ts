import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://bkxhiaplrvkkwjfeazay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreGhpYXBscnZra3dqZmVhemF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTM4MDEsImV4cCI6MjA3MzMyOTgwMX0.-41V4CFPzcITYtt0fHJdzSNROeFsD_c1LFasDV_hUdg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  location: string;
  profile_images: string[];
  skills: string[];
  bio?: string;
  job_title?: string;
  company?: string;
  website?: string;
  social_profiles: Record<string, string>;
  role: 'Freelancer' | 'Founder' | 'Student' | 'Company';
  is_active: boolean;
  last_seen: string;
}

export interface MatchRequest {
  id: string;
  requester_id: string;
  target_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  responded_at?: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  message_text: string;
  message_type: 'text' | 'image' | 'file';
  created_at: string;
  read_at?: string;
  attachment_url?: string;
  attachment_type?: string;
}

// Auth functions
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  },
};

// User functions
export const userService = {
  async createUser(userData: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    return { data, error };
  },

  async updateUser(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async getCurrentUserProfile() {
    const { user } = await authService.getCurrentUser();
    if (!user) return { data: null, error: { message: 'No user logged in' } };
    
    return this.getUser(user.id);
  },

  async getProfilesForUser(userId: string) {
    const { data, error } = await supabase.rpc('get_profiles_for_user', {
      user_id: userId,
    });
    return { data, error };
  },

  async completeOnboarding(userId: string) {
    return this.updateUser(userId, { onboarding_completed: true });
  },

  async uploadProfileImage(userId: string, imageUri: string) {
    // In a real app, you'd upload to Supabase Storage
    // For now, we'll just return the URI
    return { data: { url: imageUri }, error: null };
  },
};

// Match request functions
export const matchRequestService = {
  async createMatchRequest(requesterId: string, targetId: string) {
    const { data, error } = await supabase.rpc('create_match_request', {
      requester_id: requesterId,
      target_id: targetId,
    });
    return { data, error };
  },

  async getMatchRequests(userId: string) {
    const { data, error } = await supabase.rpc('get_user_match_requests', {
      user_id: userId,
    });
    return { data, error };
  },

  async acceptMatchRequest(requestId: string, accepterId: string) {
    const { data, error } = await supabase.rpc('accept_match_request', {
      request_id: requestId,
      accepter_id: accepterId,
    });
    return { data, error };
  },

  async rejectMatchRequest(requestId: string, rejecterId: string) {
    const { data, error } = await supabase
      .from('match_requests')
      .update({ 
        status: 'rejected',
        responded_at: new Date().toISOString(),
      })
      .eq('id', requestId)
      .eq('target_id', rejecterId)
      .select()
      .single();
    return { data, error };
  },
};

// Match functions
export const matchService = {
  async getUserMatches(userId: string) {
    const { data, error } = await supabase.rpc('get_user_matches', {
      user_id: userId,
    });
    return { data, error };
  },

  async getMatch(matchId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();
    return { data, error };
  },
};

// Message functions
export const messageService = {
  async getMatchMessages(matchId: string, userId: string) {
    const { data, error } = await supabase.rpc('get_match_messages', {
      match_id: matchId,
      user_id: userId,
    });
    return { data, error };
  },

  async sendMessage(
    matchId: string,
    senderId: string,
    messageText: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    attachmentUrl?: string,
    attachmentType?: string
  ) {
    const { data, error } = await supabase.rpc('send_message', {
      match_id: matchId,
      sender_id: senderId,
      message_text: messageText,
      message_type: messageType,
      attachment_url: attachmentUrl,
      attachment_type: attachmentType,
    });
    return { data, error };
  },

  async markMessageAsRead(messageId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select()
      .single();
    return { data, error };
  },

  async markAllMessagesAsRead(matchId: string, userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('match_id', matchId)
      .neq('sender_id', userId)
      .is('read_at', null);
    return { data, error };
  },
};

// Profile view functions
export const profileViewService = {
  async recordProfileView(viewerId: string, viewedId: string) {
    const { data, error } = await supabase.rpc('record_profile_view', {
      viewer_id: viewerId,
      viewed_id: viewedId,
    });
    return { data, error };
  },

  async getProfileViews(userId: string) {
    const { data, error } = await supabase
      .from('profile_views')
      .select(`
        *,
        viewer:viewer_id(id, name, job_title, company, profile_images)
      `)
      .eq('viewed_id', userId)
      .order('viewed_at', { ascending: false });
    return { data, error };
  },
};

// Real-time subscriptions
export const realtimeService = {
  subscribeToMatchRequests(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('match_requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_requests',
          filter: `target_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToMessages(matchId: string, callback: (payload: any) => void) {
    return supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        callback
      )
      .subscribe();
  },

  subscribeToMatches(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('matches')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `user1_id=eq.${userId},user2_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  },
};
