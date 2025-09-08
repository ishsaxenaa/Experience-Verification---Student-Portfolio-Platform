/*
//backend/routes/portfolio.js
const express = require('express');
const User = require('../models/User');
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/publish', auth(['student']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });
    // Check if username is unique (add unique index if needed)
    const existing = await User.findOne({ 'profile.publicUrl': `/portfolio/${username}` });
    if (existing) return res.status(400).json({ error: 'Username taken' });
    user.profile.publicUrl = `/portfolio/${username}`;
    await user.save();
    res.json({ publicUrl: user.profile.publicUrl });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ 'profile.publicUrl': `/portfolio/${req.params.username}` });
    if (!user) return res.status(404).json({ error: 'Portfolio not found' });
    const experiences = await Experience.find({ studentEmail: user.email, status: 'APPROVED' }).populate('orgId', 'name');
    res.json({ user, experiences });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
*/

/*
const express = require('express');
const User = require('../models/User');
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/publish', auth(['student']), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });
    
    // Check if username is unique
    const existing = await User.findOne({ 'profile.publicUrl': `/portfolio/${username}` });
    if (existing) return res.status(400).json({ error: 'Username taken' });
    
    // Update publicUrl and isPublic
    user.profile.publicUrl = `/portfolio/${username}`;
    user.profile.isPublic = true; // Set isPublic to true
    await user.save();
    
    res.json({ publicUrl: user.profile.publicUrl, isPublic: user.profile.isPublic });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ 'profile.publicUrl': `/portfolio/${req.params.username}` });
    if (!user || !user.profile.isPublic) {
      return res.status(404).json({ error: 'Portfolio not found or not public' });
    }
    const experiences = await Experience.find({ studentEmail: user.email, status: 'APPROVED' }).populate('orgId', 'name');
    res.json({ user, experiences });
  } catch (err) {
    console.error('Get portfolio error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
*/
//backend/routes/portfolio.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/portfolio/publish
 * @desc    Publish a student's portfolio with a unique username
 * @access  Private (Student)
 */
router.post('/publish', auth(['student']), async (req, res) => {
  try {
    const { username } = req.body;

    if (!username?.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check username availability
    const existingUser = await User.findOne({ 'profile.publicUrl': username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'profile.publicUrl': username,
        'profile.isPublic': true,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      publicUrl: user.profile.publicUrl,
      isPublic: user.profile.isPublic,
    });
  } catch (err) {
    console.error('Publish portfolio error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @route   GET /api/portfolio/:username
 * @desc    Get a public portfolio by username
 * @access  Public
 */
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ 'profile.publicUrl': username });
    if (!user || !user.profile.isPublic) {
      return res.status(404).json({ error: 'Portfolio not found or not public' });
    }

    const experiences = await Experience.find({
      studentId: user._id,
      status: 'APPROVED',
      studentStatus: 'ACCEPTED',
    }).populate('orgId', 'name');

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        profile: user.profile,
      },
      experiences,
    });
  } catch (err) {
    console.error('Get public portfolio error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;