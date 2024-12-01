const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const adminOrCollectionPointMiddleware = async (req, res, next) => {
  try {
    const userId = req.user.id; // Supondo que o ID do usuário já está no token
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || (user.role !== 'admin' && user.role !== 'ponto_de_coleta')) {
      return res.status(403).json({ error: 'Acesso negado. Apenas admins ou pontos de coleta podem realizar esta ação.' });
    }

    next();
  } catch (error) {
    console.error('Erro no middleware de autorização:', error.message);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = adminOrCollectionPointMiddleware;
