import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: rgba(244, 67, 54, 0.1);
  color: ${({ theme }) => theme.colors.error};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ErrorTitle = styled.h3`
    margin-top: 0;
    color: ${({ theme }) => theme.colors.error};
`;

const ErrorDetails = styled.details`
    margin-top: ${({ theme }) => theme.spacing.md};
    white-space: pre-wrap; // Preserve formatting of error stack
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text};
`;

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(/* Error */): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
            <ErrorTitle>Something went wrong.</ErrorTitle>
            <p>{this.props.fallbackMessage || "An unexpected error occurred. Please try refreshing the page."}</p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
                <ErrorDetails>
                    <summary>Error Details (Development Only)</summary>
                    <strong>{this.state.error.toString()}</strong>
                    <br />
                    {this.state.errorInfo?.componentStack}
                </ErrorDetails>
            )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 