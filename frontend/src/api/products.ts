// Assumindo que você tem uma função para obter o token de autenticação
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json',
});

const BASE_URL = 'http://localhost:3000/products'; // Porta padrão NestJS

export const ProductApi = {
  // READ ALL
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
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
