const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  progress: {
    totalHoursLearned: { type: Number, default: 0 },
    lecturesAttended: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }
  }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;