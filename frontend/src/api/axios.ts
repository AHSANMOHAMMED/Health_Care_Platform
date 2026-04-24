import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { handleApiError, logError, withRetry } from '../utils/errorHandler';

const getResponseMessage = (payload: unknown): string | undefined => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
};

// Request/Response interfaces for better type safety
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Loading state management
let activeRequests = 0;
const loadingListeners: ((isLoading: boolean) => void)[] = [];

export const addLoadingListener = (listener: (isLoading: boolean) => void) => {
  loadingListeners.push(listener);
};

export const removeLoadingListener = (listener: (isLoading: boolean) => void) => {
  const index = loadingListeners.indexOf(listener);
  if (index > -1) {
    loadingListeners.splice(index, 1);
  }
};

const notifyLoadingListeners = () => {
  const isLoading = activeRequests > 0;
  loadingListeners.forEach(listener => listener(isLoading));
};

// Create axios instance with enhanced configuration
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || '/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    activeRequests++;
    notifyLoadingListeners();

    // Add authentication token
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
    }

    return config;
  },
  (error) => {
    activeRequests--;
    notifyLoadingListeners();
    logError(error, 'Request Interceptor');
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    activeRequests--;
    notifyLoadingListeners();

    // Calculate request duration
    const endTime = new Date();
    const duration = response.config.metadata?.startTime
      ? endTime.getTime() - response.config.metadata.startTime.getTime()
      : 0;

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`, {
        status: response.status,
        data: response.data
      });
    }

    return response;
  },
  async (error) => {
    activeRequests--;
    notifyLoadingListeners();

    const apiError = handleApiError(error);
    
    // Log error
    logError(error, `${error.config?.method?.toUpperCase()} ${error.config?.url}`);

    // Handle authentication errors
    if (apiError.code === 'UNAUTHORIZED') {
      const authStore = useAuthStore.getState();
      authStore.logout();
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?message=Your session has expired. Please log in again.';
      }
    }

    // Retry on server errors or network issues
    if ((apiError.status && apiError.status >= 500) || apiError.code === 'NETWORK_ERROR') {
      const originalRequest = error.config;
      
      // Don't retry if already retried or it's a POST/PUT/DELETE request
      if (!originalRequest._retry && originalRequest.method === 'get') {
        originalRequest._retry = true;
        
        try {
          return await withRetry(() => api(originalRequest), 3, 2000);
        } catch (retryError) {
          logError(retryError, 'Retry Failed');
        }
      }
    }

    // Transform error to have consistent format
    const enhancedError = {
      ...error,
      handledError: apiError,
      config: error.config,
      response: error.response
    };

    return Promise.reject(enhancedError);
  }
);

// Enhanced API methods with better error handling
export const apiRequest = {
  // GET request
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.get<T>(url, config);
      return {
        data: response.data,
        message: getResponseMessage(response.data),
        status: response.status
      };
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post<T>(url, data, config);
      return {
        data: response.data,
        message: getResponseMessage(response.data),
        status: response.status
      };
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.put<T>(url, data, config);
      return {
        data: response.data,
        message: getResponseMessage(response.data),
        status: response.status
      };
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.patch<T>(url, data, config);
      return {
        data: response.data,
        message: getResponseMessage(response.data),
        status: response.status
      };
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const response = await api.delete<T>(url, config);
      return {
        data: response.data,
        message: getResponseMessage(response.data),
        status: response.status
      };
    } catch (error) {
      throw error;
    }
  },

  // File upload
  upload: async <T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<T>(url, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config?.headers
        }
      });

      return {
        data: response.data,
        message: getResponseMessage(response.data),
        status: response.status
      };
    } catch (error) {
      throw error;
    }
  }
};

// Utility function to check if there are active requests
export const isLoading = () => activeRequests > 0;

// Add type declaration for axios config metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime?: Date;
    };
    _retry?: boolean;
  }
}
