-- Add work_experiences column to users table
ALTER TABLE users ADD COLUMN work_experiences JSONB[] DEFAULT '{}';

-- Update the create_user_profile function to include work_experiences
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
