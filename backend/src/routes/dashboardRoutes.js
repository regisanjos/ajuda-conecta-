const { Router } = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateFilterOptions } = require('../middlewares/validation');
const rateLimit = require('express-rate-limit');

// Limitação de taxa para endpoints do dashboard
const dashboardRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message: 'Muitas requisições ao dashboard. Tente novamente mais tarde.',
});

const router = Router();

// Rota para obter visão geral do dashboard
router.get(
  '/overview',
  authMiddleware,
  dashboardRateLimiter,
  dashboardController.getOverview
);

// Rota para obter dados do gráfico, com validação de filtros
router.get(
  '/chart-data',
  authMiddleware,
  validateFilterOptions,
  dashboardController.getChartData
);

module.exports = router;
