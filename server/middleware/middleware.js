const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.ACESS_TOKEN_SECRET;

// Middleware to check authentication
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access Denied" });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
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
