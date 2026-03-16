// middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Check Admin Role
const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next(); 
};
// Check user Role
const isUser = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({ message: "Access denied. Users only." });
  }
  next();
};
module.exports = { auth, isAdmin, isUser };
