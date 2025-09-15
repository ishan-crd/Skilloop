-- Fix the database functions with proper table aliases

-- Drop and recreate get_profiles_for_user function
DROP FUNCTION IF EXISTS get_profiles_for_user(UUID);

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

-- Drop and recreate create_match_request function
DROP FUNCTION IF EXISTS create_match_request(UUID, UUID);

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
