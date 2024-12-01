const { query, validationResult } = require('express-validator');

// Mensagens de erro centralizadas
const errorMessages = {
  invalidStatus: 'Status inválido. Valores válidos: PENDING, APPROVED, REJECTED',
  invalidDisasterId: 'O ID do desastre deve ser um número inteiro',
};

// Função genérica para criar validações
const createValidator = (validations) => [
  ...validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Erros de validação:', errors.array());
      return res.status(400).json({
        success: false,
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }
    next();
  },
];

// Validações específicas para filtros
const validateFilterOptions = createValidator([
  query('status')
    .optional()
    .isIn(['PENDING', 'APPROVED', 'REJECTED'])
    .withMessage(errorMessages.invalidStatus),
  query('disasterId')
    .optional()
    .isInt()
    .withMessage(errorMessages.invalidDisasterId),
]);

module.exports = { validateFilterOptions };
