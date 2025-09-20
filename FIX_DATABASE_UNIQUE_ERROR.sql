-- FIX DATABASE UNIQUE ERROR - Run this in Supabase SQL Editor
-- This script drops all existing functions and creates the correct one

-- Step 1: Add missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS work_experiences JSONB DEFAULT '[]'::JSONB;

-- Step 2: Drop ALL existing create_user_profile functions
DROP FUNCTION IF EXISTS create_user_profile(TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT[], JSONB);
DROP FUNCTION IF EXISTS create_user_profile(TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT[], JSONB, JSONB);
DROP FUNCTION IF EXISTS create_user_profile(TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT[], TEXT[], JSONB, JSONB, JSONB);
DROP FUNCTION IF EXISTS create_user_profile CASCADE;

-- Step 3: Create the complete create_user_profile function
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
    user_social_profiles JSONB,
    user_certificates JSONB DEFAULT '[]'::JSONB,
    user_work_experiences JSONB DEFAULT '[]'::JSONB
)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Insert user with all required fields
    INSERT INTO users (
        email, name, age, gender, location, job_title, company, website,
        bio, role, skills, profile_images, social_profiles, certificates, work_experiences,
        onboarding_completed, is_active, last_seen, created_at, updated_at
    )
    VALUES (
        user_email, user_name, user_age, user_gender, user_location,
        user_job_title, user_company, user_website, user_bio, user_role,
        user_skills, user_profile_images, user_social_profiles, user_certificates, user_work_experiences,
        TRUE, TRUE, NOW(), NOW(), NOW()
    )
    RETURNING id INTO user_id;

    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant execute permission
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile TO anon;

-- Step 5: Test the function
SELECT 'Database fixed successfully! Ready for hosting.' as status;
