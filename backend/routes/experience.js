/*
//backend/routes/experience.js
const express = require('express');
const Joi = require('joi');
const Experience = require('../models/Experience');
const User = require('../models/User');
const auth = require('../middleware/auth');


const router = express.Router();

const experienceSchema = Joi.object({
  activityName: Joi.string().required(),
  achievementLevel: Joi.string().valid('Winner', 'Participant', 'Certificate').required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  studentEmail: Joi.string().email().required(),
  category: Joi.string().valid('Course', 'Competition', 'Workshop').required(),
});

module.exports = (upload) => {
  router.post('/', auth(['organization']), upload.array('documents', 5), async (req, res) => {
    const { error } = experienceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const { activityName, achievementLevel, description, date, studentEmail, category } = req.body;
      const documents = req.files ? req.files.map(file => file.path) : [];
      const student = await User.findOne({ email: studentEmail, role: 'student' });
      if (!student) return res.status(400).json({ error: 'Student not found' });
      const experience = new Experience({
        studentEmail,
        studentId: student._id, // Map to studentId
        orgId: req.user.id,
        activityName,
        achievementLevel,
        description,
        date: new Date(date),
        category,
        documents,
      });
      await experience.save();
      res.status(201).json({ message: 'Added', experience });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Other endpoints unchanged, but add org update status
  router.post('/:id/approve', auth(['organization']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Not found' });
      experience.status = 'APPROVED';
      await experience.save();
      res.json({ message: 'Approved' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/:id/reject', auth(['organization']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Not found' });
      experience.status = 'REJECTED';
      await experience.save();
      res.json({ message: 'Rejected' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/', auth(), async (req, res) => {
    try {
      const { studentEmail, page = 1, limit = 10 } = req.query;
      const filter = {};
      if (req.user.role === 'student') {
        filter.studentEmail = req.user.email;
      } else if (req.user.role === 'organization') {
        filter.orgId = req.user.id;
      }
      if (studentEmail) filter.studentEmail = studentEmail;
      const experiences = await Experience.find(filter)
        .populate('orgId', 'name')
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.json(experiences);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.patch('/:id', auth(['organization']), upload.array('documents', 5), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      Object.assign(experience, req.body);
      if (req.files) experience.documents.push(...req.files.map(file => file.path));
      await experience.save();
      res.json(experience);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.delete('/:id', auth(['organization']), async (req, res) => {
    try {
      const experience = await Experience.findOneAndDelete({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/:id/accept', auth(['student']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, studentEmail: req.user.email });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      experience.status = 'APPROVED';
      await experience.save();
      res.json({ message: 'Approved' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
  router.get('/student', auth(['student']), async (req, res) => {
    try {
      const experiences = await Experience.find({ studentEmail: req.user.email })
        .populate('orgId', 'name');
      res.json(experiences);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });


  router.post('/:id/decline', auth(['student']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, studentEmail: req.user.email });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      experience.status = 'REJECTED';
      await experience.save();
      res.json({ message: 'Rejected' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.patch('/:id/feature', auth(['student']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, studentEmail: req.user.email });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      experience.featured = !experience.featured;
      await experience.save();
      res.json(experience);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

  return router;
};
*/

/*

const express = require('express');
const Joi = require('joi');
const Experience = require('../models/Experience');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const experienceSchema = Joi.object({
  activityName: Joi.string().required(),
  achievementLevel: Joi.string().valid('Winner', 'Participant', 'Certificate').required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
  studentEmail: Joi.string().email().required(),
  category: Joi.string().valid('Course', 'Competition', 'Workshop').required(),
});

module.exports = (upload) => {
  router.post('/', auth(['organization']), upload.array('documents', 5), async (req, res) => {
    const { error } = experienceSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const { activityName, achievementLevel, description, date, studentEmail, category } = req.body;
      const documents = req.files ? req.files.map(file => file.path) : [];
      const student = await User.findOne({ email: studentEmail, role: 'student' });
      if (!student) return res.status(400).json({ error: 'Student not found' });
      const experience = new Experience({
        studentEmail,
        studentId: student._id,
        orgId: req.user.id,
        activityName,
        achievementLevel,
        description,
        date: new Date(date),
        category,
        documents,
        orgStatus: 'PENDING',
        studentStatus: 'PENDING',
      });
      await experience.save();
      res.status(201).json({ message: 'Experience added, pending verification', experience });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/:id/verify', auth(['organization']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      if (experience.orgStatus !== 'PENDING') return res.status(400).json({ error: 'Experience already verified or rejected' });
      experience.orgStatus = 'VERIFIED';
      await experience.save();
      res.json({ message: 'Experience verified, sent to student for approval' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/:id/reject', auth(['organization']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      experience.orgStatus = 'REJECTED';
      await experience.save();
      res.json({ message: 'Experience rejected' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/', auth(), async (req, res) => {
    try {
      const { studentEmail, page = 1, limit = 10 } = req.query;
      const filter = {};
      if (req.user.role === 'student') {
        filter.studentEmail = req.user.email;
      } else if (req.user.role === 'organization') {
        filter.orgId = req.user.id;
      }
      if (studentEmail) filter.studentEmail = studentEmail;
      const experiences = await Experience.find(filter)
        .populate('orgId', 'name')
        .skip((page - 1) * limit)
        .limit(Number(limit));
      res.json(experiences);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.patch('/:id', auth(['organization']), upload.array('documents', 5), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      if (experience.orgStatus !== 'PENDING') return res.status(400).json({ error: 'Cannot edit verified or rejected experience' });
      Object.assign(experience, req.body);
      if (req.files) experience.documents.push(...req.files.map(file => file.path));
      await experience.save();
      res.json(experience);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.delete('/:id', auth(['organization']), async (req, res) => {
    try {
      const experience = await Experience.findOneAndDelete({ _id: req.params.id, orgId: req.user.id });
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      res.json({ message: 'Experience deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/:id/accept', auth(['student']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, studentEmail: req.user.email, orgStatus: 'VERIFIED' });
      if (!experience) return res.status(404).json({ error: 'Experience not found or not verified' });
      if (experience.studentStatus !== 'PENDING') return res.status(400).json({ error: 'Experience already accepted or declined' });
      experience.studentStatus = 'ACCEPTED';
      await experience.save();
      res.json({ message: 'Experience accepted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/:id/decline', auth(['student']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, studentEmail: req.user.email, orgStatus: 'VERIFIED' });
      if (!experience) return res.status(404).json({ error: 'Experience not found or not verified' });
      if (experience.studentStatus !== 'PENDING') return res.status(400).json({ error: 'Experience already accepted or declined' });
      experience.studentStatus = 'DECLINED';
      await experience.save();
      res.json({ message: 'Experience declined' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.get('/student', auth(['student']), async (req, res) => {
    try {
      const experiences = await Experience.find({ studentEmail: req.user.email })
        .populate('orgId', 'name');
      res.json(experiences);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.patch('/:id/feature', auth(['student']), async (req, res) => {
    try {
      const experience = await Experience.findOne({ _id: req.params.id, studentEmail: req.user.email, studentStatus: 'ACCEPTED' });
      if (!experience) return res.status(404).json({ error: 'Experience not found or not accepted' });
      experience.featured = !experience.featured;
      await experience.save();
      res.json(experience);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  return router;
};
*/
//backend/routes/experience.js
const mongoose = require('mongoose');  
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Experience = require('../models/Experience');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'Uploads'),   
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDFs are allowed!'));
    }
  },
}).array('documents', 5);

// Create a new experience
router.post('/', auth(['organization']), upload, async (req, res) => {
  const { studentEmail, activityName, achievementLevel, description, date, category } = req.body;
  try {
    const student = await User.findOne({ email: studentEmail, role: 'student' });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const documents = req.files ? req.files.map(file => `/Uploads/${file.filename}`) : [];
    const experience = new Experience({
      studentEmail,
      studentId: student._id,
      orgId: req.user.id,
      activityName,
      achievementLevel,
      description,
      date: new Date(date),
      category,
      documents,
      status: 'PENDING',
      studentStatus: 'PENDING',
    });
    await experience.save();
    res.status(201).json(experience);
  } catch (err) {
    console.error('Error creating experience:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Get all experiences for an organization
router.get('/', auth(['organization']), async (req, res) => {
  try {
    const experiences = await Experience.find({ orgId: req.user.id }).populate('orgId', 'name');
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get experiences for a student
router.get('/student', auth(['student']), async (req, res) => {
  try {
    const experiences = await Experience.find({ studentEmail: req.user.email })
      .populate('orgId', 'name');
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve an experience
router.post('/:id/approve', auth(['organization']), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.orgId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.status !== 'PENDING') {
      return res.status(400).json({ error: 'Experience already processed' });
    }
    experience.status = 'APPROVED';
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject an experience
router.post('/:id/reject', auth(['organization']), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.orgId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.status !== 'PENDING') {
      return res.status(400).json({ error: 'Experience already processed' });
    }
    experience.status = 'REJECTED';
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept an experience
router.post('/:id/accept', auth(['student']), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.studentEmail !== req.user.email) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Experience not approved by organization' });
    }
    if (experience.studentStatus !== 'PENDING') {
      return res.status(400).json({ error: 'Experience already processed by student' });
    }
    experience.studentStatus = 'ACCEPTED';
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Decline an experience
router.post('/:id/decline', auth(['student']), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.studentEmail !== req.user.email) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Experience not approved by organization' });
    }
    if (experience.studentStatus !== 'PENDING') {
      return res.status(400).json({ error: 'Experience already processed by student' });
    }
    experience.studentStatus = 'DECLINED';
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an experience
router.patch('/:id', auth(['organization']), upload, async (req, res) => {
  const { studentEmail, activityName, achievementLevel, description, date, category } = req.body;
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.orgId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.status !== 'PENDING') {
      return res.status(400).json({ error: 'Cannot edit approved or rejected experience' });
    }
    if (studentEmail) {
      const student = await User.findOne({ email: studentEmail, role: 'student' });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      experience.studentEmail = studentEmail;
      experience.studentId = student._id;
    }
    if (activityName) experience.activityName = activityName;
    if (achievementLevel) experience.achievementLevel = achievementLevel;
    if (description) experience.description = description;
    if (date) experience.date = new Date(date);
    if (category) experience.category = category;
    if (req.files && req.files.length > 0) {
      experience.documents = req.files.map(file => `/Uploads/${file.filename}`);
    }
    await experience.save();
    res.json(experience);
  } catch (err) {
    console.error('Error updating experience:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Delete an experience
router.delete('/:id', auth(['organization']), async (req, res) => {
   try {
     // Find the experience by its ID.
     const experience = await Experience.findById(req.params.id);
     // Check if the experience exists and belongs to the current organization.
     if (!experience || experience.orgId.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Use the modern Mongoose method to delete the document.
    await experience.deleteOne(); 

    res.json({ message: 'Experience deleted' });
  } catch (err) {
      console.error('Error deleting experience:', err); 
      res.status(500).json({ error: 'Server error' });
    }
});

// Toggle featured status
router.patch('/:id/feature', auth(['student']), async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience || experience.studentEmail !== req.user.email) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    if (experience.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Only approved experiences can be featured' });
    }
    experience.featured = !experience.featured;
    await experience.save();
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
