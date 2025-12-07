export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  imageUrls?: string[]; // Agora é um array de strings
  createdAt: string;
  updatedAt: string;
}