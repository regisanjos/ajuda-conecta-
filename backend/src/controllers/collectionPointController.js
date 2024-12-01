const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const collectionPointController = {
  async create(req, res) {
    try {
      const { name, address, city, neighborhood } = req.body;

      // Validações de entrada
      if (!name || !address || !city || !neighborhood) {
        return res.status(400).json({ error: 'Todos os campos (nome, endereço, cidade e bairro) são obrigatórios.' });
      }

      // Verifica duplicidade (apenas um ponto por bairro/cidade)
      const existingPoint = await prisma.collectionPoint.findFirst({
        where: {
          city,
          neighborhood,
        },
      });

      if (existingPoint) {
        return res.status(400).json({ error: 'Já existe um ponto de coleta cadastrado para este bairro/cidade.' });
      }

      // Cria o ponto de coleta
      const collectionPoint = await prisma.collectionPoint.create({
        data: {
          name,
          address,
          city,
          neighborhood,
          adminId: req.user.id, // Admin logado
        },
      });

      res.status(201).json({ success: true, data: collectionPoint });
    } catch (error) {
      console.error('Erro ao criar ponto de coleta:', error.message);
      res.status(500).json({ error: 'Erro ao criar ponto de coleta.' });
    }
  },

  async getAll(req, res) {
    try {
      const collectionPoints = await prisma.collectionPoint.findMany();
      res.status(200).json({ success: true, data: collectionPoints });
    } catch (error) {
      console.error('Erro ao listar pontos de coleta:', error.message);
      res.status(500).json({ error: 'Erro ao listar pontos de coleta.' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, address, city, neighborhood } = req.body;

      // Validações de entrada
      if (!name || !address || !city || !neighborhood) {
        return res.status(400).json({ error: 'Todos os campos (nome, endereço, cidade e bairro) são obrigatórios.' });
      }

      // Verifica duplicidade ao atualizar
      const existingPoint = await prisma.collectionPoint.findFirst({
        where: {
          city,
          neighborhood,
          NOT: { id: Number(id) },
        },
      });

      if (existingPoint) {
        return res.status(400).json({ error: 'Já existe um ponto de coleta cadastrado para este bairro/cidade.' });
      }

      // Atualiza o ponto de coleta
      const updatedCollectionPoint = await prisma.collectionPoint.update({
        where: { id: Number(id) },
        data: { name, address, city, neighborhood },
      });

      res.status(200).json({ success: true, data: updatedCollectionPoint });
    } catch (error) {
      console.error('Erro ao atualizar ponto de coleta:', error.message);
      res.status(500).json({ error: 'Erro ao atualizar ponto de coleta.' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      // Deleta o ponto de coleta
      await prisma.collectionPoint.delete({ where: { id: Number(id) } });
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar ponto de coleta:', error.message);
      res.status(500).json({ error: 'Erro ao deletar ponto de coleta.' });
    }
  },
};

module.exports = collectionPointController;
