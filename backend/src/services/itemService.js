const prisma = require('../config/db');
const Joi = require('joi');

const errorMessages = {
  itemNotFound: 'Item não encontrado.',
  itemValidationError: 'Erro de validação nos dados do item.',
  itemDeleteError: 'Item não encontrado para deleção.',
  itemUpdateError: 'Item não encontrado para atualização.',
};

const itemSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'O nome do item é obrigatório',
  }),
  category: Joi.string().required().messages({
    'string.empty': 'A categoria do item é obrigatória',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'A quantidade deve ser um número inteiro',
    'number.min': 'A quantidade deve ser pelo menos 1',
  }),
});

const validateItemData = (itemData) => {
  const { error } = itemSchema.validate(itemData, { abortEarly: false });
  if (error) {
    throw new Error(error.details.map((detail) => detail.message).join(', '));
  }
};

const itemService = {
  async createItem(itemData) {
    validateItemData(itemData);

    try {
      const item = await prisma.item.create({
        data: itemData,
      });
      return { success: true, data: item };
    } catch (error) {
      console.error('Erro ao criar item:', error.message);
      throw new Error(`Erro ao criar item: ${error.message}`);
    }
  },

  async getAllItems() {
    try {
      const items = await prisma.item.findMany();
      return { success: true, data: items };
    } catch (error) {
      console.error('Erro ao buscar todos os itens:', error.message);
      throw new Error(`Erro ao buscar todos os itens: ${error.message}`);
    }
  },

  async getItemById(itemId) {
    try {
      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });
      if (!item) {
        throw new Error(errorMessages.itemNotFound);
      }
      return { success: true, data: item };
    } catch (error) {
      console.error('Erro ao buscar item por ID:', error.message);
      throw new Error(`Erro ao buscar item: ${error.message}`);
    }
  },

  async updateItem(itemId, itemData) {
    validateItemData(itemData);

    try {
      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: itemData,
      });
      return { success: true, data: updatedItem };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(errorMessages.itemUpdateError);
      }
      console.error('Erro ao atualizar item:', error.message);
      throw new Error(`Erro ao atualizar item: ${error.message}`);
    }
  },

  async deleteItem(itemId) {
    try {
      await prisma.item.delete({
        where: { id: itemId },
      });
      return { success: true, message: 'Item deletado com sucesso.' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error(errorMessages.itemDeleteError);
      }
      console.error('Erro ao deletar item:', error.message);
      throw new Error(`Erro ao deletar item: ${error.message}`);
    }
  },
};

module.exports = itemService;
