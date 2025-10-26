import apiService from './api.service';
import { API_ENDPOINTS, DEFAULT_PAGE_SIZE, API_BASE_URL } from '../constants/api.constants';
import { User, RegisterUserDto, UpdateUserDto, PaginatedResponse } from '../types/user.types';
import logger from '../utils/logger';

class UserService {
  async getUsers(page: number = 1, limit: number = DEFAULT_PAGE_SIZE): Promise<any> {
    logger.log('🔄 Iniciando getUsers...');
    logger.log('📍 API_BASE_URL:', API_BASE_URL);
    logger.log('📍 Endpoint:', API_ENDPOINTS.USERS);
    const url = `${API_ENDPOINTS.USERS}?page=${page}&limit=${limit}`;
    logger.log('📍 URL completa:', `${API_BASE_URL}${url}`);
    return await apiService.get(url);
  }

  async getUserById(id: string): Promise<any> {
    return apiService.get(API_ENDPOINTS.USER_BY_ID(id));
  }

  async createUser(userData: RegisterUserDto): Promise<any> {
    return apiService.post(API_ENDPOINTS.USERS, userData);
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<any> {
    return apiService.put(API_ENDPOINTS.USER_BY_ID(id), userData);
  }

  async deleteUser(id: string): Promise<any> {
    return apiService.delete(API_ENDPOINTS.USER_BY_ID(id));
  }
}

export default new UserService();

