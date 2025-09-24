-- Clean up duplicate users and fix phone number issues
-- Run these commands in your Supabase SQL Editor

-- 1. First, let's see what users we have
SELECT id, name, phone, email, created_at FROM users ORDER BY created_at;

-- 2. Delete users with NULL phone numbers
DELETE FROM users WHERE phone IS NULL;

-- 3. Delete users with duplicate phone numbers (keep the first one)
DELETE FROM users 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM users 
  WHERE phone IS NOT NULL 
  GROUP BY phone
);

-- 4. Delete users with "New User" name (these are likely duplicates)
DELETE FROM users WHERE name = 'New User';

-- 5. Verify the cleanup
SELECT id, name, phone, email, created_at FROM users ORDER BY created_at;
