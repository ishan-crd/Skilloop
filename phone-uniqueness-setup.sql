-- Database setup for phone number uniqueness
-- Run these queries in your Supabase SQL editor

-- 1. Add unique constraint to phone column
ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- 2. Create index for faster phone lookups
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- 3. Update the create_user_profile function to handle phone uniqueness
CREATE OR REPLACE FUNCTION create_user_profile(
  user_name TEXT,
  user_age INTEGER,
  user_gender TEXT,
  user_location TEXT,
  user_phone TEXT,
  user_job_title TEXT,
  user_company TEXT,
  user_website TEXT,
  user_bio TEXT,
  user_role TEXT,
  user_skills TEXT[],
  user_profile_images TEXT[],
  user_social_profiles JSONB,
  user_certificates JSONB[],
  user_work_experiences JSONB[]
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSONB;
BEGIN
  -- Check if phone number already exists
  IF EXISTS (SELECT 1 FROM users WHERE phone = user_phone) THEN
    RAISE EXCEPTION 'Phone number already exists: %', user_phone;
  END IF;

  -- Insert new user
  INSERT INTO users (
    name, age, gender, location, phone, job_title, company, website, bio, role,
    skills, profile_images, social_profiles, certificates, work_experiences,
    onboarding_completed, is_active
  ) VALUES (
    user_name, user_age, user_gender, user_location, user_phone, user_job_title,
    user_company, user_website, user_bio, user_role, user_skills, user_profile_images,
    user_social_profiles, user_certificates, user_work_experiences,
    true, true
  ) RETURNING id INTO new_user_id;

  -- Return the created user data
  SELECT to_jsonb(u.*) INTO result
  FROM users u
  WHERE u.id = new_user_id;

  RETURN result;
END;
$$;

-- 4. Create function to check if phone exists
CREATE OR REPLACE FUNCTION check_phone_exists(user_phone TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM users WHERE phone = user_phone);
END;
$$;

-- 5. Create function to get user by phone
CREATE OR REPLACE FUNCTION get_user_by_phone(user_phone TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  age INTEGER,
  gender TEXT,
  location TEXT,
  phone TEXT,
  email TEXT,
  job_title TEXT,
  company TEXT,
  website TEXT,
  bio TEXT,
  role TEXT,
  skills TEXT[],
  profile_images TEXT[],
  social_profiles JSONB,
  certificates JSONB[],
  work_experiences JSONB[],
  onboarding_completed BOOLEAN,
  is_active BOOLEAN,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.name, u.age, u.gender, u.location, u.phone, u.email,
         u.job_title, u.company, u.website, u.bio, u.role, u.skills,
         u.profile_images, u.social_profiles, u.certificates, u.work_experiences,
         u.onboarding_completed, u.is_active, u.last_seen, u.created_at, u.updated_at
  FROM users u
  WHERE u.phone = user_phone AND u.is_active = TRUE;
END;
$$;
