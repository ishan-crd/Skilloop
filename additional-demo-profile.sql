-- Additional demo profile with +91 (Indian) phone number
-- Run this after the previous 5 demo profiles

-- Demo Profile 6: Priya Sharma - Software Engineer (Indian)
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
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  'Priya Sharma',
  25,
  'Female',
  'Mumbai, India',
  '+919876543210',
  'priya.sharma@demo.com',
  'Software Engineer',
  'TechStartup India',
  'https://priyasharma.dev',
  'Passionate software engineer from Mumbai with expertise in full-stack development. Love building scalable applications and contributing to open source projects.',
  'Freelancer',
  ARRAY['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/priyasharma", "github": "https://github.com/priyasharma", "twitter": "https://twitter.com/priyasharma"}'::jsonb,
  '[
    {"id": "11", "title": "AWS Certified Solutions Architect", "organization": "Amazon Web Services", "issueDate": "2023-07-15", "imageUri": "", "url": ""},
    {"id": "12", "title": "MongoDB Certified Developer", "organization": "MongoDB", "issueDate": "2022-12-10", "imageUri": "", "url": ""},
    {"id": "13", "title": "React Developer Certification", "organization": "Meta", "issueDate": "2022-09-20", "imageUri": "", "url": ""}
  ]'::jsonb,
  '[
    {"id": "11", "company": "TechStartup India", "position": "Software Engineer", "startDate": "2022-03", "endDate": "", "isCurrent": true, "logo": ""},
    {"id": "12", "company": "Infosys", "position": "Junior Software Engineer", "startDate": "2021-06", "endDate": "2022-02", "isCurrent": false, "logo": ""},
    {"id": "13", "company": "Freelance Projects", "position": "Full Stack Developer", "startDate": "2020-01", "endDate": "2021-05", "isCurrent": false, "logo": ""}
  ]'::jsonb,
  true,
  true,
  NOW(),
  NOW(),
  NOW()
);

-- Verify the new profile was added
SELECT id, name, phone, job_title, company, role FROM users WHERE phone LIKE '+91%';
