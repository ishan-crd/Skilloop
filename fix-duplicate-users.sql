-- Fix duplicate users issue
-- This script will merge the two Ishan Gupta entries into one

-- Step 1: Check current state
SELECT 'Current users with Ishan Gupta or phone +918527189364:' as info;
SELECT id, name, phone, email, onboarding_completed, is_active, created_at
FROM users 
WHERE name LIKE '%Ishan%' OR phone = '+918527189364'
ORDER BY created_at DESC;

-- Step 2: Update the user with phone number to have the correct name and data
-- We'll keep the user with the phone number and update it with the correct profile data
UPDATE users 
SET 
    name = 'Ishan Gupta',
    email = 'user1758710176274@skilloop.local',
    onboarding_completed = true,
    updated_at = NOW()
WHERE phone = '+918527189364' 
  AND name = 'New User';

-- Step 3: Delete the duplicate user with NULL phone
DELETE FROM users 
WHERE name = 'Ishan Gupta' 
  AND phone IS NULL 
  AND email = 'user1758710176274@skilloop.local';

-- Step 4: Verify the fix
SELECT 'After cleanup - remaining users:' as info;
SELECT id, name, phone, email, onboarding_completed, is_active, created_at
FROM users 
WHERE name LIKE '%Ishan%' OR phone = '+918527189364'
ORDER BY created_at DESC;

-- Step 5: Show all users to verify no duplicates
SELECT 'All users in database:' as info;
SELECT id, name, phone, email, onboarding_completed, is_active, created_at
FROM users 
WHERE is_active = true
ORDER BY created_at DESC;