// Simple authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || authHeader !== 'authenticated') {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized access' 
    });
  }
  
  next();
};

module.exports = authMiddleware;