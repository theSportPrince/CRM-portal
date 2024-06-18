const jwt = require('jsonwebtoken');
const User=require("../Model/User")

exports.isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
 
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId); 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.isManager = (req, res, next) => {
  if (req.user.role !== 'manager') return res.status(403).json({ message: 'Forbidden' });
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
};

exports.isAdminOrManager = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
