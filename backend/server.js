
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const experienceRoutes = require('./routes/experience'); // exports a router directly
const portfolioRoutes = require('./routes/portfolio');
const userRoutes = require('./routes/user'); // exports a function that needs `upload`

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure CORS
app.use(
  cors({
    origin: 'http://localhost:3000','https://experience-verification-student-por-eight.vercel.app'
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// Serve static uploads correctly
app.use('/Uploads', express.static(uploadDir));

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image or PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/experience', experienceRoutes);   // ✅ fixed (no upload)
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/user', userRoutes(upload));       // ✅ keep upload here

// Error handling for unknown routes
app.use((req, res) => {
  console.error(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));

