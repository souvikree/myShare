// controllers/fileController.js
const File = require('../models/fileModel');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

const uploadFile = upload.single('file');

const handleFileUpload = async (req, res) => {
  try {
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size,
    });

    const savedFile = await file.save();
    const fileUrl = `${req.protocol}://${req.get('host')}/files/${savedFile.uuid}`;
    res.json({ fileUrl });
    console.log(fileUrl)
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

const downloadFile = async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(file.path, file.filename);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download file' });
  }
};

module.exports = {
  uploadFile,
  handleFileUpload,
  downloadFile,
};
