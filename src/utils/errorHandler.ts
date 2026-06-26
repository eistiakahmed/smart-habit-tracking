/**
 * Centralized Error Handling Utility
 * Provides consistent error handling across the application
 */

export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: unknown;
  timestamp: Date;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: AppError[] = [];
  private maxErrors = 50; // Keep only last 50 errors

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Log an error with consistent formatting
   */
  log(error: unknown, context?: string): AppError {
    const appError: AppError = this.normalizeError(error, context);

    // Add to error history
    this.errors.push(appError);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Console logging with proper formatting
    if (process.env.NODE_ENV === 'development') {
      console.error(`[Error${context ? ` - ${context}` : ''}]`, {
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode,
        details: appError.details,
        timestamp: appError.timestamp,
      });
    } else {
      // In production, send to logging service
      // this.sendToLoggingService(appError);
      console.error(appError.message);
    }

    return appError;
  }

  /**
   * Normalize various error types into consistent AppError format
   */
  private normalizeError(error: unknown, context?: string): AppError {
    const baseError = {
      timestamp: new Date(),
      code: context,
    };

    if (error instanceof Error) {
      return {
        message: error.message,
        details: error.stack,
        ...baseError,
      };
    }

    if (typeof error === 'string') {
      return {
        message: error,
        ...baseError,
      };
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return {
        message: String(error.message),
        details: error,
        ...baseError,
      };
    }

    return {
      message: 'An unknown error occurred',
      details: error,
      ...baseError,
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(error: AppError): string {
    // Map technical errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      NETWORK_ERROR: 'Network connection issue. Please check your internet connection.',
      TIMEOUT: 'Request timed out. Please try again.',
      UNAUTHORIZED: 'Please log in to continue.',
      FORBIDDEN: 'You don\'t have permission to perform this action.',
      NOT_FOUND: 'The requested resource was not found.',
      SERVER_ERROR: 'Something went wrong. Please try again later.',
      VALIDATION_ERROR: 'Please check your input and try again.',
    };

    if (error.code && error.code in errorMessages) {
      return errorMessages[error.code];
    }

    // Return original message if no mapping found
    return error.message;
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(count = 10): AppError[] {
    return this.errors.slice(-count);
  }

  /**
   * Clear error history
   */
  clearErrors(): void {
    this.errors = [];
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Convenience functions
export const logError = (error: unknown, context?: string): AppError => {
  return errorHandler.log(error, context);
};

export const getUserMessage = (error: AppError): string => {
  return errorHandler.getUserMessage(error);
};

export const getRecentErrors = (count?: number): AppError[] => {
  return errorHandler.getRecentErrors(count);
};

// React Error Boundary integration
export function componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
  logError(
    {
      message: error.message,
      details: {
        error,
        componentStack: errorInfo.componentStack,
      },
    },
    'ReactErrorBoundary'
  );
}
