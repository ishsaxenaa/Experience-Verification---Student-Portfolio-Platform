//backend/routes/user.js

const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Updated profileSchema from code2
const profileSchema = Joi.object({
  bio: Joi.string().allow(''),
  skills: Joi.array().items(Joi.string()).allow(null),
  links: Joi.object({
    github: Joi.string().uri().allow(''),
    leetcode: Joi.string().uri().allow(''),
    figma: Joi.string().uri().allow(''),
    linkedin: Joi.string().uri().allow(''),
  }).allow(null),
  publicUrl: Joi.string().regex(/^[a-zA-Z0-9-_]*$/).allow(''), // Allow empty string
  isPublic: Joi.alternatives().try(
    Joi.boolean(),
    Joi.string().valid('true', 'false')
  ).default(false),
  profilePic: Joi.string().allow(''),
}).unknown(true);

module.exports = (upload) => {
  // Get user profile (unchanged from code1)
  router.get('/me', auth(), async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-passwordHash');
      console.log('GET /api/user/me - User profile:', user.profile);
      res.json(user);
    } catch (err) {
      console.error('GET /api/user/me - Error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Updated PATCH /profile route from code2
  router.patch('/profile', auth(['student']), upload.single('profilePic'), async (req, res) => {
    try {
      console.log('PATCH /api/user/profile - Request body:', req.body);
      console.log('PATCH /api/user/profile - Uploaded file:', req.file);

      // Parse JSON fields with better error handling
      if (req.body.skills) {
        try {
          req.body.skills = typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills;
          if (!Array.isArray(req.body.skills)) {
            return res.status(400).json({ error: '"skills" must be an array' });
          }
        } catch (err) {
          console.error('Skills parsing error:', err);
          return res.status(400).json({ error: 'Invalid "skills" format' });
        }
      } else {
        req.body.skills = [];
      }

      if (req.body.links) {
        try {
          req.body.links = typeof req.body.links === 'string' ? JSON.parse(req.body.links) : req.body.links;
          if (typeof req.body.links !== 'object' || req.body.links === null) {
            return res.status(400).json({ error: '"links" must be an object' });
          }
        } catch (err) {
          console.error('Links parsing error:', err);
          return res.status(400).json({ error: 'Invalid "links" format' });
        }
      } else {
        req.body.links = {};
      }

      // Convert isPublic to boolean
      if (req.body.isPublic !== undefined) {
        if (typeof req.body.isPublic === 'string') {
          req.body.isPublic = req.body.isPublic.toLowerCase() === 'true';
        } else {
          req.body.isPublic = Boolean(req.body.isPublic);
        }
      }

      // Validate request body
      const { error } = profileSchema.validate(req.body, { abortEarly: false });
      if (error) {
        console.error('Validation error:', error.details);
        return res.status(400).json({ 
          error: error.details.map((e) => e.message).join('; '),
          details: error.details 
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Handle file upload
      if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, or GIF allowed.' });
        }
        if (req.file.size > 5 * 1024 * 1024) {
          return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
        }
        user.profile.profilePic = `/Uploads/${req.file.filename}`;
      }

      // Update profile fields
      user.profile = {
        ...user.profile.toObject(),
        bio: req.body.bio || '',
        skills: req.body.skills || [],
        links: req.body.links || {},
        publicUrl: req.body.publicUrl || '',
        isPublic: req.body.isPublic || false,
      };

      await user.save();
      console.log('Updated profile:', user.profile);
      res.json(user.profile);
    } catch (err) {
      console.error('Profile update error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  });

  // Save user profile (unchanged from code1)
  router.post('/profile/save', auth(['student']), upload.single('profilePic'), async (req, res) => {
    try {
      console.log('POST /api/user/profile/save - Request body:', req.body);
      console.log('POST /api/user/profile/save - Uploaded file:', req.file);

      // Parse JSON fields
      let parsedSkills = req.body.skills ? JSON.parse(req.body.skills) : [];
      if (!Array.isArray(parsedSkills)) {
        return res.status(400).json({ error: '"skills" must be an array of strings' });
      }
      if (!parsedSkills.every((skill) => typeof skill === 'string')) {
        return res.status(400).json({ error: 'All "skills" elements must be strings' });
      }

      let parsedLinks = req.body.links ? JSON.parse(req.body.links) : {};
      if (typeof parsedLinks !== 'object' || parsedLinks === null) {
        return res.status(400).json({ error: '"links" must be an object' });
      }

      // Convert isPublic to boolean
      const isPublic = req.body.isPublic === 'true' || req.body.isPublic === true;

      // Validate request body
      const { error } = profileSchema.validate({
        bio: req.body.bio,
        skills: parsedSkills,
        links: parsedLinks,
        publicUrl: req.body.publicUrl,
        isPublic,
      }, { abortEarly: false });
      if (error) {
        console.error('POST /api/user/profile/save - Validation error:', error.details);
        return res.status(400).json({ error: error.details.map((e) => e.message).join('; ') });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Initialize profile if null
      if (!user.profile) {
        user.profile = {
          bio: '',
          skills: [],
          links: { github: '', leetcode: '', figma: '', linkedin: '' },
          profilePic: '',
          publicUrl: '',
          isPublic: false,
        };
      }

      // Handle file upload
      if (req.file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
          return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, or GIF allowed.' });
        }
        if (req.file.size > 5 * 1024 * 1024) {
          return res.status(400).json({ error: 'File size exceeds 5MB limit.' });
        }
        user.profile.profilePic = `/Uploads/${req.file.filename}`;
      }

      // Update profile fields directly
      user.profile.bio = req.body.bio || '';
      user.profile.skills = parsedSkills;
      user.profile.links = parsedLinks;
      user.profile.publicUrl = req.body.publicUrl || '';
      user.profile.isPublic = isPublic;

      await user.save();
      console.log('POST /api/user/profile/save - Updated profile:', user.profile);
      res.json(user.profile);
    } catch (err) {
      console.error('POST /api/user/profile/save - Error:', err);
      res.status(500).json({ error: `Server error: ${err.message}` });
    }
  });

  return router;
};