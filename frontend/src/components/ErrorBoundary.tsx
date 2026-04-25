import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error to service (you can integrate with Sentry, LogRocket, etc.)
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In production, you would send this to your error reporting service
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.error('Error logged:', errorData);
      
      // Example: Send to your error reporting service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReload: () => void;
  onGoHome: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReload, onGoHome }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Something went wrong
          </h1>
          
          <p className="text-slate-600 mb-6">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>

          {isDevelopment && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-slate-700 mb-2">
                Error Details (Development Only)
              </summary>
              <div className="mt-2 p-4 bg-slate-100 rounded-lg text-xs font-mono text-slate-800 overflow-auto max-h-48">
                <div className="mb-2">
                  <strong>Error:</strong> {error.name}
                </div>
                <div className="mb-2">
                  <strong>Message:</strong> {error.message}
                </div>
                {error.stack && (
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">{error.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex gap-3 justify-center">
            <button
              onClick={onReload}
              className="px-6 py-3 bg-blue-600 text-slate-900 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Reload Page
            </button>
            
            <button
              onClick={onGoHome}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition flex items-center gap-2"
            >
              <Home size={18} />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
