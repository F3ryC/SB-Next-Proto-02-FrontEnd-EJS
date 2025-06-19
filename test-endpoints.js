const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
const TOKEN = 'dvf0fnQfeEPVbI28GPF5bQ4XjVn2';

async function testEndpoints() {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`
  };

  try {
    console.log('Testing Protected Endpoints...\n');

    // 1. Test Auth Profile Endpoint
    console.log('1. Testing /api/auth/profile:');
    try {
      const profileResponse = await axios.get(`${API_URL}/auth/profile`, { headers });
      console.log('✅ Profile Retrieved:', profileResponse.data);
    } catch (error) {
      console.error('❌ Profile Error:', error.response?.data || error.message);
    }

    // 2. Test Content Endpoint
    console.log('\n2. Testing /api/content:');
    try {
      const contentResponse = await axios.get(`${API_URL}/content`, { headers });
      console.log('✅ Content Retrieved:', contentResponse.data);
    } catch (error) {
      console.error('❌ Content Error:', error.response?.data || error.message);
    }

    // 3. Test Users Endpoint (requires admin role)
    console.log('\n3. Testing /api/users:');
    try {
      const usersResponse = await axios.get(`${API_URL}/users`, { headers });
      console.log('✅ Users Retrieved:', usersResponse.data);
    } catch (error) {
      console.error('❌ Users Error:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('General Error:', error.message);
  }
}

// Run the tests
testEndpoints(); 