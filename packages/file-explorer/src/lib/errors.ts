/**
 * API Error Handling Utilities
 * Provides standardized error handling for all API calls
 */

export enum ApiErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT = "TIMEOUT",
  SERVER_ERROR = "SERVER_ERROR",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  PARSE_ERROR = "PARSE_ERROR",
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  originalError?: unknown;
  retryable: boolean;
}

/**
 * Parses an error and returns a standardized ApiError
 */
export function parseApiError(error: unknown): ApiError {
  // Handle Axios errors
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { status: number; data?: unknown }; message?: string };
    const status = axiosError.response?.status;

    switch (status) {
      case 401:
        return {
          type: ApiErrorType.UNAUTHORIZED,
          message: "You are not authenticated. Please log in.",
          statusCode: 401,
          originalError: error,
          retryable: false,
        };
      case 403:
        return {
          type: ApiErrorType.FORBIDDEN,
          message: "You don't have permission to perform this action.",
          statusCode: 403,
          originalError: error,
          retryable: false,
        };
      case 404:
        return {
          type: ApiErrorType.NOT_FOUND,
          message: "The requested resource was not found.",
          statusCode: 404,
          originalError: error,
          retryable: false,
        };
      case 422:
        return {
          type: ApiErrorType.VALIDATION_ERROR,
          message: "The provided data is invalid. Please check your input.",
          statusCode: 422,
          originalError: error,
          retryable: false,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ApiErrorType.SERVER_ERROR,
          message: "The server encountered an error. Please try again later.",
          statusCode: status,
          originalError: error,
          retryable: true,
        };
      default:
        if (status && status >= 400) {
          return {
            type: ApiErrorType.UNKNOWN_ERROR,
            message: axiosError.message || "An unexpected error occurred.",
            statusCode: status,
            originalError: error,
            retryable: false,
          };
        }
    }
  }

  // Handle network errors (Axios network error)
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: string }).code;
    if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
      return {
        type: ApiErrorType.TIMEOUT,
        message: "The request timed out. Please check your connection and try again.",
        originalError: error,
        retryable: true,
      };
    }
    if (code === "ERR_NETWORK" || code === "ECONNREFUSED" || code === "ENOTFOUND") {
      return {
        type: ApiErrorType.NETWORK_ERROR,
        message: "Unable to connect to the server. Please check your internet connection.",
        originalError: error,
        retryable: true,
      };
    }
  }

  // Handle network errors (no response property)
  if (error && typeof error === "object" && "request" in error && !("response" in error)) {
    return {
      type: ApiErrorType.NETWORK_ERROR,
      message: "Network error: Unable to reach the server. The API may be offline.",
      originalError: error,
      retryable: true,
    };
  }

  // Handle JSON parse errors
  if (error instanceof SyntaxError && error.message.includes("JSON")) {
    return {
      type: ApiErrorType.PARSE_ERROR,
      message: "Received invalid data from the server. The response was corrupted.",
      originalError: error,
      retryable: true,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      type: ApiErrorType.UNKNOWN_ERROR,
      message: error.message || "An unexpected error occurred.",
      originalError: error,
      retryable: false,
    };
  }

  // Fallback for unknown error types
  return {
    type: ApiErrorType.UNKNOWN_ERROR,
    message: "An unexpected error occurred. Please try again.",
    originalError: error,
    retryable: false,
  };
}

/**
 * Retries an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const apiError = parseApiError(error);

      // Don't retry non-retryable errors
      if (!apiError.retryable || attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Creates a promise that rejects after a timeout
 */
export function createTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
}

/**
 * Race between a promise and a timeout
 */
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([promise, createTimeoutPromise(timeoutMs)]);
}

/**
 * Validates and safely parses JSON
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    console.warn("Failed to parse JSON, returning default value");
    return defaultValue;
  }
}

/**
 * Check if an error is a network-related error
 */
export function isNetworkError(error: unknown): boolean {
  const apiError = parseApiError(error);
  return apiError.type === ApiErrorType.NETWORK_ERROR || apiError.type === ApiErrorType.TIMEOUT;
}

/**
 * Check if an error is a server error (5xx)
 */
export function isServerError(error: unknown): boolean {
  const apiError = parseApiError(error);
  return apiError.type === ApiErrorType.SERVER_ERROR;
}

/**
 * User-friendly error messages for display
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const apiError = parseApiError(error);
  return apiError.message;
}
