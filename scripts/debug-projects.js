// Debug script to test projects data
const axios = require('axios');

async function debugProjects() {
  try {
    console.log('🔍 Debugging Projects Data...');
    
    // Test API endpoints
    const projectsResponse = await axios.get('http://localhost:5001/api/projects');
    const clientsResponse = await axios.get('http://localhost:5001/api/clients');
    
    console.log('\n📁 Projects Data:');
    projectsResponse.data.forEach((project, index) => {
      console.log(`${index + 1}. ${project.name}`);
      console.log(`   Type: "${project.type}"`);
      console.log(`   Status: "${project.status}"`);
      console.log(`   Client ID: ${project.clientId || 'undefined'}`);
      console.log('');
    });
    
    console.log('🏢 Clients Data:');
    clientsResponse.data.forEach((client, index) => {
      console.log(`${index + 1}. ${client.companyName} (ID: ${client.id})`);
    });
    
    console.log('\n✅ API endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugProjects();