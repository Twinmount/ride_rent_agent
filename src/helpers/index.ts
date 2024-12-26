import { SingleVehicleType } from "@/types/API-types";
import { differenceInHours } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { CustomerType } from "@/types/srm-types";
import { SRMVehicleDetailsFormType, VehicleType } from "@/types/srm-types";

type ApprovalStatusType = "APPROVED" | "UNDER_REVIEW" | "REJECTED" | "PENDING";

// Function to get descriptive message based on approval status
export function getApprovalStatusDescription(status: ApprovalStatusType) {
  switch (status) {
    case "APPROVED":
      return "These are vehicles that are currently live.";
    case "UNDER_REVIEW":
      return "These are registration completed vehicles, but it is currently under review. It will be live soon as the admin approves it.";
    case "REJECTED":
      return "These vehicles have been rejected. Please check the details and resubmit or contact support for further assistance.";
    case "PENDING":
      return "These are vehicles for which the vehicle registration form completion is pending, or vehicle registration is incomplete.";
    default:
      return "Unknown status";
  }
}

// helper function to generate dynamic url for vehicle details page
export function generateModelDetailsUrl(vehicle: SingleVehicleType): string {
  // Fallback values if vehicle details are missing
  const fallbackBrand = "brand";
  const fallbackModel = "model";
  const fallbackState = "state";

  const cleanText = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/ - /g, "-") // Handle hyphens within the string
      .replace(/[^a-z0-9-]+/g, "-") // Replace non-alphanumeric characters and spaces with hyphen
      .replace(/^-+|-+$/g, ""); // Remove any leading or trailing hyphens
  };

  const brand = cleanText(vehicle?.brand.brandName || fallbackBrand);
  const model = cleanText(vehicle?.vehicleModel || fallbackModel);
  const state = cleanText(vehicle?.state.stateValue || fallbackState);

  return `rent-${brand}-${model}-model-in-${state}`;
}

interface RentalDetails {
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

/**
 * Calculates the total rental amount based on the rental details and booking period.
 *
 * This function takes into account the enabled rental periods (month, week, day, hour) and their respective rates.
 * It calculates the total amount by determining how many complete months, weeks, and days fit into the booking period,
 * and charges the corresponding rates. For hourly rentals, it considers the minimum booking hours.
 *
 * @param rentalDetails - An object containing enabled flags, rates (in AED), and mileage limits for each rental period.
 * @param bookingStartDate - The start date of the booking in string format.
 * @param bookingEndDate - The end date of the booking in string format.
 * @returns The total rental amount for the specified booking period.
 */

export const calculateRentalAmount = (
  rentalDetails: RentalDetails,
  bookingStartDate: string,
  bookingEndDate: string
): number => {
  const startDate = new Date(bookingStartDate);
  const endDate = new Date(bookingEndDate);

  let remainingHours = differenceInHours(endDate, startDate);
  let totalAmount = 0;

  // Calculate months
  if (rentalDetails.month.enabled && remainingHours >= 24 * 30) {
    const months = Math.floor(remainingHours / (24 * 30));
    totalAmount += months * parseFloat(rentalDetails.month.rentInAED);
    remainingHours -= months * 24 * 30;
  }

  // Calculate weeks
  if (rentalDetails.week.enabled && remainingHours >= 24 * 7) {
    const weeks = Math.floor(remainingHours / (24 * 7));
    totalAmount += weeks * parseFloat(rentalDetails.week.rentInAED);
    remainingHours -= weeks * 24 * 7;
  }

  // Calculate days
  if (rentalDetails.day.enabled && remainingHours >= 24) {
    const days = Math.floor(remainingHours / 24);
    totalAmount += days * parseFloat(rentalDetails.day.rentInAED);
    remainingHours -= days * 24;
  }

  // Calculate hours
  if (rentalDetails.hour.enabled && remainingHours > 0) {
    const minBookingHours = parseInt(
      rentalDetails.hour.minBookingHours || "1",
      10
    );
    if (remainingHours >= minBookingHours) {
      totalAmount += remainingHours * parseFloat(rentalDetails.hour.rentInAED);
    }
  }

  return totalAmount;
};

export const calculateFinalAmount = (
  baseAmount: number,
  additionalChargesTotal: number,
  discount: string
): number => {
  const discountAmount = parseFloat(discount || "0");

  // Add base rental, additional charges total, subtract discount, and add 5% tax
  let finalAmount = baseAmount + additionalChargesTotal - discountAmount;

  // Add 5% tax
  finalAmount += finalAmount * 0.05;

  return finalAmount;
};

// Helper function to handle customer selection to auto fill the Customer form
export const handleCustomerSelect = (
  form: UseFormReturn<any, any>,
  customerName: string,
  customerData: CustomerType | null,
  setExistingCustomerId: (id: string | null) => void,
  setCurrentProfilePic: (pic: string | null) => void,
  setCountryCode: (code: string) => void
) => {
  form.setValue("customerName", customerName);

  if (customerData) {
    setExistingCustomerId(customerData.customerId);
    form.setValue("customerProfilePic", customerData.customerProfilePic || "");
    setCurrentProfilePic(customerData.customerProfilePic || "");
    form.setValue("nationality", customerData.nationality || "");
    form.setValue("passportNumber", customerData.passportNumber || "");
    form.setValue(
      "drivingLicenseNumber",
      customerData.drivingLicenseNumber || ""
    );
    form.setValue(
      "phoneNumber",
      (customerData.countryCode || "971") + customerData.phoneNumber || ""
    );
    setCountryCode(customerData.countryCode || "");
  } else {
    setExistingCustomerId(null);
    setCurrentProfilePic(null);
    form.setValue("customerProfilePic", "");
    form.resetField("nationality");
    form.resetField("passportNumber");
    form.resetField("drivingLicenseNumber");
    form.resetField("phoneNumber");
    setCountryCode("");
  }
};

// Helper function to handle vehicle selection to auto fill the Vehicle form
export const handleVehicleSelection = (
  vehicleRegistrationNumber: string,
  vehicleData: VehicleType | null,
  form: UseFormReturn<SRMVehicleDetailsFormType>,
  setExistingVehicleId: (id: string | null) => void,
  setCurrentVehiclePhoto: (photo: string | null) => void
) => {
  // Set vehicle registration number in the form
  form.setValue("vehicleRegistrationNumber", vehicleRegistrationNumber);

  if (vehicleData) {
    // Update existing vehicle ID
    setExistingVehicleId(vehicleData?.id);

    // Set form values based on selected vehicle data
    form.setValue(
      "vehicleCategoryId",
      vehicleData.vehicleCategory?.categoryId || ""
    );
    form.setValue("vehicleBrandId", vehicleData.vehicleBrand?.id || "");
    form.setValue("vehiclePhoto", vehicleData.vehiclePhoto || "");

    form.setValue(
      "rentalDetails.day.enabled",
      vehicleData.rentalDetails.day.enabled || false
    );
    form.setValue(
      "rentalDetails.day.rentInAED",
      vehicleData.rentalDetails.day.rentInAED || ""
    );
    form.setValue(
      "rentalDetails.day.mileageLimit",
      vehicleData.rentalDetails.day.mileageLimit || ""
    );

    form.setValue(
      "rentalDetails.week.enabled",
      vehicleData.rentalDetails.week.enabled || false
    );
    form.setValue(
      "rentalDetails.week.rentInAED",
      vehicleData.rentalDetails.week.rentInAED || ""
    );
    form.setValue(
      "rentalDetails.week.mileageLimit",
      vehicleData.rentalDetails.week.mileageLimit || ""
    );

    form.setValue(
      "rentalDetails.month.enabled",
      vehicleData.rentalDetails.month.enabled || false
    );
    form.setValue(
      "rentalDetails.month.rentInAED",
      vehicleData.rentalDetails.month.rentInAED || ""
    );
    form.setValue(
      "rentalDetails.month.mileageLimit",
      vehicleData.rentalDetails.month.mileageLimit || ""
    );

    form.setValue(
      "rentalDetails.hour.enabled",
      vehicleData.rentalDetails.hour.enabled || false
    );
    form.setValue(
      "rentalDetails.hour.minBookingHours",
      vehicleData.rentalDetails.hour.minBookingHours || ""
    );
    form.setValue(
      "rentalDetails.hour.rentInAED",
      vehicleData.rentalDetails.hour.rentInAED || ""
    );
    form.setValue(
      "rentalDetails.hour.mileageLimit",
      vehicleData.rentalDetails.hour.mileageLimit || ""
    );

    setCurrentVehiclePhoto(vehicleData.vehiclePhoto || "");
  } else {
    // Reset fields if no vehicle data is selected
    setExistingVehicleId(null);
    setCurrentVehiclePhoto(null);

    form.resetField("vehicleCategoryId");
    form.resetField("vehicleBrandId");
    form.resetField("vehiclePhoto");
    form.resetField("rentalDetails");
  }
};
