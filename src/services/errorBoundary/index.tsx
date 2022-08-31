import React, { Component } from "react";

class ErrorBoundary extends Component<
  any,
  { hasError: boolean; error: any; errorInfo: any; more: boolean }
> {
  constructor(props: any) {
    super(props);
    // eslint-disable-next-line react/no-unused-state
    this.state = { hasError: false, error: null, errorInfo: null, more: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line react/no-unused-state
    this.setState({ error, errorInfo });
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.hasError) {
      // console.log(this.state);
      // You can render any custom fallback UI
      return (
        <div>
          <div>
            {/* eslint-disable-next-line react/destructuring-assignment */}
            {this.state.error?.name || "Error"}:{" "}
            {/* eslint-disable-next-line react/destructuring-assignment */}
            {JSON.stringify(this.state.error?.message)}
            <button
              type="button"
              onClick={() => {
                // eslint-disable-next-line react/destructuring-assignment
                this.setState((prev) => ({ more: !prev.more }));
              }}
            >
              {/* eslint-disable-next-line react/destructuring-assignment */}
              {this.state.more ? "hide" : "show"} more
            </button>
          </div>
          {/* eslint-disable-next-line react/destructuring-assignment */}
          {this.state.more && (
            <pre>
              {/* eslint-disable-next-line react/destructuring-assignment */}
              {this.state.errorInfo?.componentStack || "Error"}
            </pre>
          )}
        </div>
      );
    }
    // eslint-disable-next-line react/destructuring-assignment
    return this.props.children;
  }
}
export default ErrorBoundary;
