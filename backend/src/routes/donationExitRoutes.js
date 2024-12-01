const { Router } = require('express');
const { body, param } = require('express-validator');
const donationExitController = require('../controllers/donationExitController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = Router();

// Validações
const validateDonationExit = [
  body('donationId').isInt().withMessage('O ID da doação deve ser um número inteiro'),
  body('status')
    .isIn(['PENDING', 'COMPLETED', 'CANCELLED'])
    .withMessage('Status inválido. Valores válidos: PENDING, COMPLETED, CANCELLED'),
];

const validateDonationExitId = [
  param('id').isInt().withMessage('O ID da saída deve ser um número inteiro'),
];

// Rotas para saídas de doações
// Teste da rota
router.get('/', (req, res) => {
  res.send('Donation Exit Routes funcionando');
});

// Obter todas as saídas de doações
router.get('/',
  authMiddleware,
  donationExitController.getAll
);

// Criar uma nova saída de doação
router.post('/',
  authMiddleware,
  adminMiddleware,
  validateDonationExit,
  donationExitController.create
);

// Obter uma saída de doação por ID
router.get('/:id',
  authMiddleware,
  validateDonationExitId,
  donationExitController.getById
);

// Atualizar uma saída de doação
router.put('/:id',
  authMiddleware,
  adminMiddleware,
  validateDonationExitId,
  validateDonationExit,
  donationExitController.update
);

// Deletar uma saída de doação
router.delete('/:id',
  authMiddleware,
  adminMiddleware,
  validateDonationExitId,
  donationExitController.delete
);

module.exports = router;
