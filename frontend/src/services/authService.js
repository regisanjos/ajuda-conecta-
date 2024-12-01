import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/auth'; // Atualize conforme o ambiente

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro desconhecido.' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Erro desconhecido.' };
  }
};
