const { Router } = require('express');
const collectionPointController = require('../controllers/collectionPointController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware'); // Middleware para verificar se é admin

const router = Router();

// Rota para criar um ponto de coleta (Apenas Admin pode criar)
router.post('/', authMiddleware, adminMiddleware, collectionPointController.create);

// Rota para listar todos os pontos de coleta (Acesso público)
router.get('/', collectionPointController.getAll);

// Rota para buscar um ponto de coleta por ID (Acesso público)
router.get('/:id', collectionPointController.getById);

// Rota para atualizar um ponto de coleta (Apenas Admin pode atualizar)
router.put('/:id', authMiddleware, adminMiddleware, collectionPointController.update);

// Rota para deletar um ponto de coleta (Apenas Admin pode deletar)
router.delete('/:id', authMiddleware, adminMiddleware, collectionPointController.delete);

module.exports = router;
