const notificationService = require('../services/notificationService');

const notificationController = {
  // Obter notificações do usuário
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id; // Assumindo que `authMiddleware` popula `req.user`
      const notifications = await notificationService.getUserNotifications(userId);
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error('Erro ao obter notificações:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Marcar uma notificação como lida
  async markAsRead(req, res) {
    try {
      const notificationId = parseInt(req.params.id, 10);
      await notificationService.markNotificationAsRead(notificationId);
      res.status(200).json({
        success: true,
        message: 'Notificação marcada como lida.',
      });
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Deletar uma notificação
  async deleteNotification(req, res) {
    try {
      const notificationId = parseInt(req.params.id, 10);
      await notificationService.deleteNotification(notificationId);
      res.status(204).send(); // Sem conteúdo
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = notificationController;
