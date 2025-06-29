import { lazy } from "react";
import { Navigate } from "react-router-dom";

// srm pages
const SRMIntroduction = lazy(() => import("../../pages/srm/SRMIntroduction"));

// lazy loading above static imports
const SRMDashboard = lazy(() => import("../../pages/srm/SRMDashboard"));
const SRMTripAddPage = lazy(
  () => import("../../pages/srm/srm-trips/SRMTripAddPage")
);
const SRMTripUpdatePage = lazy(
  () => import("../../pages/srm/srm-trips/SRMTripUpdatePage")
);
const OngoingTripsPage = lazy(
  () => import("../../pages/srm/srm-trips/OngoingTripsPage")
);
const CompletedTripsPage = lazy(
  () => import("../../pages/srm/srm-trips/CompletedTripsPage")
);
const ManageVehiclePage = lazy(
  () => import("../../pages/srm/srm-vehicles/ManageVehiclePage")
);
const SRMVehicleAddPage = lazy(
  () => import("../../pages/srm/srm-vehicles/SRMVehicleAddPage")
);
const SRMVehicleUpdatePage = lazy(
  () => import("../../pages/srm/srm-vehicles/SRMVehicleUpdatePage")
);
const CustomerListPage = lazy(
  () => import("../../pages/srm/srm-customers/ManageSRMCustomersPage")
);
const EndTripsPage = lazy(
  () => import("../../pages/srm/srm-trips/EndTripsPage")
);

// Tax info pages
const SRMCountryTaxInfoAddPage = lazy(
  () => import("../../pages/srm/tax-info/SRMCountryTaxInfoAddPage")
);
const SRMCountryTaxInfoUpdatePage = lazy(
  () => import("../../pages/srm/tax-info/SRMCountryTaxInfoUpdatePage")
);

// Contract pages
const SRMContractAddPage = lazy(
  () => import("../../pages/srm/contract/SRMContractAddPage")
);
const SRMContractEditPage = lazy(
  () => import("../../pages/srm/contract/SRMContractEditPage")
);

const CustomerDetailsPage = lazy(
  () => import("../../pages/srm/srm-customers/CustomerDetailsPage")
);

/**
 * SRM routes that are **only available after the user completes onboarding** (srm/intro, srm/tax-info, and srm/contracts routes).
 * These are wrapped in the `SRMConditionalWrapper` wrapper, which checks (via API) if the onboarding is already completed or not.
 * If the setup is incomplete, access to these routes is redirected to srm/intro, otherwise they are rendered.
 */
export const srmPostOnboardingRoutes = [
  {
    path: "/srm",
    element: <Navigate to={"/srm/dashboard"} />,
  },
  {
    path: "/srm/dashboard",
    element: <SRMDashboard />,
  },
  {
    path: "/srm/trips/new",
    element: <SRMTripAddPage />,
  },
  {
    path: "/srm/trips/edit/:bookingId",
    element: <SRMTripUpdatePage />,
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
    path: "/srm/tax-info/edit",
    element: <SRMCountryTaxInfoUpdatePage />,
  },

  {
    path: "/srm/contracts/edit",
    element: <SRMContractEditPage />,
  },
];

/**
 * These SRM routes are only available to users
 * visiting for the **first time** (e.g., onboarding).
 * They are wrapped in `SRMConditionalWrapper`, which checks
 * via API whether to redirect to dashboard or not.
 */
export const srmOnboardingRoutes = [
  {
    path: "/srm/intro",
    element: <SRMIntroduction />,
  },
  {
    path: "/srm/tax-info",
    element: <SRMCountryTaxInfoAddPage />,
  },
  {
    path: "/srm/contract",
    element: <SRMContractAddPage />,
  },
];

/**
 * These SRM routes are accessible at any time, regardless
 * of whether the user has completed onboarding or not.
 * They are **NOT** wrapped in the SRMConditionalWrapper.
 */
export const srmAlwaysAccessibleRoutes = [
  {
    path: "/srm/tax-info/edit",
    element: <SRMCountryTaxInfoUpdatePage />,
  },
  {
    path: "/srm/contracts/edit",
    element: <SRMContractEditPage />,
  },
];
