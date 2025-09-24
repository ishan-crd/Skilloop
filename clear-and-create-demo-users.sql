-- Complete SQL commands to clear users table and create 5 demo profiles
-- Run these commands in your Supabase SQL Editor

-- 1. DELETE ALL EXISTING USERS
DELETE FROM users;

-- 2. INSERT 5 DEMO PROFILES

-- Demo Profile 1: Sarah Johnson - Product Manager
INSERT INTO users (
  id,
  name,
  age,
  gender,
  location,
  phone,
  email,
  job_title,
  company,
  website,
  bio,
  role,
  skills,
  profile_images,
  social_profiles,
  certificates,
  work_experiences,
  onboarding_completed,
  is_active,
  last_seen,
  created_at,
  updated_at
) VALUES (
  'demo_user_1',
  'Sarah Johnson',
  28,
  'Female',
  'San Francisco, CA',
  '+1234567890',
  'sarah.johnson@demo.com',
  'Senior Product Manager',
  'TechCorp',
  'https://sarahjohnson.com',
  'Experienced product manager with a passion for building user-centric products. I love working with cross-functional teams to deliver exceptional experiences.',
  'Product Manager',
  ARRAY['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Leadership'],
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/sarahjohnson", "twitter": "https://twitter.com/sarahjohnson"}'::jsonb,
  ARRAY[
    '{"id": "1", "title": "Certified Scrum Product Owner", "organization": "Scrum Alliance", "issueDate": "2023-01-15", "imageUri": "", "url": ""}'::jsonb,
    '{"id": "2", "title": "Google Analytics Certified", "organization": "Google", "issueDate": "2022-08-20", "imageUri": "", "url": ""}'::jsonb
  ],
  ARRAY[
    '{"id": "1", "company": "TechCorp", "position": "Senior Product Manager", "startDate": "2021-03", "endDate": "", "isCurrent": true, "logo": ""}'::jsonb,
    '{"id": "2", "company": "StartupXYZ", "position": "Product Manager", "startDate": "2019-06", "endDate": "2021-02", "isCurrent": false, "logo": ""}'::jsonb
  ],
  true,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Demo Profile 2: Michael Chen - Software Engineer
INSERT INTO users (
  id,
  name,
  age,
  gender,
  location,
  phone,
  email,
  job_title,
  company,
  website,
  bio,
  role,
  skills,
  profile_images,
  social_profiles,
  certificates,
  work_experiences,
  onboarding_completed,
  is_active,
  last_seen,
  created_at,
  updated_at
) VALUES (
  'demo_user_2',
  'Michael Chen',
  26,
  'Male',
  'Seattle, WA',
  '+1234567891',
  'michael.chen@demo.com',
  'Full Stack Developer',
  'InnovateTech',
  'https://michaelchen.dev',
  'Passionate full-stack developer with expertise in React, Node.js, and cloud technologies. Always learning and building something new.',
  'Software Engineer',
  ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'Python'],
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/michaelchen", "github": "https://github.com/michaelchen"}'::jsonb,
  ARRAY[
    '{"id": "3", "title": "AWS Certified Developer", "organization": "Amazon Web Services", "issueDate": "2023-06-10", "imageUri": "", "url": ""}'::jsonb,
    '{"id": "4", "title": "React Developer Certification", "organization": "Meta", "issueDate": "2022-12-05", "imageUri": "", "url": ""}'::jsonb
  ],
  ARRAY[
    '{"id": "3", "company": "InnovateTech", "position": "Full Stack Developer", "startDate": "2022-01", "endDate": "", "isCurrent": true, "logo": ""}'::jsonb,
    '{"id": "4", "company": "CodeStartup", "position": "Frontend Developer", "startDate": "2020-08", "endDate": "2021-12", "isCurrent": false, "logo": ""}'::jsonb
  ],
  true,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Demo Profile 3: Emily Rodriguez - UX Designer
INSERT INTO users (
  id,
  name,
  age,
  gender,
  location,
  phone,
  email,
  job_title,
  company,
  website,
  bio,
  role,
  skills,
  profile_images,
  social_profiles,
  certificates,
  work_experiences,
  onboarding_completed,
  is_active,
  last_seen,
  created_at,
  updated_at
) VALUES (
  'demo_user_3',
  'Emily Rodriguez',
  29,
  'Female',
  'Austin, TX',
  '+1234567892',
  'emily.rodriguez@demo.com',
  'Senior UX Designer',
  'DesignStudio',
  'https://emilyrodriguez.design',
  'Creative UX designer with a focus on creating intuitive and beautiful user experiences. I believe good design solves real problems.',
  'UX Designer',
  ARRAY['User Experience', 'Figma', 'Prototyping', 'User Research', 'Design Systems'],
  ARRAY[
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/emilyrodriguez", "dribbble": "https://dribbble.com/emilyrodriguez"}'::jsonb,
  ARRAY[
    '{"id": "5", "title": "Google UX Design Certificate", "organization": "Google", "issueDate": "2023-03-15", "imageUri": "", "url": ""}'::jsonb,
    '{"id": "6", "title": "Figma Master Certification", "organization": "Figma", "issueDate": "2022-11-20", "imageUri": "", "url": ""}'::jsonb
  ],
  ARRAY[
    '{"id": "5", "company": "DesignStudio", "position": "Senior UX Designer", "startDate": "2021-05", "endDate": "", "isCurrent": true, "logo": ""}'::jsonb,
    '{"id": "6", "company": "CreativeAgency", "position": "UX Designer", "startDate": "2019-09", "endDate": "2021-04", "isCurrent": false, "logo": ""}'::jsonb
  ],
  true,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Demo Profile 4: David Kim - Data Scientist
INSERT INTO users (
  id,
  name,
  age,
  gender,
  location,
  phone,
  email,
  job_title,
  company,
  website,
  bio,
  role,
  skills,
  profile_images,
  social_profiles,
  certificates,
  work_experiences,
  onboarding_completed,
  is_active,
  last_seen,
  created_at,
  updated_at
) VALUES (
  'demo_user_4',
  'David Kim',
  31,
  'Male',
  'New York, NY',
  '+1234567893',
  'david.kim@demo.com',
  'Senior Data Scientist',
  'DataCorp',
  'https://davidkim.ai',
  'Data scientist passionate about turning complex data into actionable insights. Expert in machine learning, statistics, and big data technologies.',
  'Data Scientist',
  ARRAY['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
  ARRAY[
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/davidkim", "github": "https://github.com/davidkim"}'::jsonb,
  ARRAY[
    '{"id": "7", "title": "AWS Machine Learning Specialty", "organization": "Amazon Web Services", "issueDate": "2023-04-12", "imageUri": "", "url": ""}'::jsonb,
    '{"id": "8", "title": "Google Data Analytics Certificate", "organization": "Google", "issueDate": "2022-09-30", "imageUri": "", "url": ""}'::jsonb
  ],
  ARRAY[
    '{"id": "7", "company": "DataCorp", "position": "Senior Data Scientist", "startDate": "2020-02", "endDate": "", "isCurrent": true, "logo": ""}'::jsonb,
    '{"id": "8", "company": "AnalyticsPro", "position": "Data Scientist", "startDate": "2018-06", "endDate": "2020-01", "isCurrent": false, "logo": ""}'::jsonb
  ],
  true,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Demo Profile 5: Lisa Wang - Marketing Manager
INSERT INTO users (
  id,
  name,
  age,
  gender,
  location,
  phone,
  email,
  job_title,
  company,
  website,
  bio,
  role,
  skills,
  profile_images,
  social_profiles,
  certificates,
  work_experiences,
  onboarding_completed,
  is_active,
  last_seen,
  created_at,
  updated_at
) VALUES (
  'demo_user_5',
  'Lisa Wang',
  27,
  'Female',
  'Los Angeles, CA',
  '+1234567894',
  'lisa.wang@demo.com',
  'Digital Marketing Manager',
  'GrowthCo',
  'https://lisawang.marketing',
  'Digital marketing expert with a track record of driving growth through innovative campaigns. Passionate about data-driven marketing and brand building.',
  'Marketing Manager',
  ARRAY['Digital Marketing', 'SEO', 'Social Media', 'Analytics', 'Content Strategy'],
  ARRAY[
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/lisawang", "twitter": "https://twitter.com/lisawang"}'::jsonb,
  ARRAY[
    '{"id": "9", "title": "Google Ads Certified", "organization": "Google", "issueDate": "2023-02-28", "imageUri": "", "url": ""}'::jsonb,
    '{"id": "10", "title": "HubSpot Content Marketing", "organization": "HubSpot", "issueDate": "2022-10-15", "imageUri": "", "url": ""}'::jsonb
  ],
  ARRAY[
    '{"id": "9", "company": "GrowthCo", "position": "Digital Marketing Manager", "startDate": "2021-08", "endDate": "", "isCurrent": true, "logo": ""}'::jsonb,
    '{"id": "10", "company": "MarketingPro", "position": "Marketing Specialist", "startDate": "2019-03", "endDate": "2021-07", "isCurrent": false, "logo": ""}'::jsonb
  ],
  true,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- 3. VERIFY THE DEMO PROFILES WERE CREATED
SELECT id, name, phone, job_title, company FROM users ORDER BY created_at;
