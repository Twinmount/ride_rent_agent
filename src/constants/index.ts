import {
  CustomerStatus,
  SRMCustomerDetailsFormType,
  SRMPaymentDetailsFormType,
  SRMVehicleDetailsFormType,
  TripEndFormType,
} from "@/types/srm-types";
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
    label: "SRM",
    icon: Box,
    link: "/srm",
  },
  {
    label: "Profile",
    icon: UserRoundPen,
    link: "/profile",
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
      "SRM offers a simple and intuitive interface for agents to manage customer records, making it easy to update, search, and access customer information.",
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
  expireDate: undefined,
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
  commercialLicenseExpireDate: undefined,
  isLease: false,
  isCryptoAccepted: false,
  isSpotDeliverySupported: false,
  specification: "UAE_SPEC",
  rentalDetails: {
    day: { enabled: false, rentInAED: "", mileageLimit: "" },
    week: { enabled: false, rentInAED: "", mileageLimit: "" },
    month: { enabled: false, rentInAED: "", mileageLimit: "" },
    hour: {
      enabled: false,
      minBookingHours: "",
      rentInAED: "",
      mileageLimit: "",
    },
  },
  phoneNumber: "",
  stateId: "",
  cityIds: [],
  additionalVehicleTypes: [],
  securityDeposit: {
    enabled: false,
    amountInAED: "",
  },
  isCreditOrDebitCardsSupported: false,
  isTabbySupported: false,
};

// srm user details form default values
export const SRMCustomerDetailsFormDefaultValues: SRMCustomerDetailsFormType = {
  customerProfilePic: "", // Optional field
  customerName: "", // Name of the Customer
  nationality: "", // Nationality of the user
  passportNumber: "", // Passport number
  drivingLicenseNumber: "", // Driving license number
  phoneNumber: "", // Phone number with validation on minimum characters
};

// srm vehicle details form default values
export const SRMVehicleDetailsFormDefaultValues: SRMVehicleDetailsFormType = {
  vehicleCategoryId: "",
  vehicleBrandId: "",
  vehicleRegistrationNumber: "",
  vehiclePhoto: "",
  rentalDetails: {
    day: { enabled: false, rentInAED: "", mileageLimit: "" },
    week: { enabled: false, rentInAED: "", mileageLimit: "" },
    month: { enabled: false, rentInAED: "", mileageLimit: "" },
    hour: {
      enabled: false,
      minBookingHours: "",
      rentInAED: "",
      mileageLimit: "",
    },
  },
};

// SRM payment details form default values
export const SRMPaymentDetailsFormDefaultValues: SRMPaymentDetailsFormType = {
  advanceAmount: "",
  remainingAmount: "",
  securityDeposit: {
    enabled: false,
    amountInAED: "",
  },
  bookingStartDate: undefined,
  bookingEndDate: undefined,
  currency: "",
};

// trip end form default values
export const TripEndFormDefaultValues: TripEndFormType = {
  brandName: "",
  customerName: "",
  customerStatus: CustomerStatus.SUCCESSFUL,
  finesCollected: [],
  salikCollected: [],
  additionalCharges: [], // Initially no additional charges
  discounts: "", // Optional
  totalAmountCollected: "",
};
