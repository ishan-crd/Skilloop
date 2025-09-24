-- Fix RLS policies to allow user creation without authentication
-- This allows the app to create users without being authenticated through Supabase Auth

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Allow user creation for onboarding" ON users;
DROP POLICY IF EXISTS "Allow user updates for onboarding" ON users;

-- Create new policies that allow user creation without authentication
CREATE POLICY "Allow user creation for onboarding" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow user updates for onboarding" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Allow user viewing for onboarding" ON users
    FOR SELECT USING (true);

-- Note: These policies are more permissive for development
-- In production, you might want to add more specific checks
