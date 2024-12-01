const adminMiddleware = (req, res, next) => {
    // Verifica se o usuário tem privilégios de administrador
    if (req.user && req.user.role === 'admin') {
      return next();
    }
  
    return res.status(403).json({ message: 'Access denied' });
  };
  
  module.exports = adminMiddleware;
  