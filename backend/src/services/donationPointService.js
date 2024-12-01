const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const donationPointService = {
  async createDonationPoint(data) {
    // Verificar se já existe um ponto no bairro
    const existingPoint = await prisma.collectionPoint.findFirst({
      where: { bairro: data.bairro },
    });

    if (existingPoint) {
      throw new Error(`Já existe um ponto de coleta registrado no bairro ${data.bairro}.`);
    }

    // Criar o ponto de coleta
    return prisma.collectionPoint.create({
      data: {
        name: data.name,
        location: data.location,
        bairro: data.bairro,
        adminId: data.adminId,
      },
    });
  },

  async getAllDonationPoints() {
    return prisma.collectionPoint.findMany({
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  async getDonationPointById(id) {
    const point = await prisma.collectionPoint.findUnique({
      where: { id },
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!point) {
      throw new Error('Ponto de coleta não encontrado.');
    }

    return point;
  },

  async updateDonationPoint(id, data) {
    const point = await prisma.collectionPoint.findUnique({ where: { id } });

    if (!point) {
      throw new Error('Ponto de coleta não encontrado.');
    }

    // Atualizar o ponto de coleta
    return prisma.collectionPoint.update({
      where: { id },
      data,
    });
  },

  async deleteDonationPoint(id) {
    const point = await prisma.collectionPoint.findUnique({ where: { id } });

    if (!point) {
      throw new Error('Ponto de coleta não encontrado.');
    }

    // Deletar o ponto de coleta
    return prisma.collectionPoint.delete({ where: { id } });
  },
};

module.exports = donationPointService;
