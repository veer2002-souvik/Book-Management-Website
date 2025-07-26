require('dotenv').config();
const mongoose = require('mongoose');
const Book = require('./models/Book.js');

async function analyzeQuerySizes() {
  console.log('🔍 MongoDB Query Size Analysis\n');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Test 1: Find all books
    console.log('📊 Test 1: Find All Books');
    const start1 = Date.now();
    const allBooks = await Book.find();
    const time1 = Date.now() - start1;
    const size1 = JSON.stringify(allBooks).length;
    
    console.log(`   - Query Time: ${time1}ms`);
    console.log(`   - Response Size: ${size1} bytes`);
    console.log(`   - Records: ${allBooks.length}`);
    if (allBooks.length > 0) {
      console.log(`   - Average Record Size: ${Math.round(size1 / allBooks.length)} bytes`);
    }
    
    // Test 2: Find by status
    console.log('\n📊 Test 2: Find by Status (Reading)');
    const start2 = Date.now();
    const readingBooks = await Book.find({ status: 'Reading' });
    const time2 = Date.now() - start2;
    const size2 = JSON.stringify(readingBooks).length;
    
    console.log(`   - Query Time: ${time2}ms`);
    console.log(`   - Response Size: ${size2} bytes`);
    console.log(`   - Records: ${readingBooks.length}`);
    if (readingBooks.length > 0) {
      console.log(`   - Average Record Size: ${Math.round(size2 / readingBooks.length)} bytes`);
    }
    
    // Test 3: Count documents
    console.log('\n📊 Test 3: Count Documents');
    const start3 = Date.now();
    const count = await Book.countDocuments();
    const time3 = Date.now() - start3;
    const size3 = JSON.stringify({ count }).length;
    
    console.log(`   - Query Time: ${time3}ms`);
    console.log(`   - Response Size: ${size3} bytes`);
    console.log(`   - Total Books: ${count}`);
    
    // Test 4: Find with projection (limited fields)
    console.log('\n📊 Test 4: Find with Projection (title only)');
    const start4 = Date.now();
    const titlesOnly = await Book.find({}, 'title');
    const time4 = Date.now() - start4;
    const size4 = JSON.stringify(titlesOnly).length;
    
    console.log(`   - Query Time: ${time4}ms`);
    console.log(`   - Response Size: ${size4} bytes`);
    console.log(`   - Records: ${titlesOnly.length}`);
    if (titlesOnly.length > 0) {
      console.log(`   - Average Record Size: ${Math.round(size4 / titlesOnly.length)} bytes`);
      console.log(`   - Size Reduction: ${Math.round((1 - size4 / size1) * 100)}%`);
    }
    
    // Test 5: Find with limit
    console.log('\n📊 Test 5: Find with Limit (5 records)');
    const start5 = Date.now();
    const limitedBooks = await Book.find().limit(5);
    const time5 = Date.now() - start5;
    const size5 = JSON.stringify(limitedBooks).length;
    
    console.log(`   - Query Time: ${time5}ms`);
    console.log(`   - Response Size: ${size5} bytes`);
    console.log(`   - Records: ${limitedBooks.length}`);
    if (limitedBooks.length > 0) {
      console.log(`   - Average Record Size: ${Math.round(size5 / limitedBooks.length)} bytes`);
    }
    
    // Summary
    console.log('\n📈 Summary:');
    console.log(`   - Total Records in DB: ${count}`);
    console.log(`   - Full Dataset Size: ${size1} bytes`);
    console.log(`   - Average Book Size: ${count > 0 ? Math.round(size1 / count) : 0} bytes`);
    console.log(`   - Fastest Query: ${Math.min(time1, time2, time3, time4, time5)}ms`);
    console.log(`   - Smallest Response: ${Math.min(size1, size2, size3, size4, size5)} bytes`);
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    if (size1 > 10000) {
      console.log('   - Consider pagination for large datasets');
    }
    if (time1 > 100) {
      console.log('   - Consider adding indexes to frequently queried fields');
    }
    if (size4 < size1 * 0.5) {
      console.log('   - Use projections to reduce response size');
    }
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run the analysis
analyzeQuerySizes(); 