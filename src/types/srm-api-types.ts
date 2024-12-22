export interface CustomerType {
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
  result: CustomerType;
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

// vehicle types
export interface RentalDetails {
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
}

export interface VehicleType {
  id: string;
  vehicleId: string;
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
  result: {
    vehicleId: string; // Unique identifier for the vehicle
    vehicleCategoryId: string; // Category ID of the vehicle
    vehicleBrandId: string; // Brand ID of the vehicle
    vehicleRegistrationNumber: string; // Registration number of the vehicle
    bookingStartDate: string; // Start date of the booking in ISO format
    bookingEndDate: string; // End date of the booking in ISO format
    createdAt: string; // Timestamp when the record was created
    updatedAt: string; // Timestamp when the record was last updated
  };
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

// Payment type
export interface PaymentType {
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
    paymentId: string; // Unique identifier for the payment
    currency: string; // Currency code used for the payment
    advanceAmount: string; // Recorded advance amount
    remainingAmount: string; // Remaining amount
    createdAt: string; // Timestamp when the record was created
    updatedAt: string; // Timestamp when the record was last updated
  };
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

export interface CreateCustomerBookingResponse {
  result: {
    id: string;
    bookingId: string;
    levelsFilled: number;
    vehicle: VehicleType;
    customer: CustomerType;
    payment: PaymentType;
    bookingStatus: string;
    bookingStartDate: string; // ISO date string
    bookingEndDate: string; // ISO date string
    createdBy: string;
    updatedBy: string;
    createdDate: string; // ISO date string
    updatedDate: string; // ISO date string
    customerBookingRemark: string;
  };
  status: string; // Status message (e.g., 'success', 'error')
  statusCode: number; // HTTP status code (e.g., 200, 400)
}

// active trips
interface OngoingTrip {
  tripId: string;
  brandName: string;
  customerName: string;
  bookingStartDate: string;
  bookingEndDate: string;
}

export interface FetchOngoingTripsResponse {
  result: {
    list: OngoingTrip[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// completed trips api response
export interface CompletedTrip {
  tripId: string;
  brandName: string;
  customerName: string;
  tripStarted: string;
  tripEnded: string;
  amountCollected: number;
  amountPending: number;
}

export interface FetchCompletedTripsResponse {
  result: {
    list: CompletedTrip[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

export interface VehicleListItem {
  vehicleId: string;
  brandName: string;
  vehicleRegistrationNumber: string;
  totalTrips: number;
  amountGenerated: number;
}

export interface FetchVehicleListResponse {
  result: {
    list: VehicleListItem[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}

// Customer Individual type
export interface CustomerListItem {
  id: string;
  customerId: string;
  customerName: string;
  customerProfilePic: string;
  nationality: string;
  passportNumber: string;
  drivingLicenseNumber: string;
  phoneNumber: string;
  countryCode: string;
  updatedAt: string;
}

export interface FetchCustomerListResponse {
  result: {
    list: CustomerListItem[];
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
    list: CustomerListItem[];
    page: number;
    limit: number;
    total: number;
    totalNumberOfPages: number;
  };
  status: string;
  statusCode: number;
}
