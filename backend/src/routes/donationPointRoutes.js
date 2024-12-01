const { Router } = require('express');
const donationPointController = require('../controllers/donationPointController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = Router();

// Rotas para gerenciar pontos de coleta
router.post('/', authMiddleware, adminMiddleware, donationPointController.create);
router.get('/', donationPointController.getAll);
router.get('/:id', donationPointController.getById);
router.put('/:id', authMiddleware, adminMiddleware, donationPointController.update);
router.delete('/:id', authMiddleware, adminMiddleware, donationPointController.delete);

module.exports = router;
