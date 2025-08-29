import { lazy } from "react";

// dynamic import
const RegistrationPage = lazy(
  () => import("../pages/register/RegistrationPage")
);

const CompanyRegistration = lazy(
  () => import("../pages/register/CompanyRegistration")
);

const IndividualRegistration = lazy(
  () => import("../pages/register/IndividualRegistration")
);

const RegistrationComplete = lazy(
  () => import("../pages/register/RegistrationComplete")
);
const OTPPage = lazy(() => import("../pages/register/OTPPage"));
const LoginPage = lazy(() => import("../pages/login/LoginPage"));
const ResetPasswordPage = lazy(
  () => import("../pages/general/ResetPasswordPage")
);
const ResetPasswordOtpPage = lazy(
  () => import("../pages/general/ResetPasswordOtpPage")
);

const ConfirmNewPassword = lazy(
  () => import("../pages/general/ConfirmNewPassword")
);
const PublicCustomerDetailsPage = lazy(
  () => import("../pages/srm/srm-customers/PublicCustomerDetailsPage")
);

const PublicCustomerSuccessPage = lazy(
  () => import("../pages/srm/srm-customers/PublicCustomerSuccessPage")
);

export const publicRoutes = [
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/ae/register",
    element: <RegistrationPage />,
  },
  {
    path: "/in/register",
    element: <RegistrationPage country="india" />,
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
    path: "/register/individual-details",
    element: <IndividualRegistration />,
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
    path: "/ae/login",
    element: <LoginPage />,
  },
  {
    path: "/in/login",
    element: <LoginPage country="india" />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
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
    path: "/srm/customer-details/public",
    element: <PublicCustomerDetailsPage />,
  },
  {
    path: "/srm/customer-details/public/success",
    element: <PublicCustomerSuccessPage />,
  },
];
