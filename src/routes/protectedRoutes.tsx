import CustomerDetailsPage from "@/pages/srm/CustomerDetailsPage";
import { lazy } from "react";

// vehicle  pages
const VehiclesFormAddPage = lazy(
  () => import("../pages/vehicles/VehiclesFormAddPage")
);

const VehiclesFormUpdatePage = lazy(
  () => import("../pages/vehicles/VehiclesFormUpdatePage")
);

// srm pages
const SRMIntroduction = lazy(() => import("../pages/srm/SRMIntroduction"));

// general pages
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const ListingsPage = lazy(() => import("../pages/listings/ListingsPage"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));

// lazy importing profile update page
const ProfileUpdatePage = lazy(
  () => import("../pages/profile/ProfileUpdatePage")
);

// lazy loading above static imports
const SRMDashboard = lazy(() => import("../pages/srm/SRMDashboard"));
const SRMFormAddPage = lazy(() => import("../pages/srm/SRMFormAddPage"));
const SRMFormUpdatePage = lazy(() => import("../pages/srm/SRMFormUpdatePage"));
const OngoingTripsPage = lazy(
  () => import("../pages/srm/trip-data/OngoingTripsPage")
);
const CompletedTripsPage = lazy(
  () => import("../pages/srm/trip-data/CompletedTripsPage")
);
const VehicleListPage = lazy(
  () => import("../pages/srm/trip-data/VehicleListPage")
);
const CustomerListPage = lazy(
  () => import("../pages/srm/trip-data/CustomerListPage")
);
const EndTripsPage = lazy(() => import("../pages/srm/EndTripsPage"));

/* 
 protected routes array
*/

export const protectedRoutes = [
  { path: "/", element: <Dashboard /> },
  { path: "/listings", element: <ListingsPage /> },
  { path: "/profile", element: <ProfilePage /> },
  {
    path: "/profile/edit/:agentId",
    element: <ProfileUpdatePage />,
  },
  {
    path: "/listings/add/:userId",
    element: <VehiclesFormAddPage />,
  },
  {
    path: "/listings/view/:vehicleId/:companyId/:userId",
    element: <VehiclesFormUpdatePage />,
  },
  {
    path: "/srm/intro",
    element: <SRMIntroduction />,
  },
  {
    path: "/srm/dashboard",
    element: <SRMDashboard />,
  },
  {
    path: "/srm/trips/new",
    element: <SRMFormAddPage />,
  },
  {
    path: "/srm/trips/edit/:bookingId",
    element: <SRMFormUpdatePage />,
  },

  {
    path: "/srm/ongoing-trips",
    element: <OngoingTripsPage />,
  },
  {
    path: "/srm/end-trip/:bookingId",
    element: <EndTripsPage />,
  },
  {
    path: "/srm/completed-trips",
    element: <CompletedTripsPage />,
  },
  {
    path: "/srm/vehicle-list",
    element: <VehicleListPage />,
  },
  {
    path: "/srm/customer-list",
    element: <CustomerListPage />,
  },
  {
    path: "/srm/customer-details/:customerId",
    element: <CustomerDetailsPage />,
  },
];
