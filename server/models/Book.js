const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: { type: String, index: true },
  author: String,
  description: String,
  status: { type: String, index: true }
});

module.exports = mongoose.model("Book", BookSchema);
