const express = require('express');
const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    updateChapter,
    deleteCourse,
    getChapterById,
    getSectionById,
    updateCourseLayout, 
    updateChapterLayout
} = require('../controllers/courseController');
const {authenticate} = require('../middleware/middleware');
const router = express.Router();

router.post('/create-courses', authenticate, createCourse);            // Create course (requires auth)
router.get('/courselist', authenticate, getAllCourses);                            // Public - Get all courses
router.get('/:id', authenticate, getCourseById);                        // Public - Get single course
router.put('/:courseId/chapters/:chapterId', authenticate, updateChapter);         // Update (requires auth)
router.put('/:courseId', updateCourse);
router.delete('/:id', authenticate, deleteCourse);      // Delete (requires auth)
router.get('/:courseId/chapters/:chapterId', getChapterById);
router.get('/:courseId/chapters/:chapterId/sections/:sectionId', getSectionById);
router.put('/:courseId/chapters/:chapterId/layout', authenticate, updateChapterLayout);
router.put('/:courseId/layout', authenticate, updateCourseLayout);


module.exports = router;
