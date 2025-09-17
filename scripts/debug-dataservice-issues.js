// Debug dataService issues: duplicate key and decryption errors
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDataServiceIssues() {
  console.log('🔍 Debugging DataService Issues...\n');

  try {
    // Issue 1: Check unique constraints on user_goals
    console.log('1. Investigating unique constraint "unique_user_goal_id"...');
    
    // Check current data in user_goals
    const { data: goalsData, error: goalsError } = await supabase
      .from('user_goals')
      .select('*')
      .limit(10);

    if (goalsError) {
      console.log('❌ Cannot query user_goals:', goalsError.message);
    } else {
      console.log('✅ Current user_goals data:');
      console.log('   Total records:', goalsData.length);
      
      if (goalsData.length > 0) {
        console.log('   Sample record:');
        console.log('   -', JSON.stringify(goalsData[0], null, 2));
        
        // Check for duplicate goal_id values
        const goalIds = goalsData.map(goal => goal.goal_id);
        const uniqueGoalIds = new Set(goalIds);
        
        if (goalIds.length !== uniqueGoalIds.size) {
          console.log('❌ Found duplicate goal_id values!');
          const duplicates = goalIds.filter((id, index) => goalIds.indexOf(id) !== index);
          console.log('   Duplicates:', duplicates);
        } else {
          console.log('✅ No duplicate goal_id values found');
        }
      }
    }

    // Issue 2: Check symptoms table and decryption issues
    console.log('\n2. Investigating symptoms decryption errors...');
    
    const { data: symptomsData, error: symptomsError } = await supabase
      .from('user_symptoms')
      .select('*')
      .limit(5);

    if (symptomsError) {
      console.log('❌ Cannot query user_symptoms:', symptomsError.message);
    } else {
      console.log('✅ Current user_symptoms data:');
      console.log('   Total records:', symptomsData.length);
      
      if (symptomsData.length > 0) {
        console.log('   Sample encrypted data:');
        symptomsData.forEach((symptom, index) => {
          console.log(`   Record ${index + 1}:`);
          console.log('     - encrypted_symptom_data type:', typeof symptom.encrypted_symptom_data);
          console.log('     - encrypted_symptom_data content:', JSON.stringify(symptom.encrypted_symptom_data).substring(0, 100) + '...');
          console.log('     - is string?', typeof symptom.encrypted_symptom_data === 'string');
          console.log('     - starts with fallback?', symptom.encrypted_symptom_data?.toString().startsWith('fallback:'));
        });
      }
    }

    // Issue 3: Check constraints and indexes
    console.log('\n3. Checking database constraints...');
    
    // This might not work due to permissions, but let's try
    try {
      const { data: constraintsData, error: constraintsError } = await supabase
        .from('information_schema.table_constraints')
        .select('*')
        .eq('table_name', 'user_goals')
        .eq('constraint_type', 'UNIQUE');

      if (constraintsError) {
        console.log('⚠️ Cannot access constraint information:', constraintsError.message);
      } else {
        console.log('✅ Unique constraints on user_goals:');
        constraintsData.forEach(constraint => {
          console.log(`   - ${constraint.constraint_name}`);
        });
      }
    } catch (error) {
      console.log('⚠️ Cannot check constraints via REST API');
    }

    // Issue 4: Test encryption/decryption with current data
    console.log('\n4. Testing encryption/decryption...');
    
    if (symptomsData && symptomsData.length > 0) {
      const sampleEncryptedData = symptomsData[0].encrypted_symptom_data;
      console.log('   Testing decryption of sample data...');
      console.log('   Sample data type:', typeof sampleEncryptedData);
      console.log('   Sample data preview:', JSON.stringify(sampleEncryptedData).substring(0, 50) + '...');
      
      // Test if it's JSON that was stored as JSONB
      if (typeof sampleEncryptedData === 'object') {
        console.log('⚠️ Data is stored as JSONB object, not encrypted string!');
        console.log('   This explains the decryption error');
        console.log('   The encryptionService expects a string but receives an object');
      } else if (typeof sampleEncryptedData === 'string') {
        console.log('✅ Data is stored as string (correct for encryption)');
      }
    }

    console.log('\n📊 Issue Analysis Summary:');
    console.log('');
    
    console.log('Issue 1 - Duplicate Key Error:');
    if (goalsData && goalsData.length > 0) {
      console.log('✅ Can investigate - found existing goals data');
    } else {
      console.log('⚠️ No existing goals data to analyze');
    }
    
    console.log('');
    console.log('Issue 2 - Decryption Error:');
    if (symptomsData && symptomsData.length > 0) {
      const sampleData = symptomsData[0].encrypted_symptom_data;
      if (typeof sampleData === 'object') {
        console.log('❌ Root cause identified: Data stored as JSONB object instead of encrypted string');
        console.log('🔧 Fix needed: Update dataService to handle JSONB vs encrypted string properly');
      } else {
        console.log('✅ Data format looks correct');
      }
    } else {
      console.log('⚠️ No symptoms data to analyze');
    }

  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugDataServiceIssues();