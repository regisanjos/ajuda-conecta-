const errorHandler = (err, req, res, next) => {
    // Logs de erros detalhados em desenvolvimento, simplificados em produção
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    } else {
      console.error(err.message);
    }
  
    const statusCode = err.statusCode || 500;
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Erro interno do servidor'
        : err.message || 'Erro interno do servidor';
  
    // Tratamento de erros de validação
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        errors: err.errors || [{ message: err.message }],
      });
    }
  
    // Tratamento de erros genéricos com estrutura uniforme
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }), // Inclui o stack trace apenas em desenvolvimento
      },
    });
  };
  
  module.exports = errorHandler;
  