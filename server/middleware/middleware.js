const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

// Middleware to check authentication
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(token);
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid Token" });
  }
};

// Middleware to check roles
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Access Denied: Insufficient Permissions" });
  }
  next();
};

module.exports = { authenticate, authorize };
