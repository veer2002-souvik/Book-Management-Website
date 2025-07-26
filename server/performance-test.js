const axios = require('axios');

const API_BASE = 'http://localhost:5000';

async function testPerformance() {
  console.log('🚀 Starting Performance Tests...\n');

  // Test 1: GET /books performance with response size
  console.log('📊 Testing GET /books endpoint...');
  const getStart = Date.now();
  try {
    const response = await axios.get(`${API_BASE}/books`);
    const getDuration = Date.now() - getStart;
    const responseSize = JSON.stringify(response.data).length;
    
    console.log(`✅ GET /books: ${getDuration}ms`);
    console.log(`   - Response Size: ${responseSize} bytes`);
    console.log(`   - Books Retrieved: ${response.data.length}`);
    if (response.data.length > 0) {
      console.log(`   - Average Book Size: ${Math.round(responseSize / response.data.length)} bytes`);
    }
  } catch (error) {
    console.log('❌ GET /books failed:', error.message);
  }

  // Test 2: POST /books performance with response size
  console.log('\n📊 Testing POST /books endpoint...');
  const postStart = Date.now();
  try {
    const testBook = {
      title: `Test Book ${Date.now()}`,
      author: 'Performance Tester',
      description: 'This is a test book for performance testing with detailed metrics and response size analysis',
      status: 'Reading'
    };
    const response = await axios.post(`${API_BASE}/books`, testBook);
    const postDuration = Date.now() - postStart;
    const responseSize = JSON.stringify(response.data).length;
    
    console.log(`✅ POST /books: ${postDuration}ms`);
    console.log(`   - Response Size: ${responseSize} bytes`);
    console.log(`   - Book ID: ${response.data._id}`);
  } catch (error) {
    console.log('❌ POST /books failed:', error.message);
  }

  // Test 3: Multiple concurrent requests with size analysis
  console.log('\n📊 Testing concurrent requests...');
  const concurrentStart = Date.now();
  try {
    const promises = Array(5).fill().map(() => axios.get(`${API_BASE}/books`));
    const responses = await Promise.all(promises);
    const concurrentDuration = Date.now() - concurrentStart;
    
    const totalSize = responses.reduce((sum, res) => sum + JSON.stringify(res.data).length, 0);
    const avgSize = Math.round(totalSize / responses.length);
    
    console.log(`✅ 5 concurrent GET requests: ${concurrentDuration}ms`);
    console.log(`   - Total Response Size: ${totalSize} bytes`);
    console.log(`   - Average Response Size: ${avgSize} bytes`);
  } catch (error) {
    console.log('❌ Concurrent requests failed:', error.message);
  }

  // Test 4: Large dataset simulation
  console.log('\n📊 Testing with large dataset simulation...');
  try {
    // Add multiple test books to simulate larger dataset
    const testBooks = Array(10).fill().map((_, i) => ({
      title: `Large Dataset Book ${i + 1}`,
      author: 'Performance Tester',
      description: 'This is a test book for large dataset performance testing. '.repeat(10),
      status: i % 2 === 0 ? 'Reading' : 'Completed'
    }));
    
    const insertStart = Date.now();
    const insertPromises = testBooks.map(book => axios.post(`${API_BASE}/books`, book));
    await Promise.all(insertPromises);
    const insertDuration = Date.now() - insertStart;
    
    console.log(`✅ Inserted ${testBooks.length} test books: ${insertDuration}ms`);
    
    // Test retrieval of larger dataset
    const retrieveStart = Date.now();
    const largeResponse = await axios.get(`${API_BASE}/books`);
    const retrieveDuration = Date.now() - retrieveStart;
    const largeResponseSize = JSON.stringify(largeResponse.data).length;
    
    console.log(`✅ Retrieved ${largeResponse.data.length} books: ${retrieveDuration}ms`);
    console.log(`   - Total Response Size: ${largeResponseSize} bytes`);
    console.log(`   - Average Book Size: ${Math.round(largeResponseSize / largeResponse.data.length)} bytes`);
    
  } catch (error) {
    console.log('❌ Large dataset test failed:', error.message);
  }

  console.log('\n🎯 Performance test completed!');
}

// Run performance test
testPerformance().catch(console.error); 