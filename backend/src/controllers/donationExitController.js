const donationExitService = require('../services/donationExitService'); // Certifique-se de que o service existe

const donationExitController = {
  async create(req, res) {
    try {
      const donationExit = await donationExitService.create(req.body);
      res.status(201).json({ success: true, data: donationExit });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const donationExits = await donationExitService.getAll();
      res.status(200).json({ success: true, data: donationExits });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const donationExit = await donationExitService.getById(req.params.id);
      if (!donationExit) {
        return res.status(404).json({ success: false, message: 'Doação não encontrada' });
      }
      res.status(200).json({ success: true, data: donationExit });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const updatedDonationExit = await donationExitService.update(req.params.id, req.body);
      if (!updatedDonationExit) {
        return res.status(404).json({ success: false, message: 'Doação não encontrada para atualizar' });
      }
      res.status(200).json({ success: true, data: updatedDonationExit });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      await donationExitService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = donationExitController;
