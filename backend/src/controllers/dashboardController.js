const dashboardService = require('../services/dashboardService');
const { validateFilterOptions } = require('../middlewares/validation');

const handleError = (res, error) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno no servidor.';
  res.status(statusCode).json({ error: message });
};

const dashboardController = {
  async getOverview(req, res) {
    try {
      const overviewData = await dashboardService.getOverviewData();
      res.status(200).json({
        success: true,
        data: overviewData,
      });
    } catch (error) {
      console.error('Erro ao obter dados do overview:', error);
      handleError(res, error);
    }
  },

  async getChartData(req, res) {
    try {
      const { chartType } = req.query;
      const filterOptions = req.query;

      // Validação de chartType
      if (!chartType || !['donationsByDisaster', 'donationsOverTime', 'donationsByStatus'].includes(chartType)) {
        return res.status(400).json({ error: 'Tipo de gráfico inválido' });
      }

      // Validação de filtros
      const validationError = validateFilterOptions(filterOptions);
      if (validationError) return res.status(400).json({ error: validationError });

      const chartData = await dashboardService.getChartData(chartType, filterOptions);
      res.status(200).json({
        success: true,
        data: chartData,
      });
    } catch (error) {
      console.error('Erro ao obter dados do gráfico:', error);
      handleError(res, error);
    }
  },
};

module.exports = dashboardController;
