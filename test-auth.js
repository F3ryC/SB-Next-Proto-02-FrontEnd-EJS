const admin = require('./src/config/firebase');

async function createTestToken() {
  try {
    console.log('Creating/retrieving test user...');
    
    // Create a test user or use an existing one
    const testUser = await admin.auth().createUser({
      email: 'test@example.com',
      password: 'testpassword123',
      displayName: 'Test User'
    }).catch(error => {
      if (error.code === 'auth/email-already-exists') {
        console.log('User already exists, retrieving...');
        return admin.auth().getUserByEmail('test@example.com');
      }
      throw error;
    });

    console.log('\nTest User Created/Retrieved:');
    console.log('---------------------------');
    console.log('UID:', testUser.uid);
    console.log('Email:', testUser.email);
    console.log('Display Name:', testUser.displayName);

    // Set custom claims for the user
    await admin.auth().setCustomUserClaims(testUser.uid, {
      role: 'admin'
    });

    // Output just the token for easy parsing
    console.log(`TOKEN=${testUser.uid}`);

  } catch (error) {
    console.error('\nError:', error);
    if (error.errorInfo) {
      console.error('Firebase Error:', error.errorInfo);
    }
    process.exit(1);
  }
}

createTestToken(); 