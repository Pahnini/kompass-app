// Test pgcrypto encryption functions
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPgcrypto() {
  console.log('🔐 Testing Server-Side pgcrypto Encryption...\n');

  try {
    // First, authenticate a user
    console.log('0. Authenticating user...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('❌ No authenticated user. Please login first at http://localhost:5173/login');
      return;
    }
    
    console.log('✅ User authenticated:', session.user.email);
    console.log('   User ID:', session.user.id);

    const testData = 'This is sensitive healthcare data that should be encrypted';
    const userKey = `healthcare_key_${session.user.id}_development`;

    console.log('\n1. Testing encryption...');
    console.log('   Original data:', testData);

    const { data: encryptedData, error: encryptError } = await supabase.rpc('encrypt_health_data', {
      data: testData,
      user_key: userKey
    });

    if (encryptError) {
      console.log('❌ Encryption failed:', encryptError.message);
      return;
    }

    console.log('✅ Encryption successful');
    console.log('   Encrypted data:', encryptedData);
    console.log('   Is encrypted?', encryptedData !== testData ? 'YES' : 'NO');

    console.log('\n2. Testing decryption...');
    const { data: decryptedData, error: decryptError } = await supabase.rpc('decrypt_health_data', {
      encrypted_data: encryptedData,
      user_key: userKey
    });

    if (decryptError) {
      console.log('❌ Decryption failed:', decryptError.message);
      return;
    }

    console.log('✅ Decryption successful');
    console.log('   Decrypted data:', decryptedData);
    console.log('   Data matches?', decryptedData === testData ? 'YES' : 'NO');

    if (decryptedData === testData) {
      console.log('\n🎉 pgcrypto server-side encryption is WORKING!');
      console.log('✅ Data is properly encrypted and decrypted');
      console.log('✅ Ready to implement in encryptionService');
    } else {
      console.log('\n❌ pgcrypto encryption has issues');
      console.log('   Original:', testData);
      console.log('   Decrypted:', decryptedData);
    }

  } catch (error) {
    console.error('❌ pgcrypto test failed:', error);
  }
}

testPgcrypto();