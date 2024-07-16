// models/fileModel.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  uuid: String,
  path: String,
  size: Number,
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 }, // 1 week expiry
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
