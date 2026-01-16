import React from 'react';

interface TimezoneErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface TimezoneErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; retry?: () => void }>;
}

class TimezoneErrorBoundary extends React.Component<
  TimezoneErrorBoundaryProps,
  TimezoneErrorBoundaryState
> {
  constructor(props: TimezoneErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TimezoneErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Timezone Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error?: Error; retry?: () => void }) {
  return (
    <div className="timezone-error-fallback" role="alert">
      <h3>Something went wrong with the timezone visualization</h3>
      {error && (
        <details className="error-details">
          <summary>Error Details</summary>
          <pre>{error.message}</pre>
        </details>
      )}
      {retry && (
        <button onClick={retry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}

export default TimezoneErrorBoundary;