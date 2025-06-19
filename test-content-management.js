const axios = require('axios');

const API_URL = 'http://localhost:3000/api';
const TOKEN = 'dvf0fnQfeEPVbI28GPF5bQ4XjVn2';

const headers = {
  'Authorization': `Bearer ${TOKEN}`
};

// Test data for a new content item
const newContent = {
  title: "Music Theory Quiz",
  description: "Test your music theory knowledge with this comprehensive quiz covering basic to advanced concepts.",
  category: "quiz",
  contentType: "interactive",
  tags: ["theory", "quiz", "assessment", "all-levels"],
  featured: false,
  publishedAt: new Date().toISOString(),
  thumbnailUrl: "https://example.com/theory-quiz-thumb.jpg",
  contentUrl: "/quizzes/music-theory"
};

async function testContentManagement() {
  try {
    console.log('Testing Content Management Operations...\n');

    // 1. Create new content
    console.log('1. Creating new content:');
    let createdContent;
    try {
      const createResponse = await axios.post(`${API_URL}/content`, newContent, { headers });
      createdContent = createResponse.data;
      console.log('✅ Content Created:', createdContent);
    } catch (error) {
      console.error('❌ Create Error:', error.response?.data || error.message);
      return;
    }

    // 2. Update content
    console.log('\n2. Updating content:');
    try {
      const updateData = {
        ...createdContent,
        title: "Advanced Music Theory Quiz",
        featured: true
      };
      const updateResponse = await axios.put(`${API_URL}/content/${createdContent.id}`, updateData, { headers });
      console.log('✅ Content Updated:', updateResponse.data);
    } catch (error) {
      console.error('❌ Update Error:', error.response?.data || error.message);
    }

    // 3. Get specific content
    console.log('\n3. Getting updated content:');
    try {
      const getResponse = await axios.get(`${API_URL}/content/${createdContent.id}`, { headers });
      console.log('✅ Content Retrieved:', getResponse.data);
    } catch (error) {
      console.error('❌ Get Error:', error.response?.data || error.message);
    }

    // 4. Delete content
    console.log('\n4. Deleting content:');
    try {
      const deleteResponse = await axios.delete(`${API_URL}/content/${createdContent.id}`, { headers });
      console.log('✅ Content Deleted:', deleteResponse.data);
    } catch (error) {
      console.error('❌ Delete Error:', error.response?.data || error.message);
    }

    // 5. Verify deletion
    console.log('\n5. Verifying deletion:');
    try {
      await axios.get(`${API_URL}/content/${createdContent.id}`, { headers });
      console.error('❌ Content still exists');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Content successfully deleted (404 Not Found)');
      } else {
        console.error('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

  } catch (error) {
    console.error('General Error:', error.message);
  }
}

// Run the tests
testContentManagement(); 