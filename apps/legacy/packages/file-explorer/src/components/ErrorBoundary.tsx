"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

// Environment detection for browser
const isDev = typeof window !== "undefined" && 
  (window.location?.hostname === "localhost" || 
   window.location?.hostname === "127.0.0.1");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary for the FileExplorer package
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
export class FileExplorerErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to error reporting service
    console.error("FileExplorer Error Boundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });

    // In production, send to error tracking service
    if (!isDev) {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>

          <p className="text-sm text-gray-600 text-center max-w-md mb-6">
            The file explorer encountered an unexpected error. Don't worry—your files are safe.
          </p>

          {isDev && this.state.error && (
            <div className="w-full max-w-2xl mb-6 p-4 bg-red-50 border border-red-200 rounded-lg overflow-auto">
              <p className="text-sm font-mono text-red-800 mb-2">
                <strong>Error:</strong> {this.state.error.message}
              </p>
              {this.state.error.stack && (
                <pre className="text-xs text-red-700 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            <button
              onClick={this.handleReload}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reload Page
            </button>

            <button
              onClick={this.handleGoHome}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to catch errors in functional components
 * Returns an error handler that can be used to manually trigger error boundary
 */
export function useErrorBoundary(): { throwError: (error: Error) => void } {
  const throwError = (error: Error): void => {
    throw error;
  };

  return { throwError };
}

export default FileExplorerErrorBoundary;
