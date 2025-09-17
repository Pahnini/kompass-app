// Check current database schema
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseSchema() {
  console.log('🔍 Checking Database Schema...\n');

  try {
    // Check what tables exist
    console.log('1. Checking existing tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name');

    if (tablesError) {
      console.log('❌ Cannot check tables:', tablesError.message);
    } else {
      console.log('✅ Existing tables:');
      tables.forEach(table => console.log(`   - ${table.table_name}`));
    }

    // Check specific table schemas that are causing issues
    const problematicTables = ['user_profiles', 'user_skills', 'user_achievements', 'user_goals'];
    
    for (const tableName of problematicTables) {
      console.log(`\n2. Checking ${tableName} schema...`);
      
      try {
        const { data: columns, error: columnsError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type, is_nullable')
          .eq('table_name', tableName)
          .eq('table_schema', 'public')
          .order('ordinal_position');

        if (columnsError) {
          console.log(`❌ Cannot check ${tableName} columns:`, columnsError.message);
        } else if (!columns || columns.length === 0) {
          console.log(`❌ Table ${tableName} does not exist`);
        } else {
          console.log(`✅ ${tableName} columns:`);
          columns.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
          });
        }
      } catch (tableError) {
        console.log(`❌ Error checking ${tableName}:`, tableError.message);
      }
    }

    // Test actual queries that are failing
    console.log('\n3. Testing problematic queries...');
    
    // Test user_profiles query
    console.log('\n   Testing user_profiles query...');
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ user_profiles query failed:', error.message);
        console.log('   Code:', error.code);
        console.log('   Details:', error.details);
      } else {
        console.log('✅ user_profiles query successful');
        console.log('   Sample structure:', data[0] ? Object.keys(data[0]) : 'No data');
      }
    } catch (profilesError) {
      console.log('❌ user_profiles query exception:', profilesError.message);
    }

    // Test user_skills query with is_deleted
    console.log('\n   Testing user_skills query with is_deleted...');
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .eq('is_deleted', false)
        .limit(1);
      
      if (error) {
        console.log('❌ user_skills query failed:', error.message);
        console.log('   Code:', error.code);
        console.log('   This confirms the is_deleted column is missing');
      } else {
        console.log('✅ user_skills query with is_deleted successful');
      }
    } catch (skillsError) {
      console.log('❌ user_skills query exception:', skillsError.message);
    }

    // Test user_skills query without is_deleted
    console.log('\n   Testing user_skills query without is_deleted...');
    try {
      const { data, error } = await supabase
        .from('user_skills')
        .select('*')
        .limit(1);
      
      if (error) {
        console.log('❌ user_skills basic query failed:', error.message);
      } else {
        console.log('✅ user_skills basic query successful');
        console.log('   Sample structure:', data[0] ? Object.keys(data[0]) : 'No data');
      }
    } catch (skillsError) {
      console.log('❌ user_skills basic query exception:', skillsError.message);
    }

  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

checkDatabaseSchema();