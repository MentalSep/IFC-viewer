import React from "react";

interface State {
  hasError: boolean;
  error: unknown | null;
}

export default class ErrorBoundary extends React.Component<{}, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: any) {
    // eslint-disable-next-line no-console
    console.error("Unhandled error in React tree:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.error)}</pre>
          <p>Please check the browser console for details.</p>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}
