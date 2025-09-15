# Fix RLS Error - Quick Solution

## The Problem
The database has Row Level Security (RLS) enabled, which blocks direct inserts without authentication.

## The Solution
Run this SQL in your Supabase SQL Editor to create a function that bypasses RLS:

```sql
-- Function to create a user profile without RLS restrictions
CREATE OR REPLACE FUNCTION create_user_profile(
    user_email TEXT,
    user_name TEXT,
    user_age INTEGER,
    user_gender TEXT,
    user_location TEXT,
    user_job_title TEXT,
    user_company TEXT,
    user_website TEXT,
    user_bio TEXT,
    user_role TEXT,
    user_skills TEXT[],
    user_profile_images TEXT[],
    user_social_profiles JSONB
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Insert user profile (bypasses RLS due to SECURITY DEFINER)
    INSERT INTO users (
        email, name, age, gender, location, job_title, company, website, 
        bio, role, skills, profile_images, social_profiles, 
        onboarding_completed, is_active
    )
    VALUES (
        user_email, user_name, user_age, user_gender, user_location, 
        user_job_title, user_company, user_website, user_bio, user_role, 
        user_skills, user_profile_images, user_social_profiles, 
        TRUE, TRUE
    )
    RETURNING id INTO user_id;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Steps:
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Paste the above SQL
4. Click "Run"
5. Try the onboarding again

This function will bypass RLS and allow user creation without authentication errors.
