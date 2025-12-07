import type { Product } from '../types/product'; // CORREÇÃO 1: 'import type'

// Assumindo que você tem uma função para obter o token de autenticação
const getAuthHeaders = () => ({
  // Alterado de 'access_token' para 'token'
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

const BASE_URL = 'http://localhost:3000/products'; // Porta padrão NestJS

export const ProductApi = {
  // READ ALL
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      
      // CORREÇÃO 2: Garante que o retorno é um array. Se não for, retorna [].
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return []; // Retorna lista vazia em caso de erro para não quebrar o front
    }
  },

  // CREATE
  createProduct: async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  // UPDATE
  updateProduct: async (id: number, data: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // DELETE
  deleteProduct: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },
};