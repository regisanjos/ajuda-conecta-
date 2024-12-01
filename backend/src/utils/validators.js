const { cpf, cnpj } = require('cpf-cnpj-validator');

/**
 * Verifica se um e-mail é válido.
 * @param {string} email - E-mail para validação.
 * @returns {boolean} `true` se o e-mail for válido, caso contrário `false`.
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Email inválido ou vazio.');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i; // Suporte para TLDs longos
  return emailRegex.test(email);
};

/**
 * Verifica se um CPF é válido.
 * @param {string} cpfValue - CPF para validação.
 * @returns {boolean} `true` se o CPF for válido, caso contrário `false`.
 */
const isValidCPF = (cpfValue) => {
  if (!cpfValue || typeof cpfValue !== 'string') {
    throw new Error('CPF inválido ou vazio.');
  }
  return cpf.isValid(cpfValue);
};

/**
 * Verifica se um CNPJ é válido.
 * @param {string} cnpjValue - CNPJ para validação.
 * @returns {boolean} `true` se o CNPJ for válido, caso contrário `false`.
 */
const isValidCNPJ = (cnpjValue) => {
  if (!cnpjValue || typeof cnpjValue !== 'string') {
    throw new Error('CNPJ inválido ou vazio.');
  }
  return cnpj.isValid(cnpjValue);
};

/**
 * Valida um documento (CPF ou CNPJ).
 * @param {string} document - Documento para validação.
 * @returns {string} Mensagem indicando se é CPF ou CNPJ válido.
 */
const validateDocument = (document) => {
  if (!document || typeof document !== 'string') {
    throw new Error('Documento inválido ou vazio.');
  }
  if (document.length <= 11 && isValidCPF(document)) {
    return 'CPF válido.';
  }
  if (document.length > 11 && isValidCNPJ(document)) {
    return 'CNPJ válido.';
  }
  throw new Error('Documento inválido. Não é um CPF nem um CNPJ válido.');
};

module.exports = {
  isValidEmail,
  isValidCPF,
  isValidCNPJ,
  validateDocument,
};
