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
    brandValue: string;
    brandLogo: string;
  };
  vehicleRegistrationNumber: string;
  vehiclePhoto: string;
  rentalDetails: RentalDetails;
  createdBy: string;
}

export interface AddVehicleFormResponse {
  result: VehicleApiType;
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

// Payment type
export interface PaymentApiType {
  id: string;
  paymentId: string;
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
  payment: PaymentApiType;
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

export interface FetchOngoingTripsResponse {
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

export interface FetchCompletedTripsResponse {
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

export interface FetchEndTripResponse {
  result: {
    advanceCollected: number;
  };
  status: string;
  statusCode: number;
}
