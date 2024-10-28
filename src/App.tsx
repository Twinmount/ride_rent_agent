import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import Layout from "./layout/Layout";
import ErrorPage from "./pages/ErrorPage";
import { AgentProvider } from "./context/AgentContext";
import { toast } from "./components/ui/use-toast";
import ProtectedRoute from "./layout/ProtectedRoutes";
import LazyLoader from "./components/loading-skelton/LazyLoader";
import { HelmetProvider } from "react-helmet-async";
import RouteErrorBoundary from "./layout/RouteErrorBoundary";

// dynamic import
const RegistrationPage = lazy(
  () => import("./pages/register/RegistrationPage")
);

const CompanyRegistration = lazy(
  () => import("./pages/register/CompanyRegistration")
);

const RegistrationComplete = lazy(
  () => import("./pages/register/RegistrationComplete")
);
const OTPPage = lazy(() => import("./pages/register/OTPPage"));
const LoginPage = lazy(() => import("./pages/login/LoginPage"));
const ResetPassword = lazy(() => import("./pages/general/ResetPassword"));
const ResetPasswordOtpPage = lazy(
  () => import("./pages/general/ResetPasswordOtpPage")
);
const ConfirmNewPassword = lazy(
  () => import("./pages/general/ConfirmNewPassword")
);

// vehicle  pages
const VehiclesFormAddPage = lazy(
  () => import("./pages/vehicles/VehiclesFormAddPage")
);

const VehiclesFormUpdatePage = lazy(
  () => import("./pages/vehicles/VehiclesFormUpdatePage")
);

// srm pages
const SRMIntroduction = lazy(() => import("./pages/srm/SRMIntroduction"));

// general pages
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const ListingsPage = lazy(() => import("./pages/listings/ListingsPage"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/register",
        element: <RegistrationPage />,
      },
      {
        path: "/verify-otp",
        element: <OTPPage />,
      },
      {
        path: "/register/company-details",
        element: <CompanyRegistration />,
      },
      {
        path: "/register/complete",
        element: <RegistrationComplete />,
      },

      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/reset-password/verify-otp",
        element: <ResetPasswordOtpPage />,
      },
      {
        path: "/confirm-new-password",
        element: <ConfirmNewPassword />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              { path: "/", element: <Dashboard /> },
              { path: "/listings", element: <ListingsPage /> },
              { path: "/profile", element: <ProfilePage /> },
              {
                path: "/listings/add/:userId",
                element: <VehiclesFormAddPage />,
              },
              {
                path: "/listings/view/:vehicleId/:companyId/:userId",
                element: <VehiclesFormUpdatePage />,
              },
              {
                path: "/srm",
                element: <SRMIntroduction />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: `${error.message}`,
      });
    },
  }),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AgentProvider>
        <RouteErrorBoundary>
          <Suspense fallback={<LazyLoader />}>
            <HelmetProvider>
              <RouterProvider router={router} />
            </HelmetProvider>
          </Suspense>
        </RouteErrorBoundary>
      </AgentProvider>
    </QueryClientProvider>
  );
}
