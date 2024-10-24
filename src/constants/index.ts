import { CompanyFormType, PrimaryFormType } from "@/types/types";
import {
  Box,
  LayoutDashboard,
  List,
  UserRoundPen,
  UploadCloud,
  ShieldAlert,
  ClipboardList,
  Lock,
  CalendarCheck,
} from "lucide-react";

// sidebar content
export const sidebarContent = [
  { label: "Dashboard", icon: LayoutDashboard, link: "/" },
  { label: "My Listings", icon: List, link: "/listings" },
  {
    label: "Profile",
    icon: UserRoundPen,
    link: "/profile",
  },
  {
    label: "SRM",
    icon: Box,
    link: "/srm",
  },
];

// srm introduction features
export const srmFeatures = [
  {
    label: "27x7 Customer Data Upload",
    description:
      "Agents can easily upload essential customer details like passport number, name, photo, and address, all stored securely within the system accessible 24/7.",
    icon: UploadCloud,
  },
  {
    label: "Ai Powered Fraud Detection",
    description:
      "With customer details distributed across the platform, fraud detection is enhanced, allowing agents to identify and prevent fraudulent customers instantly and avoid fraudulent rentals.",
    icon: ShieldAlert,
  },
  {
    label: "Seamless Record Management",
    description:
      "SCM offers a simple and intuitive interface for agents to manage customer records, making it easy to update, search, and access customer information.",
    icon: ClipboardList,
  },
  {
    label: "Secured Data Storage",
    description:
      "Customer data is protected with advanced security measures, ensuring that sensitive information remains safe and compliant with data protection regulations.",
    icon: Lock,
  },
  {
    label: "Effortless Customer Tracking",
    description:
      "Agents can track customer bookings, periods, history, and preferences, streamlining communication and improving customer service efficiency.",
    icon: CalendarCheck,
  },
];

// Company registration phase 2 form default values
export const CompanyFormDefaultValues: CompanyFormType = {
  companyName: "",
  companyLogo: "",
  commercialLicense: "",
  expireDate: new Date(),
  regNumber: "",
};

// otp page default value
export const OtpPageDefaultValues = {
  otp: "",
};

// login page default value
export const LoginPageDefaultValues = {
  phoneNumber: "",
  password: "",
};

// primary details form default values
export const PrimaryFormDefaultValues: PrimaryFormType = {
  vehicleCategoryId: "",
  vehicleTypeId: "", //'luxury' for example
  vehicleBrandId: "",
  vehicleModel: "",
  vehiclePhotos: [], //upto 8 photos of the vehicle
  vehicleRegistrationNumber: "",
  vehicleRegisteredYear: "",
  commercialLicenses: [],
  commercialLicenseExpireDate: new Date(),
  isLease: false,
  isCryptoAccepted: false,
  isSpotDeliverySupported: false,
  specification: "UAE_SPEC",
  rentalDetails: {
    day: { enabled: false, rentInAED: "", mileageLimit: "" },
    week: { enabled: false, rentInAED: "", mileageLimit: "" },
    month: { enabled: false, rentInAED: "", mileageLimit: "" },
  },
  phoneNumber: "",
  stateId: "",
  cityIds: [],
};
