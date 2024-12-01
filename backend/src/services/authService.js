const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const roleMap = {
  doador: 'USER',
  admin: 'ADMIN',
  ponto_de_coleta: 'COLLECTION_POINT',
};

const authService = {
  createUser: async (userData) => {
    const { email, password, name, role } = userData;

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email já cadastrado. Por favor, tente outro.');
    }

    // Verificar se o role foi fornecido
    if (!role) {
      throw new Error('Role é obrigatório.');
    }

    // Mapear o role para os valores válidos do enum do Prisma
    const prismaRole = roleMap[role.toLowerCase()];
    if (!prismaRole) {
      throw new Error(`Role inválido. Valores permitidos: ${Object.keys(roleMap).join(', ')}`);
    }

    // Gerar hash da senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário no banco
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Salvar senha hashada
        name,
        role: prismaRole,
      },
    });
  },

  authenticateUser: async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Credenciais inválidas.');
    }

    // Retornar apenas os campos seguros
    const { id, name, role } = user;
    return { id, name, role, email };
  },
};

module.exports = authService;
