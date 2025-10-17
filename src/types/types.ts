// agent context  type

import React from "react";

type AppState = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  agentId: string;
};

export type AppSuportedCountries = {
  id: string;
  name: string;
  value: string;
  icon: string;
};

export type AgentContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isSmallScreen: boolean;
  agentId: string | undefined;
  userId: string | undefined;
  isLoading: boolean;
  isError: boolean;
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  appCountry: string;
  updateAppCountry: (country: string) => void;
  appSuportedCountries: AppSuportedCountries[];
};

export type RegistrationType = {
  mobile: string;
  password: string;
};

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export type CompanyFormType = {
  companyName: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate?: Date | undefined;
  regNumber: string;
  companyAddress: string;
  companyLanguages: string[];
  accountType?: "company" | "individual";
  countryId?: string;
  location?: Location;
};

export type ProfileUpdateFormType = {
  commercialLicense: string;
  expireDate?: Date | undefined;
  regNumber: string;
  companyAddress: string;
  companyLanguages: string[];
  accountType?: string;
  location?: Location;
};

// Rental detail type for day, week, and month
type RentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
  unlimitedMileage: boolean;
};

type HourlyRentalDetailType = RentalDetailType & {
  minBookingHours: string;
};

type CityType = {
  _id?: string;
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
};

// primary details form type
export type PrimaryFormType = {
  vehicleId?: string;
  vehicleCategoryId: string;
  vehicleTypeId: string;
  vehicleBrandId: string;
  vehicleModel: string;
  vehiclePhotos: string[]; // Array of  URLs
  vehicleVideos: string[];
  vehicleRegistrationNumber: string;
  isFancyNumber: boolean;
  vehicleRegisteredYear: string;
  commercialLicenses: string[]; // Array of  URLs
  commercialLicenseExpireDate: Date | undefined;
  isLease: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  specification: "India_SPEC" | "UAE_SPEC" | "USA_SPEC" | "OTHERS";
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
  isCashSupported: boolean;
  tempCitys?: CityType[];
  isVehicleModified: boolean;
};

export type SpecificationFormData = {
  id: string;
  name: string;
  values: { name: string; label: string; _id: string }[]; // Adjusted to include _id
  vehicleCategoryId: string;
};

export type TabsTypes = "primary" | "specifications" | "features";
export type SRMTabsTypes = "vehicle" | "customer" | "payment" | "check-list";
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
