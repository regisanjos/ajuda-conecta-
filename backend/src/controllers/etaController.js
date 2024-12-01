const etaService = require('../services/etaService');
const { body, param, validationResult } = require('express-validator');

// Função para validação
const validate = (method) => {
  switch (method) {
    case 'createETA': {
      return [
        body('donationId').isInt().withMessage('O ID da doação deve ser um número inteiro'),
        body('estimatedArrival').isISO8601().withMessage('A data de chegada estimada deve estar em formato ISO 8601'),
        body('currentLocation').notEmpty().withMessage('A localização atual é obrigatória'),
      ];
    }
    case 'getETAById':
    case 'updateETA':
    case 'deleteETA': {
      return [
        param('id').isInt().withMessage('O ID do ETA deve ser um número inteiro'),
      ];
    }
    default:
      return [];
  }
};

// Função para lidar com erros
const handleError = (res, error, customMessage = 'Erro interno no servidor') => {
  const statusCode = error.code === 'P2025' ? 404 : error.statusCode || 500;
  const message = customMessage || error.message || 'Erro interno no servidor.';
  console.error(message, error);
  res.status(statusCode).json({ error: message });
};

// Função para validação de erros
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const etaController = {
  create: [
    ...validate('createETA'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const eta = await etaService.createETA(req.body);
        res.status(201).json({
          success: true,
          data: eta,
        });
      } catch (error) {
        handleError(res, error, 'Erro ao criar ETA');
      }
    },
  ],

  getByDonationId: [
    param('donationId').isInt().withMessage('O ID da doação deve ser um número inteiro'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const donationId = parseInt(req.params.donationId);
        const eta = await etaService.getETAByDonationId(donationId);

        if (!eta) {
          return res.status(404).json({ error: 'ETA não encontrado para esta doação' });
        }

        res.status(200).json({
          success: true,
          data: eta,
        });
      } catch (error) {
        handleError(res, error, 'Erro ao obter ETA');
      }
    },
  ],

  update: [
    ...validate('updateETA'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const etaId = parseInt(req.params.id);
        const updatedETA = await etaService.updateETA(etaId, req.body);

        if (!updatedETA) {
          return res.status(404).json({ error: 'ETA não encontrado' });
        }

        res.status(200).json({
          success: true,
          data: updatedETA,
        });
      } catch (error) {
        handleError(res, error, 'Erro ao atualizar ETA');
      }
    },
  ],

  delete: [
    ...validate('deleteETA'),
    handleValidationErrors,
    async (req, res) => {
      try {
        const etaId = parseInt(req.params.id);
        await etaService.deleteETA(etaId);

        res.status(204).end();
      } catch (error) {
        handleError(res, error, 'Erro ao excluir ETA');
      }
    },
  ],

  getAll: async (req, res) => {
    try {
      const etas = await etaService.getAllETAs();
      res.status(200).json({
        success: true,
        data: etas,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar ETAs');
    }
  },
};

module.exports = etaController;
