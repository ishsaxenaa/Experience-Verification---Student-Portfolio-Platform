/*
// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ['student', 'organization'], required: true },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  profile: {
    bio: { type: String, default: '' },
    description: { type: String, default: '' }, // Added for specs
    profilePic: { type: String, default: '' }, // File path/URL
    skills: [{ type: String }],
    links: {
      github: { type: String, default: '' },
      leetcode: { type: String, default: '' },
      figma: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    publicUrl: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
*/
// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'organization'], required: true },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    links: {
      github: { type: String },
      leetcode: { type: String },
      figma: { type: String },
      linkedin: { type: String },
    },
    profilePic: { type: String },
    publicUrl: { type: String },
    isPublic: { type: Boolean, default: false },
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

