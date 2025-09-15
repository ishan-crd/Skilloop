-- Insert complete test users with all required fields
-- Run this in Supabase SQL Editor to bypass RLS

-- First, delete existing test users to avoid duplicates
DELETE FROM users WHERE email LIKE '%@example.com' OR email LIKE '%@skilloop.local';

-- Insert complete test users with all required fields
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
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face'
  ],
  ARRAY['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research', 'Wireframing'],
  'Creative UI/UX designer passionate about creating beautiful, user-centered experiences. I love experimenting with new design trends and tools.',
  'UI/UX Designer',
  'Design Studio',
  'https://ananyasharma.design',
  '{"linkedin": "https://linkedin.com/in/ananyasharma", "instagram": "https://instagram.com/ananyasharma", "behance": "https://behance.net/ananyasharma"}',
  'Freelancer',
  TRUE,
  TRUE
),
(
  'sam.mathews@example.com',
  '+1 555 123 4567',
  'Sam Mathews',
  32,
  'Male',
  'San Francisco',
  'Founder',
  'CEO & Co-founder',
  'TechStart Inc',
  'https://sammathews.com',
  'Serial entrepreneur and tech enthusiast. I love building products that solve real-world problems and create meaningful impact.',
  ARRAY['Leadership', 'Product Strategy', 'Business Development', 'Fundraising', 'Team Building', 'Strategic Planning'],
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/sammathews", "twitter": "https://twitter.com/sammathews"}',
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
  'Student',
  'Computer Science Student',
  'IIT Delhi',
  'https://devsingh.dev',
  'Computer science student passionate about machine learning and AI. I love working on projects that combine technology with social impact.',
  ARRAY['Python', 'Machine Learning', 'Data Science', 'React', 'Node.js', 'MongoDB', 'TensorFlow', 'Pandas'],
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/devsingh", "github": "https://github.com/devsingh"}',
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
  'Company',
  'HR Manager',
  'TechCorp Solutions',
  'https://techcorp.com',
  'HR professional with expertise in talent acquisition and employee engagement. I help companies build strong, diverse teams.',
  ARRAY['Human Resources', 'Talent Acquisition', 'Employee Relations', 'Recruitment', 'Team Management', 'HR Analytics'],
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/rachitsingh", "twitter": "https://twitter.com/rachitsingh"}',
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
  'Freelancer',
  'Full Stack Developer',
  'Freelance',
  'https://ishangupta.dev',
  'Full-stack developer with expertise in modern web technologies. I help startups and businesses build scalable applications.',
  ARRAY['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/ishangupta", "github": "https://github.com/ishangupta", "twitter": "https://twitter.com/ishangupta"}',
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
  'Student',
  'Design Student',
  'NID Ahmedabad',
  'https://ruchitasingh.design',
  'Design student passionate about creating meaningful visual experiences. I love exploring the intersection of design and technology.',
  ARRAY['Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Research', 'Visual Design', 'Branding'],
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/ruchitasingh", "behance": "https://behance.net/ruchitasingh", "dribbble": "https://dribbble.com/ruchitasingh"}',
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
  'Founder',
  'CEO & Founder',
  'HealthTech Solutions',
  'https://healthtechsolutions.com',
  'Healthcare technology entrepreneur focused on making quality healthcare accessible to everyone. I believe in the power of technology to transform lives.',
  ARRAY['Healthcare Technology', 'Product Management', 'Business Strategy', 'Leadership', 'Healthcare Innovation', 'Startup Development'],
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/manasviaggarwal", "twitter": "https://twitter.com/manasviaggarwal"}',
  TRUE,
  TRUE
);
