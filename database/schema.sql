-- Professional Networking App Database Schema
-- This is a comprehensive schema for a LinkedIn-style professional networking app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table - Main user profiles
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    
    -- Basic Information (from onboarding2)
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    location TEXT NOT NULL,
    
    -- Profile Images (from onboarding3) - 2-4 images required
    profile_images TEXT[] NOT NULL CHECK (array_length(profile_images, 1) >= 2 AND array_length(profile_images, 1) <= 4),
    
    -- Skills and Bio (from onboarding4)
    skills TEXT[] DEFAULT '{}',
    bio TEXT,
    
    -- Business Card Information (from onboarding5) - All optional
    job_title TEXT,
    company TEXT,
    website TEXT,
    social_profiles JSONB DEFAULT '{}',
    
    -- Role (from onboarding1) - Determines who they see
    role TEXT NOT NULL CHECK (role IN ('Freelancer', 'Founder', 'Student', 'Company')),
    
    -- Additional metadata
    is_active BOOLEAN DEFAULT TRUE,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match requests table - When someone presses match
CREATE TABLE match_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure no duplicate requests
    UNIQUE(requester_id, target_id)
);

-- Matches table - When both people have matched
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure no duplicate matches and user1_id < user2_id for consistency
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id < user2_id)
);

-- Messages table - Chat messages between matched users
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Additional fields for different message types
    attachment_url TEXT,
    attachment_type TEXT
);

-- Profile views table - Track who viewed whose profile
CREATE TABLE profile_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewed_date DATE DEFAULT CURRENT_DATE,
    
    -- Prevent duplicate views in same day
    UNIQUE(viewer_id, viewed_id, viewed_date)
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_skills ON users USING GIN(skills);
CREATE INDEX idx_users_gender ON users(gender);
CREATE INDEX idx_users_onboarding_completed ON users(onboarding_completed);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_match_requests_requester ON match_requests(requester_id);
CREATE INDEX idx_match_requests_target ON match_requests(target_id);
CREATE INDEX idx_match_requests_status ON match_requests(status);
CREATE INDEX idx_match_requests_created_at ON match_requests(created_at);

CREATE INDEX idx_matches_user1 ON matches(user1_id);
CREATE INDEX idx_matches_user2 ON matches(user2_id);
CREATE INDEX idx_matches_created_at ON matches(created_at);
CREATE INDEX idx_matches_last_message_at ON matches(last_message_at);

CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_profile_views_viewer ON profile_views(viewer_id);
CREATE INDEX idx_profile_views_viewed ON profile_views(viewed_id);
CREATE INDEX idx_profile_views_viewed_at ON profile_views(viewed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for match_requests table
CREATE POLICY "Users can view their own match requests" ON match_requests
    FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = target_id);

CREATE POLICY "Users can create match requests" ON match_requests
    FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update match requests they received" ON match_requests
    FOR UPDATE USING (auth.uid() = target_id);

-- RLS Policies for matches table
CREATE POLICY "Users can view their own matches" ON matches
    FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create matches" ON matches
    FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for messages table
CREATE POLICY "Users can view messages in their matches" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = messages.match_id 
            AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their matches" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM matches 
            WHERE matches.id = messages.match_id 
            AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
        )
    );

-- RLS Policies for profile_views table
CREATE POLICY "Users can view their own profile views" ON profile_views
    FOR SELECT USING (auth.uid() = viewer_id OR auth.uid() = viewed_id);

CREATE POLICY "Users can create profile views" ON profile_views
    FOR INSERT WITH CHECK (auth.uid() = viewer_id);

-- Functions for common operations

-- Function to get profiles based on user role
CREATE OR REPLACE FUNCTION get_profiles_for_user(user_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    age INTEGER,
    gender TEXT,
    location TEXT,
    job_title TEXT,
    company TEXT,
    website TEXT,
    profile_images TEXT[],
    skills TEXT[],
    bio TEXT,
    role TEXT,
    social_profiles JSONB
) AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get the user's role
    SELECT u.role INTO user_role FROM users u WHERE u.id = user_id;
    
    -- Return profiles based on role
    IF user_role = 'Freelancer' THEN
        RETURN QUERY
        SELECT u.id, u.name, u.age, u.gender, u.location, u.job_title, u.company, 
               u.website, u.profile_images, u.skills, u.bio, u.role, u.social_profiles
        FROM users u
        WHERE u.id != user_id 
        AND u.role = 'Founder'
        AND u.is_active = TRUE
        AND u.onboarding_completed = TRUE
        ORDER BY u.created_at DESC;
        
    ELSIF user_role = 'Founder' THEN
        RETURN QUERY
        SELECT u.id, u.name, u.age, u.gender, u.location, u.job_title, u.company, 
               u.website, u.profile_images, u.skills, u.bio, u.role, u.social_profiles
        FROM users u
        WHERE u.id != user_id 
        AND u.role IN ('Student', 'Freelancer')
        AND u.is_active = TRUE
        AND u.onboarding_completed = TRUE
        ORDER BY u.created_at DESC;
        
    ELSIF user_role = 'Company' THEN
        RETURN QUERY
        SELECT u.id, u.name, u.age, u.gender, u.location, u.job_title, u.company, 
               u.website, u.profile_images, u.skills, u.bio, u.role, u.social_profiles
        FROM users u
        WHERE u.id != user_id 
        AND u.role IN ('Founder', 'Student', 'Freelancer')
        AND u.is_active = TRUE
        AND u.onboarding_completed = TRUE
        ORDER BY u.created_at DESC;
        
    ELSIF user_role = 'Student' THEN
        RETURN QUERY
        SELECT u.id, u.name, u.age, u.gender, u.location, u.job_title, u.company, 
               u.website, u.profile_images, u.skills, u.bio, u.role, u.social_profiles
        FROM users u
        WHERE u.id != user_id 
        AND u.role IN ('Founder', 'Freelancer', 'Company')
        AND u.is_active = TRUE
        AND u.onboarding_completed = TRUE
        ORDER BY u.created_at DESC;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a match request
CREATE OR REPLACE FUNCTION create_match_request(requester_id UUID, target_id UUID)
RETURNS UUID AS $$
DECLARE
    request_id UUID;
BEGIN
    -- Check if request already exists
    IF EXISTS (SELECT 1 FROM match_requests mr WHERE mr.requester_id = $1 AND mr.target_id = $2) THEN
        RAISE EXCEPTION 'Match request already exists';
    END IF;
    
    -- Check if users are already matched
    IF EXISTS (
        SELECT 1 FROM matches m
        WHERE (m.user1_id = $1 AND m.user2_id = $2) OR (m.user1_id = $2 AND m.user2_id = $1)
    ) THEN
        RAISE EXCEPTION 'Users are already matched';
    END IF;
    
    -- Create the match request
    INSERT INTO match_requests (requester_id, target_id)
    VALUES ($1, $2)
    RETURNING id INTO request_id;
    
    RETURN request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to accept a match request
CREATE OR REPLACE FUNCTION accept_match_request(request_id UUID, accepter_id UUID)
RETURNS UUID AS $$
DECLARE
    match_id UUID;
    requester_id UUID;
    target_id UUID;
BEGIN
    -- Get the request details
    SELECT requester_id, target_id INTO requester_id, target_id
    FROM match_requests 
    WHERE id = request_id AND target_id = accepter_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Match request not found or not authorized';
    END IF;
    
    -- Update the request status
    UPDATE match_requests 
    SET status = 'accepted', responded_at = NOW()
    WHERE id = request_id;
    
    -- Create the match (ensure user1_id < user2_id)
    IF requester_id < target_id THEN
        INSERT INTO matches (user1_id, user2_id)
        VALUES (requester_id, target_id)
        RETURNING id INTO match_id;
    ELSE
        INSERT INTO matches (user1_id, user2_id)
        VALUES (target_id, requester_id)
        RETURNING id INTO match_id;
    END IF;
    
    RETURN match_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's match requests
CREATE OR REPLACE FUNCTION get_user_match_requests(user_id UUID)
RETURNS TABLE (
    id UUID,
    requester_id UUID,
    requester_name TEXT,
    requester_job_title TEXT,
    requester_company TEXT,
    requester_profile_images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT mr.id, mr.requester_id, u.name, u.job_title, u.company, 
           u.profile_images, mr.created_at
    FROM match_requests mr
    JOIN users u ON u.id = mr.requester_id
    WHERE mr.target_id = user_id AND mr.status = 'pending'
    ORDER BY mr.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's matches
CREATE OR REPLACE FUNCTION get_user_matches(user_id UUID)
RETURNS TABLE (
    match_id UUID,
    other_user_id UUID,
    other_user_name TEXT,
    other_user_job_title TEXT,
    other_user_company TEXT,
    other_user_profile_images TEXT[],
    last_message_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, 
           CASE WHEN m.user1_id = user_id THEN m.user2_id ELSE m.user1_id END as other_user_id,
           u.name, u.job_title, u.company, u.profile_images, m.last_message_at
    FROM matches m
    JOIN users u ON u.id = CASE WHEN m.user1_id = user_id THEN m.user2_id ELSE m.user1_id END
    WHERE (m.user1_id = user_id OR m.user2_id = user_id)
    ORDER BY m.last_message_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get messages for a match
CREATE OR REPLACE FUNCTION get_match_messages(match_id UUID, user_id UUID)
RETURNS TABLE (
    id UUID,
    sender_id UUID,
    message_text TEXT,
    message_type TEXT,
    attachment_url TEXT,
    attachment_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    -- Verify user is part of this match
    IF NOT EXISTS (
        SELECT 1 FROM matches 
        WHERE id = match_id AND (user1_id = user_id OR user2_id = user_id)
    ) THEN
        RAISE EXCEPTION 'User not authorized to view these messages';
    END IF;
    
    RETURN QUERY
    SELECT m.id, m.sender_id, m.message_text, m.message_type, 
           m.attachment_url, m.attachment_type, m.created_at, m.read_at
    FROM messages m
    WHERE m.match_id = match_id
    ORDER BY m.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to send a message
CREATE OR REPLACE FUNCTION send_message(
    match_id UUID, 
    sender_id UUID, 
    message_text TEXT,
    message_type TEXT DEFAULT 'text',
    attachment_url TEXT DEFAULT NULL,
    attachment_type TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    message_id UUID;
BEGIN
    -- Verify user is part of this match
    IF NOT EXISTS (
        SELECT 1 FROM matches 
        WHERE id = match_id AND (user1_id = sender_id OR user2_id = sender_id)
    ) THEN
        RAISE EXCEPTION 'User not authorized to send messages in this match';
    END IF;
    
    -- Insert the message
    INSERT INTO messages (match_id, sender_id, message_text, message_type, attachment_url, attachment_type)
    VALUES (match_id, sender_id, message_text, message_type, attachment_url, attachment_type)
    RETURNING id INTO message_id;
    
    -- Update the match's last_message_at
    UPDATE matches SET last_message_at = NOW() WHERE id = match_id;
    
    RETURN message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to record a profile view
CREATE OR REPLACE FUNCTION record_profile_view(viewer_id UUID, viewed_id UUID)
RETURNS UUID AS $$
DECLARE
    view_id UUID;
BEGIN
    -- Insert the profile view
    INSERT INTO profile_views (viewer_id, viewed_id, viewed_date)
    VALUES (viewer_id, viewed_id, CURRENT_DATE)
    ON CONFLICT (viewer_id, viewed_id, viewed_date) DO NOTHING
    RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
