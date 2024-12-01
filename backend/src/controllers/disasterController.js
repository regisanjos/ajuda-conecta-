const disasterService = require("../services/disasterService");

const handleError = (res, error, customMessage = null) => {
  const statusCode = error.statusCode || 500;
  const message = customMessage || error.message || 'Erro interno no servidor.';
  console.error(message, error); // Log do erro para depuração
  res.status(statusCode).json({ error: message });
};

const disasterController = {
  async getAllDisasters(req, res) {
    try {
      const disasters = await disasterService.getAllDisasters();
      res.status(200).json({
        success: true,
        data: disasters,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar desastres');
    }
  },

  async getDisasterById(req, res) {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const disaster = await disasterService.getDisasterById(disasterId);
      if (!disaster) {
        return res.status(404).json({ error: 'Desastre não encontrado' });
      }

      res.status(200).json({
        success: true,
        data: disaster,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar desastre');
    }
  },

  async create(req, res) {
    try {
      const disaster = await disasterService.createDisaster(req.body);
      res.status(201).json({
        success: true,
        data: disaster,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao criar desastre');
    }
  },

  async update(req, res) {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const updatedDisaster = await disasterService.updateDisaster(disasterId, req.body);
      res.status(200).json({
        success: true,
        data: updatedDisaster,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao atualizar desastre');
    }
  },

  async delete(req, res) {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await disasterService.deleteDisaster(disasterId);
      res.status(200).json({
        success: true,
        message: 'Desastre deletado com sucesso',
      });
    } catch (error) {
      handleError(res, error, 'Erro ao deletar desastre');
    }
  },
};

module.exports = disasterController;
