const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();
const corsOptions=require('./config/corsOptions');
const ROLES_LIST=require("./config/roles_list");
const cookieParser=require('cookie-parser');
const app = express();
const credentials = require('./middleware/credentials.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.route.js');
const doubtRoutes = require('./routes/doubts.js');
const courseRoutes = require('./routes/courseRouter.js'); 
const assessmentRoutes=require('./routes/assessmentRouter.js');
const generateCourseRoutes=require("./routes/generateCourseRouter.js");
const generateChapterContentRoutes=require("./routes/generateChapterContentRouter.js");
const chatbotRouter=require("./routes/chatbotRouter.js");
const assignedCourseRouter=require("./routes/assignedCourseRouter.js");


const PORT = process.env.PORT || 8000;

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//middleware for cookies
app.use(cookieParser());

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Protected routes
app.use("/api/doubts", doubtRoutes);


app.use('/api/courses', courseRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api', generateCourseRoutes);
app.use('/api', generateChapterContentRoutes);


app.use('/api/assigned',assignedCourseRouter);
app.use('/api',chatbotRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

