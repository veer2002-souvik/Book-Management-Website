require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const Book = require("./models/Book.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(compression());

// Performance monitoring middleware
app.use((req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - start;
    const responseSize = JSON.stringify(data).length;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - Size: ${responseSize} bytes`);
    originalSend.call(this, data);
  };
  
  next();
});

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Updated GET /books endpoint with pagination and projections
app.get("/books", async (req, res) => {
  console.time('GET /books - Database Query');
  const queryStart = Date.now();
  const { page = 1, limit = 10, fields } = req.query;
  const projection = fields ? fields.split(',').join(' ') : '';
  const skip = (parseInt(page) - 1) * parseInt(limit);

  try {
    const books = await Book.find({}, projection)
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Book.countDocuments();
    const queryDuration = Date.now() - queryStart;
    const responseSize = JSON.stringify(books).length;
    
    console.timeEnd('GET /books - Database Query');
    console.log(`📊 MongoDB Query Metrics:`);
    console.log(`   - Response Size: ${responseSize} bytes`);
    console.log(`   - Query Time: ${queryDuration}ms`);
    console.log(`   - Records Retrieved: ${books.length}`);
    console.log(`   - Average Record Size: ${books.length > 0 ? Math.round(responseSize / books.length) : 0} bytes`);
    
    res.json({ books, total });
  } catch (error) {
    console.timeEnd('GET /books - Database Query');
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

app.post("/books", async (req, res) => {
  console.time('POST /books - Database Insert');
  const queryStart = Date.now();
  
  try {
    const book = new Book(req.body);
    await book.save();
    const queryDuration = Date.now() - queryStart;
    const responseSize = JSON.stringify(book).length;
    
    console.timeEnd('POST /books - Database Insert');
    console.log(`📊 MongoDB Insert Metrics:`);
    console.log(`   - Response Size: ${responseSize} bytes`);
    console.log(`   - Insert Time: ${queryDuration}ms`);
    console.log(`   - New Book ID: ${book._id}`);
    
    res.status(201).send(book);
  } catch (error) {
    console.timeEnd('POST /books - Database Insert');
    console.error('Database insert error:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));