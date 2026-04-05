import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  public status?: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data;

    // Network errors
    if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
      return {
        message: 'Network error. Please check your internet connection.',
        status: 0,
        code: 'NETWORK_ERROR'
      };
    }

    // Timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        message: 'Request timed out. Please try again.',
        status: 408,
        code: 'TIMEOUT'
      };
    }

    // Server response errors
    if (status && data) {
      switch (status) {
        case 400:
          return {
            message: data.message || 'Invalid request. Please check your input.',
            status,
            code: 'BAD_REQUEST',
            details: data.errors
          };
        
        case 401:
          return {
            message: 'Your session has expired. Please log in again.',
            status,
            code: 'UNAUTHORIZED'
          };
        
        case 403:
          return {
            message: 'You do not have permission to perform this action.',
            status,
            code: 'FORBIDDEN'
          };
        
        case 404:
          return {
            message: 'The requested resource was not found.',
            status,
            code: 'NOT_FOUND'
          };
        
        case 409:
          return {
            message: data.message || 'Conflict with existing data.',
            status,
            code: 'CONFLICT'
          };
        
        case 422:
          return {
            message: data.message || 'Invalid data provided.',
            status,
            code: 'VALIDATION_ERROR',
            details: data.errors
          };
        
        case 429:
          return {
            message: 'Too many requests. Please try again later.',
            status,
            code: 'RATE_LIMITED'
          };
        
        case 500:
          return {
            message: 'Server error. Please try again later.',
            status,
            code: 'SERVER_ERROR'
          };
        
        case 502:
        case 503:
        case 504:
          return {
            message: 'Service temporarily unavailable. Please try again later.',
            status,
            code: 'SERVICE_UNAVAILABLE'
          };
        
        default:
          return {
            message: data.message || `Request failed with status ${status}.`,
            status,
            code: 'UNKNOWN_ERROR'
          };
      }
    }

    // Other Axios errors
    return {
      message: error.message || 'An unexpected error occurred.',
      status,
      code: 'AXIOS_ERROR'
    };
  }

  // Non-API errors
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'APP_ERROR'
    };
  }

  // Unknown errors
  return {
    message: 'An unexpected error occurred.',
    code: 'UNKNOWN_ERROR'
  };
};

export const getErrorMessage = (error: ApiError): string => {
  return error.message;
};

export const isNetworkError = (error: ApiError): boolean => {
  return error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT';
};

export const isAuthError = (error: ApiError): boolean => {
  return error.code === 'UNAUTHORIZED' || error.code === 'FORBIDDEN';
};

export const isServerError = (error: ApiError): boolean => {
  return error.status ? error.status >= 500 : false;
};

export const isClientError = (error: ApiError): boolean => {
  return error.status ? error.status >= 400 && error.status < 500 : false;
};

// Error logging utility
export const logError = (error: unknown, context?: string) => {
  const apiError = handleApiError(error);
  
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    ...apiError,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  console.error('Application Error:', errorLog);

  // In production, send to error reporting service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to your error reporting service
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorLog)
    // }).catch(err => {
    //   console.error('Failed to log error:', err);
    // });
  }
};

// Retry utility for failed requests
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const apiError = handleApiError(error);

      // Don't retry on client errors (4xx)
      if (isClientError(apiError)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};
