import { useState, useEffect, useCallback } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products';
import toast from 'react-hot-toast';

function extractError(err) {
  const data = err.response?.data;
  if (data?.fieldErrors) {
    return Object.values(data.fieldErrors).join(', ');
  }
  return data?.message || err.message || 'Something went wrong';
}

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback((query) => {
    setLoading(true);
    getProducts(query || '')
      .then((res) => setProducts(res.data))
      .catch((err) => toast.error(extractError(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts(search);
  }, [search, fetchProducts]);

  const addProduct = async (data) => {
    const res = await createProduct(data);
    setProducts((prev) => [...prev, res.data]);
    toast.success(`${res.data.name} created`);
    return res.data;
  };

  const editProduct = async (id, data) => {
    const res = await updateProduct(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    toast.success(`${res.data.name} updated`);
    return res.data;
  };

  const removeProduct = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Product deleted');
  };

  return {
    products,
    loading,
    search,
    setSearch,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}

export default useProducts;
