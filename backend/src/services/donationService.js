const prisma = require('../config/db');
const notificationService = require('./notificationService');
const Joi = require('joi');

const errorMessages = {
  donationNotFound: 'Doação não encontrada.',
  notificationError: 'Erro ao enviar notificação.',
};

const donationSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').optional(),
  type: Joi.string().optional(),
  description: Joi.string().optional(),
  // Outros campos podem ser adicionados aqui conforme necessário
});

const donationService = {
  async updateDonation(donationId, donationData) {
    // Validação dos dados da doação
    const { error } = donationSchema.validate(donationData);
    if (error) {
      throw new Error(error.details.map((detail) => detail.message).join(', '));
    }

    try {
      // Atualiza a doação no banco de dados
      const updatedDonation = await prisma.donation.update({
        where: { id: donationId },
        data: donationData,
      });

      // Envia notificação se o status foi atualizado
      if (donationData.status) {
        const userId = updatedDonation.userId;
        const title = 'Atualização de Doação';
        const message = `Sua doação foi atualizada para o status: ${donationData.status}.`;

        try {
          await notificationService.createNotification(userId, title, message);
        } catch (notificationError) {
          console.error(errorMessages.notificationError, notificationError);
        }
      }

      return { success: true, data: updatedDonation };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(errorMessages.donationNotFound);
      }
      throw error;
    }
  },
};

module.exports = donationService;
