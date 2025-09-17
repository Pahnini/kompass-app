// Test script for authentication flow in local environment
// Tests login, logout, and session management

import { createClient } from '@supabase/supabase-js';

// Use local Supabase for testing
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuthFlow() {
  console.log('🔐 Testing Authentication Flow...\n');

  try {
    // Test 1: Check current session
    console.log('1. Checking Current Session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('⚠️  Session check error:', sessionError.message);
    } else if (sessionData.session) {
      console.log('✅ Active session found:', sessionData.session.user.email);
    } else {
      console.log('ℹ️  No active session (user not logged in)');
    }

    // Test 2: Test signup flow
    console.log('\n2. Testing User Registration...');
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        console.log('ℹ️  User already exists - this is expected');
      } else {
        console.log('⚠️  Signup error:', signUpError.message);
      }
    } else {
      console.log('✅ User signup successful');
      if (signUpData.user && !signUpData.user.email_confirmed_at) {
        console.log('📧 Email confirmation required - check Inbucket: http://127.0.0.1:54324');
      }
    }

    // Test 3: Test login
    console.log('\n3. Testing User Login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });
    
    if (loginError) {
      console.log('⚠️  Login error:', loginError.message);
      if (loginError.message.includes('Email not confirmed')) {
        console.log('📧 Please confirm email first via Inbucket: http://127.0.0.1:54324');
      }
    } else {
      console.log('✅ Login successful:', loginData.user?.email);
    }

    // Test 4: Test logout
    console.log('\n4. Testing User Logout...');
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      console.log('⚠️  Logout error:', logoutError.message);
    } else {
      console.log('✅ Logout successful');
    }

    // Test 5: Verify session cleared
    console.log('\n5. Verifying Session Cleared...');
    const { data: postLogoutSession } = await supabase.auth.getSession();
    
    if (postLogoutSession.session) {
      console.log('⚠️  Session still active after logout');
    } else {
      console.log('✅ Session successfully cleared');
    }

    console.log('\n🎉 Authentication flow testing completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Open your app: http://localhost:5173');
    console.log('2. You should now see the Landing/Login page');
    console.log('3. Register with test@example.com / password123');
    console.log('4. Check email confirmation: http://127.0.0.1:54324');
    console.log('5. Login and test logout button in sidebar');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testAuthFlow();