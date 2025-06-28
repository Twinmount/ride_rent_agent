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
  companyAddress: string;
  companyLanguages: string[];
};

export type ProfileUpdateFormType = {
  commercialLicense: string;
  expireDate: Date | undefined;
  regNumber: string;
  companyAddress: string;
  companyLanguages: string[];
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
export type SRMTabsTypes = "customer" | "vehicle" | "payment" | "check-list";
export type TabItemsTypes = {
  value: SRMTabsTypes;
  label: string;
  subLabel: string;
}[];

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
