const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const errorHandler = require('./middlewares/errorHandler');

// Rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const donationRoutes = require('./routes/donationRoutes');
const disasterRoutes = require('./routes/disasterRoutes');
const donationExitRoutes = require('./routes/donationExitRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const etaRoutes = require('./routes/etaRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const donationPointRoutes = require('./routes/donationPointRoutes'); // Rotas de pontos de coleta

const app = express();

// Configuração de middlewares globais
app.use(cors({
  origin: 'http://localhost:3000', // Permitir conexões do front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
app.use(express.json()); // Interpretar JSON nas requisições

// Tratamento de JSON inválido
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'JSON inválido' });
  }
  next();
});

app.use(loggerMiddleware); // Middleware para logs de requisições

// Prefixo base para a API
const apiBase = '/api/v1';

// Configuração de rotas
app.use(`${apiBase}/auth`, authRoutes);
app.use(`${apiBase}/users`, userRoutes);
app.use(`${apiBase}/donations`, donationRoutes);
app.use(`${apiBase}/disasters`, disasterRoutes);
app.use(`${apiBase}/donations-exit`, donationExitRoutes);
app.use(`${apiBase}/dashboard`, dashboardRoutes);
app.use(`${apiBase}/etas`, etaRoutes);
app.use(`${apiBase}/notifications`, notificationRoutes);
app.use(`${apiBase}/collection-points`, donationPointRoutes); // Rota para pontos de coleta

// Tratamento para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
