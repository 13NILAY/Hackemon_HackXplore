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

const PORT = process.env.PORT || 8000;

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware for cookies
app.use(cookieParser());

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Protected routes
app.use("/api/doubts", doubtRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

