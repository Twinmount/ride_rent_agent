import { PaymentApiType, VehicleApiType } from "@/types/srm-api-types";
import {
  SRMPaymentDetailsFormType,
  SRMVehicleDetailsFormType,
} from "@/types/srm-types";

type FormFieldArrayItem = {
  amount?: string; // Now optional
  paymentDate?: Date | null | undefined; // Now optional
};

type ValidationResult = string | null;

/**
 * Generic validation helper for array fields like Traffic Fine, Salik, and Additional Charges
 * @param fieldArray - Array of form field items to validate
 * @param fieldName - Name of the field (used for error messages)
 * @returns {ValidationResult} - Error message or null if valid
 */
export const validateFieldArray = (
  fieldArray: FormFieldArrayItem[] | undefined,
  fieldName: string
): ValidationResult => {
  if (!fieldArray || fieldArray.length === 0) {
    // If array is empty, it's valid
    return null;
  }

  for (let i = 0; i < fieldArray.length; i++) {
    const { amount, paymentDate } = fieldArray[i];

    if (!amount) {
      return `Amount is required for ${fieldName} all entries`;
    }

    if (!paymentDate) {
      return `Payment date is required for ${fieldName} all entries`;
    }
  }

  // All items are valid
  return null;
};

// map to SRM vehicle form
export const mapToSRMVehicleForm = (
  vehicle: VehicleApiType | undefined
): SRMVehicleDetailsFormType => {
  if (!vehicle) {
    return {
      vehicleCategoryId: "",
      vehicleBrandId: "",
      vehicleRegistrationNumber: "",
      vehiclePhoto: "",
      numberOfPassengers: "",
      vehicleColor: "",
      bodyType: "",
      chassisNumber: "",
      additionalMilageChargePerKm: "",
      registrationDate: undefined,
      registrationDueDate: undefined,
      trafficFineId: "",
      lastServiceDate: undefined,
      currentKilometre: "",
      serviceKilometre: "",
      nextServiceKilometre: "",
      nextServiceDate: undefined,
      rentalDetails: {
        day: { enabled: false, rentInAED: "", mileageLimit: "" },
        week: { enabled: false, rentInAED: "", mileageLimit: "" },
        month: { enabled: false, rentInAED: "", mileageLimit: "" },
        hour: {
          enabled: false,
          minBookingHours: "",
          rentInAED: "",
          mileageLimit: "",
        },
      },
    };
  }

  return {
    vehicleCategoryId: vehicle.vehicleCategory?.categoryId ?? "",
    vehicleBrandId: vehicle.vehicleBrand?.id ?? "",
    vehicleRegistrationNumber: vehicle.vehicleRegistrationNumber ?? "",
    vehiclePhoto: vehicle.vehiclePhotoPath ?? "",
    // convert to string
    numberOfPassengers: vehicle.numberOfPassengers?.toString() ?? "",
    vehicleColor: vehicle.vehicleColor ?? "",
    bodyType: vehicle.bodyType ?? "",
    chassisNumber: vehicle.chassisNumber ?? "",
    additionalMilageChargePerKm: vehicle.additionalMilageChargePerKm ?? "",
    registrationDate: vehicle.registrationDate
      ? new Date(vehicle.registrationDate)
      : undefined,
    registrationDueDate: vehicle.registrationDueDate
      ? new Date(vehicle.registrationDueDate)
      : undefined,
    trafficFineId: vehicle.trafficFineId ?? "",
    lastServiceDate: vehicle.lastServiceDate
      ? new Date(vehicle.lastServiceDate)
      : undefined,
    currentKilometre: vehicle.currentKilometre ?? "",
    serviceKilometre: vehicle.serviceKilometre ?? "",
    nextServiceKilometre: vehicle.nextServiceKilometre ?? "",
    nextServiceDate: vehicle.nextServiceDate
      ? new Date(vehicle.nextServiceDate)
      : undefined,
    rentalDetails: vehicle.rentalDetails ?? {
      day: { enabled: false, rentInAED: "", mileageLimit: "" },
      week: { enabled: false, rentInAED: "", mileageLimit: "" },
      month: { enabled: false, rentInAED: "", mileageLimit: "" },
      hour: {
        enabled: false,
        minBookingHours: "",
        rentInAED: "",
        mileageLimit: "",
      },
    },
  };
};

// map to srm payment form
export const mapToSRMPaymentForm = (
  vehicle: PaymentApiType | undefined
): SRMPaymentDetailsFormType => {
  if (!vehicle) {
    return {
      advanceAmount: "",
      remainingAmount: "",
      securityDeposit: {
        enabled: false,
        amountInAED: "",
      },
      currency: "",
      bookingStartDate: undefined,
      bookingEndDate: undefined,
    };
  }

  return {
    advanceAmount: vehicle.payment.advanceAmount,
    remainingAmount: vehicle.payment.remainingAmount,
    securityDeposit: vehicle.payment.securityDeposits,
    bookingStartDate: new Date(vehicle.bookingStartDate),
    bookingEndDate: new Date(vehicle.bookingEndDate),
    currency: vehicle.payment.currency,
  };
};
