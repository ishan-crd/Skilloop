import { supabase } from './supabase';

export interface MatchRequest {
  id: string;
  requester_id: string;
  requested_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  user1: any;
  user2: any;
}

class MatchingService {
  // Send a match request
  async sendMatchRequest(requesterId: string, requestedId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { data, error } = await supabase
        .from('match_requests')
        .insert({
          requester_id: requesterId,
          requested_id: requestedId,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        message: 'Match request sent successfully'
      };
    } catch (error) {
      console.error('Error sending match request:', error);
      return {
        success: false,
        message: 'Failed to send match request'
      };
    }
  }

  // Accept a match request
  async acceptMatchRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get the match request
      const { data: request, error: requestError } = await supabase
        .from('match_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Update the request status
      const { error: updateError } = await supabase
        .from('match_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create a match
      const { error: matchError } = await supabase
        .from('matches')
        .insert({
          user1_id: request.requester_id,
          user2_id: request.requested_id
        });

      if (matchError) throw matchError;

      return {
        success: true,
        message: 'Match accepted successfully'
      };
    } catch (error) {
      console.error('Error accepting match request:', error);
      return {
        success: false,
        message: 'Failed to accept match request'
      };
    }
  }

  // Reject a match request
  async rejectMatchRequest(requestId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('match_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      return {
        success: true,
        message: 'Match request rejected'
      };
    } catch (error) {
      console.error('Error rejecting match request:', error);
      return {
        success: false,
        message: 'Failed to reject match request'
      };
    }
  }

  // Get user's match requests (both sent and received)
  async getUserMatchRequests(userId: string): Promise<MatchRequest[]> {
    try {
      const { data, error } = await supabase
        .from('match_requests')
        .select(`
          *,
          requester:requester_id(id, name, profile_images, job_title, company),
          requested:requested_id(id, name, profile_images, job_title, company)
        `)
        .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting match requests:', error);
      return [];
    }
  }

  // Get user's matches
  async getUserMatches(userId: string): Promise<Match[]> {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          user1:user1_id(id, name, profile_images, job_title, company),
          user2:user2_id(id, name, profile_images, job_title, company)
        `)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting matches:', error);
      return [];
    }
  }

  // Record profile view
  async recordProfileView(viewerId: string, viewedId: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.rpc('record_profile_view', {
        viewer_id: viewerId,
        viewed_id: viewedId
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Profile view recorded'
      };
    } catch (error) {
      console.error('Error recording profile view:', error);
      return {
        success: false,
        message: 'Failed to record profile view'
      };
    }
  }

  // Get profiles for user (excluding already viewed and matched)
  async getProfilesForUser(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.rpc('get_profiles_for_user', {
        user_id: userId
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting profiles:', error);
      return [];
    }
  }
}

export const matchingService = new MatchingService();
