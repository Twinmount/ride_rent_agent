// agent context  type
export type AgentContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isSmallScreen: boolean;
};

export type RegistrationType = {
  mobile: string;
  password: string;
};

export type CompanyFormType = {
  companyName: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: Date | undefined;
  regNumber: string;
};

// Rental detail type for day, week, and month
type RentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
};

// Hourly rental detail type, which includes minBookingHours
type HourlyRentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
  minBookingHours: string;
};

// primary details form type
export type PrimaryFormType = {
  vehicleId?: string;
  vehicleCategoryId: string;
  vehicleTypeId: string;
  vehicleBrandId: string;
  vehicleModel: string;
  vehiclePhotos: string[]; // Array of  URLs
  vehicleRegistrationNumber: string;
  vehicleRegisteredYear: string;
  commercialLicenses: string[]; // Array of  URLs
  commercialLicenseExpireDate: Date | undefined;
  isLease: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  specification: "UAE_SPEC" | "USA_SPEC" | "OTHERS";
  rentalDetails: {
    day: RentalDetailType;
    week: RentalDetailType;
    month: RentalDetailType;
    hour: HourlyRentalDetailType;
  };
  countryCode?: string;
  phoneNumber: string;
  stateId: string;
  cityIds: string[];
  additionalVehicleTypes?: string[];
  securityDeposit: {
    enabled: boolean;
    amountInAED?: string;
  };
  isCreditOrDebitCardsSupported: boolean;
  isTabbySupported: boolean;
};

export type SpecificationFormData = {
  id: string;
  name: string;
  values: { name: string; label: string; _id: string }[]; // Adjusted to include _id
  vehicleCategoryId: string;
};

export type TabsTypes = "primary" | "specifications" | "features";
export type SRMTabsTypes = "customer" | "vehicle" | "payment";

export interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}

export type ApprovalStatusTypes =
  | "ALL"
  | "APPROVED"
  | "REJECTED"
  | "PENDING"
  | "UNDER_REVIEW";

// CustomerDetailsFormType (level 1)
export type SRMCustomerDetailsFormType = {
  customerProfile?: string; // Optional field for profile photo or identifier
  customerName: string; // User name
  nationality: string; // Nationality of the user
  passportNum: string; // Passport number of the user
  drivingLicenseNum: string; // Driving license number of the user
  phoneNumber: string; // Mobile number of the user
};

// VehicleDetailsFormType  (level 2)
export type SRMVehicleDetailsFormType = {
  vehicleCategoryId: string;
  vehicleBrandId: string;
  vehicleRegistrationNumber: string;
  rentalDetails: {
    day: RentalDetailType;
    week: RentalDetailType;
    month: RentalDetailType;
    hour: HourlyRentalDetailType;
  };
};

// PaymentDetailsFormType (level 3)
export type SRMPaymentDetailsFormType = {
  advanceAmount: string;
  remainingAmount: string;
  securityDeposit: {
    enabled: boolean;
    amountInAED?: string;
  };
  bookingStartDate: Date | undefined;
  bookingEndDate: Date | undefined;
  currency: string;
};

export enum CustomerStatus {
  SUCCESSFUL = "Successfully Completed Trip",
  PAYMENT_PENDING = "Payment Pending",
  UNPAID_FINES = "Unpaid Fines",
  DAMAGE_UNCLEARED = "Vehicle Damage Reported/Uncleared",
  DAMAGE_CLEARED = "Vehicle Damage Reported/Cleared",
  VEHICLE_LOST = "Vehicle Lost",
}
