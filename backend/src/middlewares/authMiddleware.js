const authMiddleware = (req, res, next) => {
  // Simulação de autenticação básica
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Simulação de usuário autenticado
    req.user = { id: '123', role: 'user' }; // Substitua por lógica real se necessário
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized' });
};

module.exports = authMiddleware;
