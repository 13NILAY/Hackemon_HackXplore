const AssignedCourse = require('../models/AssignedCourseModel');
const Course = require('../models/CourseModel');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Create Assigned Course
const createAssignedCourse = async (req, res) => {
    try {
        const { teacher, assigns, orgCourseId, dueDate } = req.body;

        const assignedCourse = new AssignedCourse({
            teacher,
            assigns,
            orgCourseId,
            dueDate
        });

        await assignedCourse.save();
        res.status(201).json({ message: 'Assigned Course created successfully', assignedCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error creating assigned course', error });
    }
};

// Get All Assigned Courses
const getAllAssignedCourses = async (req, res) => {
    try {
        const assignedCourses = await AssignedCourse.find().populate('assigns.studentId assigns.courseCopy orgCourseId');
        res.json(assignedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned courses', error });
    }
};

// Get Assigned Course by ID
const getAssignedCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const assignedCourse = await AssignedCourse.findById(id).populate('assigns.studentId assigns.courseCopy orgCourseId');
        if (!assignedCourse) return res.status(404).json({ message: 'Assigned Course not found' });
        res.json(assignedCourse);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned course', error });
    }
};

// Add Student Assignment (Add a new student and duplicated course to existing assignedCourse)
const addStudentToAssignedCourse = async (req, res) => {
    try {
        const { assignedCourseId } = req.params;
        const { studentId, orgCourseId } = req.body;

        console.log('Fetching original course:', orgCourseId);
        const originalCourse = await Course.findById(orgCourseId);
        if (!originalCourse) {
            console.log('Original course not found');
            return res.status(404).json({ message: 'Original Course not found' });
        }

        console.log('Original Course found:', originalCourse);

        const duplicatedCourse = new Course(originalCourse.toObject());
        duplicatedCourse._id = new mongoose.Types.ObjectId();
        duplicatedCourse.isNew = true;  // Critical step
        console.log('Saving duplicated course...');
        await duplicatedCourse.save();

        console.log('Duplicated course saved:', duplicatedCourse._id);

        await User.findByIdAndUpdate(
            studentId,
            { $push: { courses: duplicatedCourse._id } },
            { new: true }
        );

        const updatedAssignedCourse = await AssignedCourse.findByIdAndUpdate(
            assignedCourseId,
            { $push: { assigns: { studentId, courseCopy: duplicatedCourse._id } } },
            { new: true }
        ).populate('assigns.studentId assigns.courseCopy orgCourseId');

        console.log('Student added successfully');
        res.json({ message: 'Student added with new course copy', updatedAssignedCourse });

    } catch (error) {
        console.error('🔥 Error adding student:', error.message, error.stack);
        res.status(500).json({ message: 'Error adding student', error: error.message });
    }
};


const getAssignedCourseByOrgCourse = async (req, res) => {
    try {
        const { orgCourseId } = req.params;
        const assignedCourse = await AssignedCourse.findOne({ orgCourseId });

        if (!assignedCourse) {
            return res.status(404).json({ message: 'Assigned Course not found' });
        }

        res.json({ assignedCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assigned course', error });
    }
};

const getAssignedCoursesForStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const assignedCourses = await AssignedCourse.find({
            'assigns.studentId': studentId
        }).populate('assigns.courseCopy');

        const filteredCourses = [];

        assignedCourses.forEach(assignedCourse => {
            const assignEntry = assignedCourse.assigns.find(assign => assign.studentId.toString() === studentId);

            if (assignEntry && assignEntry.courseCopy) {
                const courseData = {
                    _id: assignEntry.courseCopy._id,
                    courseName: assignEntry.courseCopy.courseName,
                    description: assignEntry.courseCopy.description,
                    skills: assignEntry.courseCopy.skills,
                    level: assignEntry.courseCopy.level,
                    passedFinal: assignEntry.courseCopy.passedFinal,  // Added
                    assignedDate: assignedCourse.updatedAt,
                    teacher: assignedCourse.teacher
                };
                filteredCourses.push(courseData);
            }
        });

        res.status(200).json({ courses: filteredCourses });
    } catch (error) {
        console.error('Error fetching assigned courses for student:', error);
        res.status(500).json({ message: 'Failed to fetch assigned courses.' });
    }
};

// Set due date
const setDueDate = async (req, res) => {
    const { dueDate } = req.body;
    try {
        const assignedCourse = await AssignedCourse.findByIdAndUpdate(
            req.params.assignedCourseId,
            { dueDate },
            { new: true }
        );
        res.json({ message: 'Due date set', assignedCourse });
    } catch (error) {
        res.status(500).json({ error: 'Failed to set due date' });
    }
};


// Delete Assigned Course
const deleteAssignedCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await AssignedCourse.findByIdAndDelete(id);
        res.json({ message: 'Assigned Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting assigned course', error });
    }
};

// List Assigned Courses for Specific Teacher
const getCoursesByTeacher = async (req, res) => {
    try {
        const { teacher } = req.params;
        const assignedCourses = await AssignedCourse.find({ teacher }).populate('assigns.studentId assigns.courseCopy orgCourseId');
        res.json(assignedCourses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teacher courses', error });
    }
};

module.exports = {
    createAssignedCourse,
    getAllAssignedCourses,
    getAssignedCourseById,
    addStudentToAssignedCourse,
    deleteAssignedCourse,
    getCoursesByTeacher,
    getAssignedCourseByOrgCourse,
    getAssignedCoursesForStudent, 
    setDueDate
};
