// routes/fileRoutes.js
const express = require('express');
const { handleFileUpload, uploadFile, downloadFile } = require('../controllers/fileController');
const router = express.Router();


// Upload route
router.post('/upload', uploadFile, handleFileUpload);

// Download route
router.get('/files/:uuid', downloadFile);

module.exports = router;
