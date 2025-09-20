import { supabase, User } from './supabase';

class AuthService {
  private confirmationResult: any = null;
  private storedOTP: string | null = null;
  private storedPhone: string | null = null;
  
  // Singleton pattern
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Phone number authentication - Mock OTP for now
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`[AuthService] Sending mock OTP to ${phoneNumber}`);
      console.log(`[AuthService] Current instance:`, this);
      console.log(`[AuthService] Current storedOTP:`, this.storedOTP);

      // Format phone number (ensure it starts with +)
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      console.log(`[AuthService] Formatted phone: ${formattedPhone}`);

      // Use a fixed OTP for testing
      const mockOTP = '123456';
      console.log(`[AuthService] Using fixed OTP: ${mockOTP}`);

      // Store in memory (simpler than AsyncStorage)
      this.storedOTP = mockOTP;
      this.storedPhone = formattedPhone;

      console.log(`[AuthService] After storing - OTP: ${this.storedOTP}, Phone: ${this.storedPhone}`);

      return {
        success: true,
        message: `OTP sent successfully! Use OTP: ${mockOTP}`
      };
    } catch (error: any) {
      console.error('[AuthService] Error sending mock OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  async verifyOTP(otp: string): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      console.log(`[AuthService] Verifying mock OTP: "${otp}"`);
      console.log(`[AuthService] Current instance:`, this);
      console.log(`[AuthService] Stored OTP: "${this.storedOTP}", Phone: "${this.storedPhone}"`);
      console.log(`[AuthService] OTP type: ${typeof otp}, Stored type: ${typeof this.storedOTP}`);
      console.log(`[AuthService] OTP length: ${otp.length}, Stored length: ${this.storedOTP?.length}`);
      console.log(`[AuthService] Comparison: "${otp.trim()}" === "${this.storedOTP}" = ${otp.trim() === this.storedOTP}`);
      
      // Simple comparison
      if (otp.trim() === this.storedOTP && this.storedPhone) {
        console.log('[AuthService] OTP verification successful!');
        
        // Create a mock user for now (bypass database)
        const mockUser: User = {
          id: 'user_' + Date.now(),
          phone: this.storedPhone,
          email: `user_${Date.now()}@skilloop.demo`,
          name: 'New User',
          age: 25,
          gender: 'Other',
          location: 'Unknown',
          profile_images: ['https://via.placeholder.com/300x300/cccccc/666666?text=User', 'https://via.placeholder.com/300x300/cccccc/666666?text=User'],
          skills: [],
          social_profiles: {},
          role: 'Freelancer',
          onboarding_completed: false,
          is_active: true,
          last_seen: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('[AuthService] Mock user created:', mockUser.id);
        return {
          success: true,
          user: mockUser,
          message: 'Login successful'
        };
      } else {
        console.log('[AuthService] Invalid OTP or phone number');
        console.log(`[AuthService] Expected: "${this.storedOTP}", Got: "${otp.trim()}"`);
        return {
          success: false,
          message: `Invalid OTP code. Expected: ${this.storedOTP}, Got: ${otp.trim()}`
        };
      }
    } catch (error: any) {
      console.error('[AuthService] Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP'
      };
    }
  }

  // Google authentication
  async signInWithGoogle(): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // For now, we'll simulate Google sign-in
      // In production, integrate with Google Sign-In
      const mockEmail = 'user@gmail.com';
      const mockName = 'Google User';

      // Check if user exists
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', mockEmail)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (existingUser) {
        return {
          success: true,
          user: existingUser,
          message: 'Login successful'
        };
      } else {
        // Create new user with all required fields
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email: mockEmail,
            name: mockName,
            phone: `+1${Math.floor(Math.random() * 10000000000)}`,
            age: 25,
            gender: 'Other',
            location: 'Unknown',
            profile_images: ['https://via.placeholder.com/300x300/cccccc/666666?text=Google', 'https://via.placeholder.com/300x300/cccccc/666666?text=Google'],
            skills: [],
            social_profiles: {},
            role: 'Freelancer',
            onboarding_completed: false,
            is_active: true,
            last_seen: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;

        return {
          success: true,
          user: newUser,
          message: 'Account created successfully'
        };
      }
    } catch (error) {
      console.error('Error with Google sign-in:', error);
      return {
        success: false,
        message: 'Failed to sign in with Google'
      };
    }
  }

  // Sign out
  async signOut(): Promise<{ success: boolean; message: string }> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('currentUser');
      
      // Clear stored OTP and phone
      this.storedOTP = null;
      this.storedPhone = null;
      
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        message: 'Failed to sign out'
      };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const userData = await AsyncStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      // Update local storage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('currentUser', JSON.stringify(data));

      return {
        success: true,
        user: data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: 'Failed to update profile'
      };
    }
  }
}

export const authService = AuthService.getInstance();
