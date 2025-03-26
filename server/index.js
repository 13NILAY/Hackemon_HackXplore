const express = require('express');
const cors = require('cors');
const { Server } = require("socket.io");
const connectDB = require('./db');
require('dotenv').config();
const corsOptions=require('./config/corsOptions');
const ROLES_LIST=require("./config/roles_list");
const cookieParser=require('cookie-parser');
const app = express();
const credentials = require('./middleware/credentials');

const PORT = process.env.PORT || 8080;

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//middleware for cookies
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

