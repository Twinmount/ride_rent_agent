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

export const publicRoutes = [
  {
    path: "/register",
    element: <RegistrationPage />,
  },
  {
    path: "/uae/register",
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
    path: "/uae/login",
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
];
