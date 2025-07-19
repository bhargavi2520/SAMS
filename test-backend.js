// Test script to verify backend endpoints
const axios = require('axios');

const BASE_URL = 'https://sams-5crs.onrender.com';

async function testEndpoints() {
  console.log('🔍 Testing SAMS Backend Endpoints...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Department HODs (should return 404 if not deployed)
    console.log('2. Testing Department HODs...');
    try {
      const hodsResponse = await axios.get(`${BASE_URL}/department/hods`);
      console.log('✅ HODs Endpoint:', hodsResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ HODs Endpoint: 404 Not Found - Backend not deployed with latest changes');
      } else {
        console.log('❌ HODs Endpoint Error:', error.message);
      }
    }
    console.log('');

    // Test 3: Department Assignments (should return 404 if not deployed)
    console.log('3. Testing Department Assignments...');
    try {
      const assignmentsResponse = await axios.get(`${BASE_URL}/department/assignments`);
      console.log('✅ Assignments Endpoint:', assignmentsResponse.data);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('❌ Assignments Endpoint: 404 Not Found - Backend not deployed with latest changes');
      } else {
        console.log('❌ Assignments Endpoint Error:', error.message);
      }
    }
    console.log('');

    // Test 4: Students Endpoint
    console.log('4. Testing Students Endpoint...');
    try {
      const studentsResponse = await axios.get(`${BASE_URL}/userData/students`);
      console.log('✅ Students Endpoint: Working');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Students Endpoint: Requires authentication (expected)');
      } else if (error.response?.status === 404) {
        console.log('❌ Students Endpoint: 404 Not Found');
      } else {
        console.log('❌ Students Endpoint Error:', error.message);
      }
    }
    console.log('');

    // Test 5: Check Timetable Endpoint
    console.log('5. Testing Check Timetable Endpoint...');
    try {
      const timetableResponse = await axios.get(`${BASE_URL}/userData/checkTimetable?department=CSE&year=1&section=1`);
      console.log('✅ Timetable Endpoint: Working');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Timetable Endpoint: Requires authentication (expected)');
      } else if (error.response?.status === 404) {
        console.log('❌ Timetable Endpoint: 404 Not Found');
      } else {
        console.log('❌ Timetable Endpoint Error:', error.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('- If you see 404 errors for /department/* endpoints, the backend needs to be deployed');
  console.log('- If you see authentication errors (401), that means the endpoints exist but need login');
  console.log('- If you see other errors, there might be a server issue');
}

// Run the test
testEndpoints(); 