-- Simple cleanup script - no constraint creation
-- Run these commands in your Supabase SQL Editor

-- 1. See what users we currently have
SELECT id, name, phone, email, created_at FROM users ORDER BY created_at;

-- 2. Delete users with NULL phone numbers
DELETE FROM users WHERE phone IS NULL;

-- 3. Delete users with "New User" name (these are likely duplicates)
DELETE FROM users WHERE name = 'New User';

-- 4. Delete duplicate phone numbers (keep the first one created)
DELETE FROM users 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM users 
  WHERE phone IS NOT NULL 
  GROUP BY phone
);

-- 5. Final check - should only have demo profiles + your real profile
SELECT id, name, phone, email, created_at FROM users ORDER BY created_at;
