-- Remove Company option from role enum and update existing Company users
-- This script removes the Company role option and updates any existing Company users to Freelancer

-- First, update any existing users with 'Company' role to 'Freelancer'
UPDATE users 
SET role = 'Freelancer' 
WHERE role = 'Company';

-- Note: Since we're using a TEXT field for role (not an enum), we don't need to alter the column type
-- The role field will continue to accept any text value, but we've removed the Company option from the UI

-- Verify the changes
SELECT DISTINCT role FROM users ORDER BY role;
