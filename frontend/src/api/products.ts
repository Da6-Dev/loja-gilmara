import type { Product } from '../types/product';

// Headers sem Content-Type para ser usado com FormData (upload de arquivo)
const getAuthHeaders = () => ({
  // Alterado de 'access_token' para 'token'
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// Headers com Content-Type explícito para operações JSON (READ/PATCH/DELETE)
const getJsonHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
});

const BASE_URL = 'http://localhost:3000/products'; // Porta padrão NestJS

export const ProductApi = {
  // READ ALL (Usa headers JSON)
  getProducts: async (): Promise<Product[]> => {
    try {
      // Usa getJsonHeaders (pois espera JSON)
      const response = await fetch(BASE_URL, { headers: getJsonHeaders() }); 
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      
      // Garante que o retorno é um array. Se não for, retorna [].
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      return []; // Retorna lista vazia em caso de erro para não quebrar o front
    }
  },

  // CREATE (ALTERADO: Agora aceita FormData que inclui o arquivo)
  createProduct: async (formData: FormData): Promise<Product> => {
    // Usa getAuthHeaders (sem Content-Type) e envia FormData
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });
    if (!response.ok) {
        // Tenta ler o erro do backend se o status for 4xx ou 5xx
        const errorData = await response.json().catch(() => ({ message: 'Failed to create product (No JSON error response)' }));
        throw new Error(errorData.message || 'Failed to create product');
    }
    return response.json();
  },

  // UPDATE (Usa headers JSON)
  updateProduct: async (id: number, data: FormData | Partial<Product>): Promise<Product> => {
    const isFormData = data instanceof FormData;
    
    // Se for FormData, usa headers normais (browser define boundary). Se for JSON, usa Content-Type json.
    const headers = isFormData ? getAuthHeaders() : getJsonHeaders();
    const body = isFormData ? data : JSON.stringify(data);

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers, 
      body,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Failed to update product' }));
        throw new Error(err.message || 'Failed to update product');
    }
    return response.json();
  },

  // DELETE (Usa headers JSON)
  deleteProduct: async (id: number): Promise<void> => {
    // Usa getJsonHeaders (pois espera JSON)
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getJsonHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },
};
