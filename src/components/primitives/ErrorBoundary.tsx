import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Rendered instead of the children after they throw. */
  fallback: ReactNode;
  onError?: (error: unknown) => void;
}

/** Contains a failure to its own subtree, so an optional enhancement can never blank the page. */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError?.(error);
    if (import.meta.env.DEV) console.warn('Contained by ErrorBoundary:', error, info.componentStack);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
