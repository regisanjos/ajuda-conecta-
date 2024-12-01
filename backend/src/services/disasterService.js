const prisma = require('../config/db');
const Joi = require('joi');

const errorMessages = {
  disasterNotFound: 'Desastre não encontrado',
  disasterValidationError: 'Erro de validação dos dados do desastre',
  disasterDeleteError: 'Desastre não encontrado para deleção',
  disasterUpdateError: 'Desastre não encontrado para atualização',
};

const disasterSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'O nome do desastre é obrigatório',
  }),
  location: Joi.string().required().messages({
    'string.empty': 'A localização do desastre é obrigatória',
  }),
  startDate: Joi.date().required().messages({
    'date.base': 'A data de início é obrigatória e deve estar no formato de data',
  }),
  endDate: Joi.date().optional(),
  status: Joi.string().valid('ACTIVE', 'INACTIVE', 'ENDED').required(),
  description: Joi.string().optional(),
  imageUrl: Joi.string().uri().optional(),
});

const validateDisasterData = (disasterData) => {
  const { error } = disasterSchema.validate(disasterData, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(', '));
  }
};

const disasterService = {
  async createDisaster(disasterData) {
    validateDisasterData(disasterData);
    const disaster = await prisma.disaster.create({
      data: disasterData,
    });
    return { success: true, data: disaster };
  },

  async getAllDisasters() {
    const disasters = await prisma.disaster.findMany();
    return { success: true, data: disasters };
  },

  async getDisasterById(disasterId) {
    const disaster = await prisma.disaster.findUnique({
      where: { id: disasterId },
    });
    if (!disaster) {
      throw new Error(errorMessages.disasterNotFound);
    }
    return { success: true, data: disaster };
  },

  async updateDisaster(disasterId, disasterData) {
    try {
      validateDisasterData(disasterData);
      const updatedDisaster = await prisma.disaster.update({
        where: { id: disasterId },
        data: disasterData,
      });
      return { success: true, data: updatedDisaster };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(errorMessages.disasterUpdateError);
      }
      throw error;
    }
  },

  async deleteDisaster(disasterId) {
    try {
      await prisma.disaster.delete({
        where: { id: disasterId },
      });
      return { success: true, message: 'Desastre deletado com sucesso' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(errorMessages.disasterDeleteError);
      }
      throw error;
    }
  },
};

module.exports = disasterService;
