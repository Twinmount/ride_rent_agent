import { useEffect } from "react";
import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
} from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Check if the error is related to a failed dynamic import and reload if necessary
  useEffect(() => {
    if (
      error instanceof Error &&
      (error.message.includes("Failed to fetch dynamically imported module") ||
        error.message.includes("Importing a module script failed"))
    ) {
      window.location.reload();
    }
  }, [error]);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="flex flex-col justify-center items-center p-6 min-h-screen text-gray-800 bg-gray-100">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-2 text-lg">This page doesn't exist!</p>
          <button onClick={handleGoBack} className="text-blue-500 underline">
            Go back
          </button>
        </div>
      );
    }

    if (error.status === 401) {
      return (
        <div className="flex flex-col justify-center items-center p-6 min-h-screen text-gray-800 bg-gray-100">
          <h1 className="mb-4 text-4xl font-bold">401</h1>
          <p className="mb-2 text-lg">You aren't authorized to see this</p>
          <button onClick={handleGoBack} className="text-blue-500 underline">
            Go back
          </button>
        </div>
      );
    }

    if (error.status === 503) {
      return (
        <div className="flex flex-col justify-center items-center p-6 min-h-screen text-gray-800 bg-gray-100">
          <h1 className="mb-4 text-4xl font-bold">503</h1>
          <p className="mb-2 text-lg">Looks like our API is down</p>
          <button onClick={handleGoBack} className="text-blue-500 underline">
            Go back
          </button>
        </div>
      );
    }

    if (error.status === 418) {
      return (
        <div className="flex flex-col justify-center items-center p-6 min-h-screen text-gray-800 bg-gray-100">
          <h1 className="mb-4 text-4xl font-bold">418</h1>
          <p className="mb-2 text-lg">🫖</p>
          <button onClick={handleGoBack} className="text-blue-500 underline">
            Go back
          </button>
        </div>
      );
    }
  }

  if (error instanceof Error) {
    return (
      <div className="flex flex-col justify-center items-center p-6 min-h-screen text-gray-800 bg-gray-100">
        <h1 className="mb-4 text-4xl font-bold">Oops</h1>
        <p className="mb-2 text-lg">{error.message}</p>
        <button onClick={handleGoBack} className="text-blue-500 underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 min-h-screen text-gray-800 bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
      <button onClick={handleGoBack} className="text-blue-500 underline">
        Go back
      </button>
    </div>
  );
};

export default ErrorPage;
