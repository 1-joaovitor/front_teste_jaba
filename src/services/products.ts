import api from './api';
import { isAuthenticated } from 'src/context/AuthContext';

export interface Product {
  id: number;
  name: string;
  registration_date: string;
  price: number;
  user_id: number;
  categories: { id: number; name: string }[];
  category_ids?: number[]
}

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/products', {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
    
return response?.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const addProduct = async (product: Omit<Product, "id" | "categories" | 'category_ids'> & { user_id: number }) => {
  try {
    const response = await api.post('/products', product, {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
    
return response?.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const editProduct = async (id: number, product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await api.put(`/products/${id}`, product, {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
    
return response?.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
