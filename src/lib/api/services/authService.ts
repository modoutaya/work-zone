import { apiClient, authManager } from '../client';

// Auth endpoints
const AUTH_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  me: '/auth/me',
  register: '/auth/register',
};

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Service
export class AuthService {
  // Login user
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.login, credentials);
    
    // Store tokens
    authManager.setToken(response.data.accessToken);
    authManager.setRefreshToken(response.data.refreshToken);
    
    return response.data;
  }

  // Register user
  static async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.register, data);
    
    // Store tokens
    authManager.setToken(response.data.accessToken);
    authManager.setRefreshToken(response.data.refreshToken);
    
    return response.data;
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await apiClient.post(AUTH_ENDPOINTS.logout);
    } catch (error) {
      // Even if server call fails, clear local tokens
      console.warn('Logout server call failed, clearing local tokens');
    } finally {
      // Always clear local tokens
      authManager.clearTokens();
    }
  }

  // Refresh access token
  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = authManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.refresh, {
      refreshToken,
    });
    
    // Update tokens
    authManager.setToken(response.data.accessToken);
    authManager.setRefreshToken(response.data.refreshToken);
    
    return response.data;
  }

  // Get current user info
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.me);
    return response.data;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return authManager.isAuthenticated();
  }

  // Get stored user info (from localStorage or cache)
  static getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Store user info
  static storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Clear stored user info
  static clearStoredUser(): void {
    localStorage.removeItem('user');
  }
} 