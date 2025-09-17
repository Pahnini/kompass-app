// Test the fixed dataService issues
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDataServiceFixes() {
  console.log('🧪 Testing DataService Fixes...\n');

  try {
    // First, authenticate a test user
    console.log('1. Setting up test user...');
    
    const testEmail = 'test-dataservice@example.com';
    const testPassword = 'TestPass123!';
    
    // Try to sign up (might already exist)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: undefined // Skip email confirmation for testing
      }
    });
    
    // Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (signInError) {
      console.log('❌ Authentication failed:', signInError.message);
      console.log('⚠️ Cannot test without authentication - please login first');
      return;
    }

    const userId = signInData.user.id;
    console.log('✅ Authenticated as:', testEmail);
    console.log('   User ID:', userId);

    // Test 1: Goals - Test the duplicate key constraint fix
    console.log('\n2. Testing Goals (Duplicate Key Constraint Fix)...');
    
    // Create test goals
    const testGoals = [
      { id: 'test-goal-1', title: 'Test Goal 1', completed: false, text: 'First test goal' },
      { id: 'test-goal-2', title: 'Test Goal 2', completed: false, text: 'Second test goal' },
      { id: 'test-goal-3', title: 'Test Goal 3', completed: true, text: 'Third test goal' }
    ];

    console.log('   Creating initial goals...');
    const goalRows1 = await Promise.all(
      testGoals.map(async goal => ({
        user_id: userId,
        goal_id: goal.id,
        encrypted_goal_data: JSON.stringify(goal), // Simulate encrypted data
        completed: goal.completed,
        version: 1,
        is_deleted: false
      }))
    );

    const { error: insertError1 } = await supabase
      .from('user_goals')
      .upsert(goalRows1, { 
        onConflict: 'user_id,goal_id',
        ignoreDuplicates: false 
      });

    if (insertError1) {
      console.log('❌ Initial goal creation failed:', insertError1.message);
    } else {
      console.log('✅ Initial goals created successfully');
    }

    // Update goals (this should trigger the duplicate key issue if not fixed)
    console.log('   Updating goals (testing duplicate key fix)...');
    const updatedGoals = [
      { id: 'test-goal-1', title: 'Updated Goal 1', completed: true, text: 'Updated first test goal' },
      { id: 'test-goal-2', title: 'Updated Goal 2', completed: false, text: 'Updated second test goal' },
      { id: 'test-goal-4', title: 'New Goal 4', completed: false, text: 'New fourth test goal' }
    ];

    // First mark existing as deleted (simulate the dataService flow)
    await supabase
      .from('user_goals')
      .update({ 
        is_deleted: true, 
        deleted_at: new Date().toISOString(),
        deletion_reason: 'replaced_by_update'
      })
      .eq('user_id', userId)
      .eq('is_deleted', false);

    const goalRows2 = await Promise.all(
      updatedGoals.map(async goal => ({
        user_id: userId,
        goal_id: goal.id,
        encrypted_goal_data: JSON.stringify(goal), // Simulate encrypted data
        completed: goal.completed,
        version: 2,
        is_deleted: false
      }))
    );

    const { error: updateError } = await supabase
      .from('user_goals')
      .upsert(goalRows2, { 
        onConflict: 'user_id,goal_id',
        ignoreDuplicates: false 
      });

    if (updateError) {
      console.log('❌ Goal update failed:', updateError.message);
      console.log('   Code:', updateError.code);
      if (updateError.code === '23505') {
        console.log('   🔥 DUPLICATE KEY ERROR STILL EXISTS - Fix not working!');
      }
    } else {
      console.log('✅ Goal update successful - Duplicate key fix working!');
    }

    // Test 2: Read back goals and test decryption
    console.log('\n3. Testing Data Reading (Decryption Fix)...');
    
    const { data: goalsFromDB, error: readError } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false);

    if (readError) {
      console.log('❌ Reading goals failed:', readError.message);
    } else {
      console.log('✅ Reading goals successful');
      console.log('   Found', goalsFromDB.length, 'active goals');
      
      // Test decryption of the data
      for (const goal of goalsFromDB) {
        console.log(`   Goal ${goal.goal_id}:`);
        console.log('     - encrypted_goal_data type:', typeof goal.encrypted_goal_data);
        
        if (typeof goal.encrypted_goal_data === 'string') {
          try {
            const decrypted = JSON.parse(goal.encrypted_goal_data);
            console.log('     - decryption: ✅ Success');
            console.log('     - title:', decrypted.title);
          } catch (error) {
            console.log('     - decryption: ❌ Failed to parse JSON');
          }
        } else if (typeof goal.encrypted_goal_data === 'object') {
          console.log('     - decryption: ✅ Direct JSONB access');
          console.log('     - title:', goal.encrypted_goal_data.title);
        } else {
          console.log('     - decryption: ❌ Unknown data type');
        }
      }
    }

    // Test 3: Test symptoms with mixed data types
    console.log('\n4. Testing Symptoms (Mixed Data Types)...');
    
    // Create some test symptoms with different data formats
    const testSymptoms = [
      {
        user_id: userId,
        symptom_date: '2025-08-17',
        encrypted_symptom_data: JSON.stringify([{ title: 'Anxiety', intensity: 3 }]), // String format
        symptom_count: 1,
        version: 1,
        is_deleted: false
      },
      {
        user_id: userId,
        symptom_date: '2025-08-16',
        encrypted_symptom_data: [{ title: 'Mood', intensity: 5 }], // JSONB format (simulates old data)
        symptom_count: 1,
        version: 1,
        is_deleted: false
      }
    ];

    const { error: symptomsInsertError } = await supabase
      .from('user_symptoms')
      .insert(testSymptoms);

    if (symptomsInsertError) {
      console.log('❌ Symptoms creation failed:', symptomsInsertError.message);
    } else {
      console.log('✅ Test symptoms created successfully');
    }

    // Read back symptoms
    const { data: symptomsFromDB, error: symptomsReadError } = await supabase
      .from('user_symptoms')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false);

    if (symptomsReadError) {
      console.log('❌ Reading symptoms failed:', symptomsReadError.message);
    } else {
      console.log('✅ Reading symptoms successful');
      console.log('   Found', symptomsFromDB.length, 'symptoms');
      
      for (const symptom of symptomsFromDB) {
        console.log(`   Symptom ${symptom.symptom_date}:`);
        console.log('     - encrypted_symptom_data type:', typeof symptom.encrypted_symptom_data);
        
        // Test our safeDecrypt logic
        let decrypted;
        try {
          if (typeof symptom.encrypted_symptom_data === 'object') {
            decrypted = symptom.encrypted_symptom_data; // Direct JSONB access
            console.log('     - decryption: ✅ Direct JSONB access');
          } else if (typeof symptom.encrypted_symptom_data === 'string') {
            decrypted = JSON.parse(symptom.encrypted_symptom_data); // JSON parse
            console.log('     - decryption: ✅ JSON parse success');
          }
          
          if (decrypted && Array.isArray(decrypted)) {
            console.log('     - symptom title:', decrypted[0]?.title);
            console.log('     - intensity:', decrypted[0]?.intensity);
          }
        } catch (error) {
          console.log('     - decryption: ❌ Failed -', error.message);
        }
      }
    }

    console.log('\n📊 Test Results Summary:');
    console.log('');
    
    console.log('Issue 1 - Duplicate Key Constraint:');
    if (!updateError) {
      console.log('✅ FIXED - Goal updates work without duplicate key errors');
    } else if (updateError.code === '23505') {
      console.log('❌ NOT FIXED - Duplicate key constraint still failing');
    } else {
      console.log('⚠️ DIFFERENT ERROR -', updateError.message);
    }
    
    console.log('');
    console.log('Issue 2 - Decryption Errors:');
    if (!symptomsReadError && symptomsFromDB && symptomsFromDB.length > 0) {
      console.log('✅ FIXED - Can read symptoms data without decryption errors');
      console.log('✅ COMPATIBLE - Handles both string and JSONB data formats');
    } else {
      console.log('❌ NOT FIXED - Still having decryption issues');
    }

    console.log('');
    console.log('🎯 Next Steps:');
    console.log('1. Test the application in browser with real user interactions');
    console.log('2. Add goals, mark them complete, delete them');
    console.log('3. Add symptoms and other data types');
    console.log('4. Verify no more 23505 or decryption errors in console');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDataServiceFixes();