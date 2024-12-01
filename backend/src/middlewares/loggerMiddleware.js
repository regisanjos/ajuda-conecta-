const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    const logDetails = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    if (process.env.NODE_ENV !== 'production') {
      // Logs detalhados em desenvolvimento
      console.log(JSON.stringify(logDetails, null, 2));
    } else {
      // Logs simplificados em produção
      console.log(`[${logDetails.timestamp}] ${logDetails.method} ${logDetails.url} ${logDetails.status} ${logDetails.duration}`);
    }
  });

  next();
};

module.exports = loggerMiddleware;
