const prisma = require('../config/db');
const userService = require('./userService');
const donationService = require('./donationService');
const disasterService = require('./disasterService');

const dashboardService = {
  async getOverviewData() {
    try {
      const [totalUsers, totalDonations, totalActiveDisasters, recentUsers, recentDisasters] = await Promise.all([
        userService.getTotalUsers(),
        donationService.getTotalDonations(),
        disasterService.getTotalActiveDisasters(),
        userService.getRecentUsers(),
        disasterService.getRecentDisasters(),
      ]);

      return {
        success: true,
        data: {
          totalUsers,
          totalDonations,
          totalActiveDisasters,
          recentUsers,
          recentDisasters,
        },
      };
    } catch (error) {
      console.error('Erro ao obter dados de visão geral:', error.message);
      throw new Error('Erro ao obter dados de visão geral.');
    }
  },

  async getChartData(chartType, filterOptions) {
    try {
      switch (chartType) {
        case 'donationsByDisaster':
          return {
            success: true,
            data: await this.getDonationsByDisaster(filterOptions),
          };
        case 'donationsOverTime':
          return {
            success: true,
            data: await this.getDonationsOverTime(filterOptions),
          };
        case 'donationsByStatus':
          return {
            success: true,
            data: await donationService.getDonationsByStatus(),
          };
        default:
          throw new Error('Tipo de gráfico inválido.');
      }
    } catch (error) {
      console.error('Erro ao obter dados do gráfico:', error.message);
      throw new Error('Erro ao obter dados do gráfico.');
    }
  },

  async getDonationsByDisaster(filterOptions) {
    try {
      const { startDate, endDate, disasterIds } = filterOptions;

      const whereConditions = {
        ...(startDate && endDate && {
          createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
        }),
        ...(disasterIds && {
          disasterId: { in: disasterIds.map((id) => parseInt(id)) },
        }),
      };

      const donationsByDisaster = await prisma.donation.groupBy({
        by: ['disasterId'],
        _count: {
          id: true,
        },
        where: whereConditions,
      });

      const disasterNames = await prisma.disaster.findMany({
        where: { id: { in: donationsByDisaster.map((item) => item.disasterId) } },
        select: { id: true, name: true },
      });

      const chartData = donationsByDisaster.map((item) => {
        const disaster = disasterNames.find((d) => d.id === item.disasterId);
        return {
          disasterName: disaster ? disaster.name : 'Desconhecido',
          totalDonations: item._count.id,
        };
      });

      return chartData;
    } catch (error) {
      console.error('Erro ao agrupar doações por desastre:', error.message);
      throw new Error('Erro ao agrupar doações por desastre.');
    }
  },

  async getDonationsOverTime(filterOptions) {
    try {
      const { startDate, endDate } = filterOptions;

      const donationsOverTime = await prisma.donation.groupBy({
        by: ['createdAt'],
        _count: {
          id: true,
        },
        where: {
          ...(startDate && endDate && {
            createdAt: { gte: new Date(startDate), lte: new Date(endDate) },
          }),
        },
      });

      const chartData = donationsOverTime.map((item) => ({
        date: item.createdAt.toISOString().split('T')[0], // Retorna apenas a data
        totalDonations: item._count.id,
      }));

      return chartData;
    } catch (error) {
      console.error('Erro ao agrupar doações ao longo do tempo:', error.message);
      throw new Error('Erro ao agrupar doações ao longo do tempo.');
    }
  },
};

module.exports = dashboardService;
