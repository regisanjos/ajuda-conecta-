const prisma = require('../config/db'); // Certifique-se de que o Prisma está configurado corretamente

const donationExitService = {
  async create(data) {
    return await prisma.donationExit.create({ data });
  },

  async getAll() {
    return await prisma.donationExit.findMany();
  },

  async getById(id) {
    return await prisma.donationExit.findUnique({ where: { id } });
  },

  async update(id, data) {
    return await prisma.donationExit.update({
      where: { id },
      data,
    });
  },

  async delete(id) {
    return await prisma.donationExit.delete({ where: { id } });
  },
};

module.exports = donationExitService;
