const itemService = require('../services/itemService');

// Função para lidar com erros
const handleError = (res, error, customMessage = 'Erro interno no servidor') => {
  const statusCode = error.statusCode || 500;
  const message = customMessage || error.message || 'Erro interno no servidor.';
  console.error(message, error); // Log para depuração
  res.status(statusCode).json({ error: message });
};

const itemController = {
  async create(req, res) {
    try {
      const newItem = await itemService.createItem(req.body);
      res.status(201).json({
        success: true,
        data: newItem,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao criar item');
    }
  },

  async getAll(req, res) {
    try {
      const items = await itemService.getAllItems();
      res.status(200).json({
        success: true,
        data: items,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar itens');
    }
  },

  async getById(req, res) {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const item = await itemService.getItemById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar item');
    }
  },

  async update(req, res) {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const updatedItem = await itemService.updateItem(itemId, req.body);
      if (!updatedItem) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }

      res.status(200).json({
        success: true,
        data: updatedItem,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao atualizar item');
    }
  },

  async delete(req, res) {
    try {
      const itemId = parseInt(req.params.id);
      if (isNaN(itemId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await itemService.deleteItem(itemId);
      res.status(204).end();
    } catch (error) {
      handleError(res, error, 'Erro ao deletar item');
    }
  },
};

module.exports = itemController;
