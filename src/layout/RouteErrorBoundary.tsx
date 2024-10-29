import { Component, ReactNode } from "react";

interface RouteErrorBoundaryProps {
  children: ReactNode;
}

class RouteErrorBoundary extends Component<RouteErrorBoundaryProps> {
  componentDidCatch(error: Error) {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (
      !hasReloaded && // Check if reload has already happened
      (error.message.includes("Failed to fetch dynamically imported module") ||
        error.message.includes("Importing a module script failed"))
    ) {
      // Set flag in sessionStorage to indicate reload has occurred
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }

  render() {
    return this.props.children;
  }
}

export default RouteErrorBoundary;
