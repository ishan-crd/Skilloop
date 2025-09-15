# 🗄️ Professional Networking App - Database Setup Guide

This guide will walk you through setting up the complete database for your professional networking app.

## 📋 **Prerequisites**

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Install Node.js and npm
3. **Supabase CLI**: Install with `npm install -g supabase`

## 🚀 **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `skilloop-networking`
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (2-3 minutes)

## 🔧 **Step 2: Run Database Schema**

1. **Copy the SQL**: Open `database/schema.sql` and copy all the content
2. **Go to SQL Editor**: In your Supabase dashboard, click "SQL Editor"
3. **Paste and Run**: Paste the schema and click "Run"
4. **Verify Tables**: Check that all tables are created:
   - `users`
   - `match_requests`
   - `matches`
   - `messages`
   - `profile_views`

## 🔑 **Step 3: Get API Keys**

1. **Go to Settings**: Click the gear icon in your Supabase dashboard
2. **API Settings**: Click "API" in the left sidebar
3. **Copy Keys**: Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## ⚙️ **Step 4: Configure Frontend**

1. **Update Service File**: Open `services/supabase.ts`
2. **Replace Placeholders**:
   ```typescript
   const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with your Project URL
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with your Anon Key
   ```

## 🔐 **Step 5: Configure Authentication**

1. **Go to Authentication**: In Supabase dashboard, click "Authentication"
2. **Settings**: Click "Settings" tab
3. **Site URL**: Set to your app's URL (for development: `exp://localhost:8081`)
4. **Redirect URLs**: Add your app's redirect URLs
5. **Email Settings**: Configure email templates if needed

## 📊 **Step 6: Test Database Functions**

Run this test query in the SQL Editor to verify everything works:

```sql
-- Test user creation
INSERT INTO users (
  email, name, age, gender, location, role, 
  profile_images, skills, bio, onboarding_completed
) VALUES (
  'test@example.com', 'Test User', 25, 'Male', 'New York', 'Freelancer',
  ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  ARRAY['React', 'Node.js'], 'Test bio', true
);

-- Test profile filtering
SELECT * FROM get_profiles_for_user('your-user-id-here');

-- Test match request
SELECT create_match_request('user1-id', 'user2-id');
```

## 🎯 **Step 7: Database Structure Overview**

### **Core Tables:**

#### **1. Users Table**
- Stores all user profile information
- Includes onboarding data, skills, images
- Role-based filtering (Freelancer, Founder, Student, Company)

#### **2. Match Requests Table**
- When someone presses "Match" on a profile
- Status: pending, accepted, rejected, expired
- Prevents duplicate requests

#### **3. Matches Table**
- When both users have matched
- Creates a chat relationship
- Tracks last message time

#### **4. Messages Table**
- All chat messages between matched users
- Supports text, images, and files
- Read status tracking

#### **5. Profile Views Table**
- Tracks who viewed whose profile
- Analytics and insights

### **Key Functions:**

#### **Profile Filtering Logic:**
- **Freelancers** see **Founders**
- **Founders** see **Students** and **Freelancers**
- **Companies** see **Founders**, **Students**, and **Freelancers**
- **Students** see **Founders**, **Freelancers**, and **Companies**

#### **Match Flow:**
1. User A presses "Match" on User B's profile
2. Creates a `match_request` with status "pending"
3. User B sees the request in their "Matches" tab
4. If User B accepts, creates a `match` and moves to chat
5. If User B rejects, updates request status to "rejected"

## 🔒 **Security Features**

- **Row Level Security (RLS)**: Users can only see their own data
- **Function Security**: Database functions are secure and validated
- **Input Validation**: All inputs are validated and sanitized
- **Duplicate Prevention**: Prevents duplicate matches and requests

## 📈 **Performance Optimizations**

- **Indexes**: Optimized for common queries
- **GIN Indexes**: For array fields like skills
- **Composite Indexes**: For complex queries
- **Function-based Queries**: Efficient data retrieval

## 🧪 **Testing Your Setup**

1. **Create Test Users**: Use the SQL editor to create test users
2. **Test Matching**: Create match requests between users
3. **Test Chat**: Send messages between matched users
4. **Test Filtering**: Verify role-based profile filtering works

## 🚨 **Common Issues & Solutions**

### **Issue**: "Function not found" error
**Solution**: Make sure you ran the complete schema.sql file

### **Issue**: "Permission denied" error
**Solution**: Check that RLS policies are properly set up

### **Issue**: "Invalid input" error
**Solution**: Verify that your data matches the expected types

### **Issue**: Real-time not working
**Solution**: Check that you're subscribed to the correct channels

## 📱 **Next Steps**

1. **Install Dependencies**: Run `npm install @supabase/supabase-js`
2. **Update Environment**: Add your Supabase keys to environment variables
3. **Test Integration**: Test the app with real database
4. **Deploy**: Deploy your app with the configured database

## 🎉 **You're Ready!**

Your database is now set up and ready for your professional networking app! The schema supports all the features you requested:

- ✅ Role-based profile filtering
- ✅ Match request system
- ✅ Chat functionality
- ✅ Image upload validation (2-4 images)
- ✅ Professional networking features
- ✅ Real-time updates
- ✅ Secure data access

Start building your app and watch the magic happen! 🚀
