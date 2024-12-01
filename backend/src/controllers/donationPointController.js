const donationPointService = require('../services/donationPointService');

const donationPointController = {
  async create(req, res) {
    try {
      const { name, location, bairro } = req.body;
      const adminId = req.user.id; // ID do admin autenticado

      const newPoint = await donationPointService.createDonationPoint({ name, location, bairro, adminId });

      res.status(201).json({ success: true, data: newPoint });
    } catch (error) {
      console.error('Erro ao criar ponto de coleta:', error.message);
      res.status(400).json({ error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const points = await donationPointService.getAllDonationPoints();
      res.status(200).json({ success: true, data: points });
    } catch (error) {
      console.error('Erro ao buscar pontos de coleta:', error.message);
      res.status(500).json({ error: 'Erro ao buscar pontos de coleta.' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const point = await donationPointService.getDonationPointById(parseInt(id));

      res.status(200).json({ success: true, data: point });
    } catch (error) {
      console.error('Erro ao buscar ponto de coleta:', error.message);
      res.status(404).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, location, bairro } = req.body;

      const updatedPoint = await donationPointService.updateDonationPoint(parseInt(id), { name, location, bairro });

      res.status(200).json({ success: true, data: updatedPoint });
    } catch (error) {
      console.error('Erro ao atualizar ponto de coleta:', error.message);
      res.status(404).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      await donationPointService.deleteDonationPoint(parseInt(id));

      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar ponto de coleta:', error.message);
      res.status(404).json({ error: error.message });
    }
  },
};

module.exports = donationPointController;
