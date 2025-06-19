const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' }); // Ensure .env is loaded

const API_URL = 'http://localhost:3000/api/mailchimp';

// Make sure to set these in your .env for this test to run completely
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;


async function testMailchimpSubscription() {
  console.log('Testing Mailchimp Subscription...\n');

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_LIST_ID) {
    console.warn('⚠️  Skipping Mailchimp tests: MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, or MAILCHIMP_LIST_ID not set in .env');
    return;
  }

  const testEmailNew = `new_subscriber_${Date.now()}@example.com`;
  const testEmailExisting = `existing_subscriber_${Date.now()}@example.com`; // For re-subscription test

  // 1. Test subscribing a new email
  console.log('1. Subscribing a new email:');
  try {
    const responseNew = await axios.post(`${API_URL}/subscribe`, {
      email: testEmailNew,
      firstName: 'Test',
      lastName: 'UserNew',
    });
    console.log('✅ Subscription successful (new):', responseNew.data.message);
    // console.log('   Detail:', responseNew.data.detail);
  } catch (error) {
    console.error('❌ Subscription error (new):', error.response?.data || error.message);
  }

  // 2. Test subscribing an existing email (should update or indicate already subscribed)
  console.log('\n2. Attempting to re-subscribe an email (first time for this one, then again):');
  try {
    // First subscription
    await axios.post(`${API_URL}/subscribe`, {
      email: testEmailExisting,
      firstName: 'Test',
      lastName: 'UserExisting',
    });
    console.log('   ✅ Initial subscription successful for:', testEmailExisting);

    // Attempt re-subscription
    const responseExisting = await axios.post(`${API_URL}/subscribe`, {
      email: testEmailExisting,
      firstName: 'Test',
      lastName: 'UserExistingUpdated', // e.g. updated name
    });
    console.log('✅ Re-subscription attempt processed:', responseExisting.data.message);
     // console.log('   Detail:', responseExisting.data.detail);
  } catch (error) {
    // If it's a 409 (Conflict), it means "Member Exists" which is an expected outcome for a re-subscribe.
    if (error.response && error.response.status === 409) {
        console.log('✅ Re-subscription attempt (expected):', error.response.data.message);
    } else {
        console.error('❌ Re-subscription error (unexpected):', error.response?.data || error.message);
    }
  }
  
  // 3. Test subscribing with a missing email
  console.log('\n3. Subscribing with missing email:');
  try {
    await axios.post(`${API_URL}/subscribe`, {
      firstName: 'No',
      lastName: 'Email',
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Correctly handled missing email:', error.response.data.message);
    } else {
      console.error('❌ Error handling missing email (unexpected):', error.response?.data || error.message);
    }
  }

  // 4. Test subscribing with an invalid email format
  console.log('\n4. Subscribing with invalid email format:');
  try {
    await axios.post(`${API_URL}/subscribe`, {
      email: 'invalid-email',
      firstName: 'Bad',
      lastName: 'Email',
    });
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.message.toLowerCase().includes('invalid email')) {
      console.log('✅ Correctly handled invalid email:', error.response.data.message);
    } else if (error.response && error.response.status === 500 && error.response.data.message.toLowerCase().includes('failed to subscribe')) {
        // This can happen if Mailchimp itself rejects the format deeper in the call
         console.log('✅ Correctly handled invalid email (via Mailchimp rejection):', error.response.data.message);
    }
    else {
      console.error('❌ Error handling invalid email (unexpected):', error.response?.data || error.message);
    }
  }
}

async function testGetMailchimpLists() {
  console.log('\n\nTesting Get Mailchimp Lists (Admin/Info)...\n');

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX) {
    console.warn('⚠️  Skipping Get Mailchimp Lists: MAILCHIMP_API_KEY or MAILCHIMP_SERVER_PREFIX not set in .env');
    return;
  }
  
  console.log('Fetching Mailchimp Lists (requires API key and server prefix in .env):');
  try {
    const response = await axios.get(`${API_URL}/lists`);
    if (response.data && Array.isArray(response.data)) {
        console.log(`✅ Successfully fetched ${response.data.length} Mailchimp list(s).`);
        response.data.forEach(list => {
            console.log(`   - List Name: ${list.name}, ID: ${list.id}, Members: ${list.stats?.member_count || 'N/A'}`);
        });
    } else {
        console.log('✅ Get lists request successful, but unexpected data format received:', response.data);
    }
  } catch (error) {
    console.error('❌ Error fetching Mailchimp lists:', error.response?.data || error.message);
  }
}


async function runTests() {
  await testMailchimpSubscription();
  await testGetMailchimpLists();
  console.log("\nMailchimp tests complete. Check .env if tests were skipped.");
}

runTests(); 