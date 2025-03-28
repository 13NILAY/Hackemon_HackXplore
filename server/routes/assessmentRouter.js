const express = require("express");
const router = express.Router();
const Assessment = require("../models/AssessmentModel");
const User = require("../models/user.model");
const { generateExamModel } = require("../config/AIModel"); 
const {authenticate} = require('../middleware/middleware');
const Course = require("../models/CourseModel");

router.post("/generate", async (req, res) => {
  try {
    const { userId, topic } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const airesponse = await generateExamModel.sendMessage(
      `Generate Exam on topic : ${topic} with Question and Options along with correct answer in JSON format with difficulty level high but not very long questions and no need for difficulty key, (Give 10)`
    );
 
    const examQuestions = JSON.parse(airesponse.response.text());
    console.log(examQuestions);

    const newAssessment = new Assessment({
      user: userId,
      topic,
      questions: examQuestions
    });

    await newAssessment.save();
    res.status(201).json(newAssessment);
  } catch (error) {
    res.status(500).json({ message: "Error generating exam", error });
  }
});

router.patch("/:examId", async (req, res) => {
  try {
    const { score } = req.body;
    const { examId } = req.params;

    const updatedExam = await Assessment.findByIdAndUpdate(
      examId,
      { score: score },
      { new: true }
    );
    if (!updatedExam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json({ message: "Score updated successfully", exam: updatedExam });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/:examId", async (req, res) => {
  try {
    const { examId } = req.params;
    const assessment = await Assessment.findById(examId);
    
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }
    res.json(assessment); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getassess/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const assessments = await Assessment.find({ user: userId });

    if (assessments.length === 0) {
      return res.status(404).json({ message: "No assessments found for the user" });
    }

    res.json(assessments);
  } catch (error) {
    console.error("Error fetching assessments:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;

router.post("/:id/course-end-assessment", async (req, res) => {
  try {
      const { userId, topic, courseId, skills, difficultyLevel } = req.body;

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const aiPrompt = `
          Generate a final assessment for the course on topic: "${topic}".
          This is a ${difficultyLevel} level assessment.
          Focus on the following skills: ${skills.join(", ")}.
          Provide exactly 10 questions in JSON format.
          Each question must include:
          - The question text
          - 4 options
          - The correct answer.
          No need to include a 'difficulty' key. Keep questions concise but challenging.
          if possible search the web to check if the answers to the questions generated are correct or not.
      `;

      const airesponse = await generateExamModel.sendMessage(aiPrompt.trim());

      const examQuestions = JSON.parse(airesponse.response.text());  // Adjust if response format differs
      console.log(examQuestions);

      const newAssessment = new Assessment({
          user: userId,
          topic,
          course: courseId || null,
          questions: examQuestions
      });

      await newAssessment.save();
      res.status(201).json(newAssessment);
  } catch (error) {
      console.error("Error generating exam:", error);
      res.status(500).json({ message: "Error generating exam", error });
  }
});

//GET course assessments
router.get("/course/:courseId", authenticate, async (req, res) => {
  try {
      const { courseId } = req.params;
      const userId = req.user.id;  // Assuming you have user authentication middleware
      // console.log("Fetching assessments for user:", userId, "and course:", courseId);
      const assessments = await Assessment.find({ course: courseId, user: userId });

      if (assessments.length === 0) {
          return res.status(404).json({ message: "No assessments found for this course." });
      }

      res.json(assessments);
  } catch (error) {
      console.error("Error fetching assessments by courseId:", error);
      res.status(500).json({ message: "Server error", error });
  }
});

// Generate chapter assessment
router.post("/:courseId/chapters/:chapterId/assessment", authenticate, async (req, res) => {
  try {
      const { courseId, chapterId } = req.params;
      const { userId } = req.user.id;
      
      // Find course and chapter
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
      
      const chapter = course.chapters.id(chapterId);
      if (!chapter) return res.status(404).json({ message: "Chapter not found" });

      // Generate chapter-specific questions
      const aiPrompt = `
          Generate an assessment for the chapter: "${chapter.chapterName}"
          Based on the following content:
          ${chapter.about}
          ${chapter.sections.map(s => `${s.title}\n${s.explanation}`).join('\n')}
          Provide exactly 5 questions in JSON format.
          Each question must include:
          - question text
          - 4 options
          - correct answer
      `;

      const airesponse = await generateExamModel.sendMessage(aiPrompt.trim());
      const examQuestions = JSON.parse(airesponse.response.text());

      const newAssessment = new Assessment({
          user: userId,
          topic: chapter.chapterName,
          course: courseId,
          chapter: chapterId,
          type: 'chapter',
          questions: examQuestions
      });

      await newAssessment.save();
      res.status(201).json(newAssessment);
  } catch (error) {
      console.error("Error generating chapter assessment:", error);
      res.status(500).json({ message: "Error generating assessment", error });
  }
});

// Get chapter assessments
router.get("/course/:courseId/chapter/:chapterId", authenticate, async (req, res) => {
  try {
      const { courseId, chapterId } = req.params;
      const userId = req.user.id;

      const assessments = await Assessment.find({
          course: courseId,
          chapter: chapterId,
          user: userId,
          type: 'chapter'
      });

      res.json(assessments);
  } catch (error) {
      console.error("Error fetching chapter assessments:", error);
      res.status(500).json({ message: "Server error", error });
  }
});


