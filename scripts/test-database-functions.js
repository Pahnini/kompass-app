// Test script for healthcare compliance database functions
// Run this after applying the migration to verify everything works

import { createClient } from '@supabase/supabase-js';

// Use local Supabase for testing
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseCompliance() {
  console.log('🔍 Testing Database Compliance Functions...\n');

  try {
    // Test 1: Check if extensions are enabled
    console.log('1. Testing Extensions...');
    const { data: extensions, error: extError } = await supabase
      .rpc('pg_extension', {})
      .single();
    
    if (extError) {
      console.log('⚠️  Extension check requires admin access');
    } else {
      console.log('✅ Extensions accessible');
    }

    // Test 2: Check if tables exist
    console.log('\n2. Testing Table Access...');
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact' })
      .limit(0);
      
    if (profileError) {
      console.log('❌ user_profiles table not accessible:', profileError.message);
    } else {
      console.log('✅ user_profiles table accessible');
    }

    // Test 3: Check if GDPR functions exist
    console.log('\n3. Testing GDPR Functions...');
    try {
      // This will fail if not authenticated, but we can check if function exists
      const { error: gdprError } = await supabase
        .rpc('gdpr_export_user_data', { user_uuid: 'test' });
      
      if (gdprError && gdprError.message.includes('Access denied')) {
        console.log('✅ gdpr_export_user_data function exists (access control working)');
      } else if (gdprError) {
        console.log('⚠️  gdpr_export_user_data error:', gdprError.message);
      }
    } catch (error) {
      console.log('❌ GDPR functions not available:', error.message);
    }

    // Test 4: Check if consent functions exist
    console.log('\n4. Testing Consent Functions...');
    try {
      const { error: consentError } = await supabase
        .rpc('record_user_consent', {
          consent_type_param: 'test',
          consent_granted_param: true
        });
      
      if (consentError && consentError.message.includes('authenticated')) {
        console.log('✅ record_user_consent function exists (auth working)');
      } else if (consentError) {
        console.log('⚠️  record_user_consent error:', consentError.message);
      }
    } catch (error) {
      console.log('❌ Consent functions not available:', error.message);
    }

    // Test 5: Check if audit_logs table exists
    console.log('\n5. Testing Audit Logging...');
    const { data: auditCount, error: auditError } = await supabase
      .from('audit_logs')
      .select('id', { count: 'exact' })
      .limit(0);
      
    if (auditError) {
      console.log('❌ audit_logs table not accessible:', auditError.message);
    } else {
      console.log('✅ audit_logs table accessible');
    }

    // Test 6: Check RLS policies
    console.log('\n6. Testing Row Level Security...');
    const { data: rlsTest, error: rlsError } = await supabase
      .from('user_goals')
      .select('id', { count: 'exact' })
      .limit(0);
      
    if (rlsError && rlsError.message.includes('RLS')) {
      console.log('✅ Row Level Security is active');
    } else if (rlsError) {
      console.log('⚠️  RLS test error:', rlsError.message);
    } else {
      console.log('✅ user_goals table accessible');
    }

    console.log('\n🎉 Database compliance testing completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Apply the migration via Supabase Dashboard');
    console.log('2. Test with authenticated user session');
    console.log('3. Verify GDPR functions work end-to-end');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testDatabaseCompliance();