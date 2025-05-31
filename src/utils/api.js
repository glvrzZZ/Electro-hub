const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || response.statusText || 'Ошибка сервера';
    throw new Error(errorMessage);
  }
  return response.json();
}

export const fetchProducts = async (filters) => {
  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.category) params.append('category', filters.category);
  if (filters.manufacturer) params.append('manufacturer', filters.manufacturer);
  if (filters.min_price) params.append('min_price', filters.min_price);
  if (filters.max_price) params.append('max_price', filters.max_price);
  if (filters.sort) params.append('sort', filters.sort);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const url = `${API_BASE_URL}/api/products?${params.toString()}`;
  const response = await fetch(url);
  return await handleResponse(response);
};

export const fetchCategories = async () => {
  const url = `${API_BASE_URL}/api/categories`;
  const response = await fetch(url);
  return await handleResponse(response);
};

export const fetchManufacturers = async () => {
  const url = `${API_BASE_URL}/api/manufacturers`;
  const response = await fetch(url);
  return await handleResponse(response);
};

export const fetchProductDetails = async (productId) => {
  const url = `${API_BASE_URL}/api/products/${productId}`;
  const response = await fetch(url);
  return await handleResponse(response);
};
