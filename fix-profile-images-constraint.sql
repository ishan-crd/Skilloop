-- Fix profile_images constraint to allow 1-3 images instead of 2-4
-- This aligns with the frontend limit of 3 images maximum

-- First, drop the existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_profile_images_check;

-- Add the new constraint that allows 1-3 images
ALTER TABLE users ADD CONSTRAINT users_profile_images_check 
CHECK (array_length(profile_images, 1) >= 1 AND array_length(profile_images, 1) <= 3);

-- Optional: Update the comment to reflect the new constraint
COMMENT ON COLUMN users.profile_images IS 'Array of profile image URLs (1-3 images required)';

-- Verify the constraint was applied correctly
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'users'::regclass 
AND conname = 'users_profile_images_check';
