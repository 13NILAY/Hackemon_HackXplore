const express = require("express");
const { authenticate, authorize } = require("../middleware/middleware.js");

const router = express.Router();

// Student-only route
router.get("/student", authenticate, authorize(["student"]), (req, res) => {
  res.json({ message: "Welcome, Student!" });
});

// Teacher-only route
router.get("/teacher", authenticate, authorize(["teacher"]), (req, res) => {
  res.json({ message: "Welcome, Teacher!" });
});

// Admin-only route
router.get("/admin", authenticate, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

module.exports = router;
