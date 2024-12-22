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

export interface Trip {
  id: string;
  brandName: string;
  vehicleRegistrationNumber: string;
  passportNumber: string;
  customerName: string;
  bookingStartDate: Date;
  BookingEndDate: Date;
  nationality: string;
  mobileNumber: string;
  advancePaid: number;
  amountRemaining: number;
}

// Additional charge type
export type AdditionalChargeType = {
  amount: string;
  description?: string;
  paymentDate: Date;
};

// Traffic fine type
export type TrafficFineType = {
  amount: string;
  description: string; // Internal description
  paymentDate: Date;
};

// Salik type
export type SalikType = {
  amount: string;
  description: string; // "SALIK" set internally
  paymentDate: Date;
};

export type TripEndFormType = {
  brandName: string;
  customerName: string;
  customerStatus: CustomerStatus;
  finesCollected: TrafficFineType[];
  salikCollected: SalikType[];
  additionalCharges: AdditionalChargeType[];
  discounts?: string;
  totalAmountCollected: string;
};
