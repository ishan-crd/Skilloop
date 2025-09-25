-- Check current profile_images data in the database
-- This will help identify any existing data that violates the new constraint

-- Check users with profile_images arrays
SELECT 
    id, 
    name, 
    array_length(profile_images, 1) as image_count,
    profile_images
FROM users 
WHERE profile_images IS NOT NULL
ORDER BY array_length(profile_images, 1);

-- Check for users with empty or null profile_images
SELECT 
    id, 
    name, 
    profile_images,
    CASE 
        WHEN profile_images IS NULL THEN 'NULL'
        WHEN array_length(profile_images, 1) IS NULL THEN 'EMPTY_ARRAY'
        ELSE 'HAS_IMAGES'
    END as status
FROM users 
WHERE profile_images IS NULL OR array_length(profile_images, 1) IS NULL OR array_length(profile_images, 1) = 0;

-- Count users by image count
SELECT 
    array_length(profile_images, 1) as image_count,
    COUNT(*) as user_count
FROM users 
WHERE profile_images IS NOT NULL
GROUP BY array_length(profile_images, 1)
ORDER BY image_count;
