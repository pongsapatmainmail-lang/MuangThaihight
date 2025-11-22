import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = () => api.get('/products/');
export const getCategories = () => api.get('/categories/');
export const getProductById = (id) => api.get(`/products/${id}/`);