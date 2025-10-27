// URL del API Gateway
// Para Android Emulator usa 10.0.2.2 en lugar de localhost
export const API_BASE_URL = 'http://192.168.1.10:5000/api/v1';

export const API_ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
} as const;

export const DEFAULT_PAGE_SIZE = 5;

