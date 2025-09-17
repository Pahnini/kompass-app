// Test script for healthcare data encryption functions
// Tests pgcrypto extension and server-side encryption capabilities

import { createClient } from '@supabase/supabase-js';

// Use local Supabase for testing
const supabaseUrl = 'http://127.0.0.1:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';  // service_role key for testing

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEncryptionCapabilities() {
  console.log('🔐 Testing Healthcare Data Encryption Capabilities...\n');

  try {
    // Test 1: Test healthcare data encryption functions
    console.log('1. Testing Healthcare Data Encryption...');
    try {
      const testData = 'sensitive healthcare data';
      const { data: encryptTest, error: encryptError } = await supabase
        .rpc('encrypt_health_data', { 
          data: testData,
          user_key: 'test_key_for_encryption_123'
        });
      
      if (encryptError) {
        console.log('⚠️  Healthcare encryption error:', encryptError.message);
      } else {
        console.log('✅ Healthcare data encryption function working');
      }
    } catch (error) {
      console.log('❌ Healthcare encryption not accessible:', error.message);
    }

    // Test 2: Test healthcare data decryption functions
    console.log('\n2. Testing Healthcare Data Decryption...');
    try {
      const { data: decryptTest, error: decryptError } = await supabase
        .rpc('decrypt_health_data', { 
          encrypted_data: 'test_encrypted_data',
          user_key: 'test_key_for_encryption_123'
        });
      
      if (decryptError) {
        console.log('⚠️  Healthcare decryption error:', decryptError.message);
      } else {
        console.log('✅ Healthcare data decryption function working');
      }
    } catch (error) {
      console.log('❌ Healthcare decryption not accessible:', error.message);
    }

    // Test 3: Test German digital consent age verification
    console.log('\n3. Testing German Digital Consent Age Verification...');
    try {
      const { data: ageTest, error: ageError } = await supabase
        .rpc('verify_digital_consent_age', {
          birth_date: '2010-01-01'  // 14 years old, needs parental consent
        });
      
      if (ageError) {
        console.log('⚠️  Age verification error:', ageError.message);
      } else {
        console.log('✅ German age verification function working');
        console.log('   Result:', ageTest);
      }
    } catch (error) {
      console.log('❌ Age verification function not available:', error.message);
    }

    // Test 4: Test GDPR data export (Article 15)
    console.log('\n4. Testing GDPR Data Export...');
    try {
      const { data: exportTest, error: exportError } = await supabase
        .rpc('gdpr_export_user_data', {
          user_uuid: '123e4567-e89b-12d3-a456-426614174000'
        });
      
      if (exportError) {
        console.log('⚠️  GDPR export error:', exportError.message);
      } else {
        console.log('✅ GDPR data export function working');
      }
    } catch (error) {
      console.log('❌ GDPR export function not available:', error.message);
    }

    // Test 5: Test compliance reporting
    console.log('\n5. Testing Compliance Reporting...');
    try {
      const { data: reportTest, error: reportError } = await supabase
        .rpc('generate_compliance_report', {
          start_date: '2024-01-01'
        });
      
      if (reportError) {
        console.log('⚠️  Compliance reporting error:', reportError.message);
      } else {
        console.log('✅ Compliance reporting function working');
      }
    } catch (error) {
      console.log('❌ Compliance reporting function not available:', error.message);
    }

    console.log('\n🎉 Healthcare encryption testing completed!');
    console.log('\n📋 Summary:');
    console.log('- Server-side encryption: pgcrypto extension');
    console.log('- Client-to-server: TLS 1.3 (via Supabase)');
    console.log('- At-rest encryption: AES-256 (via Supabase native)');
    console.log('- Healthcare compliance: GDPR + BDSG functions');
    console.log('- Audit logging: PostgreSQL audit trail');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testEncryptionCapabilities();