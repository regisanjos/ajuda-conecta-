/**
 * Calcula a distância entre duas coordenadas geográficas usando a fórmula de Haversine.
 * @param {number} lat1 - Latitude do primeiro ponto.
 * @param {number} lon1 - Longitude do primeiro ponto.
 * @param {number} lat2 - Latitude do segundo ponto.
 * @param {number} lon2 - Longitude do segundo ponto.
 * @returns {number} Distância em quilômetros.
 * @throws {Error} Lança erro se as coordenadas forem inválidas.
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Validação das coordenadas
  const isValidLatitude = (lat) => typeof lat === "number" && lat >= -90 && lat <= 90;
  const isValidLongitude = (lon) => typeof lon === "number" && lon >= -180 && lon <= 180;

  if (!isValidLatitude(lat1) || !isValidLatitude(lat2)) {
    throw new Error("Latitude inválida. Deve estar entre -90 e 90.");
  }
  if (!isValidLongitude(lon1) || !isValidLongitude(lon2)) {
    throw new Error("Longitude inválida. Deve estar entre -180 e 180.");
  }

  const R = 6371; // Raio da Terra em km
  const toRad = (value) => (value * Math.PI) / 180; // Converte graus para radianos

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km
  return distance;
};

module.exports = { calculateDistance };
