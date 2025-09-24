import { supabase, User } from './supabase';

class AuthService {
  private confirmationResult: any = null;
  private storedOTP: string | null = null;
  private storedPhone: string | null = null;
  private isProcessing: boolean = false;
  
  // Singleton pattern
  private static instance: AuthService;
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Phone number authentication - Check if phone exists and handle accordingly
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; isExistingUser?: boolean }> {
    try {
      console.log(`[AuthService] Sending OTP to ${phoneNumber}`);

      // Standardize phone number format
      let formattedPhone = this.normalizePhoneNumber(phoneNumber);
      
      console.log(`[AuthService] Original phone: ${phoneNumber}`);
      console.log(`[AuthService] Formatted phone: ${formattedPhone}`);

      // Check if phone number already exists in database
      console.log(`[AuthService] Searching for phone: "${formattedPhone}"`);
      
      // Check for existing user with this phone number
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('id, name, phone, onboarding_completed, is_active')
        .eq('phone', formattedPhone)
        .eq('is_active', true)
        .single();

      console.log(`[AuthService] Database query result:`, { existingUser, error });

      // Handle database errors (but not "no rows found" error)
      if (error && error.code !== 'PGRST116') {
        console.error('[AuthService] Error checking phone existence:', error);
        return {
          success: false,
          message: 'Failed to check phone number'
        };
      }

      // Use a fixed OTP for testing
      const mockOTP = '123456';
      console.log(`[AuthService] Using fixed OTP: ${mockOTP}`);

      // Store in memory
      this.storedOTP = mockOTP;
      this.storedPhone = formattedPhone;

      if (existingUser) {
        console.log(`[AuthService] Phone number exists for user: ${existingUser.name}`);
        return {
          success: true,
          message: `OTP sent successfully! Use OTP: ${mockOTP}`,
          isExistingUser: true
        };
      } else {
        console.log(`[AuthService] Phone number is new, will create account`);
        return {
          success: true,
          message: `OTP sent successfully! Use OTP: ${mockOTP}`,
          isExistingUser: false
        };
      }
    } catch (error: any) {
      console.error('[AuthService] Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  // Helper method to normalize phone numbers
  private normalizePhoneNumber(phoneNumber: string): string {
    // Remove all spaces and special characters except +
    let cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Handle different input formats
    if (cleaned.startsWith('+91')) {
      return cleaned;
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      return '+' + cleaned;
    } else if (cleaned.startsWith('9876543210')) {
      return '+919876543210';
    } else if (cleaned.length === 10 && !cleaned.startsWith('+')) {
      return '+91' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    
    return cleaned;
  }

  async verifyOTP(otp: string): Promise<{ success: boolean; user?: User; message: string }> {
    try {
      // Prevent multiple simultaneous calls
      if (this.isProcessing) {
        console.log('[AuthService] Already processing OTP verification, please wait...');
        return {
          success: false,
          message: 'Please wait, verification in progress...'
        };
      }
      
      this.isProcessing = true;
      
      console.log(`[AuthService] Verifying OTP: "${otp}"`);
      console.log(`[AuthService] Stored OTP: "${this.storedOTP}", Phone: "${this.storedPhone}"`);
      
      // Verify OTP - only accept 123456
      if (otp.trim() !== '123456') {
        console.log('[AuthService] Invalid OTP - not 123456');
        this.isProcessing = false;
        return {
          success: false,
          message: `Invalid OTP code. Please enter: 123456`
        };
      }
      
      if (!this.storedPhone) {
        console.log('[AuthService] No stored phone number');
        this.isProcessing = false;
        return {
          success: false,
          message: 'No phone number found. Please try again.'
        };
      }

      console.log('[AuthService] OTP verification successful!');
      console.log('[AuthService] Looking for phone:', this.storedPhone);

      // First, check if user exists with this exact phone number
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', this.storedPhone)
        .eq('is_active', true)
        .single();

      console.log(`[AuthService] Database lookup result:`, { existingUser, error: fetchError });

      if (existingUser) {
        // User exists - log them in
        console.log('[AuthService] Existing user found, logging in:', existingUser.name);
        console.log('[AuthService] User onboarding status:', existingUser.onboarding_completed);
        
        // Update last_seen
        await supabase
          .from('users')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', existingUser.id);

        this.isProcessing = false;
        return {
          success: true,
          user: existingUser,
          message: 'Login successful'
        };
      }

      // If no existing user found, create new one
      console.log('[AuthService] No existing user found, creating new account for phone:', this.storedPhone);
      
      // Generate a proper UUID for new user
      const newUserId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      
      // Create user object with all required fields
      const newUser = {
        id: newUserId,
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
        last_seen: new Date().toISOString()
      };

      console.log('[AuthService] Creating user with phone:', this.storedPhone);
      console.log('[AuthService] User data:', newUser);

      // Insert new user into database
      const { data: createdUser, error: createError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      console.log('[AuthService] Create user result:', { createdUser, createError });

      if (createError) {
        console.error('[AuthService] Error creating user:', createError);
        
        // If it's a duplicate key error, try to fetch the existing user
        if (createError.code === '23505' || createError.message.includes('duplicate')) {
          console.log('[AuthService] Duplicate key error, fetching existing user');
          const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('phone', this.storedPhone)
            .eq('is_active', true)
            .single();
            
          if (existingUser) {
            console.log('[AuthService] Found existing user after duplicate error:', existingUser.name);
            this.isProcessing = false;
            return {
              success: true,
              user: existingUser,
              message: 'Login successful'
            };
          }
        }
        
        this.isProcessing = false;
        return {
          success: false,
          message: `Failed to create account: ${createError.message}`
        };
      }

      console.log('[AuthService] New user created successfully:', createdUser.id);
      this.isProcessing = false;
      return {
        success: true,
        user: createdUser,
        message: 'Account created successfully'
      };
    } catch (error: any) {
      console.error('[AuthService] Error verifying OTP:', error);
      this.isProcessing = false;
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
