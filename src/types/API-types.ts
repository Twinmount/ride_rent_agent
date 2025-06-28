// register response
export interface RegisterResponse {
  result: {
    otpId: string;
    userId: string;
    otp: string;
  };
  status: string;
  statusCode: number;
}

// verify otp response
export interface VerifyOTPResponse {
  result: {
    emailId: string;
    refreshToken: string;
    isPhoneVerified: boolean;
    token: string;
    userId: string;
  };
}

// login response
export interface LoginResponse {
  result: {
    emailId: string | null;
    isPhoneVerified: boolean;
    refreshToken: string;
    token: string;
    userId: string;
  };

  status: string;
  statusCode: number;
}

// reset password response
export interface ResetPasswordResponse {
  result: {
    otpId: string;
    otp: string;
    userId: string;
  };

  status: string;
  statusCode: number;
}

// get user response
export interface FetchUserResponse {
  result: {
    id: string;
    agentId: string;
    countryCode: string;
    phoneNumber: string;
    emailId: string;
    createdAt: string;
    updatedAt: string;
  };

  status: string;
  statusCode: number;
}

// company type
export interface companyType {
  agentId: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: Date;
  regNumber: string;
  approvalStatus: string;
  rejectionReason: string;
  plan: string;
  companyAddress: string;
  companyLanguages: string[];
}

//  interface for the get-all-companies  API response
export interface FetchCompaniesResponse {
  result: companyType[];
  status: string;
  statusCode: number;
}

//  interface for the company (by id)  API response
export interface FetchSpecificCompanyResponse {
  result: companyType | null;
  status: string;
  statusCode: number;
}

//  email send otp response
export interface SendOTPResponse {
  result: {
    otpId: string;
    Otp: string;
    userId: string;
  };
  status: string;
  statusCode: number;
}

export interface FetchIsEmailAlreadyVerifiedResponse {
  result: {
    isEmailVerified: boolean;
  };
  status: string;
  statusCode: number;
}

// category type
export interface CategoryType {
  categoryId: string;
  name: string;
  value: string;
}

//  interface for the category (GET ALL) API response
export interface FetchCategoriesResponse {
  status: string;
  result: {
    list: CategoryType[]; // Array of categories
    page: number; // Current page number
    total: number; // Total number of categories
  };
  statusCode: number;
}

// type of single vehicle type
export interface VehicleTypeType {
  typeId: string;
  name: string;
  value: string;
  subHeading: string;
  typeLogo: any;
  metaTitle: string;
  metaDescription: string;
}

//  interface for the vehicle types (GET ALL) API response
export interface FetchTypesResponse {
  status: string;
  result: {
    list: VehicleTypeType[]; // Array of vehicle types
    page: number; // Current page number
    total: number; // Total number of categories
  };
  statusCode: number;
}

// type of single brand
export interface BrandType {
  id: string;
  vehicleCategoryId: string;
  brandName: string;
  brandValue: string;
  subHeading: string;
  brandLogo: any;
  metaTitle: string;
  metaDescription: string;
}

//  interface for the Brand GET ALL) API response
export interface FetchBrandsResponse {
  status: string;
  result: {
    list: BrandType[]; // Array of brands
    page: number; // Current page number
    total: number; // Total number of categories
  };
  statusCode: number;
}

// interface for the  Brand (GET BY ID) response
export interface FetchSpecificBrandResponse {
  result: BrandType;
  status: string;
  statusCode: number;
}

// state type
export interface StateType {
  countryId: string;
  stateId: string;
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any;
}

//  interface for the get-all-states  API response
export interface FetchStatesResponse {
  result: StateType[];
  status: string;
  statusCode: number;
}

export interface CountryType {
  countryId: string;
  countryName: string;
  countryValue: string;
}

export interface FetchCountryResponse {
  result: CountryType[];
  status: string;
  statusCode: number;
}

export interface CityType {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
}

//  interface for the location API response
export interface FetchCitiesResponse {
  result: CityType[];
  status: string;
  statusCode: number;
}

// Type for a single brand
export interface BrandType {
  id: string;
  vehicleCategoryId: string;
  brandName: string;
  brandValue: string;
  subHeading: string;
  brandLogo: any; // Assuming brandLogo is a URL (string)
  metaTitle: string;
  metaDescription: string;
}

// Type for vehicle type
export interface VehicleType {
  typeId: string;
  name: string;
  value: string;
}

// Type for category
export interface CategoryType {
  categoryId: string;
  name: string;
  value: string;
}

// Type for state
export interface StateType {
  countryId: string;
  stateId: string;
  stateName: string;
  stateValue: string;
  subHeading: string;
  metaTitle: string;
  metaDescription: string;
  stateImage: any; // Assuming stateImage is a URL (string)
}

// Type for city
export interface CityType {
  stateId: string;
  cityId: string;
  cityName: string;
  cityValue: string;
}

// type fo rental details
export type RentalDetailsType = {
  day: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  week: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
  month: {
    enabled: boolean;
    rentInAED: string;
    mileageLimit: string;
  };
};

// Interface for the Primary Form (POST) API response
export interface AddPrimaryFormResponse {
  result: {
    vehicleId: string;
    tempId: string;
    commercialLicenseExpiryDate: string;
    brand: BrandType;
    vehicleType: VehicleType;
    vehicleCategory: CategoryType;
    vehicleModel: string;
    registredYear: string; // corrected to match the response field name
    rentalDetails: RentalDetailsType; // Assuming this is a JSON string, as in the response example
    specification: "USA_SPEC" | "UAE_SPEC" | "OTHERS";
    countryCode: string;
    phoneNumber: string;
    state: StateType;
    city: CityType[];
    levelsFilled: number; // Assuming this is a number based on the example response
    vehiclePhotos: string[];
    commercialLicences: string[];
    companyId: string;
    vehicleRegistrationNumber: string;
    createdAt: string;
    updatedAt: string;
  };
  status: string;
  statusCode: number;
}

// Primary form data
export type GetPrimaryForm = {
  vehicleId: string;
  vehicleRegistrationNumber: string;
  vehicleCategoryId: string;
  vehicleTypeId: string;
  vehicleBrandId: string;
  vehicleModel: string;
  countryCode: string;
  phoneNumber: string;
  specification: "UAE_SPEC" | "USA_SPEC" | "OTHERS";
  rentalDetails: {
    day: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
    };
    week: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
    };
    month: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
    };
    hour: {
      enabled: boolean;
      rentInAED: string;
      mileageLimit: string;
      minBookingHours: string;
    };
  };
  stateId: string;
  cityIds: string[];
  vehicleRegisteredYear: string;
  commercialLicenseExpireDate: string;
  isLease: boolean;
  isCryptoAccepted: boolean;
  isSpotDeliverySupported: boolean;
  description: string;
  vehiclePhotos: string[];
  commercialLicenses: string[];
  additionalVehicleTypes?: string[];
  securityDeposit: {
    enabled: boolean;
    amountInAED?: string;
  };
  isCreditOrDebitCardsSupported: boolean;
  isTabbySupported: boolean;
};

// Primary form get all response
export interface GetPrimaryFormResponse {
  result: GetPrimaryForm;
  status: string;
  statusCode: number;
}

// levels filled response to check whether whats the currently completed level of vehicle registration form
export interface GetLevelsFilledResponse {
  result: {
    levelsFilled: string;
  };
  status: string;
  statusCode: number;
}

// Specification form data
export type SpecificationFormData = {
  id: string;
  name: string;
  hoverInfo: string;
  values: { label: string; name: string; _id: string; hoverInfo: string }[];
  vehicleCategoryId: string;
};

// Specification form get all response
export interface GetSpecificationFormFieldsResponse {
  result: {
    list: SpecificationFormData[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// Type for each specification field (for "Update")
export type SpecificationField = {
  id: string;
  name: string;
  hoverInfo: string;
  values: {
    name: string;
    label: string;
    selected: boolean;
  }[];
  vehicleCategoryId: string;
  vehicleId: string | null; // vehicleId might be null
};

// Type for the API response (for "Update")
export interface GetSpecificationFormDataResponse {
  status: string;
  result: SpecificationField[];
  statusCode: number;
}

// Type for a single feature field
export type FeatureField = {
  id: string;
  name: string;
  values: { name: string; label: string; _id: string; selected: boolean }[]; // Add `_id` field
  vehicleCategoryId: string;
  vehicleId: string | null;
};

// Type for the features form data response
export type GetFeaturesFormDataResponse = {
  status: string;
  result: FeatureField[]; // Adjusted to match the response structure
  statusCode: number;
};

// Features form data
export type FeaturesFormData = {
  id: string;
  name: string;
  values: { label: string; name: string; _id: string; selected?: boolean }[];
  vehicleCategoryId: string;
};

// Features form get all response
export interface FeaturesFormResponse {
  result: {
    list: FeaturesFormData[]; // Adjusted to match the nested structure
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}
// fetch all vehicles response
// Features Type
export type FeatureType = {
  name: string;
  value: string;
  selected: boolean;
};

// Specification Type
export type SpecificationType = {
  name: string;
  value: string;
  selected: boolean;
};

export type CompanyType = {
  companyId: string;
  companyName: string;
  regNumber: string;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
  plan: "BASIC" | "PREMIUM" | "ENTERPRISE";
  rejectionReason: string;
  agentId: string;
  companyLogo: string;
  commercialLicense: string;
  expireDate: string;
};

// Vehicle Type
export type SingleVehicleType = {
  vehicleId: string;
  tempId: string;
  disabledBy: "admin" | "seller";
  vehicleRegistrationNumber: string;
  company: CompanyType;
  brand: BrandType;
  vehicleType: VehicleTypeType;
  vehicleCategory: CategoryType;
  vehicleModel: string;
  vehicleRegisteredYear: string;
  countryCode: string;
  phoneNumber: string;
  rentalDetails: RentalDetailsType;
  specification: string;
  state: StateType;
  city: CityType[];
  levelsFilled: string;
  vehiclePhotos: string[];
  commercialLicenses: string;
  commercialLicenseExpiryDate: string;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED" | "UNDER_REVIEW";
  rejectionReason: string;
  isLease: boolean;
  isModified: boolean;
  isDisabled: boolean;
  rank: number;
  newRegistration: boolean;
  features: Record<string, FeatureType[]>;
  specs: Record<string, SpecificationType>;
  updatedAt: string;
  createdAt: string;
  thumbnail: string;
};

// get all vehicles api response
export interface FetchAllVehiclesResponse {
  result: {
    list: SingleVehicleType[]; // Adjusted to match the nested structure
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

//  response for dashboard enquiries and portfolios response
export interface FetchDashboardResponse {
  result: {
    count: string;
  };
  status: string;
  statusCode: number;
}

// api response types for single file upload
export interface SingleFileUploadResponse {
  result: {
    message: string;
    fileName: string;
    path: string;
  };
  status: string;
  statusCode: number;
}

// api response types for multiple file upload
export interface MultipleFileUploadResponse {
  result: {
    message: string;
    fileName: string;
    paths: string[]; //array of paths
  };
  status: string;
  statusCode: number;
}

export interface GetSingleImageResponse {
  status: string;
  statusCode: number;
  result: {
    url: string;
  };
}

export interface DeleteSingleImageResponse {
  status: string;
  statusCode: number;
  result: {
    message: string;
    fileFullPath: string;
  };
}
