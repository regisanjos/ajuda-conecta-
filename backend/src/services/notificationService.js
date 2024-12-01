const prisma = require('../config/db');

const errorMessages = {
  notificationCreateError: 'Erro ao criar notificação.',
  notificationsFetchError: 'Erro ao buscar notificações.',
};

const notificationService = {
  async createNotification(userId, title, message) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
        },
      });
      return { success: true, data: notification };
    } catch (error) {
      console.error(errorMessages.notificationCreateError, error.message);
      throw new Error(errorMessages.notificationCreateError);
    }
  },

  async getUserNotifications(userId) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, data: notifications };
    } catch (error) {
      console.error(errorMessages.notificationsFetchError, error.message);
      throw new Error(errorMessages.notificationsFetchError);
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const updatedNotification = await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
      return { success: true, data: updatedNotification };
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error.message);
      throw new Error('Erro ao marcar notificação como lida.');
    }
  },

  async deleteNotification(notificationId) {
    try {
      await prisma.notification.delete({
        where: { id: notificationId },
      });
      return { success: true, message: 'Notificação deletada com sucesso.' };
    } catch (error) {
      console.error('Erro ao deletar notificação:', error.message);
      throw new Error('Erro ao deletar notificação.');
    }
  },
};

module.exports = notificationService;
