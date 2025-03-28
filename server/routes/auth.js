const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
const Teacher = require("../models/Teacher.js");
const Student = require("../models/Student.js");

const router = express.Router();
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

// Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    if (role === 'teacher') {
      const teacher = new Teacher({
          user: user._id
      });
      await teacher.save();
  }

  if (role === 'student') {
      const student = new Student({
          user: user._id
      });
      await student.save();
  }

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/profile/:id",async(req,res)=>{
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
}
})

module.exports = router;
