-- Fix database constraints to allow null values for email and phone
-- Run these queries in your Supabase SQL editor

-- 1. Allow null values for email column
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- 2. Allow null values for phone column  
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;

-- 3. Add unique constraints only when values are not null
-- This ensures uniqueness when values exist, but allows null values
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique 
ON users(email) WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS users_phone_unique 
ON users(phone) WHERE phone IS NOT NULL;

-- 4. Verify the changes
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('email', 'phone');
