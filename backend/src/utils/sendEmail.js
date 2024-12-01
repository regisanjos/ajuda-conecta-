const nodemailer = require("nodemailer");
const config = require("../config/config");

/**
 * Configura o transporte de e-mail com base nas configurações.
 */
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // SSL se a porta for 465
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

/**
 * Envia um e-mail com suporte a texto e HTML.
 * @param {string} to - Destinatário do e-mail.
 * @param {string} subject - Assunto do e-mail.
 * @param {string} text - Texto simples do corpo do e-mail.
 * @param {string} [html] - Corpo do e-mail em HTML (opcional).
 * @returns {Promise<object>} Retorna o resultado do envio.
 * @throws {Error} Lança erro se o envio falhar.
 */
const sendEmail = async (to, subject, text, html = null) => {
  // Validações básicas
  if (!to || !subject || (!text && !html)) {
    throw new Error("Os campos 'to', 'subject' e 'text/html' são obrigatórios.");
  }

  const mailOptions = {
    from: config.email.user,
    to,
    subject,
    text,
    html, // Adiciona suporte a HTML
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso:", info.messageId);
    return {
      success: true,
      message: `Email enviado para ${to}`,
      info,
    };
  } catch (error) {
    console.error("Erro ao enviar email:", error.message);
    throw new Error("Erro ao enviar email. Por favor, tente novamente mais tarde.");
  }
};

module.exports = sendEmail;
