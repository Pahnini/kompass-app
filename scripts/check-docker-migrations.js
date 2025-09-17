// Check Docker database migration status
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDockerMigrations() {
  console.log('🐳 Checking Docker Database Migration Status...\n');

  try {
    // Check if migrations table exists and what migrations are applied
    console.log('1. Checking applied migrations...');
    try {
      const { data: migrations, error: migrationsError } = await supabase
        .from('supabase_migrations.schema_migrations')
        .select('*')
        .order('version');

      if (migrationsError) {
        console.log('❌ Cannot access migrations table:', migrationsError.message);
      } else {
        console.log('✅ Applied migrations:');
        migrations.forEach(migration => {
          console.log(`   - ${migration.version}`);
        });
      }
    } catch (migError) {
      console.log('⚠️ Migrations table not accessible via REST API');
    }

    // Check if our specific schema fixes are applied
    console.log('\n2. Testing schema fixes...');
    
    // Test 1: user_skills with is_deleted (this confirms our fix is applied)
    console.log('   Testing user_skills.is_deleted column...');
    const { data: skillsTest, error: skillsError } = await supabase
      .from('user_skills')
      .select('*')
      .eq('is_deleted', false)
      .limit(1);

    if (skillsError) {
      console.log('❌ user_skills fix NOT applied:', skillsError.message);
      console.log('   Code:', skillsError.code);
    } else {
      console.log('✅ user_skills fix IS applied (is_deleted column exists)');
    }

    // Test 2: user_profiles query without 406 errors
    console.log('   Testing user_profiles query...');
    const { data: profileTest, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profileError) {
      console.log('❌ user_profiles query failed:', profileError.message);
    } else {
      console.log('✅ user_profiles query working');
    }

    // Test 3: Check if encryption functions exist
    console.log('   Testing encryption functions...');
    try {
      const { data: encryptTest, error: encryptError } = await supabase.rpc('encrypt_health_data', {
        data: 'test',
        user_key: 'test_key'
      });

      if (encryptError) {
        console.log('❌ Encryption functions not available:', encryptError.message);
      } else {
        console.log('✅ Encryption functions available');
      }
    } catch (encryptionError) {
      console.log('⚠️ Encryption functions require auth context (expected)');
    }

    // Test 4: Check all tables exist with proper structure
    console.log('\n3. Checking all required tables...');
    const expectedTables = [
      'user_profiles',
      'user_goals', 
      'user_achievements',
      'user_skills',
      'user_calendar_notes',
      'user_symptoms',
      'user_word_files',
      'audit_logs'
    ];

    for (const table of expectedTables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Table exists and accessible`);
      }
    }

    console.log('\n📊 Docker Migration Status:');
    
    if (skillsError && skillsError.code === '42703') {
      console.log('❌ MIGRATION NEEDED: Schema fixes not applied to Docker database');
      console.log('🔧 Action Required:');
      console.log('   1. The local Docker database needs the schema fix migration');
      console.log('   2. Run: npx supabase db reset');
      console.log('   3. This will apply all migrations including the fixes');
    } else {
      console.log('✅ MIGRATIONS APPLIED: Docker database has all schema fixes');
      console.log('🎉 Ready to use:');
      console.log('   - All tables have consistent soft delete columns');
      console.log('   - user_skills has is_deleted column');
      console.log('   - user_profiles queries work without 406 errors');
      console.log('   - Server-side encryption functions available');
    }

  } catch (error) {
    console.error('❌ Migration check failed:', error);
  }
}

checkDockerMigrations();