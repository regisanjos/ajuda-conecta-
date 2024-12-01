const authService = require('../services/authService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateRequestBody = (fields, body) => {
  for (const field of fields) {
    if (!body[field] || body[field].trim() === '') {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório.`;
    }
  }
  return null;
};

const handleError = (res, error, customMessage) => {
  const statusCode = error.statusCode || 500;
  const message = customMessage || error.message || 'Erro interno no servidor.';
  console.error('Erro:', message, error);
  res.status(statusCode).json({ error: message });
};

const authController = {
  async register(req, res) {
    const { name, email, password, role } = req.body;

    // Validação simplificada
    const validationError = validateRequestBody(['name', 'email', 'password', 'role'], req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      // Criação do usuário
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await authService.createUser({
        name,
        email,
        password: hashedPassword,
        role,
      });

      // Remover senha do retorno
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso.',
        data: userWithoutPassword,
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        return res.status(400).json({ error: 'Email já está em uso.' });
      }
      handleError(res, error, 'Erro ao registrar o usuário.');
    }
  },

  async login(req, res) {
    const { email, password } = req.body;

    // Validação
    const validationError = validateRequestBody(['email', 'password'], req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    try {
      const user = await authService.authenticateUser(email, password);

      // Gerar Token JWT
      const jwtSecret = process.env.JWT_SECRET || 'default_secret';
      if (!jwtSecret) {
        throw new Error('JWT_SECRET não configurado nas variáveis de ambiente.');
      }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRATION || '1h' } // Expiração configurável
      );

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso.',
        token,
      });
    } catch (error) {
      if (error.message === 'Credenciais inválidas.') {
        return res.status(401).json({ error: error.message });
      }
      handleError(res, error, 'Erro ao realizar login.');
    }
  },
};

module.exports = authController;
