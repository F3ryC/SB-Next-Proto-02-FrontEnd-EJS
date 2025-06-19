const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

console.log('Checking Firebase Configuration...');
console.log('--------------------------------');

// Check environment variables
const requiredVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_STORAGE_BUCKET'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Initialize Firebase Admin
try {
  const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  };

  console.log('Project ID:', serviceAccount.project_id);
  console.log('Client Email:', serviceAccount.client_email);
  console.log('Storage Bucket:', process.env.FIREBASE_STORAGE_BUCKET);

  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  });

  // Test Firebase Auth
  console.log('\nTesting Firebase Authentication...');
  admin.auth().listUsers(1)
    .then(() => {
      console.log('✅ Firebase Authentication is working');
      // Test Storage
      return admin.storage().bucket().exists();
    })
    .then(() => {
      console.log('✅ Firebase Storage is working');
      console.log('\n✅ All Firebase services are properly configured!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Firebase test failed:', error.message);
      console.error('\nDetailed error:', JSON.stringify(error, null, 2));
      process.exit(1);
    });

} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
} 