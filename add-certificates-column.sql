-- Add certificates column to users table if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS certificates JSONB DEFAULT '[]'::JSONB;
