const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const deliveryController = {
  getAll: async (req, res) => {
    try {
      const deliveries = await prisma.delivery.findMany();
      res.status(200).json({ success: true, deliveries });
    } catch (error) {
      console.error('Erro ao buscar entregas:', error.message);
      res.status(500).json({ error: 'Erro ao buscar entregas.' });
    }
  },
  create: async (req, res) => {
    try {
      const { trackingCode, recipient, address, city, state, status } = req.body;
      const newDelivery = await prisma.delivery.create({
        data: { trackingCode, recipient, address, city, state, status },
      });
      res.status(201).json({ success: true, delivery: newDelivery });
    } catch (error) {
      console.error('Erro ao criar entrega:', error.message);
      res.status(400).json({ error: error.message });
    }
  },
};
module.exports = deliveryController;
