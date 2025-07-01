import {
  CustomerStatus,
  SRMContractFormType,
  SRMCustomerDetailsFormType,
  SRMPaymentDetailsFormType,
  SRMPublicCustomerDetailsFormType,
  SRMTaxInfoFormType,
  SRMVehicleDetailsFormType,
  TripEndFormType,
} from "@/types/srm-types";
import {
  CompanyFormType,
  PrimaryFormType,
  ProfileUpdateFormType,
} from "@/types/types";
import {
  LayoutDashboard,
  List,
  UserRoundPen,
  UploadCloud,
  ShieldAlert,
  ClipboardList,
  Lock,
  CalendarCheck,
  Box,
  Globe,
  Users,
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
    label: "24x7 Customer Data Upload",
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

export const SRMIntroFeatures = [
  {
    label: "Efficient Fleet Management",
    description: "Easily organize and monitor all vehicles from one place.",
    icon: Box,
  },
  {
    label: "Unlimited Vehicle Tracking",
    description: "Track your entire fleet with no limitations or hidden costs.",
    icon: Globe,
  },
  {
    label: "Advanced Protection Against Rental Abuse",
    description: "AI-backed alerts help detect and prevent rental fraud.",
    icon: ShieldAlert,
  },
  {
    label: "Cloud-Based Invoicing",
    description: "Generate, manage, and store invoices securely in the cloud.",
    icon: UploadCloud,
  },
  {
    label: "Streamlined Customer Management",
    description: "Centralize and access customer records in seconds.",
    icon: Users,
  },
];

// Company registration phase 2 form default values
export const CompanyFormDefaultValues: CompanyFormType = {
  companyName: "",
  companyLogo: "",
  commercialLicense: "",
  expireDate: undefined,
  regNumber: "",
  companyAddress: "", // Default empty value
  companyLanguages: [],
};

// Company profile update form default values
export const ProfileUpdateFormDefaultValues: ProfileUpdateFormType = {
  commercialLicense: "",
  expireDate: undefined,
  regNumber: "",
  companyAddress: "", // Default empty value
  companyLanguages: [],
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
  vehicleTypeId: "",
  vehicleBrandId: "",
  vehicleModel: "",
  vehiclePhotos: [],
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
  stateId: "", //required
  cityIds: [], //required
  additionalVehicleTypes: [],
  securityDeposit: {
    enabled: false,
    amountInAED: "",
  },
  isCreditOrDebitCardsSupported: false,
  isTabbySupported: false,
};

// srm customer details form default values
export const SRMCustomerDetailsFormDefaultValues: SRMCustomerDetailsFormType = {
  customerProfilePic: "",
  customerName: "", // Name of the Customer
  email: "",
  nationality: "", // Nationality of the user
  passportNumber: "", // Passport number
  passport: [], // Passport image
  drivingLicenseNumber: "", // Driving license number
  drivingLicense: [], // Driving license image
  phoneNumber: "", // Phone number with validation on minimum characters
};

// srm public customer details form default values
export const SRMPublicCustomerDetailsFormDefaultValues: SRMPublicCustomerDetailsFormType =
  {
    customerProfilePic: "",
    customerName: "",
    email: "",
    nationality: "",
    passportNumber: "",
    passport: [], // Passport image
    drivingLicenseNumber: "", // Driving license number
    drivingLicense: [],
    phoneNumber: "",
  };

export const SRMTaxInfoFormDefaultValues: SRMTaxInfoFormType = {
  countryId: "",
  taxNumber: "",
};

export const SRMContractFormDefaultValues: SRMContractFormType = {
  termsNCondition: "",
};

// srm vehicle details form default values
export const SRMVehicleDetailsFormDefaultValues: SRMVehicleDetailsFormType = {
  vehicleCategoryId: "",
  vehicleBrandId: "",
  vehicleRegistrationNumber: "",
  vehiclePhoto: "",
  numberOfPassengers: "",
  vehicleColor: "",
  bodyType: "",
  chassisNumber: "",
  additionalMilageChargePerKm: "",
  registrationDate: undefined,
  registrationDueDate: undefined,
  trafficFineId: "",
  lastServiceDate: undefined,
  currentKilometre: "",
  serviceKilometre: "",
  nextServiceKilometre: "",
  nextServiceDate: undefined,
  rentalDetails: {
    day: { enabled: true, rentInAED: "", mileageLimit: "" },
    week: { enabled: true, rentInAED: "", mileageLimit: "" },
    month: { enabled: true, rentInAED: "", mileageLimit: "" },
    hour: {
      enabled: true,
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
  currency: "AED",
};

// trip end form default values
export const TripEndFormDefaultValues: TripEndFormType = {
  customerStatus: CustomerStatus.SUCCESSFUL,
  finesCollected: [],
  salikCollected: [],
  additionalCharges: [], // Initially no additional charges
  discounts: "0",
  totalAmountCollected: "",
  currentKilometre: "",
};

export const ADDITIONAL_CHARGES_OPTIONS = [
  "Fuel Charges",
  "Excess Mileage Charges",
  "Cleaning Charges",
  "Late Return Fee",
  "Insurance Excess/Deductible",
  "Replacement/Repair of Lost/Damaged Accessories",
  "Additional Driver Fee",
  "Child Seat",
  "GPS/Navigation System",
  "Wi-Fi Hotspot Device",
  "Roadside Assistance",
  "Cross-Border Fee",
  "Smoking Penalty",
  "Lost Registration Card (Mulkia)",
  "Replacement Car Delivery Fee",
  "Car Delivery Fee",
  "Car Return Fee",
  "Service Charge",
];

export const BODY_TYPES = [
  { label: "Sedan", value: "sedan" },
  { label: "Luxury Sedan", value: "luxury-sedan" },
  { label: "Hatchback", value: "hatchback" },
  { label: "Saloon", value: "saloon" },
  { label: "Beertle Version", value: "beertle-version" },
  { label: "Beertle Convertible", value: "beertle-convertible" },
  { label: "SUV (Sport Utility Vehicle)", value: "suv" },
  { label: "SUV Large", value: "suv-large" },
  { label: "Compact SUV", value: "compact-suv" },
  { label: "Estate", value: "estate" },
  { label: "Coupe", value: "coupe" },
  { label: "MPV", value: "mpv" },
  { label: "Convertible Small", value: "convertible-small" },
  { label: "Convertible", value: "convertible" },
  { label: "Jeep Varients", value: "jeep-varients" },
  { label: "Pickup Truck", value: "pickup-truck" },
  { label: "Crossover", value: "crossover" },
  { label: "Sports Car", value: "sports-car" },
  { label: "Passenger Van", value: "passenger-van" },
  { label: "Van Cargo (Mni)", value: "van-cargo-mni" },
  { label: "Van Long (Cargo)", value: "van-long-cargo" },
  { label: "Limousine", value: "limousine" },
];
