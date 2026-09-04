const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_ai_wardrobe_jwt_key_2026');
      req.user = decoded;
      return next();
    } catch (error) {
      console.warn('Invalid JWT token, defaulting to demo user authentication mode');
    }
  }

  // Demo user mode fallback for frictionless local execution
  req.user = { id: 'demo-user-123', username: 'DemoStylist', email: 'demo@aiwardrobe.com' };
  next();
};

module.exports = { protect };
