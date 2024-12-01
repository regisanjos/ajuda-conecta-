/**
 * Formata uma data no formato DD/MM/AAAA
 * @param {Date} date - Objeto Date válido
 * @returns {string} Data formatada no padrão brasileiro (DD/MM/AAAA)
 * @throws {Error} Lança erro se a data for inválida
 */
const formatDateBR = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error("Data inválida. Certifique-se de passar um objeto Date válido.");
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Calcula o número de dias entre duas datas
 * @param {Date} date1 - Primeira data
 * @param {Date} date2 - Segunda data
 * @returns {number} Número de dias entre as duas datas
 * @throws {Error} Lança erro se qualquer data for inválida
 */
const daysBetweenDates = (date1, date2) => {
    if (!(date1 instanceof Date) || !(date2 instanceof Date) || isNaN(date1) || isNaN(date2)) {
        throw new Error("Datas inválidas. Certifique-se de passar objetos Date válidos.");
    }

    const oneDay = 24 * 60 * 60 * 1000; // Número de milissegundos em um dia
    const diffMs = Math.abs(date1 - date2); // Diferença absoluta em milissegundos

    return Math.round(diffMs / oneDay);
};

module.exports = {
    formatDateBR,
    daysBetweenDates,
};
