const { Router } = require('express');
const { body, param } = require('express-validator');
const etaController = require('../controllers/etaController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = Router();

// Validações
const validateETA = [
  body('donationId').isInt().withMessage('O ID da doação deve ser um número inteiro'),
  body('estimatedArrival').isISO8601().withMessage('A data de chegada deve estar no formato ISO 8601'),
  body('currentLocation').notEmpty().withMessage('A localização atual é obrigatória'),
];

const validateETAId = [
  param('id').isInt().withMessage('O ID do ETA deve ser um número inteiro'),
];

const validateDonationId = [
  param('donationId').isInt().withMessage('O ID da doação deve ser um número inteiro'),
];

// Rotas para ETA
// Criar um novo ETA
router.post(
  '/etas',
  authMiddleware,
  adminMiddleware,
  validateETA,
  etaController.create
);

// Obter ETA por ID de doação
router.get(
  '/etas/donation/:donationId',
  authMiddleware,
  validateDonationId,
  etaController.getByDonationId
);

// Atualizar um ETA
router.put(
  '/etas/:id',
  authMiddleware,
  adminMiddleware,
  validateETAId,
  validateETA,
  etaController.update
);

// Deletar um ETA
router.delete(
  '/etas/:id',
  authMiddleware,
  adminMiddleware,
  validateETAId,
  etaController.delete
);

// Obter todos os ETAs
router.get(
  '/etas',
  authMiddleware,
  etaController.getAll
);

module.exports = router;
