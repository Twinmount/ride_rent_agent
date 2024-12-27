// CustomerDetailsFormType (level 1)
export type SRMCustomerDetailsFormType = {
  customerProfilePic?: string; // Optional field for profile photo or identifier
  customerName: string; // User name
  nationality: string; // Nationality of the user
  passportNumber: string; // Passport number of the user
  drivingLicenseNumber: string; // Driving license number of the user
  phoneNumber: string; // Mobile number of the user
};

// Rental detail type for day, week, and month
type SRMRentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
};

// Hourly rental detail type, which includes minBookingHours
type SRMHourlyRentalDetailType = {
  enabled: boolean;
  rentInAED: string;
  mileageLimit: string;
  minBookingHours: string;
};

// VehicleDetailsFormType  (level 2)
export type SRMVehicleDetailsFormType = {
  vehicleCategoryId: string;
  vehicleBrandId: string;
  vehicleRegistrationNumber: string;
  vehiclePhoto: string;
  rentalDetails: {
    day: SRMRentalDetailType;
    week: SRMRentalDetailType;
    month: SRMRentalDetailType;
    hour: SRMHourlyRentalDetailType;
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

// SRM Booking Status
export enum BookingStatus {
  COMPLETED = "COMPLETED",
  ONGOING = "ONGOING",
  CANCELLED = "CANCELLED",
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

// individual customer
export interface CustomerType {
  id: string;
  customerId: string;
  customerName: string;
  nationality: string;
  passportNumber: string;
  drivingLicenseNumber: string;
  phoneNumber: string;
  customerProfilePic?: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
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

export interface Trip {
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
}

// Base type for charges
export type ChargeType = {
  amount: string;
  description: string; // General description field
  paymentDate: Date;
};

// Trip End Form Type
export type TripEndFormType = {
  customerStatus: CustomerStatus;
  finesCollected: ChargeType[];
  salikCollected: ChargeType[];
  additionalCharges: ChargeType[];
  discounts?: string;
  totalAmountCollected: string;
};

export type BannedCustomerType = {
  isSpammed: boolean;
  customerId: string;
  reason: string | null;
  vehicleRegistrationNumber: string | null;
  companyName: string | null;
  bookingStartDate: string | null;
  bookingEndDate: string | null;
};
