const { Router } = require("express");
const { body, param } = require("express-validator");
const donationController = require("../controllers/donationController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminOrCollectionPointMiddleware = require("../middlewares/adminOrCollectionPointMiddleware");

const router = Router();

// Validações de entrada
const validateDonation = [
  body('userId').isInt().withMessage('O ID do usuário deve ser um número inteiro'),
  body('disasterId').isInt().withMessage('O ID do desastre deve ser um número inteiro'),
  body('type').notEmpty().withMessage('O tipo de doação é obrigatório'),
  body('description').notEmpty().withMessage('A descrição é obrigatória'),
  body('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Status inválido'),
];

const validateDonationId = [
  param('id').isInt().withMessage('O ID da doação deve ser um número inteiro'),
];

// Rotas de Doações
router.get('/', donationController.getAll); // Obter todas as doações

router.get(
  '/recent',
  authMiddleware,
  donationController.getRecentDonations // Obter doações recentes
);

router.get(
  '/:id',
  authMiddleware,
  validateDonationId,
  donationController.getById // Obter uma doação pelo ID
);

router.post(
  '/',
  authMiddleware,
  validateDonation,
  donationController.create // Criar uma nova doação
);

router.put(
  '/:id',
  authMiddleware,
  validateDonationId,
  validateDonation,
  donationController.update // Atualizar uma doação
);

router.delete(
  '/:id',
  authMiddleware,
  adminOrCollectionPointMiddleware, // Apenas admins ou responsáveis podem deletar
  validateDonationId,
  donationController.delete // Deletar uma doação
);

module.exports = router;
