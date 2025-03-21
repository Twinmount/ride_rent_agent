import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "../layout/Layout";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "../layout/ProtectedRoutes";
import { publicRoutes } from "./publicRoutes";
import { protectedRoutes } from "./protectedRoutes";

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    {
      element: <Outlet />,
      errorElement: <ErrorPage />,
      children: [
        ...publicRoutes, // public routes
        {
          element: <ProtectedRoute />, // protected routes wrapper
          children: [
            {
              element: <Layout />,
              children: protectedRoutes, // protected routes
            },
          ],
        },
      ],
    },
  ]);
