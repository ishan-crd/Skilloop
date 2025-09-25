-- Add customizations column to users table for card customization
-- Run this in your Supabase SQL editor

ALTER TABLE users 
ADD COLUMN customizations TEXT DEFAULT '{}';

-- Add a comment to explain the column
COMMENT ON COLUMN users.customizations IS 'JSON string storing card customization preferences (colors, fonts, etc.)';
