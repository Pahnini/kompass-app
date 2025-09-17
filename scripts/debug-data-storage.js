// Debug script to check data storage issues
// Tests if the app can actually save data to the new healthcare tables

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDataStorage() {
  console.log('🔍 Debugging Data Storage Issues...\n');

  try {
    // Step 1: Check if user is authenticated
    console.log('1. Checking Authentication Status...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.log('❌ Session error:', sessionError.message);
      return;
    }
    
    if (!session) {
      console.log('❌ No active session - user needs to login first');
      console.log('   Please login at: http://localhost:5173/login');
      return;
    }
    
    console.log('✅ User authenticated:', session.user.email);
    console.log('   User ID:', session.user.id);

    // Step 2: Check existing data in healthcare tables
    console.log('\n2. Checking Existing Data in Healthcare Tables...');
    
    const tables = [
      'user_profiles',
      'user_goals', 
      'user_achievements',
      'user_skills'
    ];
    
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count || 0} records found`);
        if (data && data.length > 0) {
          console.log(`   Sample data:`, data[0]);
        }
      }
    }

    // Step 3: Test manual data insertion
    console.log('\n3. Testing Manual Data Insertion...');
    
    // Test user_profile creation
    console.log('   Testing user_profiles insertion...');
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: session.user.id,
        encrypted_username: 'Test User',
        encrypted_preferences: { theme: 'dark', test: true },
        points: 100,
        level: 1
      })
      .select();
    
    if (profileError) {
      console.log('❌ Profile insertion failed:', profileError.message);
    } else {
      console.log('✅ Profile insertion successful:', profileData);
    }

    // Test goal creation
    console.log('   Testing user_goals insertion...');
    const { data: goalData, error: goalError } = await supabase
      .from('user_goals')
      .insert({
        user_id: session.user.id,
        encrypted_title: 'Test Goal',
        encrypted_description: 'This is a test goal',
        category: 'personal',
        target_value: 100,
        current_progress: 10,
        is_active: true
      })
      .select();
    
    if (goalError) {
      console.log('❌ Goal insertion failed:', goalError.message);
    } else {
      console.log('✅ Goal insertion successful:', goalData);
    }

    // Test achievement creation
    console.log('   Testing user_achievements insertion...');
    const { data: achievementData, error: achievementError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: session.user.id,
        achievement_id: 'test-achievement',
        encrypted_title: 'Test Achievement',
        earned_at: new Date().toISOString(),
        points_awarded: 50
      })
      .select();
    
    if (achievementError) {
      console.log('❌ Achievement insertion failed:', achievementError.message);
    } else {
      console.log('✅ Achievement insertion successful:', achievementData);
    }

    // Step 4: Check Row Level Security policies
    console.log('\n4. Testing Row Level Security...');
    
    // Try to access another user's data (should fail)
    const { data: otherUserData, error: rlsError } = await supabase
      .from('user_profiles')
      .select('*')
      .neq('user_id', session.user.id)
      .limit(1);
    
    if (rlsError) {
      console.log('✅ RLS working - cannot access other users data:', rlsError.message);
    } else if (otherUserData && otherUserData.length === 0) {
      console.log('✅ RLS working - no other user data accessible');
    } else {
      console.log('⚠️  RLS may not be working properly - can access other user data');
    }

    // Step 5: Check if old localStorage data exists
    console.log('\n5. Checking for Old Data Storage Methods...');
    console.log('   Check browser localStorage for old data:');
    console.log('   - Open DevTools → Application → Local Storage');
    console.log('   - Look for keys like: goals, achievements, userProgress, etc.');

    console.log('\n🎯 Summary:');
    console.log('   If manual insertions work but app data doesn\'t save:');
    console.log('   1. Frontend may still be using localStorage instead of Supabase');
    console.log('   2. dataService.ts may not be properly integrated');
    console.log('   3. Frontend components may need updates for new schema');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugDataStorage();