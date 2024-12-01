// Arquivo userRoutes.js
const { Router } = require('express');
const { body, param, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = Router();

// Middleware para validar erros de validação
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validações
const validateUserId = [
  param('id').isUUID().withMessage('ID inválido'),
  validateRequest,
];

const validateUserCreation = [
  body('name').notEmpty().withMessage('Nome obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha curta'),
  validateRequest,
];

// Rotas de usuários
router.post('/', validateUserCreation, userController.create); // Corrigido aqui

router.use(authMiddleware); // Middleware de autenticação

router.get('/', adminMiddleware, userController.getAll);
router.get('/:id', validateUserId, userController.getById);
router.put('/:id', validateUserId, userController.update);
router.delete('/:id', adminMiddleware, validateUserId, userController.delete);

module.exports = router;
