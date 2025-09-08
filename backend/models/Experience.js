/*
//backend/models/Experience.js

const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // New
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityName: { type: String, required: true },
  achievementLevel: { type: String, enum: ['Winner', 'Participant', 'Certificate'], required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, enum: ['Course', 'Competition', 'Workshop'], required: true }, // New
  documents: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);
*/
const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityName: { type: String, required: true },
  achievementLevel: { type: String, enum: ['Winner', 'Participant', 'Certificate'], required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, enum: ['Course', 'Competition', 'Workshop'], required: true },
  documents: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' }, // Organization verification status
  studentStatus: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED'], default: 'PENDING' }, // Student acceptance status
  featured: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema);