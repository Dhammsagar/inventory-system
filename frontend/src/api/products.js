import api from './axios';

export const getProducts = (search) => {
  const params = search ? { search } : {};
  return api.get('/products', { params });
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const createProduct = (data) => {
  return api.post('/products', data);
};

export const updateProduct = (id, data) => {
  return api.put(`/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

export const getLowStockProducts = () => {
  return api.get('/products/low-stock');
};
