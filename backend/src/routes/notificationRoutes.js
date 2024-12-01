const { Router } = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

// Rota para obter notificações do usuário
router.get('/notifications', authMiddleware, notificationController.getUserNotifications);

// Rota para marcar uma notificação como lida
router.put('/notifications/:id/read', authMiddleware, notificationController.markAsRead);

// Rota para deletar uma notificação
router.delete('/notifications/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
