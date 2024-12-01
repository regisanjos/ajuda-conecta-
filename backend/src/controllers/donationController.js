const { body, param, validationResult } = require('express-validator');
const donationService = require('../services/donationService');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const handleError = (res, error, customMessage = 'Erro interno no servidor') => {
  const statusCode = error.statusCode || 500;
  const message = error.message || customMessage;
  console.error(message, error); // Log para depuração
  res.status(statusCode).json({ error: message });
};

const donationController = {
  validate(method) {
    switch (method) {
      case 'createDonation': {
        return [
          body('userId').isInt().withMessage('O ID do usuário deve ser um número inteiro'),
          body('disasterId').isInt().withMessage('O ID do desastre deve ser um número inteiro'),
          body('collectionPointId').isInt().withMessage('O ID do ponto de coleta deve ser um número inteiro'),
          body('type').notEmpty().withMessage('O tipo de doação é obrigatório'),
          body('description').notEmpty().withMessage('A descrição é obrigatória'),
          body('status').isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Status inválido'),
          body('items').isArray().withMessage('Os itens devem ser um array'),
          body('items.*.id').isInt().withMessage('O ID do item deve ser um número inteiro'),
          body('items.*.quantity').isInt({ min: 1 }).withMessage('A quantidade deve ser um número inteiro maior que zero'),
        ];
      }
      case 'getDonationById': {
        return [
          param('id').isInt().withMessage('O ID deve ser um número inteiro'),
        ];
      }
      case 'updateDonation': {
        return [
          param('id').isInt().withMessage('O ID deve ser um número inteiro'),
          body('type').optional().notEmpty().withMessage('O tipo de doação deve ser preenchido'),
          body('description').optional().isString().withMessage('A descrição deve ser uma string'),
          body('status').optional().isIn(['PENDING', 'APPROVED', 'REJECTED']).withMessage('Status inválido'),
          body('collectionPointId').optional().isInt().withMessage('O ID do ponto de coleta deve ser um número inteiro'),
          body('items').optional().isArray().withMessage('Os itens devem ser um array'),
          body('items.*.id').optional().isInt().withMessage('O ID do item deve ser um número inteiro'),
          body('items.*.quantity').optional().isInt({ min: 1 }).withMessage('A quantidade deve ser um número inteiro maior que zero'),
        ];
      }
      case 'deleteDonation': {
        return [
          param('id').isInt().withMessage('O ID deve ser um número inteiro'),
        ];
      }
      default:
        return [];
    }
  },

  async create(req, res) {
    try {
      const donation = await donationService.createDonation(req.body);
      res.status(201).json({
        success: true,
        data: donation,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao criar a doação');
    }
  },

  async getAll(req, res) {
    try {
      const donations = await donationService.getAllDonations();
      res.status(200).json({
        success: true,
        data: donations,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar todas as doações');
    }
  },

  async getById(req, res) {
    try {
      const donationId = parseInt(req.params.id);
      if (isNaN(donationId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const donation = await donationService.getDonationById(donationId);
      if (!donation) {
        return res.status(404).json({ error: 'Doação não encontrada' });
      }

      res.status(200).json({
        success: true,
        data: donation,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar a doação');
    }
  },

  async update(req, res) {
    try {
      const donationId = parseInt(req.params.id);
      if (isNaN(donationId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const updatedDonation = await donationService.updateDonation(donationId, req.body);
      res.status(200).json({
        success: true,
        data: updatedDonation,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao atualizar a doação');
    }
  },

  async delete(req, res) {
    try {
      const donationId = parseInt(req.params.id);
      if (isNaN(donationId)) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      await donationService.deleteDonation(donationId);
      res.status(204).send();
    } catch (error) {
      handleError(res, error, 'Erro ao deletar a doação');
    }
  },

  async getRecentDonations(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const recentDonations = await donationService.getRecentDonations(limit);
      res.status(200).json({
        success: true,
        data: recentDonations,
      });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar doações recentes');
    }
  },
};

module.exports = donationController;
