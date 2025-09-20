// Test database connection and function
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bkxhiaplrvkkwjfeazay.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreGhpYXBscnZra3dqZmVhemF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NTM4MDEsImV4cCI6MjA3MzMyOTgwMX0.-41V4CFPzcITYtt0fHJdzSNROeFsD_c1LFasDV_hUdg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('=== DATABASE TEST ===');
  
  try {
    // Test 1: Check connection
    console.log('1. Testing connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    console.log('✅ Connection successful');
    
    // Test 2: Test create_user_profile function
    console.log('2. Testing create_user_profile function...');
    const testData = {
      user_email: `test_${Date.now()}@skilloop.test`,
      user_name: 'Test User',
      user_age: 25,
      user_gender: 'Other',
      user_location: 'Test City',
      user_job_title: 'Test Job',
      user_company: 'Test Company',
      user_website: 'https://test.com',
      user_bio: 'Test bio',
      user_role: 'Freelancer',
      user_skills: ['JavaScript', 'React'],
      user_profile_images: ['https://via.placeholder.com/300x300', 'https://via.placeholder.com/300x300'],
      user_social_profiles: { linkedin: 'https://linkedin.com/test' },
      user_certificates: [],
      user_work_experiences: []
    };
    
    const { data: userId, error: functionError } = await supabase.rpc('create_user_profile', testData);
    
    if (functionError) {
      console.error('Function error:', functionError);
      console.error('Error details:', JSON.stringify(functionError, null, 2));
    } else {
      console.log('✅ Function successful, User ID:', userId);
      
      // Clean up test user
      await supabase.from('users').delete().eq('id', userId);
      console.log('✅ Test user cleaned up');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testDatabase();
