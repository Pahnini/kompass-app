// Debug user_profiles 406 errors
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUserProfiles() {
  console.log('🔍 Debugging user_profiles 406 errors...\n');

  const testUserId = 'eb2ce711-f16d-430b-b461-8bef0697422b'; // From the logs

  try {
    // Test 1: Basic query without single()
    console.log('1. Testing basic user_profiles query...');
    const { data: basicData, error: basicError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', testUserId);

    console.log('   Basic query result:');
    console.log('   Data:', basicData);
    console.log('   Error:', basicError);

    // Test 2: Query with single() - this is what's causing 406
    console.log('\n2. Testing user_profiles query with .single()...');
    const { data: singleData, error: singleError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', testUserId)
      .single();

    console.log('   Single query result:');
    console.log('   Data:', singleData);
    console.log('   Error:', singleError);
    console.log('   Error code:', singleError?.code);

    // Test 3: Query with maybeSingle() - better approach
    console.log('\n3. Testing user_profiles query with .maybeSingle()...');
    const { data: maybeData, error: maybeError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', testUserId)
      .maybeSingle();

    console.log('   MaybeSingle query result:');
    console.log('   Data:', maybeData);
    console.log('   Error:', maybeError);

    // Test 4: Create a user profile for testing
    console.log('\n4. Creating test user profile...');
    const { data: insertData, error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: testUserId,
        points: 0,
        level: 1,
        level_progress: 0.0
      })
      .select()
      .single();

    console.log('   Insert result:');
    console.log('   Data:', insertData);
    console.log('   Error:', insertError);

    if (!insertError && insertData) {
      // Test 5: Query again after creating the profile
      console.log('\n5. Testing query after profile creation...');
      const { data: afterData, error: afterError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', testUserId)
        .single();

      console.log('   After creation result:');
      console.log('   Data:', afterData);
      console.log('   Error:', afterError);
    }

    // Analysis
    console.log('\n📊 Analysis:');
    if (singleError?.code === 'PGRST116') {
      console.log('✅ 406 error is caused by .single() when no rows exist');
      console.log('✅ This is expected behavior - not a bug');
      console.log('✅ Solution: Use .maybeSingle() or handle PGRST116 error code');
    } else if (singleError?.code) {
      console.log('❌ Unexpected error code:', singleError.code);
      console.log('❌ Message:', singleError.message);
    } else {
      console.log('✅ No errors found - user_profiles is working correctly');
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugUserProfiles();