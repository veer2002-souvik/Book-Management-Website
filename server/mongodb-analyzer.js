const mongoose = require('mongoose');
const Book = require('./models/Book.js');

class MongoDBAnalyzer {
  constructor() {
    this.metrics = {
      totalQueries: 0,
      totalResponseSize: 0,
      totalQueryTime: 0,
      averageResponseSize: 0,
      averageQueryTime: 0,
      slowestQuery: { time: 0, operation: '' },
      largestResponse: { size: 0, operation: '' }
    };
  }

  async analyzeQuery(operation, queryFn) {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    
    try {
      const result = await queryFn();
      const endTime = Date.now();
      const endMemory = process.memoryUsage();
      
      const queryTime = endTime - startTime;
      const responseSize = JSON.stringify(result).length;
      const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;
      
      // Update metrics
      this.metrics.totalQueries++;
      this.metrics.totalResponseSize += responseSize;
      this.metrics.totalQueryTime += queryTime;
      this.metrics.averageResponseSize = this.metrics.totalResponseSize / this.metrics.totalQueries;
      this.metrics.averageQueryTime = this.metrics.totalQueryTime / this.metrics.totalQueries;
      
      // Track slowest query
      if (queryTime > this.metrics.slowestQuery.time) {
        this.metrics.slowestQuery = { time: queryTime, operation };
      }
      
      // Track largest response
      if (responseSize > this.metrics.largestResponse.size) {
        this.metrics.largestResponse = { size: responseSize, operation };
      }
      
      console.log(`\n📊 MongoDB Query Analysis - ${operation}:`);
      console.log(`   - Response Size: ${responseSize} bytes`);
      console.log(`   - Query Time: ${queryTime}ms`);
      console.log(`   - Memory Used: ${Math.round(memoryUsed / 1024)}KB`);
      console.log(`   - Records: ${Array.isArray(result) ? result.length : 1}`);
      
      if (Array.isArray(result) && result.length > 0) {
        const avgRecordSize = Math.round(responseSize / result.length);
        console.log(`   - Average Record Size: ${avgRecordSize} bytes`);
      }
      
      return result;
    } catch (error) {
      const queryTime = Date.now() - startTime;
      console.error(`❌ Query failed - ${operation}: ${error.message} (${queryTime}ms)`);
      throw error;
    }
  }

  getMetrics() {
    console.log('\n📈 Overall MongoDB Performance Metrics:');
    console.log(`   - Total Queries: ${this.metrics.totalQueries}`);
    console.log(`   - Average Response Size: ${Math.round(this.metrics.averageResponseSize)} bytes`);
    console.log(`   - Average Query Time: ${Math.round(this.metrics.averageQueryTime)}ms`);
    console.log(`   - Slowest Query: ${this.metrics.slowestQuery.operation} (${this.metrics.slowestQuery.time}ms)`);
    console.log(`   - Largest Response: ${this.metrics.largestResponse.operation} (${this.metrics.largestResponse.size} bytes)`);
    
    return this.metrics;
  }
}

// Example usage
async function runAnalysis() {
  const analyzer = new MongoDBAnalyzer();
  
  try {
    // Test different queries
    await analyzer.analyzeQuery('Find All Books', () => Book.find());
    await analyzer.analyzeQuery('Find by Status', () => Book.find({ status: 'Reading' }));
    await analyzer.analyzeQuery('Count Books', () => Book.countDocuments());
    
    // Get overall metrics
    analyzer.getMetrics();
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}

module.exports = { MongoDBAnalyzer, runAnalysis };

// Run if called directly
if (require.main === module) {
  runAnalysis();
} 