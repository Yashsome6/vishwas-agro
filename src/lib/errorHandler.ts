// Global error handling and logging

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorLog {
  id: string;
  timestamp: string;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  resolved: boolean;
}

class ErrorHandler {
  private errors: ErrorLog[] = [];
  private readonly MAX_ERRORS = 100;
  private errorListeners: Array<(error: ErrorLog) => void> = [];

  constructor() {
    this.loadErrors();
    this.setupGlobalHandlers();
  }

  private setupGlobalHandlers() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        severity: 'error',
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
      });
    });

    // Catch global errors
    window.addEventListener('error', (event) => {
      this.logError({
        severity: 'error',
        message: event.message,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });
  }

  logError(error: Omit<ErrorLog, 'id' | 'timestamp' | 'resolved'>): ErrorLog {
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...error,
    };

    this.errors.unshift(errorLog);
    
    // Keep only recent errors
    if (this.errors.length > this.MAX_ERRORS) {
      this.errors = this.errors.slice(0, this.MAX_ERRORS);
    }

    this.saveErrors();
    this.notifyListeners(errorLog);

    // Console log for development (with severity color)
    const consoleMethod = error.severity === 'critical' || error.severity === 'error' 
      ? console.error 
      : error.severity === 'warning' 
      ? console.warn 
      : console.info;
    
    consoleMethod(`[${error.severity.toUpperCase()}]`, error.message, error.context);

    return errorLog;
  }

  getErrors(severity?: ErrorSeverity): ErrorLog[] {
    if (severity) {
      return this.errors.filter(e => e.severity === severity);
    }
    return this.errors;
  }

  getUnresolvedErrors(): ErrorLog[] {
    return this.errors.filter(e => !e.resolved);
  }

  markAsResolved(errorId: string): void {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      this.saveErrors();
    }
  }

  clearErrors(): void {
    this.errors = [];
    this.saveErrors();
  }

  clearResolvedErrors(): void {
    this.errors = this.errors.filter(e => !e.resolved);
    this.saveErrors();
  }

  onError(callback: (error: ErrorLog) => void): () => void {
    this.errorListeners.push(callback);
    return () => {
      this.errorListeners = this.errorListeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(error: ErrorLog): void {
    this.errorListeners.forEach(callback => {
      try {
        callback(error);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  private saveErrors(): void {
    try {
      localStorage.setItem('erp_error_logs', JSON.stringify(this.errors));
    } catch (err) {
      console.error('Failed to save errors:', err);
    }
  }

  private loadErrors(): void {
    try {
      const stored = localStorage.getItem('erp_error_logs');
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to load errors:', err);
      this.errors = [];
    }
  }

  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  getErrorStats(): {
    total: number;
    bySeverity: Record<ErrorSeverity, number>;
    unresolved: number;
  } {
    const stats = {
      total: this.errors.length,
      bySeverity: {
        info: 0,
        warning: 0,
        error: 0,
        critical: 0,
      } as Record<ErrorSeverity, number>,
      unresolved: 0,
    };

    this.errors.forEach(error => {
      stats.bySeverity[error.severity]++;
      if (!error.resolved) {
        stats.unresolved++;
      }
    });

    return stats;
  }
}

export const errorHandler = new ErrorHandler();

// Helper function to wrap async operations with error handling
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: Record<string, any>,
  onError?: (error: Error) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    errorHandler.logError({
      severity: 'error',
      message: errorMessage,
      stack: errorStack,
      context,
    });

    if (onError && error instanceof Error) {
      onError(error);
    }

    return null;
  }
}
