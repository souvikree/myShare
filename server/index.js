// index.js
const express = require('express');
const connectDB = require('./database/db');
const fileRoutes = require('./routes/fileRoutes');
const path = require('path');
const cors = require("cors")


const app = express();
const PORT = 8080;
const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200
  }
  
  app.use(cors(corsOptions));
// Connect to MongoDB
connectDB();

app.use((_req, res, next) => {
    // Disable caching for all responses by default
    res.setHeader('Cache-Control', 'no-store');
  
    // Set other headers as needed, depending on your application requirements
    // Example: Allow caching for static assets with a max age of 1 hour
    // res.setHeader('Cache-Control', 'public, max-age=3600');
  
    // Continue to next middleware or route handler
    next();
  });
  

// Middleware to serve static files
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Use routes
app.use('/', fileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
