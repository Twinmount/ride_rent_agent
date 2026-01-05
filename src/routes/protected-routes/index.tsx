import { SRMConditionalWrapper } from "@/hoc/SRMConditionalWrapper";
import { lazy } from "react";
import { srmOnboardingRoutes, srmPostOnboardingRoutes } from "./srm-routes";
import AgentTableView from "@/pages/enquiry/EnquiryPage";

// vehicle  pages
const VehiclesFormAddPage = lazy(
  () => import("../../pages/vehicles/VehiclesFormAddPage")
);

const VehiclesFormUpdatePage = lazy(
  () => import("../../pages/vehicles/VehiclesFormUpdatePage")
);

// general pages
const Dashboard = lazy(() => import("../../pages/dashboard/Dashboard"));
const ListingsPage = lazy(() => import("../../pages/listings/ListingsPage"));
const ProfilePage = lazy(() => import("../../pages/profile/ProfilePage"));

// lazy importing profile update page
const ProfileUpdatePage = lazy(
  () => import("../../pages/profile/ProfileUpdatePage")
);

const RateManager = lazy(() => import("../../pages/RateManager/RateManager"));

/*
 * These routes are protected routes and intended to be accessed only by authenticated users
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
<<<<<<< HEAD
  {
    path: "/enquiries",
    element: <AgentTableView />,
  },
  {
    path: "/rate-manager",
    element: <RateManager />
  },
=======
  { path: "/rate-manager", element: <RateManager /> },
>>>>>>> c9c0ed4 (feat: implemented updated bulk discount and rate manager frontend changes)

  //  These SRM routes are always accessible (not wrapped by SRMConditionalWrapper)

  //  These SRM routes are wrapped in SRMConditionalWrapper
  {
    element: <SRMConditionalWrapper />,
    children: [...srmOnboardingRoutes, ...srmPostOnboardingRoutes],
  },
];
