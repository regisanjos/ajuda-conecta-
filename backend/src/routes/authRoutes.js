const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const rateLimit = require('express-rate-limit');

const router = Router();

// Middleware de limitação de taxa
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Máximo de 10 requisições por IP
  message: 'Muitas tentativas de login. Tente novamente mais tarde.',
});

// Rota para registro
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Por favor, insira um email válido'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    body('name').notEmpty().withMessage('O nome é obrigatório'),
    body('role').notEmpty().withMessage('O role é obrigatório'),
    validateRequest,
  ],
  authController.register // Certifique-se de que 'register' está definido
);

// Rota para login
router.post(
  '/login',
  authRateLimiter,
  [
    body('email').isEmail().withMessage('Por favor, insira um email válido'),
    body('password').notEmpty().withMessage('A senha é obrigatória'),
    validateRequest,
  ],
  authController.login // Certifique-se de que 'login' está definido
);

module.exports = router;
