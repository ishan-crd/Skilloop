-- Fix phone number formats in the database
-- This script standardizes all phone numbers to the +91XXXXXXXXXX format

-- First, handle the duplicate phone number issue
-- Delete the duplicate user (keep the one with completed onboarding)
DELETE FROM users 
WHERE phone = '+91 9876543210' 
  AND onboarding_completed = false 
  AND name = 'New User';

-- Now standardize the remaining phone numbers
UPDATE users 
SET phone = '+919876543210' 
WHERE phone = '+91-9876543210' OR phone = '91 9876543210' OR phone = '91-9876543210';

-- Update other phone numbers to remove spaces and standardize format
UPDATE users 
SET phone = '+919876543210' 
WHERE phone LIKE '+91%9876543210' OR phone LIKE '91%9876543210';

-- Show the results
SELECT 'Final users after cleanup:' as info;
SELECT id, name, phone, onboarding_completed, is_active, created_at
FROM users 
WHERE is_active = true 
ORDER BY created_at DESC;
