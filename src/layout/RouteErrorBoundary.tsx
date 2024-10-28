import { Component, ReactNode } from "react";

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps> {
  componentDidCatch(error: Error) {
    if (
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed")
    ) {
      // Force a hard reload to fetch new module versions
      window.location.reload();
    }
  }

  render() {
    return this.props.children;
  }
}

export default RouteErrorBoundary;
