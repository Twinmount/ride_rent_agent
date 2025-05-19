import { RentalDetails } from "./srm-types";

export interface CustomerApiType {
  id: string; // Unique identifier for the user
  customerId: string;
  customerName: string; // User's name
  nationality: string; // User's nationality
  passportNumber: string; // User's passport number
  drivingLicenseNumber: string; // User's driving license number
  phoneNumber: string; // User's phone number, possibly formatted
  customerProfilePic?: string; // Optional field for the user's profile image or identifier
  customerProfilePicPath?: string; // Optional field for the user's profile image or identifier
  countryCode: string; // The country code associated with the user's phone number
  createdAt: string; // Timestamp when the record was created
  updatedAt: string; // Timestamp when the record was last updated
}
export interface AddCustomerFormResponse {
  result: CustomerApiType;
  status: string;
  statusCode: number;
}

export interface GetIsCustomerSpamResponse {
  result: {
    isSpammed: boolean;
    customerId: string;
    reason: string | null;
    vehicleRegistrationNumber: string | null;
    companyName: string | null;
    bookingStartDate: string | null;
    bookingEndDate: string | null;
  };
  status: string;
  statusCode: number;
}

// vehicle types

export interface VehicleApiType {
  id: string;
  vehicleCategory: {
    categoryId: string;
    name: string;
    value: string;
  };
  vehicleBrand: {
    id: string;
    vehicleCategoryId: string;
    brandName: string;
    brandLogo: string;
  };
  vehicleRegistrationNumber: string;
  vehiclePhoto: string;
  vehiclePhotoPath: string;
  numberOfPassengers: string;
  vehicleColor: string;
  bodyType: string;
  chassisNumber: string;
  additionalMilageChargePerKm: string;

  registrationDate: string;
  registrationDueDate: string;
  trafficFineId: string;
  lastServiceDate: string;
  currentKilometre: string;
  serviceKilometre: string;
  nextServiceKilometre: string;
  nextServiceDate: string;
  rentalDetails: RentalDetails;
  createdBy: string;
}

export interface OngoingListVehicleType {
  _id: string;
  vehicleRegistrationNumber: string;
  vehicleCategoryId: string;
  vehicleBrandId: string;
  vehiclePhoto: string;
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
  };
}

export interface AddVehicleFormResponse {
  result: VehicleApiType;
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

// Payment type
export interface PaymentApiType {
  bookingId: string;
  payment: {
    id: string;
    advanceAmount: string;
    remainingAmount: string;
    securityDeposits: {
      enabled: boolean;
      amountInAED: string;
    };
    currency: string;
  };
  vehicle: {
    rentalDetails: RentalDetails;
  };
  bookingStartDate: string;
  bookingEndDate: string;
}

export interface ListPaymentType {
  id: string;
  advanceAmount: string;
  remainingAmount: string;
  securityDeposits: {
    enabled: boolean;
    amountInAED: string;
  };
  currency: string;
}

export interface AddPaymentFormResponse {
  result: {
    id: string; // Unique identifier for the payment
    currency: string; // Currency code used for the payment
    advanceAmount: string; // Recorded advance amount
    remainingAmount: string; // Remaining amount
    createdAt: string; // Timestamp when the record was created
    updatedAt: string; // Timestamp when the record was last updated
  };
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

// active trips
export interface IndividualTrip {
  id: string;
  bookingId: string;
  levelsFilled: number;
  vehicle: VehicleApiType;
  customer: CustomerApiType;
  payment: ListPaymentType;
  bookingStatus: string;
  bookingStartDate: string; // ISO date string
  bookingEndDate: string; // ISO date string
  createdBy: string;
  updatedBy: string;
  createdDate: string; // ISO date string
  updatedDate: string; // ISO date string
  customerBookingRemark: string;
  maxBookingDate: string;
  discounts: string;
  totalAmountCollected: string;
}

export interface CreateCustomerBookingResponse {
  result: IndividualTrip;
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

export interface FetchSingleBookingResponse {
  result: IndividualTrip;
  status: string;
  statusCode: number;
}

export interface FetchBookingsResponse {
  result: {
    list: IndividualTrip[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchTripEndResponse {
  result: {
    list: IndividualTrip[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchVehicleListResponse {
  result: {
    list: VehicleApiType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchCustomerListResponse {
  result: {
    list: CustomerApiType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchCustomerDetailsByIdResponse {
  result: CustomerApiType;
  status: string;
  statusCode: number;
}

export interface FetchUpcomingBookingDatesResponse {
  result: { bookingStartDate: string; bookingEndDate: string }[];
  status: string;
  statusCode: number;
}

export interface SearchCustomerResponse {
  result: {
    list: CustomerApiType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface SearchVehicleResponse {
  result: {
    list: VehicleApiType[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface FetchExtendTripResponse {
  result: {
    advanceCollected: number;
    remainingAmount: number;
    bookingStartDate: string;
    bookingEndDate: string;
    nextPossibleMaxBookingEndDate: string;
    vehicle: VehicleApiType;
  };
  status: string;
  statusCode: number;
}
export interface ExtendTripResponse {
  result: IndividualTrip;
  status: string;
  statusCode: number;
}

export interface FetchEndTripResponse {
  result: {
    advanceCollected: number;
    vehicle: VehicleApiType;
    customer: CustomerApiType;
  };
  status: string;
  statusCode: number;
}

export interface FetchPaymentFormRequiredDataResponse {
  result: {
    bookingId: string;
    vehicle: VehicleApiType;
  };
  status: string;
  statusCode: number;
}

export interface GetSRMLevelsFilledResponse {
  result: {
    levelsFilled: string;
  };
  status: string;
  statusCode: number;
}

export interface GetSRMCustomerDetailsResponse {
  result: CustomerApiType;
  status: string;
  statusCode: number;
}

export interface GetSRMVehicleDetailsResponse {
  result: VehicleApiType;
  status: string;
  statusCode: number;
}

export interface ChecklistApiType {
  vehicleId: string;
  checklistMetadata: string;
}

export interface GetSRMChecklistResponse {
  result: ChecklistApiType;
  status: string;
  statusCode: number;
}
export interface GetSRMPaymentDetailsResponse {
  result: PaymentApiType;
  status: string;
  statusCode: number;
}
