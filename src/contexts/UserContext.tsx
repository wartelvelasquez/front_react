import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, RegisterUserDto, UpdateUserDto } from '../types/user.types';
import userService from '../services/user.service';
import logger from '../utils/logger';

interface UserContextType {
  users: any[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  fetchUserById: (id: string) => Promise<any>;
  createUser: (userData: RegisterUserDto) => Promise<any>;
  updateUser: (id: string, userData: UpdateUserDto) => Promise<any>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  const fetchUsers = async (page: number = 1, limit: number = 5) => {
    try {
      logger.log('🔄 Iniciando fetchUsers...');
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(page, limit);
      logger.log('✅ Response received:', JSON.stringify(response, null, 2));
      logger.log('✅ Response type:', typeof response);
      logger.log('✅ Is Array?', Array.isArray(response));
      logger.log('✅ Response.data?', response?.data);
      logger.log('✅ Response.data is Array?', Array.isArray(response?.data));
      
      // Estructura de tu API: { success, data: { users: [...], pagination: {...} } }
      let usersArray = [];
      let pageInfo = { page: page, totalPages: 1, total: 0 };
      
      if (response && response.data) {
        // Tu API devuelve: response.data.users y response.data.pagination
        if (response.data.users && Array.isArray(response.data.users)) {
          usersArray = response.data.users;
          
          if (response.data.pagination) {
            pageInfo.page = response.data.pagination.page || page;
            pageInfo.totalPages = response.data.pagination.totalPages || 1;
            pageInfo.total = response.data.pagination.total || usersArray.length;
          }
        }
        // Fallback: si viene directamente data como array
        else if (Array.isArray(response.data)) {
          usersArray = response.data;
        }
      }
      // Fallback: si viene como array directo
      else if (Array.isArray(response)) {
        usersArray = response;
      }
      
      logger.log('📊 Users array length:', usersArray.length);
      logger.log('📊 First user:', usersArray[0]);
      logger.log('📊 Page info:', pageInfo);
      
      setUsers(usersArray);
      setCurrentPage(pageInfo.page);
      setTotalPages(pageInfo.totalPages);
      setTotalUsers(pageInfo.total);
      
      logger.log('✅ Users loaded successfully:', usersArray.length, 'users on page', pageInfo.page, 'of', pageInfo.totalPages, '- Total:', pageInfo.total);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al cargar usuarios';
      setError(errorMsg);
      setUsers([]);
      logger.error('❌ Error fetching users:', err);
      logger.error('❌ Error message:', errorMsg);
    } finally {
      setLoading(false);
      logger.log('🏁 fetchUsers completed');
    }
  };

  const fetchUserById = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserById(id);
      return response.data || response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar usuario');
      logger.error('Error fetching user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: RegisterUserDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.createUser(userData);
      await fetchUsers(currentPage); // Refrescar lista
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al crear usuario');
      logger.error('Error creating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: UpdateUserDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.updateUser(id, userData);
      await fetchUsers(currentPage); // Refrescar lista
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar usuario');
      logger.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(id);
      await fetchUsers(currentPage); // Refrescar lista
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al eliminar usuario');
      logger.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        currentPage,
        totalPages,
        totalUsers,
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};

