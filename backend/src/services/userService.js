const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const AppError = require('../utils/AppError');

const errorMessages = {
  emailInUse: 'Este email já está em uso.',
  accessDenied: 'Acesso negado.',
  userNotFound: 'Usuário não encontrado.',
  userUpdateError: 'Usuário não encontrado para atualização.',
  userDeleteError: 'Usuário não encontrado para deleção.',
};

const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'O email é obrigatório',
    'string.email': 'Formato de email inválido',
  }),
  password: Joi.string().min(6).optional().messages({
    'string.min': 'A senha deve ter pelo menos 6 caracteres',
  }),
  name: Joi.string().max(50).required().messages({
    'string.empty': 'O nome é obrigatório',
    'string.max': 'O nome deve ter no máximo 50 caracteres',
  }),
});

const validateUserData = (userData) => {
  const { error } = userSchema.validate(userData, { abortEarly: false });
  if (error) {
    throw new AppError(
      error.details.map((detail) => detail.message).join(', '),
      400
    );
  }
};

const sanitizeUser = (user) => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const userService = {
  async createUser(userData) {
    validateUserData(userData);

    const existingUser = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existingUser) {
      throw new AppError(errorMessages.emailInUse, 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: { ...userData, password: hashedPassword },
    });

    return { success: true, data: sanitizeUser(user) };
  },

  async getAllUsers(adminId, page = 1, limit = 10) {
    if (!(await this.isAdmin(adminId))) {
      console.warn(`Acesso negado ao usuário ${adminId}`);
      throw new AppError(errorMessages.accessDenied, 403);
    }

    const users = await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      success: true,
      data: users.map(sanitizeUser),
      meta: { page, limit },
    };
  },

  async getUserById(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError(errorMessages.userNotFound, 404);
    }

    return { success: true, data: sanitizeUser(user) };
  },

  async updateUser(userId, userData, requesterId) {
    if (userId !== requesterId && !(await this.isAdmin(requesterId))) {
      console.warn(`Acesso negado ao usuário ${requesterId} para atualizar ${userId}`);
      throw new AppError(errorMessages.accessDenied, 403);
    }

    validateUserData(userData);

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: userData,
      });
      return { success: true, data: sanitizeUser(updatedUser) };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError(errorMessages.userUpdateError, 404);
      }
      throw error;
    }
  },

  async deleteUser(userId, adminId) {
    if (!(await this.isAdmin(adminId))) {
      console.warn(`Acesso negado ao usuário ${adminId} para deletar ${userId}`);
      throw new AppError(errorMessages.accessDenied, 403);
    }

    try {
      await prisma.user.delete({ where: { id: userId } });
      return { success: true, message: 'Usuário deletado com sucesso.' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError(errorMessages.userDeleteError, 404);
      }
      throw error;
    }
  },

  async getTotalUsers() {
    const count = await prisma.user.count();
    return { success: true, data: count };
  },

  async isAdmin(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return user && user.role === 'ADMIN';
  },
};

module.exports = userService;
