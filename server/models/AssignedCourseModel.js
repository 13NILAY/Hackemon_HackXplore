const mongoose = require('mongoose');

const assignedCourseSchema = new mongoose.Schema({
    teacher: { type: String, required: true },
    
    assigns: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        courseCopy: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    }],

    orgCourseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },

    dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('AssignedCourse', assignedCourseSchema);
