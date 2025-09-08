const mongoose = require('mongoose');
const Experience = require('../models/Experience'); // Adjusted path

mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateExperiences() {
  try {
    const experiences = await Experience.find();
    for (let exp of experiences) {
      if (exp.status && !exp.orgStatus && !exp.studentStatus) {
        // Map old status to new fields
        if (exp.status === 'APPROVED') {
          exp.orgStatus = 'VERIFIED';
          exp.studentStatus = 'ACCEPTED';
        } else if (exp.status === 'REJECTED') {
          exp.orgStatus = 'REJECTED';
          exp.studentStatus = 'DECLINED';
        } else {
          exp.orgStatus = 'PENDING';
          exp.studentStatus = 'PENDING';
        }
        await exp.save();
        console.log(`Updated experience ${exp._id}`);
      }
    }
    console.log('Migration complete');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    mongoose.connection.close();
  }
}

migrateExperiences();