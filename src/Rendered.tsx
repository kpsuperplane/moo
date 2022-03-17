import React, { useEffect } from "react";
import { useAppContext } from "./lib/AppContext";
import PrettyError from "./lib/PrettyError";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  constructor(props) {
    super(props);
    this.state = { error: undefined };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error != null) {
      return <PrettyError error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default function Rendered() {
  const { rendered } = useAppContext();

  return (
    <div id="rendered" className="section">
      <h2 className="heading">Output</h2>
      <div className="content">
        <ErrorBoundary>{rendered}</ErrorBoundary>
      </div>
    </div>
  );
}
