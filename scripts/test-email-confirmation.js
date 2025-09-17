// Test script for email confirmation in local environment
// Tests signup with email confirmation requirement

import { createClient } from '@supabase/supabase-js';

// Use local Supabase for testing
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailConfirmation() {
  console.log('📧 Testing Email Confirmation Flow...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing User Registration with Email Confirmation...');
    
    const testEmail = `test${Date.now()}@example.com`; // Unique email
    const testPassword = 'password123';
    
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      console.log('❌ Signup error:', error.message);
      return;
    }
    
    console.log('✅ User registration request successful');
    
    // Check if email confirmation is required
    if (data.user && !data.user.email_confirmed_at) {
      console.log('📧 Email confirmation required (this is expected)');
      console.log('   User ID:', data.user.id);
      console.log('   Email:', data.user.email);
      console.log('   Confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
      
      console.log('\n🔍 Check your email at: http://127.0.0.1:54324');
      console.log(`   Look for email sent to: ${testEmail}`);
      
      // Test 2: Try to login without confirmation
      console.log('\n2. Testing Login Without Email Confirmation...');
      
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });
      
      if (loginError) {
        if (loginError.message.includes('Email not confirmed')) {
          console.log('✅ Login correctly blocked - email confirmation required');
        } else {
          console.log('⚠️  Unexpected login error:', loginError.message);
        }
      } else {
        console.log('⚠️  Login succeeded without email confirmation (unexpected)');
      }
      
    } else if (data.user && data.user.email_confirmed_at) {
      console.log('⚠️  User was automatically confirmed (unexpected in this setup)');
    } else {
      console.log('❌ No user data returned');
    }
    
    console.log('\n🎉 Email confirmation testing completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open Inbucket: http://127.0.0.1:54324');
    console.log(`2. Look for confirmation email for: ${testEmail}`);
    console.log('3. Click the confirmation link in the email');
    console.log('4. Try logging in with the confirmed account');
    console.log('5. Register a new user in your app to test the full flow');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEmailConfirmation();