import api from './axios';

export const updateStock = (productId, data) => {
  return api.post(`/products/${productId}/stock`, data);
};

export const getMovementsByProduct = (productId) => {
  return api.get(`/products/${productId}/movements`);
};

export const getAllMovements = (params = {}) => {
  return api.get('/movements', { params });
};
