import React from 'react';
import { logBoot } from '../utils/bootLog';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

class RootErrorBoundary extends React.Component<Props, State> {
  state: State = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logBoot('react_error_boundary', `${error.message}\n${errorInfo.componentStack}`);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-kibana-bg p-4 text-kibana-text">
          <div className="mx-auto flex min-h-screen max-w-xl items-center">
            <div className="w-full rounded-lg border border-kibana-border bg-kibana-card p-6">
              <h1 className="text-2xl font-bold">Tasks failed to load</h1>
              <p className="mt-3 text-sm text-kibana-textSecondary">
                The frontend hit an unexpected error during startup. Check the add-on logs for
                `tasks-boot` entries and `frontend-log` requests.
              </p>
              <pre className="mt-4 overflow-x-auto rounded-md bg-kibana-bg p-3 text-xs text-kibana-textSecondary">
                {this.state.error.message}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RootErrorBoundary;
