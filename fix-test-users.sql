-- Fix test users with correct column order
-- Run this in Supabase SQL Editor

-- First, delete existing test users to avoid duplicates
DELETE FROM users WHERE email LIKE   OR email LIKE '%@skilloop.local';

-- Insert test users with correct column order
INSERT INTO users (
  email, phone, name, age, gender, location, profile_images, skills, bio, 
  job_title, company, website, social_profiles, role, onboarding_completed, is_active
) VALUES 
(
  'ananya.sharma@example.com',
  '+91 98765 43210',
  'Ananya Sharma',
  24,
  'Female',
  'Mumbai',
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
  ],
  
),
(
  'sam.mathews@example.com',
  '+1 555 123 4567',
  'Sam Mathews',
  32,ARRAY['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping'],
  'Creative UI/UX designer passionate about creating beautiful, user-centered experiences.',
  'UI/UX Designer',
  'Design Studio',
  'https://ananyasharma.design',
  '{"linkedin": "https://linkedin.com/in/ananyasharma", "instagram": "https://instagram.com/ananyasharma"}',
  'Freelancer',
  TRUE,
  TRUE
  'Male',
  'San Francisco',
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
  ],
  ARRAY['Leadership', 'Product Strategy', 'Business Development', 'Fundraising'],
  'Serial entrepreneur and tech enthusiast. I love building products that solve real-world problems.',
  'CEO & Co-founder',
  'TechStart Inc',
  'https://sammathews.com',
  '{"linkedin": "https://linkedin.com/in/sammathews", "twitter": "https://twitter.com/sammathews"}',
  'Founder',
  TRUE,
  TRUE
),
(
  'dev.singh@example.com',
  '+91 98765 12345',
  'Dev Singh',
  20,
  'Male',
  'Delhi',
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
  ],
  ARRAY['Python', 'Machine Learning', 'Data Science', 'React', 'Node.js'],
  'Computer science student passionate about machine learning and AI.',
  'Computer Science Student',
  'IIT Delhi',
  'https://devsingh.dev',
  '{"linkedin": "https://linkedin.com/in/devsingh", "github": "https://github.com/devsingh"}',
  'Student',
  TRUE,
  TRUE
),
(
  'rachit.singh@example.com',
  '+91 98765 54321',
  'Rachit Singh',
  28,
  'Male',
  'Bangalore',
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
  ],
  ARRAY['Human Resources', 'Talent Acquisition', 'Employee Relations', 'Recruitment'],
  'HR professional with expertise in talent acquisition and employee engagement.',
  'HR Manager',
  'TechCorp Solutions',
  'https://techcorp.com',
  '{"linkedin": "https://linkedin.com/in/rachitsingh", "twitter": "https://twitter.com/rachitsingh"}',
  'Company',
  TRUE,
  TRUE
),
(
  'ishan.gupta@example.com',
  '+91 98765 67890',
  'Ishan Gupta',
  26,
  'Male',
  'Gurgaon',
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
  ],
  ARRAY['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'PostgreSQL'],
  'Full-stack developer with expertise in modern web technologies.',
  'Full Stack Developer',
  'Freelance',
  'https://ishangupta.dev',
  '{"linkedin": "https://linkedin.com/in/ishangupta", "github": "https://github.com/ishangupta"}',
  'Freelancer',
  TRUE,
  TRUE
),
(
  'ruchita.singh@example.com',
  '+91 98765 11111',
  'Ruchita Singh',
  22,
  'Female',
  'Pune',
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
  ],
  ARRAY['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Research'],
  'Design student passionate about creating meaningful visual experiences.',
  'Design Student',
  'NID Ahmedabad',
  'https://ruchitasingh.design',
  '{"linkedin": "https://linkedin.com/in/ruchitasingh", "behance": "https://behance.net/ruchitasingh"}',
  'Student',
  TRUE,
  TRUE
),
(
  'manasvi.aggarwal@example.com',
  '+91 98765 22222',
  'Manasvi Aggarwal',
  30,
  'Female',
  'Hyderabad',
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
  ],
  ARRAY['Healthcare Technology', 'Product Management', 'Business Strategy', 'Leadership'],
  'Healthcare technology entrepreneur focused on making quality healthcare accessible.',
  'CEO & Founder',
  'HealthTech Solutions',
  'https://healthtechsolutions.com',
  '{"linkedin": "https://linkedin.com/in/manasviaggarwal", "twitter": "https://twitter.com/manasviaggarwal"}',
  'Founder',
  TRUE,
  TRUE
);
