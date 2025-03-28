const express = require('express');
const router = express.Router();
const assignedCourseController = require('../controllers/assignedCourseController');

router.post('/', assignedCourseController.createAssignedCourse);  // Create assigned course
router.get('/', assignedCourseController.getAllAssignedCourses);  // List all
router.get('/by-org-course/:orgCourseId', assignedCourseController.getAssignedCourseByOrgCourse);
router.get('/assigned-courses/:studentId', assignedCourseController.getAssignedCoursesForStudent);
router.get('/:id', assignedCourseController.getAssignedCourseById);  // Get single by ID
router.put('/:assignedCourseId/addStudent', assignedCourseController.addStudentToAssignedCourse);  // Add student to course
router.delete('/:id', assignedCourseController.deleteAssignedCourse);  // Delete assigned course
router.get('/teacher/:teacher', assignedCourseController.getCoursesByTeacher);  // Courses assigned by specific teacher
router.put('/:assignedCourseId/setDueDate', assignedCourseController.setDueDate);

module.exports = router;
