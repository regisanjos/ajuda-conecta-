const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Redimensiona uma imagem para as dimensões especificadas.
 * @param {string} imagePath - Caminho da imagem de entrada.
 * @param {number} width - Largura desejada (em pixels).
 * @param {number} height - Altura desejada (em pixels).
 * @param {Object} options - Opções adicionais.
 * @param {string} [options.format] - Formato da imagem de saída (ex.: "jpeg", "png").
 * @param {number} [options.quality] - Qualidade da imagem de saída (0-100, aplicável a JPEG).
 * @returns {string} Caminho do arquivo redimensionado.
 * @throws {Error} Lança erro se o caminho da imagem ou dimensões forem inválidos.
 */
const resizeImage = async (imagePath, width, height, options = {}) => {
  try {
    // Validações de entrada
    if (!fs.existsSync(imagePath)) {
      throw new Error('O caminho da imagem não existe.');
    }
    if (typeof width !== 'number' || width <= 0) {
      throw new Error('A largura deve ser um número positivo.');
    }
    if (typeof height !== 'number' || height <= 0) {
      throw new Error('A altura deve ser um número positivo.');
    }

    const { format = 'jpeg', quality = 80 } = options;

    // Caminho de saída
    const outputPath = path.join(
      path.dirname(imagePath),
      `resized-${width}x${height}-${path.basename(imagePath)}`
    );

    // Redimensiona e salva a imagem
    await sharp(imagePath)
      .resize(width, height)
      .toFormat(format, { quality })
      .toFile(outputPath);

    console.log(`Imagem redimensionada com sucesso: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Erro ao redimensionar imagem:', error.message);
    throw new Error('Erro ao processar imagem');
  }
};

module.exports = { resizeImage };
