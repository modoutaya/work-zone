import { useAppStore } from '../../store/appStore';

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retries: 3,
};

// Request/Response types
export interface ApiRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Auth token management
class AuthManager {
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  clearTokens(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Interceptors
class RequestInterceptor {
  intercept(request: ApiRequest): ApiRequest {
    // Add auth token
    const authManager = new AuthManager();
    if (authManager.isAuthenticated()) {
      request.headers = {
        ...request.headers,
        'Authorization': `Bearer ${authManager.getToken()}`,
      };
    }

    // Add default headers
    request.headers = {
      'Content-Type': 'application/json',
      ...request.headers,
    };

    return request;
  }
}

class ResponseInterceptor {
  async intercept<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'An error occurred',
        status: response.status,
        code: data.code,
        details: data.details,
      };

      // Handle specific error cases
      if (response.status === 401) {
        // Unauthorized - clear tokens and redirect to login
        const authManager = new AuthManager();
        authManager.clearTokens();
        useAppStore.getState().setError('Session expired. Please login again.');
        // Could redirect to login page here
      } else if (response.status === 403) {
        useAppStore.getState().setError('Access denied. You don\'t have permission for this action.');
      } else if (response.status >= 500) {
        useAppStore.getState().setError('Server error. Please try again later.');
      }

      throw error;
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    };
  }
}

// API Client
class ApiClient {
  private requestInterceptor = new RequestInterceptor();
  private responseInterceptor = new ResponseInterceptor();

  private async makeRequest<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    const interceptedRequest = this.requestInterceptor.intercept(request);
    
    // Build URL with query parameters
    const url = new URL(interceptedRequest.url, API_CONFIG.baseURL);
    if (interceptedRequest.params) {
      Object.entries(interceptedRequest.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: interceptedRequest.method,
      headers: interceptedRequest.headers,
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    };

    if (interceptedRequest.data && interceptedRequest.method !== 'GET') {
      fetchOptions.body = JSON.stringify(interceptedRequest.data);
    }

    // Make request with retry logic
    let lastError: ApiError;
    
    for (let attempt = 0; attempt < API_CONFIG.retries; attempt++) {
      try {
        const response = await fetch(url.toString(), fetchOptions);
        return await this.responseInterceptor.intercept<T>(response);
      } catch (error) {
        lastError = error as ApiError;
        
        // Don't retry on client errors (4xx)
        if (lastError.status && lastError.status >= 400 && lastError.status < 500) {
          throw lastError;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < API_CONFIG.retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }
    
    throw lastError!;
  }

  // HTTP methods
  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ url, method: 'GET', params });
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ url, method: 'POST', data });
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ url, method: 'PUT', data });
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ url, method: 'PATCH', data });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({ url, method: 'DELETE' });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export const authManager = new AuthManager(); 