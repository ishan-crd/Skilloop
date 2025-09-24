-- Check onboarding status of all users
-- Run this in your Supabase SQL Editor

SELECT id, name, phone, onboarding_completed, created_at FROM users ORDER BY created_at;
