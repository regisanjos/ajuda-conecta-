const userService = require("../services/userService");
const { body, validationResult, param } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const handleError = (res, error, customMessage = 'Erro interno no servidor') => {
  const statusCode = error.statusCode || 500;
  const message = customMessage || error.message || 'Erro interno no servidor.';
  console.error(message, error);
  res.status(statusCode).json({ error: message });
};

const userController = {
  create: [
    body("name").notEmpty().withMessage("O nome é obrigatório"),
    body("email").notEmpty().isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("Senha muito curta"),
    validateRequest,
    async (req, res) => {
      try {
        const user = await userService.createUser(req.body);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({ success: true, data: userWithoutPassword });
      } catch (error) {
        handleError(res, error, 'Erro ao criar usuário');
      }
    },
  ],

  getAll: async (req, res) => {
    try {
      const users = await userService.getAllUsers(req.user.id);
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      handleError(res, error, 'Erro ao buscar usuários');
    }
  },

  getById: [
    param("id").isUUID().withMessage("ID inválido"),
    validateRequest,
    async (req, res) => {
      try {
        const user = await userService.getUserById(req.params.id);
        if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

        const { password, ...userWithoutPassword } = user;
        res.status(200).json({ success: true, data: userWithoutPassword });
      } catch (error) {
        handleError(res, error, 'Erro ao buscar usuário');
      }
    },
  ],

  update: [
    param("id").isUUID().withMessage("ID inválido"),
    body("name").optional().isLength({ min: 3 }).withMessage("Nome inválido"),
    body("email").optional().isEmail().withMessage("Email inválido"),
    validateRequest,
    async (req, res) => {
      try {
        const updatedUser = await userService.updateUser(req.params.id, req.body, req.user.id);
        if (!updatedUser) return res.status(404).json({ error: "Usuário não encontrado" });

        const { password, ...userWithoutPassword } = updatedUser;
        res.status(200).json({ success: true, data: userWithoutPassword });
      } catch (error) {
        handleError(res, error, 'Erro ao atualizar usuário');
      }
    },
  ],

  delete: [
    param("id").isUUID().withMessage("ID inválido"),
    validateRequest,
    async (req, res) => {
      try {
        await userService.deleteUser(req.params.id, req.user.id);
        res.status(204).send();
      } catch (error) {
        handleError(res, error, 'Erro ao deletar usuário');
      }
    },
  ],
};

module.exports = userController;
