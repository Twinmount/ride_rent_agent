import CustomerDetailsPage from "@/pages/srm/srm-customers/CustomerDetailsPage";
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
const SRMFormAddPage = lazy(
  () => import("../pages/srm/srm-trips/SRMFormAddPage")
);
const SRMFormUpdatePage = lazy(
  () => import("../pages/srm/srm-trips/SRMFormUpdatePage")
);
const OngoingTripsPage = lazy(
  () => import("../pages/srm/srm-trips/OngoingTripsPage")
);
const CompletedTripsPage = lazy(
  () => import("../pages/srm/srm-trips/CompletedTripsPage")
);
const ManageVehiclePage = lazy(
  () => import("../pages/srm/srm-vehicles/ManageVehiclePage")
);
const SRMVehicleAddPage = lazy(
  () => import("../pages/srm/srm-vehicles/SRMVehicleAddPage")
);
const SRMVehicleUpdatePage = lazy(
  () => import("../pages/srm/srm-vehicles/SRMVehicleUpdatePage")
);
const CustomerListPage = lazy(
  () => import("../pages/srm/srm-customers/ManageSRMCustomersPage")
);
const EndTripsPage = lazy(() => import("../pages/srm/srm-trips/EndTripsPage"));

// Tax info pages
const SRMCountryTaxInfoAddPage = lazy(
  () => import("../pages/srm/tax-info/SRMCountryTaxInfoAddPage")
);
const SRMCountryTaxInfoUpdatePage = lazy(
  () => import("../pages/srm/tax-info/SRMCountryTaxInfoUpdatePage")
);

// Contract pages
const SRMContractAddPage = lazy(
  () => import("../pages/srm/contract/SRMContractAddPage")
);
const SRMContractEditPage = lazy(
  () => import("../pages/srm/contract/SRMContractEditPage")
);

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
    path: "/srm/manage-vehicles",
    element: <ManageVehiclePage />,
  },
  {
    path: "/srm/manage-vehicles/add",
    element: <SRMVehicleAddPage />,
  },
  {
    path: "/srm/manage-vehicles/edit/:vehicleId",
    element: <SRMVehicleUpdatePage />,
  },
  {
    path: "/srm/customer-list",
    element: <CustomerListPage />,
  },
  {
    path: "/srm/customer-details/:customerId",
    element: <CustomerDetailsPage />,
  },

  {
    path: "/srm/tax-info",
    element: <SRMCountryTaxInfoAddPage />,
  },

  {
    path: "/srm/tax-info/edit",
    element: <SRMCountryTaxInfoUpdatePage />,
  },

  {
    path: "/srm/contracts/new",
    element: <SRMContractAddPage />,
  },
  {
    path: "/srm/contracts/edit/:contractId",
    element: <SRMContractEditPage />,
  },
];
