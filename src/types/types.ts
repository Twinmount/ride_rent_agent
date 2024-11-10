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
  expireDate: Date;
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
  commercialLicenseExpireDate: Date;
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
export type SRMTabsTypes = "user" | "vehicle" | "payment";

export interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
      };
    };
  };
}

export type SRMUserDetailsFormType = {
  userProfile?: string; // Optional field for profile photo or identifier
  userName: string; // User name
  nationality: string; // Nationality of the user
  passportNum: string; // Passport number of the user
  drivingLicenseNum: string; // Driving license number of the user
  phoneNumber: string; // Mobile number of the user
};

export type SRMVehicleDetailsFormType = {
  vehicleCategoryId: string;
  vehicleBrandId: string;
  vehicleRegistrationNumber: string;
  startDateTime: Date;
  endDateTime: Date;
};

export type SRMPaymentDetailsFormType = {
  currency: string;
  advancePaid: string;
  remainingAmount: string;
};
