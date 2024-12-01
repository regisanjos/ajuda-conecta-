const { Router } = require("express");
const { body, param } = require("express-validator");
const disasterController = require("../controllers/disasterController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = Router();

// Validações
const validateDisaster = [
  body('name').notEmpty().withMessage('O nome é obrigatório'),
  body('location').notEmpty().withMessage('A localização é obrigatória'),
  body('startDate').isISO8601().withMessage('A data de início deve estar no formato ISO8601'),
];

const validateDisasterId = [
  param('id').isInt().withMessage('O ID do desastre deve ser um número inteiro'),
];

// Rotas para desastres
// Obter todos os desastres
router.get('/disasters', disasterController.getAllDisasters);

// Criar um novo desastre (somente admin)
router.post(
  '/disasters',
  authMiddleware,
  adminMiddleware,
  validateDisaster,
  disasterController.create
);

// Obter um desastre pelo ID
router.get(
  '/disasters/:id',
  authMiddleware,
  validateDisasterId,
  disasterController.getDisasterById
);

// Atualizar um desastre (somente admin)
router.put(
  '/disasters/:id',
  authMiddleware,
  adminMiddleware,
  validateDisasterId,
  validateDisaster,
  disasterController.update
);

// Deletar um desastre (somente admin)
router.delete(
  '/disasters/:id',
  authMiddleware,
  adminMiddleware,
  validateDisasterId,
  disasterController.delete
);

module.exports = router;
