-- Check what users are actually in the database
-- Run this in your Supabase SQL Editor to verify the data

SELECT id, name, phone, is_active FROM users ORDER BY created_at;
