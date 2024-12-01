const jwt = require('jsonwebtoken');
const config = require('../config/config');
const crypto = require('crypto');

/**
 * Gera um token JWT de autenticação para um usuário.
 * @param {string|number} userId - ID do usuário.
 * @param {string} [expiresIn='1h'] - Tempo de expiração do token (opcional).
 * @returns {string} Token JWT gerado.
 */
const generateAuthToken = (userId, expiresIn = '1h') => {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn });
};

/**
 * Verifica a validade de um token JWT.
 * @param {string} token - Token JWT a ser verificado.
 * @returns {object} Decodificação do token JWT.
 * @throws {Error} Lança erro se o token for inválido ou expirado.
 */
const verifyAuthToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado. Por favor, faça login novamente.');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido. Verifique as credenciais fornecidas.');
    } else {
      throw new Error(`Erro ao verificar token: ${error.message}`);
    }
  }
};

/**
 * Gera um token aleatório de 32 bytes em formato hexadecimal.
 * @returns {string} Token aleatório gerado.
 */
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Valida um token aleatório gerado.
 * @param {string} token - Token a ser validado.
 * @returns {boolean} Retorna verdadeiro se o token for válido.
 */
const validateRandomToken = (token) => {
  return typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  generateRandomToken,
  validateRandomToken,
};
