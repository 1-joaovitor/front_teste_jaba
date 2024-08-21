import api from './api';
import { isAuthenticated } from 'src/context/AuthContext';

export const getCategories = async () => {
  try {
    const response = await api.get('/categories', {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
    
return response?.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addCategory = async (category:{name:string}) => {
  try {
    const response = await api.post('/categories', category, {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
    
return response?.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const editCategory = async (id:number, category:{name:string}) => {
  try {
    const response = await api.put(`/categories/${id}`, category, {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
    
return response?.data;
  } catch (error) {
    console.error('Error editing category:', error);
    throw error;
  }
};

export const deleteCategory = async (id:number) => {
  try {
    await api.delete(`/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${isAuthenticated()}`,
      },
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
