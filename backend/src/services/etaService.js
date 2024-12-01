const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');

const prisma = new PrismaClient();

const errorMessages = {
  etaNotFound: 'ETA não encontrado.',
  etaAlreadyExists: 'Já existe um ETA para esta doação.',
  validationError: 'Erro de validação nos dados do ETA.',
};

const etaSchema = Joi.object({
  donationId: Joi.number().integer().required().messages({
    'number.base': 'O ID da doação deve ser um número inteiro',
    'any.required': 'O ID da doação é obrigatório',
  }),
  estimatedArrival: Joi.date().iso().required().messages({
    'date.format': 'A data de chegada estimada deve estar no formato ISO 8601',
    'any.required': 'A data de chegada estimada é obrigatória',
  }),
  currentLocation: Joi.string().required().messages({
    'string.empty': 'A localização atual é obrigatória',
  }),
  status: Joi.string().optional(),
  transporter: Joi.string().optional(),
  trackingNumber: Joi.string().optional(),
});

const validateETAData = (etaData) => {
  const { error } = etaSchema.validate(etaData, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(', '));
  }
};

const etaService = {
  async createETA(etaData) {
    validateETAData(etaData);

    try {
      const eta = await prisma.eta.create({
        data: etaData,
      });
      return { success: true, data: eta };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error(errorMessages.etaAlreadyExists);
      }
      console.error('Erro ao criar ETA:', error);
      throw error;
    }
  },

  async getETAByDonationId(donationId) {
    try {
      const eta = await prisma.eta.findUnique({
        where: { donationId },
      });
      if (!eta) {
        throw new Error(errorMessages.etaNotFound);
      }
      return { success: true, data: eta };
    } catch (error) {
      console.error('Erro ao buscar ETA por ID de doação:', error);
      throw error;
    }
  },

  async updateETA(id, etaData) {
    validateETAData(etaData);

    try {
      const updatedETA = await prisma.eta.update({
        where: { id },
        data: etaData,
      });
      return { success: true, data: updatedETA };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(errorMessages.etaNotFound);
      }
      console.error('Erro ao atualizar ETA:', error);
      throw error;
    }
  },

  async deleteETA(id) {
    try {
      await prisma.eta.delete({
        where: { id },
      });
      return { success: true, message: 'ETA deletado com sucesso.' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(errorMessages.etaNotFound);
      }
      console.error('Erro ao deletar ETA:', error);
      throw error;
    }
  },

  async getAllETAs() {
    try {
      const etas = await prisma.eta.findMany();
      return { success: true, data: etas };
    } catch (error) {
      console.error('Erro ao buscar todos os ETAs:', error);
      throw error;
    }
  },
};

module.exports = etaService;
