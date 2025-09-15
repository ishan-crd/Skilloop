-- Insert test users for the professional networking app
-- Run this in Supabase SQL Editor to bypass RLS

-- First, delete existing test users to avoid duplicates
DELETE FROM users WHERE email LIKE '%@example.com' OR email LIKE '%@skilloop.local';

-- Insert complete test users with all required fields
INSERT INTO users (
  email, phone, name, age, gender, location, role, job_title, company, website, bio, 
  skills, profile_images, social_profiles, onboarding_completed, is_active
) VALUES 
(
  'ananya.sharma@example.com',
  'Ananya Sharma',
  24,
  'Female',
  'Mumbai',
  'Freelancer',
  'UI/UX Designer',
  'Design Studio',
  'https://ananyasharma.design',
  'Creative UI/UX designer passionate about creating beautiful, user-centered experiences. I love experimenting with new design trends and tools.',
  ARRAY['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototyping', 'User Research', 'Wireframing'],
  ARRAY[
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/ananyasharma", "instagram": "https://instagram.com/ananyasharma", "behance": "https://behance.net/ananyasharma", "dribbble": "https://dribbble.com/ananyasharma"}',
  true,
  true
),
(
  'sam.mathews@example.com',
  'Sam Mathews',
  28,
  'Male',
  'Bangalore',
  'Founder',
  'CEO & Founder',
  'TechStartup Inc',
  'https://sammathews.com',
  'Serial entrepreneur and tech enthusiast. Building the next generation of AI-powered productivity tools. Passionate about innovation and helping startups grow.',
  ARRAY['JavaScript', 'Python', 'Machine Learning', 'Product Management', 'Leadership', 'Strategy', 'Fundraising', 'Team Building'],
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/sammathews", "twitter": "https://twitter.com/sammathews", "github": "https://github.com/sammathews"}',
  true,
  true
),
(
  'dev.singh@example.com',
  'Dev Singh',
  26,
  'Male',
  'Delhi',
  'Student',
  'Computer Science Student',
  'IIT Delhi',
  'https://devsingh.dev',
  'Computer Science student passionate about algorithms and data structures. Currently working on machine learning projects and open source contributions.',
  ARRAY['Python', 'Java', 'C++', 'Machine Learning', 'Data Structures', 'Algorithms', 'React', 'Node.js'],
  ARRAY[
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/devsingh", "github": "https://github.com/devsingh", "twitter": "https://twitter.com/devsingh"}',
  true,
  true
),
(
  'rachit.singh@example.com',
  'Rachit Singh',
  29,
  'Male',
  'Pune',
  'Company',
  'Engineering Manager',
  'TechCorp Solutions',
  'https://rachitsingh.com',
  'Engineering manager with 8+ years of experience in building scalable systems. Leading a team of 15+ engineers and passionate about mentoring.',
  ARRAY['Team Leadership', 'System Design', 'Microservices', 'AWS', 'Docker', 'Kubernetes', 'Python', 'Go'],
  ARRAY[
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/rachitsingh", "twitter": "https://twitter.com/rachitsingh", "github": "https://github.com/rachitsingh"}',
  true,
  true
),
(
  'ishan.gupta@example.com',
  'Ishan Gupta',
  25,
  'Male',
  'Gurugram',
  'Freelancer',
  'Full Stack Developer',
  'Freelance',
  'https://ishangupta.dev',
  'Full-stack developer specializing in React and Node.js. I help startups build their MVP and scale their applications. Love working on challenging problems.',
  ARRAY['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
  ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/ishangupta", "github": "https://github.com/ishangupta", "twitter": "https://twitter.com/ishangupta"}',
  true,
  true
),
(
  'ruchita.singh@example.com',
  'Ruchita Singh',
  23,
  'Female',
  'Hyderabad',
  'Student',
  'MBA Student',
  'IIM Hyderabad',
  'https://ruchitasingh.com',
  'MBA student with a passion for business strategy and digital marketing. Currently interning at a top consulting firm and exploring entrepreneurship.',
  ARRAY['Business Strategy', 'Digital Marketing', 'Data Analysis', 'Excel', 'PowerBI', 'Presentation Skills', 'Leadership', 'Project Management'],
  ARRAY[
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/ruchitasingh", "twitter": "https://twitter.com/ruchitasingh", "instagram": "https://instagram.com/ruchitasingh"}',
  true,
  true
),
(
  'manasvi.aggarwal@example.com',
  'Manasvi Aggarwal',
  27,
  'Female',
  'Chennai',
  'Founder',
  'Co-Founder & CTO',
  'HealthTech Solutions',
  'https://manasviaggarwal.com',
  'Co-founder of a healthtech startup focused on AI-powered medical diagnostics. Computer science graduate with a passion for healthcare innovation.',
  ARRAY['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Healthcare', 'AI', 'Product Development'],
  ARRAY[
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=face'
  ],
  '{"linkedin": "https://linkedin.com/in/manasviaggarwal", "twitter": "https://twitter.com/manasviaggarwal", "github": "https://github.com/manasviaggarwal"}',
  true,
  true
);

-- Verify the users were created
SELECT name, role, location, age, gender FROM users ORDER BY created_at DESC;
