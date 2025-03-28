const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalHoursTaught: {
    type: Number,
    default: 0
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }]
}, { timestamps: true });


const Teacher =mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
